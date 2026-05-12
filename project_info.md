# NetSense Prototype — Build Specification
> **Goal:** A polished, interactive 4-screen demo for an investor pitch. Mock data only. No backend.
> **Deployment target:** Vercel (static / Next.js).

---

## 1. Product Context

**NetSense** is a decentralised mesh-network platform for smart farming. It combines LoRa (long-range, low-bandwidth) and Wi-Fi HaLow (medium-range, higher-bandwidth) hardware nodes that self-organise into a resilient mesh. Farmers deploy low-cost soil/environmental sensors that route data through the mesh to a gateway, then to this dashboard. The sensors themselves use lora can also act as a mesh bridge (at a lower range)

**Target user:** Small-to-medium commercial farmers in the Western Cape, South Africa. Wine farms, fruit orchards, mixed crop. Tech-literate enough to use a smartphone, not technical enough to configure a network.

**Core narrative the prototype must communicate in 30 seconds:**
1. Easy to set up (just plug in a sensor, it joins the mesh automatically).
2. Real farm value (moisture, yield insights, alerts that save crops/water/money).
3. Decentralised network the farmer owns.

---

## 2. Tech Stack

- **Framework:** Next.js 14+ (App Router) with TypeScript. Deploys to Vercel with zero config.
- **Styling:** Tailwind CSS. Use `shadcn/ui` for base components (Card, Button, Dialog, Badge, Tabs, etc.).
- **Charts:** Recharts (time-series for sensor history).
- **Maps:** **react-leaflet + Leaflet** with OpenStreetMap tiles (free, no API key). Centre on a real Western Cape wine farm location.
- **Icons:** lucide-react.
- **State:** React `useState` / `useContext`. No Redux. No backend.
- **Data:** Static mock data in `/lib/mockData.ts`. All sensor readings, nodes, history, alerts hard-coded or pre-generate all the history arrays and random values directly inside your mockData.ts file as hard-coded, static constants. Do not compute the randomness at runtime inside the React components. So data looks realistic and don't change on every refresh.

**Project structure:**
```
/app
  /layout.tsx              # Root layout, sidebar nav
  /page.tsx                # Redirects to /setup or /dashboard
  /setup/page.tsx          # Screen 1: Login / Farm Setup
  /dashboard/page.tsx      # Screen 2: Live Dashboard
  /sensors/[id]/page.tsx   # Screen 3: Sensor Detail
  /network/page.tsx        # Screen 4: Network Health
/components
  /ui/                     # shadcn components
  /FarmMap.tsx             # Leaflet map wrapper (dynamic import, ssr:false)
  /Sidebar.tsx
  /SensorCard.tsx
  /AlertBanner.tsx
  /MeshOverlay.tsx         # SVG/Leaflet layer for mesh links between nodes
/lib
  /mockData.ts             # All farm, sensor, node, history data
  /types.ts
/public
  /logo.svg
```

**Important:** Leaflet must be dynamically imported with `ssr: false` in Next.js or the build will fail.

---

## 3. The Farm (shared mock data context)

Use a real location so the map looks credible. Suggested:
- **Farm name:** "Cape Town Vineyard" (fictional NetSense customer, real-ish location)
- **Coordinates:** `-33.892330, 18.987339`
- (Franschhoek wine region, Western Cape)
- **Size:** ~120 hectares
- **Fields:** 4 named blocks
  - "Block A" (28 ha)
  - "Block B" (22 ha)
  - "Block C" (35 ha)
  - "Block D" (35 ha)

Draw each field as a polygon overlay on the Leaflet map (use rough lat/lng polygons around the centre point). Use semi-transparent green fill, darker green border. Label each block.

**Sensors (12 total, 3 per block):**
Each sensor has:
```ts
{
  id: "S-001",
  name: "Block A",
  type: "soil_moisture" | "temperature" | "humidity" | "ph",
  block: "A",
  lat: number, lng: number,
  status: "online" | "offline" | "warning",
  battery: 0–100,
  signalStrength: 0–100,
  lastReading: number,
  unit: "%" | "°C" | "pH",
  routedVia: "node_id"  // which mesh node it talks to
}
```

