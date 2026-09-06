# MY BOO // ARG CREATOR — V1

Primeira versão do painel para criar e organizar fases de uma ARG.

## O que já funciona

- Dashboard de fases
- Criar fase
- Editar fase
- Duplicar fase
- Excluir fase
- Busca
- Preview ao vivo
- Status rascunho/publicada
- Código/resposta
- Pista e dica
- Regra de desbloqueio
- Exportar/importar JSON
- Persistência local no navegador
- Layout responsivo

## Rodar localmente

Requer Node.js 18+.

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Vercel + GitHub

1. Crie um repositório no GitHub.
2. Envie esta pasta para o repositório.
3. Na Vercel, importe o repositório.
4. A Vercel detectará Next.js automaticamente.
5. Faça o deploy.

### Importante

A V1 salva as fases em `localStorage`. Isso é ótimo para prototipar a interface, mas não é um banco compartilhado nem permite publicar fases para outras pessoas.

A próxima versão deve trocar o armazenamento local por banco/API e adicionar autenticação do painel.
