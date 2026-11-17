# ResearchOS TECT — Capital-Efficient Revenue Research
Independent research workspace for comparing revenue experiments with limited upfront funding.

## Implemented
Browser app and CLI compare declared downside/base/upside demand, delivery capacity, costs, cash collection delays, funding gaps, horizon-bounded payback and owner-time assumptions. Includes source/review notes, JSON editing/import/export, local storage, CSV results, monthly cash timelines and Markdown research memos. Synthetic examples only; no real earnings or demand claim.

## Run
Node 22+, no npm dependencies:
```sh
npm test
npm run build
python -m http.server 8000 --directory dist
```
Open http://localhost:8000. Or serve the repository root. Modules and demo loading require localhost or HTTPS; file:// is unsupported.
```sh
node cli.mjs example.json
node cli.mjs example.json results.json
node cli.mjs example.json results.csv
```
Output files refuse overwrite. Export local study backups regularly. No telemetry or external API is configured.

## Method and verification
Read [model contract](docs/MODEL.md) for exact timing, equations and exclusions. Revenue, cash flow, funding and time-adjusted surplus are distinct metrics.
Nine model tests and Node 22/24 CI check syntax, calculations, CLI execution and static packaging, then upload app artifacts. Local execution and interactive browser checks were unavailable during implementation; consult CI results. Hosting is not configured.

No payments, spending, customer outreach, investment recommendations or automatic business execution. Independent research prototype with no earnings guarantee. Apache-2.0 license retained.