Soil Sensors use LoRa. They can also act as a rely, instead of relying on the Central Mesh Network. The range for LoRa is lowered to 1km due to antenna being close to the ground.

**Mesh nodes (5 total — the LoRa/HaLow routers):**
```ts
{
  id: "N-01",
  name: "Gateway — Farmhouse",
  type: "gateway" | "lora_node" | "halow_node",
  lat: number, lng: number,
  status: "online" | "degraded" | "offline",
  connectedSensors: number,
  neighbours: ["N-02", "N-03"],  // mesh links
}
```
- 1 gateway at the farmhouse (centre).
- 4 mesh nodes spread across the corners of the farm.
- One node should be in "degraded" status to demonstrate self-healing. Degraded status has a less than expected range, due to terrain, weather, network load. During setup the degraded node should have full range. However, then in the dashboard it should have a slightly smaller range that makes it not overlap with a single soil sensor. This sensor would instead communicate with a nearby sensor since it can't communicate with the central mesh node.
- Mesh links have an estimated circle boundry of their network range. LoRa has about a 5km range. Wifi Halow has a 1km range. All mesh link nodes have these three combinations with different ranges.

**Alerts (3–4 active):**
```ts
{
  id, severity: "critical" | "warning" | "info",
  title: "Soil moisture critical — Block A",
  message: "Moisture dropped below 18%. Irrigation recommended within 6 hours to avoid yield loss.",
  sensorId, timestamp,
  estimatedImpact: "~R12,400 potential yield loss if untreated"
}
```

---

## 4. Screen 1 — Login / Farm Setup

**Goal:** Show how trivially easy onboarding is. **adding a sensor in one click and it automatically gets added**.

**Layout:**
- A welcome page with a login page (no real auth — clicking it advances).
- After "login," transition to a first time 3-step setup wizard:
  1. **Step 1 — Name your farm.** Pre-filled with "Cape Town Vineyard." Just click Next.
  2. **Step 2 — Place your gateway.** Show the Leaflet map. A pulsing pin appears at the farmhouse coordinates. Something like we've detected your gateway. Confirm location and setup. Please confirm your details.
  3. **Step 3 — Add sensors.** This is the showpiece.
     - Show the map with the gateway pinned. Currently no sensors added.
     - A button: **"+ Auto-detect new sensors"**. On click: animate sensors appearing on the map one by one over ~3 seconds with a soft "ping" visual. Each one shows an alert that it has automatically joined the network. It also has a list of added sensors. There should be 12 hard coded sensor details.
     - After all 12 appear, show that no other sensors are detected and a Button: **"Go to Dashboard"** → routes to `/dashboard`.

**Key UX details:**
- The animation is the entire point. It must feel magical. Use Framer Motion or simple CSS transitions.
- No forms beyond a pre-filled name field. Investors should think "anyone could do this."
- After completing setup once (store in localStorage or React context), the app should default to `/dashboard` on subsequent loads, but include a "Reset demo" button in the sidebar so the presenter can replay the setup flow.

---

## 5. Screen 2 — Live Dashboard

**Goal:** At a glance, the farmer knows the state of their farm. Show real value.

**Layout (top to bottom):**

**Header bar:**
- "Cape Town Vineyard" + small location text.
- Last sync timestamp ("Synced 2 min ago via mesh").
- Weather widget (mock): "22°C, partly cloudy, no rain forecast for 5 days" — this matters because it makes the moisture alerts feel urgent.

**Alert banner (if any active alerts):**
- Red/amber strip at the top with the most critical alert.
- Includes the **estimated rand impact** ("~R12,400 potential yield loss"). This is the thing that sells the product.
- Click → routes to that sensor's detail page.

