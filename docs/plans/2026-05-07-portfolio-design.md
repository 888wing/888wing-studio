# Portfolio Design — 純血構成主義

**Date:** 2026-05-07
**Author:** chuisiufai (with Claude)
**Status:** Approved, ready for implementation planning

---

## Audience & Purpose

- **70% A — 招募 / 合作方 / 投資人**：重 case study 深度、技術可信度
- **30% D — 個人作品博物館**：保留 raw 個人表達空間

設計選擇上：當 70% 與 30% 衝突時，30% 不妥協 — 構成主義美學是身份立場，雇主來不來就是這個樣子。

## Design Direction

**1920 蘇聯純血構成主義（El Lissitzky / Rodchenko 路線）**

- 不做 Persona 5 動漫化、不做 Anton & Irene 新構成主義路線
- 不向職場美學妥協 — 立場本身就是 case study

## 視覺基底（Ironclad Rules）

| 元素 | 規則 |
|---|---|
| **顏色** | 純 4 色：`--ink-red: #8B1A1A`（陳年印刷紅 / oxblood）、`--ink-black: #0A0A0A`、`--paper: #F4EFE6`（米白紙）、`--ink-yellow: #E8C547`（少量強調用） |
| **字體** | 標題首選 Druk Wide Heavy（付費）/ 免費替代 Tusker Grotesk；中文 Noto Serif TC Black + Noto Sans TC Black；內文等寬 JetBrains Mono |
| **格線** | 12-col grid 顯示出來不隱藏，hairline + 藍圖式編號 `01–12` / `A–L` |
| **紙質** | 白底加 subtle paper noise SVG filter；圖片全部 halftone（CSS filter + duotone） |
| **印刷標記** | 角落 registration mark（⊕）、裁切線、油墨色票條 |
| **不准** | 漸層、圓角、fade、多餘顏色、emoji |

## 站點架構

```
/                   首頁 — Manifesto + Hero 4 卡 + Archive 入口 + Colophon
/work/dova          Hero case study — Dova Travel
/work/loopline      Hero case study — Loopline
/work/prodriver     Hero case study — ProDriver Hub
/work/latent        Hero case study — latent (rawctl)
/archive            Grid 20+ 全部作品
```

About / Contact 不獨立成頁，全部塞在首頁底部 Colophon 區塊（構成主義海報就是「一張紙講完所有事」）。

## 首頁版面（從上到下）

1. **TOP STRIP** — 常駐黑條，monospace 跑馬燈：`●REC  HKT 14:32   PORTFOLIO/2026`
2. **HERO BLOCK** — 巨大斜置姓名（旋轉 -7°）+ 紅 wedge 隨 scroll 長大
3. **MANIFESTO** — Kinetic typography，一句宣言逐字組版進入
4. **HERO 4** — 4 個 hero 專案卡，編號 01/02/03/04，全寬交錯左右
5. **ARCHIVE 23** — Filter chips + 小卡 grid，hover 整 grid 重排
6. **COLOPHON** — 地址 / Email / GitHub / 印刷資訊 + 角落 ⊕

## Hero 4 專案

| # | 專案 | 路徑 | 形態 | 雇主訊號 |
|---|---|---|---|---|
| 01 | **Dova Travel** | `~/Projects/Dova` | 旅遊 SaaS + 全運作系統 | 能做完整商業系統 |
| 02 | **Loopline** | `~/Documents/Codex/loopline` | iOS 遊戲，Phaser+Capacitor，付費 IAP | 能上架賺錢 |
| 03 | **ProDriver Hub** | `~/ProDriverHub` | Flutter 跨平台 + landing | 能做跨平台 |
| 04 | **latent (rawctl)** | `~/Projects/rawctl` | macOS App + AI 攝影 culling | 能做專業桌面工具 |

## 動畫語彙（10 招）

