# Relatório de testes pré-commit — Frontend

> Nota bilíngue: documento em PT-BR; nomes de arquivos, APIs e comandos permanecem em inglês.

## 1. Data e repositório

- **Data:** 2026-11-03
- **Repositório:** `C:\Kiro\CoC\clash-village-tracker-frontend` (Angular 21 / Node 22.12.0 / Vitest)
- **Branch:** `main` (ainda sem commits; tudo em staging)
- **Escopo:** validação pré-commit do dashboard conectado à API real, sem commit/push.

## 2. Funcionalidades analisadas

- `DashboardApiService`: cliente HTTP somente leitura que monta as URLs dos endpoints e repassa as respostas sem transformá-las.
- `DashboardPage`: componente que carrega dashboard/categorias/upgrades via `forkJoin`, gerencia estados (`loading`/`ready`/`error`), separa Sobrecargas de melhorias permanentes e formata durações.
- `App`: shell da aplicação (teste pré-existente preservado).

## 3. Arquivos de teste criados ou modificados

| Arquivo | Situação | Conteúdo |
|---|---|---|
| `src/app/app.spec.ts` | Existente (preservado) | Renderização do shell. |
| `src/app/core/api/dashboard-api.service.spec.ts` | Criado | 4 testes do cliente HTTP com `HttpTestingController`. |
| `src/app/features/dashboard/dashboard-page.spec.ts` | Criado | 4 testes do componente com serviço mockado. |

## 4. Cenários cobertos

**`DashboardApiService`** (usando `provideHttpClientTesting`):
- `configured`/`baseUrl` refletem a configuração injetada.
- `health()` chama `GET /api/health`.
- `dashboard()` chama `GET /api/village/dashboard` e repassa o corpo sem alterar (não duplica cálculo do backend).
- `snapshot()`, `categories()` e `upgrades()` usam cada um sua URL correta.

**`DashboardPage`** (serviço mockado, sem rede):
- Estado `ready`: renderiza jogador (`jaoo`), tag (`#U8J89QP2`) e progresso geral (92,8%).
- Separa 1 linha de Sobrecarga e 1 de melhoria permanente (computed signals).
- Estado de erro: quando a API falha, mostra "Backend indisponível" e **não** fabrica dados (não exibe `jaoo`).
- `formatDays`: duração desconhecida (`null`/`undefined`) vira "desconhecido", nunca zero.

**`App`:** renderiza o shell com o título "Clash Village Tracker".

## 5. Comandos utilizados

```powershell
# Node 22 via NVM (o node do PATH é v12, incompatível com Angular 21)
# Testes (vitest, execução única)
& "$env:APPDATA\nvm\v22.12.0\node.exe" node_modules\@angular\cli\bin\ng.js test --watch=false
# Build de produção
& "$env:APPDATA\nvm\v22.12.0\node.exe" node_modules\@angular\cli\bin\ng.js build
# Equivalentes npm (quando a execution policy do PowerShell permitir npm.ps1):
#   npm test -- --watch=false
#   npm run build
```

## 6. Resultado por conjunto de testes

| Arquivo de teste | Testes | Resultado |
|---|---:|---|
| `app.spec.ts` | 1 | ✅ |
| `dashboard-api.service.spec.ts` | 4 | ✅ |
| `dashboard-page.spec.ts` | 4 | ✅ |
| **Total** | **9** | **✅ 3 arquivos, 9 testes, 0 falhas** |

## 7. Resultado do build de produção

`ng build` → **Application bundle generation complete**, sem warnings. Saída em `dist/clash-village-tracker-frontend` (initial total ~272 kB raw / ~74 kB transfer). O budget de estilo por componente foi elevado em `angular.json` para acomodar o SCSS do dashboard.

## 8. Falhas encontradas e como foram corrigidas

- Nenhuma falha de teste. O único ajuste anterior foi o budget de estilo (warning de build, não falha de teste), resolvido em `angular.json`.

## 9. Testes não executados e motivos

- Não há testes e2e (Protractor/Cypress) configurados no projeto; não foram adicionados nesta etapa para não introduzir dependências novas fora do escopo da validação.
- A integração real backend↔frontend (CORS + dados reais) foi verificada manualmente na sessão anterior (servidores em `:8080` e `:4200`); os testes automatizados aqui usam mocks para não depender de rede.

## 10. Pendências e riscos

- Gráficos temporais e filtros por período dependem da evolução do backend (E4) e ainda não existem na UI.
- O Node do PATH é a v12 (incompatível); é necessário usar o Node 22 do NVM para build/test. Documentado no README.
- `npm.ps1` é bloqueado pela execution policy do PowerShell nesta máquina; os comandos foram executados via `node ... ng.js`.
