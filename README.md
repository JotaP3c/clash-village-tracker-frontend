# Clash Village Tracker — Frontend

Interface Angular do Clash Village Tracker. O dashboard consome a **API REST de leitura** do backend Java e exibe a progressão da vila a partir do snapshot histórico. Não acessa banco, não contém token e não inventa dados: quando a API está indisponível, mostra um estado de erro explícito com botão de retry.

Angular frontend for Clash Village Tracker. The dashboard consumes the backend's **read-only REST API** and renders the village progression from the historical snapshot. It never holds a token, never talks to a database, and never fabricates data: when the API is unavailable it shows an explicit error state with a retry button.

## Pré-requisito / Prerequisite

Node `22.12.0` (ou compatível com Angular 21). A máquina mantém esse Node via NVM; o Node 12 **não** é compatível com este projeto. Se o `node` do PATH for o 12, use o Node 22 pelo caminho do NVM (`%APPDATA%\nvm\v22.12.0`).

## Desenvolvimento local / Local development

```powershell
npm install --legacy-peer-deps   # primeira vez / first time
npm start                        # http://localhost:4200
```

O backend deve estar rodando em `http://localhost:8080` (ver README do backend, comando `spring-boot:run`). / The backend must be running at `http://localhost:8080`.

A URL da API tem como padrão `http://localhost:8080` e pode ser sobrescrita em tempo de execução, sem rebuild, por `window.__CLASH_TRACKER_API__ = { baseUrl: '...' }`. Nunca inclua token da Supercell ou senha de banco no navegador. / The API base URL defaults to `http://localhost:8080` and can be overridden at runtime via `window.__CLASH_TRACKER_API__` without rebuilding.

## O que o dashboard mostra / What the dashboard shows

- Identidade da vila (jogador, TH, data do snapshot histórico, Passe Dourado configurado).
- Progresso geral, permanente e de Sobrecargas (métrica por etapas catalogadas, não a % oficial da Supercell).
- Cartões de etapas restantes, construtores, dias-construtor (limite inferior) e cobertura dos dados.
- Navegação por categoria com detalhamento das entidades (nível, máximo, `countAtMax`, Sobrecargas).
- Listas de Sobrecargas e melhorias permanentes pendentes, com duração base/com Passe e marcação de "em andamento" e "duração desconhecida".

## Build e testes / Build and tests

```powershell
npm run build                    # gera dist/
npm test -- --watch=false        # testes unitários (vitest)
```

Contrato da API consumida: ver `docs/17_api_e_exportacao.md` no repositório do backend (seção "API de leitura do dashboard"). / API contract: see the backend repo `docs/17_api_e_exportacao.md` ("Read-only dashboard API").
