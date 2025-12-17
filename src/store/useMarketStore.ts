import { create } from 'zustand';
import { type TokenData } from '../types/market';

interface MarketState {
    tokens: TokenData[];
    isLoading: boolean;
    timeframe: string;
    selectedToken: TokenData | null;
    error: string | null;

    // Actions
    setTokens: (data: TokenData[]) => void;
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setTimeframe: (tf: string) => void;
    setSelectedToken: (token: TokenData | null) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
    tokens: [],
    isLoading: false,
    timeframe: '24hr',
    selectedToken: null,
    error: null,

    setIsLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    setTimeframe: (tf) => set({ timeframe: tf }),
    setSelectedToken: (token) => set({ selectedToken: token }),

    setTokens: (data) => {
        // Optimization & Filtering Logic
        const processed = data
            .filter(t => t.symbol.endsWith('USDT'))     // 1. Filter USDT pairs
            .filter(t => t.volume > 0)                  // 2. Remove zero volume
            .sort((a, b) => b.percentChange - a.percentChange); // 3. Sort by % Change Desc

        set({ tokens: processed });
    }
}));
