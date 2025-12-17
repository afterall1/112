# Data Contracts

## Source: Binance API
*   **Endpoint:** `GET /api/v3/ticker/24hr`
*   **Stream:** `wss://stream.binance.com:9443/ws/!ticker@arr`

## Interfaces

```typescript
export interface ITickerData {
    s: string;  // Symbol (e.g., "BTCUSDT")
    p: string;  // Price Change
    P: string;  // Price Change Percent
    w: string;  // Weighted Average Price
    x: string;  // First Trade(F) Price before 24hr
    c: string;  // Last Price
    Q: string;  // Last Quantity
    b: string;  // Best Bid Price
    B: string;  // Best Bid Quantity
    a: string;  // Best Ask Price
    A: string;  // Best Ask Quantity
    o: string;  // Open Price
    h: string;  // High Price
    l: string;  // Low Price
    v: string;  // Total Traded Base Asset Volume
    q: string;  // Total Traded Quote Asset Volume
    O: number;  // Statistics Open Time
    C: number;  // Statistics Close Time
    F: number;  // First Trade ID
    L: number;  // Last Trade Id
    n: number;  // Total Number of Trades
}

// Normalized Internal Model (mapped from API)
export interface ICoinState {
    symbol: string;
    price: number;
    changePercent: number; // The key driver for physics (Gravity/Velocity)
    volume: number;        // Determines mass/size? (TBD)
}
```
