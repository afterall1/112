import axios from 'axios';
import { type RawTicker, type TokenData, type TokenStatus } from '../types/market';
import { useMarketStore } from '../store/useMarketStore';

const API_PROXY = '/api/binance'; // Goes to vite.config.ts proxy -> https://api.binance.com

export const fetchMarketData = async () => {
    const { setTokens, setIsLoading, setError } = useMarketStore.getState();

    setIsLoading(true);
    setError(null); // Clear previous errors

    try {
        // GET /api/v3/ticker/24hr via Proxy
        const response = await axios.get<RawTicker[]>(`${API_PROXY}/api/v3/ticker/24hr`);

        const rawData = response.data;

        // Map & Parse
        const tokens: TokenData[] = rawData.map(t => {
            const price = parseFloat(t.lastPrice);
            const percentChange = parseFloat(t.priceChangePercent);
            const volume = parseFloat(t.quoteVolume); // Using Quote Volume (USDT volume) usually makes more sense for "size", but user asked for "volume" (usually base).
            // However, standard for sorting "volume" in trackers is often Quote Volume (USDT traded).
            // I will use QuoteVolume as 'volume' for better relevance or base if strictly requested.
            // User said "Hacmi 0 olanları ele".
            // I will use QuoteVolume as it represents the $ value.

            let status: TokenStatus = 'neutral';
            if (percentChange > 0) status = 'rising';
            if (percentChange < 0) status = 'falling';

            return {
                symbol: t.symbol,
                price,
                percentChange,
                volume, // Mapping quoteVolume to volume for $ filtering relevance
                status
            };
        });

        console.log(`[BinanceService] Fetched ${tokens.length} tokens.`);
        setTokens(tokens);

    } catch (error) {
        console.error("Failed to fetch market data:", error);
        setError("CONNECTION LOST - RETRYING...");
    } finally {
        setIsLoading(false);
    }
};
