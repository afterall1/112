// Raw data from Binance API
export interface RawTicker {
    symbol: string;
    priceChange: string;
    priceChangePercent: string;
    weightedAvgPrice: string;
    prevClosePrice: string;
    lastPrice: string;
    lastQty: string;
    bidPrice: string;
    bidQty: string;
    askPrice: string;
    askQty: string;
    openPrice: string;
    highPrice: string;
    lowPrice: string;
    volume: string;
    quoteVolume: string;
    openTime: number;
    closeTime: number;
    firstId: number;
    lastId: number;
    count: number;
}

export type TokenStatus = 'rising' | 'falling' | 'neutral';

// Processed data for internal use
export interface TokenData {
    symbol: string;
    price: number;
    percentChange: number;
    volume: number;
    status: TokenStatus;
}
