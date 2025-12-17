# Tech Stack

## Core Architecture
*   **Framework:** React 19
*   **Language:** TypeScript
*   **Build Tool:** Vite

## Visuals & Graphics (WebGL)
*   **Engine:** PixiJS (v8)
    *   *Reasoning:* Selected for superior 2D performance and batch rendering capabilities, crucial for handling many moving particle elements smoothly compared to DOM-based approaches.
    *   *Alternative:* Three.js (if 3D depth becomes a strict requirement later, but PixiJS is primary).

## State Management
*   **Global State:** Zustand
    *   *Usage:* Transient updates for high-frequency ticker data to avoid unnecessary React re-renders. Direct integration with the WebGL loop.

## Styling
*   **CSS Engine:** TailwindCSS v4
    *   *Theme:* Cyberpunk / Sci-Fi aesthetics.

## Data Layer
*   **HTTP Client:** Axios (for REST snapshots)
*   **Real-time:** Native WebSocket API (for Binance streams)
