# Firebase setup

O projeto agora usa Firebase real para login, cadastro e banco.

## Ativar no Firebase Console

1. Abra o projeto `elntechnology`.
2. Em Authentication, ative o provedor Email/Password.
3. Em Firestore Database, crie o banco em modo production ou test.
4. Crie as colecoes automaticamente pelo app:
   - `users`
   - `clientes`
   - `projetos`
   - `technicians`
   - `firmwareReleases`

## Regras mais seguras

Novas contas entram como `client`, exceto os emails donos do sistema:

- `isaqueeln11@gmail.com`
- `elntechnologyinnovations@gmail.com`

Esses emails sao reconhecidos como `admin`. Para transformar outra conta em admin, edite o documento em `users/{uid}` no Firestore e altere `role` para `admin`.

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

    function isOwnerEmail() {
      return signedIn()
        && request.auth.token.email in [
          "isaqueeln11@gmail.com",
          "elntechnologyinnovations@gmail.com"
        ];
    }

    match /users/{userId} {
      allow create: if signedIn()
        && request.auth.uid == userId
        && (
          request.resource.data.role == "client"
          || (isOwnerEmail() && request.resource.data.role == "admin")
        );

      allow read: if signedIn() && (request.auth.uid == userId || isAdmin());

      allow update: if signedIn()
        && request.auth.uid == userId
        && (
          request.resource.data.role == resource.data.role
          || (isOwnerEmail() && request.resource.data.role == "admin")
        );

      allow delete: if isAdmin();
    }

    match /firmwareReleases/{releaseId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /clientes/{clientId} {
      allow read, write: if isAdmin();
    }

    match /technicians/{technicianId} {
      allow read, write: if isAdmin();
    }

    match /projetos/{projectId} {
      allow create: if isAdmin()
        || (
          request.resource.data.nome is string
          && request.resource.data.email is string
          && request.resource.data.telefone is string
          && request.resource.data.tipo is string
        );
      allow read, update, delete: if isAdmin();
    }
  }
}
```

## Segurança extra ativada no app

- Cadastro sempre cria `role: "client"`, exceto os emails donos configurados no app.
- Admin e tecnico devem ser liberados manualmente no Firestore.
- Cadastro envia verificacao de email pelo Firebase Auth.
- Login tem recuperacao de senha por email.
- Perfil do admin pode salvar nome, empresa e foto no documento do usuario.
- Clientes, tecnicos e projetos do painel admin ficam protegidos para escrita de admin.
- OTA grava no Firestore, mas regras recomendadas deixam escrita apenas para admin.

## Observacao sobre OTA

O painel admin salva os firmwares no Firestore e gera o manifesto na tela. Para um equipamento embarcado baixar automaticamente um JSON publico e sempre atualizado, o proximo passo ideal e publicar uma API/Cloud Function que leia `firmwareReleases` e responda `/ota/manifest.json`.
