# Terapia Holística — Leandro Eduardo Silva (Astro)

Reconstrução do site institucional em Astro, com foco em SEO, performance e segurança.

## Por que essa estrutura (e não um blueprint de SPA)

Este é um site de conteúdo/institucional, não um dashboard autenticado. Por isso a
arquitetura segue o modelo idiomático do Astro — content collections + páginas
estáticas + ilhas pontuais de interatividade — em vez de um blueprint de SPA com
roteador em cliente, gerenciamento de estado global e camada de criptografia de
payload por requisição. Esse tipo de aparato resolve problemas de aplicações
autenticadas (dashboards, área logada) que este projeto não tem. Os princípios de
segurança relevantes aqui foram aplicados de forma proporcional: validação
server-side no endpoint de contato, honeypot + rate limiting anti-spam, headers de
segurança no host, e nenhum dado sensível armazenado em cliente.

Se no futuro o projeto ganhar uma área logada (ex.: portal do cliente, agendamento
com login), aí sim faz sentido revisitar uma arquitetura de aplicação completa.

## Design

> **Referência de layout**: esta versão segue a estrutura da landing page
> [Redgevity Master (Luminous Labs)](https://www.luminouslabs.health/redgevity-master)
> — um padrão editorial/B2B premium: hero com bullets de destaque ao lado do
> título, faixa de confiança rolante, spec-strip de diferenciais, blocos grandes
> de "pilares" do método, tags de público-alvo, faixa escura de destaque e
> processo numerado vertical. A paleta voltou a um tom claro e sóbrio (verde-
> sálvia + off-white) — mais alinhado ao tom "wellness" do negócio do que a
> versão urbana/neon anterior, mas o objetivo aqui foi replicar a *arquitetura
> visual* da referência, não copiar sua marca.
>
> **Sobre os números**: o site de referência usa estatísticas reais do negócio
> dele (sessões/dia, instalações ativas). Não inventei equivalentes aqui — a
> faixa de confiança e a seção de destaque usam apenas afirmações qualitativas
> verificáveis (ex.: "atendimento 100% online"). Se o Leandro tiver números reais
> (anos de experiência, sessões realizadas), vale adicioná-los na faixa escura
> de destaque em `index.astro` (seção "Filosofia").

- **Paleta**: base clara off-white (`--bg`) com verde-sálvia profundo
  (`--accent`) como cor única de destaque — editorial e sóbria, para dar
  espaço à estrutura de conteúdo (que é o foco desta referência) em vez de
  efeitos visuais.
- **Tipografia**: `Plus Jakarta Sans` (geométrica, moderna) nos títulos,
  `Inter` no corpo — carregadas via Google Fonts no `BaseLayout.astro`.
- **Faixa de confiança rolante** (`.trust-track`) logo abaixo do hero — mesmo
  padrão da fita de logos de parceiros da referência, adaptada para selos de
  texto já que não há logos de clientes B2B aqui.
- **Spec-strip de diferenciais**: grade de 4 itens com borda fina entre eles,
  no mesmo espírito da seção de especificações técnicas do produto de
  referência.
- **3 pilares do método**: blocos grandes com título + descrição + bullets,
  replicando a seção "Tablet / Support / Ecosystem" da referência.
- **Tags de público-alvo**: pílulas soltas, equivalente às tags de segmento
  ("Longevity clinics", "Hotels & spas"...) da referência.
- **Faixa escura de destaque**: seção de fundo escuro isolada no meio da
  página, mesmo padrão de contraste da referência — aqui usada para uma
  declaração de posicionamento em vez de estatísticas.
- **Processo numerado vertical**: 5 passos com linha conectora, no mesmo
  formato do fluxo "Personal Consultation → ... → Onboarding" da referência.
- **Scroll-reveal**: seções entram com fade + leve translação ao aparecerem na
  tela (classe `.reveal`, ativada por um único `IntersectionObserver` global no
  `BaseLayout.astro`).
- **Mobile-first de verdade**: todas as classes Tailwind partem do layout mobile
  (coluna única, hero com imagem acima do texto) e só ganham `md:`/`lg:` para
  telas maiores — não é um desktop "encolhido" com media query.
- Todas as animações respeitam `prefers-reduced-motion` — exceto a faixa de
  confiança rolante, que é puramente decorativa (`aria-hidden`) e não carrega
  informação exclusiva.

## Navegação

- **Desktop**: indicador deslizante ("pílula" sob o link ativo) que acompanha a
  seção visível na tela via scroll-spy (`IntersectionObserver` em `Header.astro`).
- **Mobile**: menu vira um drawer que desliza da direita com transição suave
  (`cubic-bezier`), backdrop escurecido, fecha ao clicar fora, no `Esc` ou ao
  navegar — e trava o scroll do body enquanto aberto.
- **Header** ganha sombra e borda sutis só depois de rolar a página (fica
  "flutuando" no topo do hero).
- **Botão flutuante de WhatsApp** fixo no canto da tela em todas as páginas
  (`WhatsappFab.astro`) — ação de contato sempre a um toque, sem precisar rolar
  até o rodapé.

## Stack

- **Astro 5** (SSG, `output: 'static'`) — HTML puro por padrão, JS só onde é ilha.
- **React** apenas na ilha do formulário de contato (`client:visible`).
- **Tailwind CSS 4** via plugin do Vite.
- **Content Collections** tipadas para serviços, depoimentos, FAQ e blog.
- **@astrojs/sitemap** — sitemap.xml gerado automaticamente no build.

> As versões no `package.json` usam `^` (ranges). Rode `npm outdated` / `pnpm outdated`
> antes do primeiro `install` e confirme que as versões mais recentes de Astro,
> React e Tailwind são mutuamente compatíveis — evoluem rápido.

## SEO implementado

- **Meta tags completas** por página (title, description, canonical, Open Graph,
  Twitter Card) via `SeoHead.astro`, com fonte única de verdade em `src/lib/seo.ts`.
- **JSON-LD estruturado**:
  - `ProfessionalService` (negócio local) injetado globalmente — reforça relevância
    para buscas como "terapia holística São Paulo/São Roque".
  - `FAQPage` gerado automaticamente a partir da collection `faq` — habilita rich
    snippets de pergunta/resposta no Google sem duplicar conteúdo.
  - `Article` + `BreadcrumbList` em cada post do blog.
- **Sitemap automático** (`/sitemap-index.xml`) via `@astrojs/sitemap`.
- **`robots.txt`** apontando para o sitemap.
- **Blog real** (`/blog`) — a seção "Conteúdos" do site antigo estava vazia; agora
  gera páginas indexáveis de verdade, com um post de exemplo já incluído.
- **Imagens otimizadas** via `astro:assets` (`<Image />`) quando você adicionar fotos
  reais — gera WebP/AVIF, lazy loading e dimensões corretas automaticamente.
- **HTML semântico** (`<h1>` único por página, hierarquia de headings coerente).

### Pendências que exigem dados reais (não dá para preencher com placeholder)

- [ ] **Imagens**: `SITE.images` (`src/lib/site.ts`) ainda aponta para o CDN do
      site antigo (`site2.com.br/sites_midias/...`), usadas via hotlink. Baixe os
      3 arquivos (logo, retrato, imagem de capa), coloque em `src/assets/img/` e
      troque as tags `<img>` em `Header.astro`, `Footer.astro` e `index.astro`
      pelo componente `<Image />` de `astro:assets` — assim você ganha
      otimização automática (WebP/AVIF, dimensões corretas) e independência do
      provedor antigo, que pode sair do ar quando a migração terminar.
- [ ] Trocar `SITE.url` (em `src/lib/site.ts` e `astro.config.mjs`) pelo domínio final.
- [ ] Gerar uma imagem OG real (`public/og-default.jpg`, 1200×630) e trocar o
      `favicon.svg` placeholder.
- [ ] Confirmar e-mail de contato real em `SITE.email`.
- [ ] Decidir se/quando ativar Google Analytics ou Meta Pixel — devem carregar
      **somente após consentimento de cookies** (ver comentário em `BaseLayout.astro`).
- [ ] Registrar o site no Google Search Console e submeter o sitemap.

## Segurança

- Formulário de contato: honeypot anti-bot + validação server-side (`src/pages/api/contact.ts`)
  + rate limiting básico por IP.
- **A rota `/api/contact` precisa de SSR** (Astro API routes não funcionam em
  `output: 'static'` puro). Duas opções:
  1. Adicionar um adapter (`@astrojs/vercel`, `@astrojs/netlify` ou
     `@astrojs/cloudflare`) e trocar `output: 'static'` por `'hybrid'`.
  2. Ou substituir o endpoint por um serviço de formulário com proteção embutida
     (Web3Forms, Formspree) e remover `src/pages/api/contact.ts`.
- Nenhum dado de formulário é logado em texto plano; comentário deixado no código
  para lembrar disso ao integrar o envio real (e-mail/WhatsApp Business API).
- LGPD: como o site coleta nome/telefone/e-mail (não são dados de saúde
  propriamente, mas o contexto é sensível), adicionar antes de publicar: link para
  política de privacidade e checkbox de consentimento no formulário.
- Configurar no host escolhido (Vercel/Netlify/Cloudflare Pages): CSP básica,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
  HSTS.

## Rodando localmente

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
