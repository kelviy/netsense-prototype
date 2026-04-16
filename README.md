# NetSense — Investor Prototype

NetSense is a decentralised mesh-network platform for smart farming that combines LoRa and Wi-Fi HaLow hardware into a self-organising sensor mesh. This repo is a interactive prototype built for a live investor pitch. All data is mocked; there is no backend.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). On first load you are routed to `/setup` (3-step onboarding wizard). After completing setup, subsequent loads default to `/dashboard`. Use the **Reset demo** button in the sidebar to replay the setup flow.

## Screens

- **`/setup`** — login + 3-step wizard with auto-detect sensor animation.
- **`/dashboard`** — live farm overview with alerts, KPIs, map, and activity feed.
- **`/sensors/[id]`** — 30-day history chart with threshold bands, NetSense insights, and block/farm benchmarking.
- **`/network`** — mesh topology map with range circles, self-healing routing, node table, and growth recommendations.

## Notes

All sensor readings, history, nodes, alerts, and recommendations are hard-coded in [`lib/mockData.ts`](lib/mockData.ts). History is generated once at module load with a seeded PRNG so the demo is reproducible between reloads.
