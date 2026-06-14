import { useEffect, useMemo, useState } from 'react';
import { arrayUnion, collection, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';

export type AppNotification = {
  id: string;
  title?: string;
  message?: string;
  status?: string;
  target?: string;
  ownerId?: string;
  clientEmail?: string;
  readBy?: string[];
};

export function isActionableNotification(notification: AppNotification) {
  const isLegacyNotificationStatusEvent = notification.type === 'status-change'
    && notification.message?.toLocaleLowerCase('pt-BR').includes('registro em notifications');

  return !isLegacyNotificationStatusEvent;
}

type UserRole = 'admin' | 'client' | 'technician';

function notificationList(snapshot: { docs: Array<{ id: string; data: () => unknown }> }) {
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as object) }) as AppNotification);
}

export function notificationIsUnread(notification: AppNotification, userId?: string) {
  return notification.status !== 'Lida' && !notification.readBy?.includes(userId || '');
}

export function useNotifications(role?: UserRole, userId?: string, email?: string) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!role || !userId) return;

    const groups = new Map<string, AppNotification[]>();
    const emit = () => {
      const merged = Array.from(new Map(
        Array.from(groups.values()).flat().map((item) => [item.id, item]),
      ).values());
      setNotifications(merged.filter((item) => item.status !== 'Rascunho' && isActionableNotification(item)));
    };
    const subscribe = (key: string, source: ReturnType<typeof query>) => onSnapshot(
      source,
      (snapshot) => {
        groups.set(key, notificationList(snapshot));
        setError('');
        emit();
      },
      () => setError('Não foi possível carregar as notificações. Confira as regras do Firestore.'),
    );

    if (role === 'admin') {
      return onSnapshot(
        collection(db, 'notifications'),
        (snapshot) => {
          setNotifications(notificationList(snapshot).filter((item) => (
            item.status !== 'Rascunho'
            && ['Admin', 'Todos'].includes(item.target || 'Admin')
            && isActionableNotification(item)
          )));
          setError('');
        },
        () => setError('Não foi possível carregar as notificações. Confira as regras do Firestore.'),
      );
    }

    const roleTarget = role === 'technician' ? 'Técnicos' : 'Clientes';
    const subscriptions = [
      subscribe('all', query(collection(db, 'notifications'), where('target', '==', 'Todos'))),
      subscribe('role', query(collection(db, 'notifications'), where('target', '==', roleTarget))),
      subscribe('owner', query(collection(db, 'notifications'), where('ownerId', '==', userId))),
    ];
    if (email) subscriptions.push(subscribe('email', query(collection(db, 'notifications'), where('clientEmail', '==', email.toLowerCase()))));
    return () => subscriptions.forEach((unsubscribe) => unsubscribe());
  }, [email, role, userId]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => notificationIsUnread(item, userId)).length,
    [notifications, userId],
  );

  async function markRead(notificationId: string) {
    if (!userId) return;
    await updateDoc(doc(db, 'notifications', notificationId), {
      readBy: arrayUnion(userId),
      updatedAt: serverTimestamp(),
    });
  }

  return { notifications, unreadCount, error, markRead };
}