| # | 招式名 | 行為 | 用在哪 |
|---|---|---|---|
| 1 | 印版組裝 Press Assembly | 黑色色塊先推進蓋住，再像印刷板掀開露出 | 首屏載入、頁面切換 |
| 2 | 紅楔成長 Red Wedge | scroll progress 變成會長大旋轉的紅三角 | 全站 scroll progress |
| 3 | 斜切轉場 Diagonal Slice | 切頁時整個畫面被對角線切開 | 路由轉場 |
| 4 | 活字組版 Movable Type | 大標題字逐個從上方落下、輕微旋轉再校正歸位 | 每個 hero 標題 |
| 5 | 網點顯影 Halftone Reveal | 圖片從大點 → 小點 → 清晰，像報紙印刷顯影 | 所有 hero 主圖 |
| 6 | 十字準星游標 Registration Cursor | 自定 cursor 為 ⊕ 十字，hover 連結放大成色票方塊 | 全站 |
| 7 | PROUN 重排 Grid Tilt | hover archive 卡片，整 grid 微微傾斜 1–2° | Archive section |
| 8 | Manifesto 跑帶 Kinetic Type | 滾到 manifesto 段，文字以不同字級/旋轉/斷行自動拼進來 | Manifesto section |
| 9 | 油墨溢色 Ink Bleed | hover 紅色按鈕，紅色溢出邊框 1–2px 像套色不準 | CTA 按鈕 |
| 10 | 色條條碼 Ink Strip | 頁尾一條 CMYK + R/B/Y 油墨色票條 marquee 跑 | Footer |

### 互動規則

- 所有過渡用 `cubic-bezier(0.7, 0, 0.3, 1)` 或更尖銳，模擬機械
- 不准圓角，唯一例外是十字準星圓圈
- `prefers-reduced-motion` 偵測到就停掉招式 1, 3, 7，保留 4, 5, 6 的最後幀
- mobile：斜置標題改正、grid 從 12 col 降 4 col、招式 7 改成 tap 觸發

## Hero Case Study 內頁結構

每個 hero 副頁用同一條脊椎（7 段）+ 每個專案 1–2 段獨有內容（折疊式）。

### 共通脊椎

```
01 — TITLE BLOCK / 標題版
02 — HERO MEDIA / 主視覺
03 — CONTEXT / 為什麼做這個
04 — APPROACH / 怎麼想
[獨有段 04A — 折疊式]
05 — EXECUTION / 怎麼做
06 — OUTCOME / 結果
07 — COLOPHON / 版權頁
```

### 每個 hero 的獨有段

| Hero | 獨有段 | 為什麼 |
|---|---|---|
| **Dova** | **SYSTEM MAP** — 構成主義圖解 content-engine / competitor-watch / cruise-intel 三個子系統 | 雇主要看「能設計系統」 |
| **Loopline** | **SHIP LOG** — 1.0 → 1.1 → 1.2 版本演進時間軸 + commit 數 | 證明能持續迭代 |
| **ProDriver** | **PLATFORM MATRIX** — 6 col × N row 表格列各 feature 跨平台支援 | 跨平台是賣點要直接秀 |
| **latent** | **BEFORE/AFTER SLIDER** — AI culling 100 RAW → 20 精選互動示範 | 工具最好的 demo 是親手玩 |

### 折疊機制（拆封信封式）

**收起**：全寬黑色厚邊框（top + bottom 4px solid black）像信封封口；左上 ⊕ 紅色十字；編號 `04A`；右上 `[+]` 厚 slab；中間 2–3 行 summary（必寫，不是「點擊展開」）。

**展開動畫**：
1. `[+]` 旋轉 45° 變 `[×]`（紅）
2. 黑色封口邊框先往兩邊裂開（`scale-y` 從中線 split）
3. 內容區從中線往上下展開（`clip-path` reveal）
4. 內容浮現時觸發招式 5 + 招式 4
5. 600ms `cubic-bezier(0.7, 0, 0.3, 1)`；收回 300ms

### 折疊 edge cases

| 情況 | 處理 |
|---|---|
| 直接分享連結 (`?expand=04A` 或 `#04A`) | 該段預設展開 + auto-scroll |
| 多段同時開 | 允許，不互斥 |
| Mobile | 點整條黑邊任意位置觸發 |
| 可訪問性 | `<details>/<summary>` 原生標籤包，aria-expanded 自動帶 |
| 列印 / PDF | `@media print` 強制全展開 |
| SEO | `<details>` 對 crawler 完全可見 |
| 第一次訪問 | 全部收起，不做「第一段預設展開」小聰明 |

### 套用範圍

折疊機制也套用到脊椎 03/04/05 的 sub-section。頁頂加全展開/全收起切換鈕：

