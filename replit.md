# Projeto no Replit

Site institucional em Astro com Tailwind CSS e uma ilha React para o formulário de contato.

## Executar

O workflow **Start application** inicia o projeto com:

```bash
npm run dev -- --host 0.0.0.0 --port 5000
```

## Verificar

```bash
npm run build
```

O formulário de contato valida os dados no navegador e redireciona para o WhatsApp configurado em `src/lib/site.ts`, levando nome, telefone e e-mail na mensagem.