**KPI strip (4 cards):**
- Avg soil moisture: 24% (with up/down arrow vs yesterday)
- Avg temperature: 22°C
- Sensors online: 12 / 12

**Main content — 2 columns:**

*Left (60%): Farm Map*
- Leaflet map of the farm with field polygons.
- All 12 sensors as colour-coded pins (green/amber/red by status).
- All 5 mesh nodes as larger square icons.
- Click any sensor pin → routes to `/sensors/[id]`.
- Toggle controls: "Show mesh links" / "Show field boundaries" / "Show sensors" / "Show nodes".

*Right (40%): Recent activity feed*
- Scrollable list of recent events:
  - "Block A North moisture dropped to 18% — 14 min ago"
  - "Sensor S-008 routed via S-009 (N-02 degraded) — 1 hr ago". this line shows self-healing live. Clicking this would go to network health page.
  - "Daily report ready — 3 hr ago"
  - "Mesh sync complete — all sensors reporting — 6 hr ago"

**Sidebar nav (persistent across all screens):**
- Logo
- Dashboard
- Sensors
- Network
- Alerts (with badge count)
- Settings
- "Reset demo" button at bottom

---

## 6. Screen 3 — Sensor Detail / Historical View

**Goal:** Prove that NetSense data drives real farming decisions and protects yield. This is where you justify the price tag.

**Route:** `/sensors/[id]` — when user clicks a sensor on the map or in a list.

**Layout:**

**List of Sensors (Right)**
- A list of sensors as a scrollable Right sidebar. Clicking the respective sidebars would navigate to them.
- Sensor list element which block is the sensor and type of the sensor.
- Only the sensor with the alert would have insights panel and action buttons.

**Header:**
- Sensor name + block + type + current reading (large, bold).
- Status badge (online/warning/offline).
- Battery + signal indicators.
- "Routed via N-02 (Mode: LoRa)" — small text reinforcing the mesh story.

**Hero chart (Recharts AreaChart):**
- 30-day soil moisture history.
- Threshold lines: optimal range (shaded green band 22–35%), warning (amber), critical (red).
- The current reading should be visibly *below* the optimal band on the chart for the alerted sensor — visually obvious why there's an alert.
- Time-range toggle: 24h / 7d / 30d.

**Insights panel (this is the value story):**
A card titled **"NetSense Insights"** with 3–4 bullets generated from the (mock) data:
- "Moisture has dropped 12% over the last 7 days — faster than the seasonal average."*
- "Recommended action: irrigate Block A North within 6 hours. Estimated 4,200 L required."*
- "Historical correlation: similar moisture patterns in 2024 led to a 8% yield reduction in Cabernet blocks."*
- "Estimated yield damage: **R12,400**"*

**Comparison panel:**
- Mini-chart comparing this sensor against the block average and the farm average. Frames NetSense as a tool for **comparison and benchmarking**, not just monitoring.

**Action buttons (mostly non-functional, just for show):**
- "Schedule irrigation" (opens a dialog with a fake confirmation)
- "Mark as resolved" (resolves the alert)

---

## 7. Screen 4 — Network Health

**Goal:** Showcase the **decentralised mesh**. Also: actionable recommendations to grow the network and show estimated range of network.

**Layout:**

**Header KPIs:**
- Total nodes: 5
- Online: 5 / 5
- Total sensors served: 12
- Mesh redundancy score: "Good" (with green badge)

**Main visualisation — Mesh topology map:**
- Same Leaflet base map as the dashboard, but this view emphasises **the network** and the range, not the crops. You can toggle the ranges of either the mesh nodes on and off (default on). Or the sensor ranges on and off (default off) - it has a reduced range or 1km LoRa.
- Field polygons fade to very light grey.
- Mesh nodes are large, prominent icons.
- Links between the mesh nodes and the sensors are **bold animated lines** (subtle pulse animation showing data flow). The sensor that is related to the mesh link node with the degraded signal have a thin red line to the degraded mesh link node. The but bold animated line would be to a nearby sensor. This shows that it can utitlise other sensors as a bridge / rely for communication.
- Sensors are tiny dots that visually "feed into" their parent node.
- The degraded node (N-02) should be amber and have a visible weak link.
- Hover on a node → tooltip with uptime, connected sensors, neighbours, signal strength.
- Click on a node → a pop up panel with full details.

