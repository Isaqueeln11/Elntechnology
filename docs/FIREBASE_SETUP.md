# Firebase setup

O projeto agora usa Firebase real para login, cadastro e banco.

## Ativar no Firebase Console

1. Abra o projeto `elntechnology`.
2. Em Authentication, ative o provedor Email/Password.
3. Em Firestore Database, crie o banco em modo production ou test.
4. Crie as colecoes automaticamente pelo app:
   - `users`
   - `firmwareReleases`

## Regras mais seguras

Novas contas entram como `client`. Para transformar uma conta em admin, edite o documento em `users/{uid}` no Firestore e altere `role` para `admin`.

```txt
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() {
      return request.auth != null;
    }

    function currentUser() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid));
    }

    function isAdmin() {
      return signedIn() && currentUser().data.role == "admin";
    }

    match /users/{userId} {
      allow create: if signedIn()
        && request.auth.uid == userId
        && request.resource.data.role == "client";

      allow read: if signedIn() && (request.auth.uid == userId || isAdmin());

      allow update: if signedIn()
        && request.auth.uid == userId
        && request.resource.data.role == resource.data.role;

      allow delete: if isAdmin();
    }

    match /firmwareReleases/{releaseId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /projetos/{projectId} {
      allow create: if request.resource.data.nome is string
        && request.resource.data.email is string
        && request.resource.data.telefone is string
        && request.resource.data.tipo is string;
      allow read, update, delete: if isAdmin();
    }
  }
}
```

## Segurança extra ativada no app

- Cadastro sempre cria `role: "client"`.
- Admin e tecnico devem ser liberados manualmente no Firestore.
- Cadastro envia verificacao de email pelo Firebase Auth.
- Login tem recuperacao de senha por email.
- OTA grava no Firestore, mas regras recomendadas deixam escrita apenas para admin.

## Observacao sobre OTA

O painel admin salva os firmwares no Firestore e gera o manifesto na tela. Para um equipamento embarcado baixar automaticamente um JSON publico e sempre atualizado, o proximo passo ideal e publicar uma API/Cloud Function que leia `firmwareReleases` e responda `/ota/manifest.json`.
