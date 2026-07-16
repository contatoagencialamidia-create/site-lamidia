# Site LAMIDIA

Site institucional estático da LAMIDIA, desenvolvido com HTML, CSS e JavaScript puro.

## Estrutura

- `index.html`: home, serviços, portfólio resumido e contato.
- `quem-somos.html`: história, propósito, missão, visão e valores.
- `portfolio.html`: portfólio de projetos.
- `case-real-estate.html`: case A+ Real Estate.
- `case-hub4.html`: case HUB4 Empresarial.
- `case-pk7-producoes.html`: case PK7 Produções.
- `magestic-nails.html`: case Majestic Nails.
- `Phytoflora-farma.html`: case Phytoflora Farma.
- `resident-pro.html`: case ResidentPRO.
- `maestro-adriano-machado.html`: case Maestro Adriano Machado.
- `volare-logistica.html`: case Volare Logística.
- `css/style.css`: design system e estilos compartilhados.
- `css/case.css`: estilos das páginas de case.
- `js/script.js`: menu, cabeçalho e formulário de contato.
- `js/case.js`: comportamento dos carrosséis de cases.
- `images/` e `videos/`: ativos visuais e audiovisuais.

## Executar localmente

Não há dependências para instalar nem etapa de build. Na raiz do projeto, execute:

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Acesse `http://127.0.0.1:8765/`.

As fontes Lora e Geist são carregadas pelo Google Fonts e precisam de conexão com a internet. Sem conexão, o site usa as fontes de fallback definidas no CSS.

## Formulário de contato

O formulário possui validação no navegador e estados visuais de envio, sucesso e erro. A integração com a planilha está desativada até existir um endpoint seguro.

O endereço comum de uma planilha Google não é um endpoint de formulário. Não coloque a URL da planilha, IDs privados ou credenciais no JavaScript.

Para ativar o envio futuramente:

1. Crie um Google Apps Script vinculado à planilha de leads.
2. Implemente `doPost(e)` para validar e gravar somente os campos `nome`, `empresa`, `telefone`, `email` e `mensagem`.
3. Faça o script retornar JSON com `{ "ok": true }` somente depois de confirmar a gravação. Em falhas, retorne `{ "ok": false }`.
4. Publique o script como aplicativo da web e obtenha sua URL pública terminada em `/exec`.
5. Em `js/script.js`, preencha apenas a constante `CONTACT_FORM_ENDPOINT` com essa URL.
6. Teste sucesso, erro, campos inválidos, duplicidade e limitação de abuso antes da publicação.

Enquanto `CONTACT_FORM_ENDPOINT` estiver vazio, o formulário impede falsos envios de sucesso e orienta o visitante a usar o WhatsApp.

## Publicação na Vercel

O projeto pode ser publicado como site estático sem configuração de build:

1. Crie ou importe o projeto na Vercel.
2. Selecione este repositório como raiz.
3. Use `Other` como framework preset.
4. Deixe Build Command vazio.
5. Deixe Output Directory vazio ou use a raiz do projeto, conforme a interface apresentada.
6. Após o primeiro deploy, configure `agencialamidia.com.br` em **Settings > Domains**.
7. Ajuste o DNS somente depois de revisar o deploy de preview.

Antes de publicar, confira:

- links e CTAs;
- envio e mensagens do formulário;
- navegação por teclado e menu móvel;
- visual em desktop e dispositivos móveis;
- canonical e Open Graph;
- `robots.txt` e `sitemap.xml`;
- ausência de vídeos brutos ou arquivos grandes não utilizados no commit.

## SEO

O domínio canônico é `https://agencialamidia.com.br`. O sitemap inclui somente as páginas públicas disponíveis.