**Recommendations panel (right side or below map):**
A card titled **"Network Recommendations"** with 2–3 actionable items:
-  **"Move sensor to closer to a relay node near Block C"**
  - Sensors S-008 currently routes through S-009 instead of of N-02 (degraded). Suggest moving Antennas on Sensor (S-008) to be higher and Sensor (S-009) to increase network range and reliability.
- **"Replace battery on N-04"**
  - "Battery at 18%. Estimated 9 days remaining. Recharge to avoid service interruption."
- **"Upgrade gateway firmware to v2.4.1"**
  - "Improves Battery Life by 15% and adds support for new sensor types."

**Node list table (below the map):**
Sortable table with columns:
| Node | Type | Status | Battery |
|------|------|--------|---------|
Each row clickable → opens the pop up panel with full details.

**The decentralisation story this screen tells:**
1. The farmer *sees* the mesh, not just a list of devices.
2. When N-02 degrades, sensors *automatically* re-route — no farmer intervention.
3. The system *recommends* growth — the network gets smarter and stronger over time with more sensors / mesh links.

---

## 8. Map Implementation Notes (critical)

**Use react-leaflet with these layers:**
1. **Base tiles:** OpenStreetMap (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`) — free, no key.
   - Alternative for prettier aerial: Esri World Imagery (`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`) — also free, looks like Google Maps satellite. **Prefer this for the farm map** — it makes the demo look real.
2. **Field polygons:** `<Polygon>` components with hard-coded coordinate arrays. Define these once in `mockData.ts`.
3. **Sensor markers:** Custom `<Marker>` with a `divIcon` (HTML-based) so you can colour-code them with Tailwind classes.
4. **Mesh node markers:** Larger custom div icons (square, distinct from sensors).
5. **Mesh links:** `<Polyline>` between node coordinates, dashed for active links, bold + animated for the degraded one. For animation, use Leaflet's `setStyle` on an interval or just CSS-animate a SVG overlay.
6. **Map centre:** `[-33.8869, 18.9756]`, initial zoom 15.
7. **Disable scroll-wheel zoom** by default (or it'll annoy presenters during the demo). Add a "Reset view" button.

**Generate field polygons:** Just hand-craft 4 rough rectangles around the centre point. Each ~0.005 degrees on a side ≈ 500m, which is roughly right for ~25 ha. Don't overthink it.

**Important Next.js gotcha:**
```tsx
// components/FarmMap.tsx
"use client";
// Must be client component, and the page that uses it must dynamically import:

// app/dashboard/page.tsx
import dynamic from "next/dynamic";
const FarmMap = dynamic(() => import("@/components/FarmMap"), { ssr: false });
```

---

## 9. Mock Data Realism Rules

- **Sensor readings should look believable.** Soil moisture for vineyards: 18–35%. Temperature: 15–28°C in autumn. Humidity: 40–70%.
- **History data:** generate 30 days of hourly readings with a slight downward trend on the alerted sensor and stable readings elsewhere. Use a seeded PRNG (e.g., `seedrandom`) so the demo is identical every time.
- **Currency:** Always Rand (R), never $. This is a South African product. e.g., "R12,400", "R1,850".
- **Units:** Metric. Hectares, °C, mm rainfall, litres.
- **Timestamps:** Use relative ("14 min ago", "3 hr ago") for the activity feed. Use absolute for charts.

---

## 10. Visual Polish Checklist

These are the things that separate a "student prototype" from "investor-ready":

- [ ] Loading states on every screen (skeleton loaders for the first 800ms — fake the loading).
- [ ] Smooth page transitions (Framer Motion `AnimatePresence` or Next.js built-in).
- [ ] Empty states (e.g., on the alerts page if no alerts).
- [ ] Hover states on every clickable element.
- [ ] Mobile-responsive (the panel might pull this up on a phone). At minimum, sidebar collapses to a bottom bar on mobile.
- [ ] A favicon (use the logo).
- [ ] Page titles set per route ("NetSense — Dashboard", etc.).
- [ ] Consistent rounded corners (`rounded-xl`), shadows (`shadow-sm`), spacing.
- [ ] No Lorem Ipsum, no placeholder names anywhere. Every label is real.
- [ ] No console errors on load.
- [ ] Works in Chrome and Safari (test both before pitch day).

---

## 11. Demo Script Alignment

The presenter will walk through these screens in this order during the live demo. Build with this flow in mind:

1. **Setup (30 sec):** "Watch how easy it is to deploy NetSense on a farm." → click through the 3 wizard steps, sensors auto-appear on the map.
2. **Dashboard (60 sec):** "Here's what the farmer sees every morning. Look at this alert — Block A is drying out, and we've calculated it could cost them R12,400 if they don't act today."
3. **Sensor detail (60 sec):** Click the alerted sensor → "30 days of history, optimal range overlay, and our insights engine tells them exactly what to do and how much to irrigate."
4. **Network health (45 sec):** "And here's our moat — the decentralised mesh. See this node? It's degraded, but the farmer never noticed because the sensors auto-routed through neighbouring nodes. We even tell them where to add the next node to strengthen coverage."
5. **Back to dashboard (15 sec):** "All of this runs without a single cell tower, without a monthly contract, on hardware they own outright."

Total: ~3.5 minutes, leaving 1.5 min for Q&A handover.

---

## 12. Deployment to Vercel

1. Push to GitHub.
2. Import the repo at vercel.com → Next.js is auto-detected.
3. No environment variables needed.
4. Deploy. Typical build time: 60–90 seconds.
5. Custom domain optional — `netsense.vercel.app` is fine for the pitch.
6. Add a `README.md` in the repo root with:
   - One-paragraph product description.
   - `npm install && npm run dev` instructions.
   - Link to the live Vercel URL.
   - Note: "All data is mocked. No backend connection."

---

## 13. What NOT to Build (scope discipline)

- Real authentication. The "login" is one button.
- A backend, database, or API. Everything is in `mockData.ts`.
- Real-time updates via WebSockets. Fake it with `setInterval` if you want a "live" feel on the dashboard.
- Settings pages, user profiles, billing. Out of scope.
- A PDF export that actually works. The button can show a toast: "Report queued for export."
- Multiple farms / multi-tenancy. One farm only.
- Any screen not listed in this spec. Resist scope creep.

---

## 14. Definition of Done

The prototype is complete when:
1. All 4 screens are built, navigable, and visually polished.
2. The map shows a real Western Cape location with field overlays, sensors, nodes, and mesh links.
3. The setup wizard's "auto-detect sensors" animation works smoothly.
4. The dashboard alert clearly communicates rand-value yield impact.
5. The sensor detail page has a working time-series chart with threshold bands.
6. The network health page shows mesh topology with a degraded node and at least one actionable recommendation.
7. It's deployed to Vercel and the URL works on mobile and desktop.
8. The full demo script can be performed in under 4 minutes without bugs.
9. There are no console errors, no broken links, no placeholder text.
10. README is in place.

---

**Build order recommendation:**
1. Set up Next.js + Tailwind + shadcn + Leaflet, get a blank map rendering.
2. Build `mockData.ts` with full farm, sensors, nodes, alerts, history.
3. Build the layout + sidebar + the dashboard screen first (the centrepiece).
4. Build the sensor detail page (chart-heavy).
5. Build the network health page.
6. Build the setup wizard last (it's the most "magic" but technically simplest).
7. Polish pass: loading states, animations, mobile, empty states.
8. Deploy to Vercel + test on mobile / laptop.