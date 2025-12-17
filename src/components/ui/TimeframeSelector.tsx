import clsx from 'clsx';
import { useMarketStore } from '../../store/useMarketStore';

const TIMEFRAMES = ['15m', '1h', '4h', '24h'];

export const TimeframeSelector = () => {
    const { timeframe, setTimeframe } = useMarketStore();

    return (
        <div className="flex space-x-2 bg-black/40 backdrop-blur-sm p-1 rounded-lg border border-white/10 pointer-events-auto">
            {TIMEFRAMES.map((tf) => (
                <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={clsx(
                        "px-4 py-1 text-sm font-bold tracking-widest transition-all duration-300 rounded",
                        timeframe === tf
                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                            : "text-gray-500 hover:text-white hover:bg-white/5"
                    )}
                >
                    {tf}
                </button>
            ))}
        </div>
    );
};
