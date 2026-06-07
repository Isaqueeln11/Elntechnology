# Publicar no Cloudflare Pages

O Netlify pausou o site porque a equipe ultrapassou o limite de creditos. O projeto pode ser publicado no Cloudflare Pages usando o mesmo repositorio do GitHub.

## Criar o site

1. Acesse `https://dash.cloudflare.com/`.
2. Abra **Workers & Pages**.
3. Clique em **Create application**.
4. Escolha **Pages** e **Import an existing Git repository**.
5. Conecte o GitHub e selecione o repositorio `Isaqueeln11/Elntechnology`.
6. Configure:
   - Production branch: `main`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: deixe vazio
   - Node.js version: `22`
7. Clique em **Save and Deploy**.

O Cloudflare criara um endereco parecido com:

```text
https://elntechnology.pages.dev
```

Cada novo push para a branch `main` publicara o site automaticamente.

## Liberar login no Firebase

Depois que o endereco `pages.dev` existir:

1. Acesse o Firebase Console.
2. Abra **Authentication**.
3. Entre em **Configuracoes**.
4. Em **Dominios autorizados**, adicione somente o dominio, sem `https://`:

```text
elntechnology.pages.dev
```

Se o nome criado pelo Cloudflare for diferente, use exatamente o dominio informado por ele.

## Rotas e atualizacao da pagina

O arquivo `public/_redirects` ja envia todas as rotas para `index.html`. Assim, paginas como `/dashboard`, `/lojas` e `/produtos` continuam funcionando quando o usuario atualiza o navegador.

## Dominio proprio

No projeto do Cloudflare Pages, abra **Custom domains** para conectar um dominio como `elntechnology.com.br`. Depois, adicione esse dominio tambem nos dominios autorizados do Firebase Authentication.
