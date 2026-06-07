# ELN Technology Site

Site institucional da ELN Technology feito em React, Vite e Tailwind CSS.

## O que tem no site

- Pagina inicial com a logo da ELN Technology
- Secoes sobre IoT, impressao 3D, robos, eletronica e PCBs
- Processo de atendimento organizado
- Cards de projetos e aplicacoes
- Formulario funcional com mensagem de confirmacao
- Animacoes leves e menu responsivo

## Como rodar

```bash
npm install
npm run dev
```

Depois abra o endereco mostrado pelo Vite no navegador.

## Como gerar para publicar

```bash
npm run build
```

Os arquivos finais ficam na pasta `dist`.

## Hospedagem

Para publicar no Cloudflare Pages usando o GitHub, siga o guia em [`docs/CLOUDFLARE_PAGES.md`](docs/CLOUDFLARE_PAGES.md).

Configuracao do build:

- Branch: `main`
- Comando: `npm run build`
- Pasta publicada: `dist`
- Node.js: `22`