```
[ ▭ ▭ ▭ COMPRESSED ]  [ ▭▭▭▭▭ EXPANDED ]
```

預設 COMPRESSED — 第一眼看到完整海報式 case study；想深讀按 EXPANDED 全攤開。

## Tech Stack

| 層 | 選擇 | 理由 |
|---|---|---|
| Framework | **Astro 4 + React islands** | Portfolio 90% 靜態，Astro 預設 0 JS、SEO 滿分；只 hydrate 需要互動的 island |
| 動畫主力 | **GSAP 3 + ScrollTrigger + SplitText** | 招式 2/3/4/8 需要 sharp 時間控制 |
| Smooth scroll | **Lenis** | 招式 2 紅楔需 scroll progress |
| UI motion | **Framer Motion**（React islands 內） | Collapsible / hover micro-interaction |
| Styling | **Tailwind CSS + 嚴格 design token** | 4 色寫死成 token，禁用 raw hex |
| Content | **MDX**（每個 case study = `.mdx`） | 七段脊椎做成 MDX layout component |
| Image | **Astro `<Image>` + Sharp** | 自動 webp/avif、halftone 前處理在 build time |
| Hosting | **Cloudflare Pages** | 已用 CF；免費；edge cache；wrangler 部署 |
| Domain | TBD（`chuisiufai.com` 或 `siufai.studio`） | studio 後綴更像 design studio |

### 字體（含免費替代）

| 用途 | 首選（付費） | 免費替代 |
|---|---|---|
| 大標題 | Druk Wide Heavy ($70 Commercial Type) | **Tusker Grotesk** (Pangram Pangram) |
| 副標題 | GT America Mono | **JetBrains Mono Bold** |
| 內文 | GT America | **Inter** |
| 中文標題 | — | **Noto Serif TC Black + Noto Sans TC Black** |
| 等寬註解 | — | **JetBrains Mono Regular** |

**起跑全免費。** Tusker 視覺 90% 接近 Druk Wide，省 $70。

### 動畫架構決定

1. GSAP context per route — 用 `useGSAP` hook，路由切換自動 cleanup
2. `ScrollTriggerProvider` React context — 統一管理，方便 `prefers-reduced-motion` 一鍵全關
3. Custom cursor 用 50 行 vanilla JS + `mix-blend-mode: difference`，不引 lib
4. Halftone — 靜態用 build-time SVG filter；動態 reveal 用 CSS `mask-image` + animated `background-position`
5. 路由轉場用 View Transitions API（Astro 4 原生）+ GSAP，舊瀏覽器 fade fallback

## 素材準備清單

### 1. 主視覺
- [ ] 4 hero 各一支 6–10 秒 loop 影片或極大尺寸截圖（≥ 2400px 寬）
- [ ] 個人 headshot（高對比黑白）

### 2. 文案
- [ ] 一句 tagline（10 字內）
- [ ] Manifesto 80–120 字
- [ ] 每個 hero：tagline、Context (200 字)、3–5 Approach 決策、Execution (300 字)、Outcome 數字 2–3 個

### 3. 獨有段素材
- [ ] Dova: 三子系統架構草圖
- [ ] Loopline: 1.0 / 1.1 / 1.2 各一張代表截圖 + commit 數
- [ ] ProDriver: 各平台一張截圖
- [ ] latent: 5 對 before/after RAW culling 範例

### 4. Archive 23 件作品
- [ ] 每件：名稱 / 一句話 / 縮圖 (512² ) / 外部連結 / tag

### 5. Colophon
- [ ] Email、GitHub、社群、在地

## Repo

- 路徑：`~/Projects/portfolio`
- Git 已 init
- 接 GitHub + Cloudflare Pages 自動部署（待加）

## Out of scope（這次不做）

- Blog / writing 區塊
- Dark mode（構成主義就是這個配色，不切換）
- i18n 系統（中英並陳是版面決定，不做動態切換）
- CMS — 用 MDX 直接寫，不上 Sanity / Contentful
- Analytics 細節（裝個 Plausible 就好）

## Approval

四段設計 (Section 1–4) 全部經 user 逐段確認通過於 2026-05-07。下一步：invoke writing-plans skill 拆成可執行的實作步驟。
