import clsx from 'clsx';
import { useMarketStore } from '../../store/useMarketStore';

export const DetailPanel = () => {
    const { selectedToken, setSelectedToken } = useMarketStore();

    if (!selectedToken) return null;

    const isRising = selectedToken.status === 'rising';
    const colorClass = isRising ? 'text-cyan-400' : 'text-[#ff0055]';
    const borderClass = isRising ? 'border-cyan-500/30' : 'border-[#ff0055]/30';

    return (
        <div
            className={clsx(
                "fixed right-0 top-0 h-full w-96 bg-black/80 backdrop-blur-xl border-l p-8 transform transition-transform duration-500 ease-out z-50 pointer-events-auto",
                borderClass,
                selectedToken ? "translate-x-0" : "translate-x-full"
            )}
        >
            {/* Close Button */}
            <button
                onClick={() => setSelectedToken(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
                [X] CLOSE
            </button>

            <div className="mt-12 space-y-8">
                {/* Header */}
                <div>
                    <h2 className="text-6xl font-bold tracking-tighter text-white/90">
                        {selectedToken.symbol.replace('USDT', '')}
                    </h2>
                    <span className="text-xs text-gray-400 tracking-[0.2em] font-mono">
                        USDT PERPETUAL
                    </span>
                </div>

                {/* Price Block */}
                <div className={clsx("border-l-4 pl-4", borderClass)}>
                    <div className="text-sm text-gray-400 mb-1">CURRENT PRICE</div>
                    <div className={clsx("text-4xl font-mono", colorClass)}>
                        ${selectedToken.price.toFixed(selectedToken.price < 1 ? 5 : 2)}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded border border-white/5">
                        <div className="text-xs text-gray-500 mb-1">24H CHANGE</div>
                        <div className={clsx("text-xl font-bold", colorClass)}>
                            {selectedToken.percentChange > 0 ? '+' : ''}{selectedToken.percentChange.toFixed(2)}%
                        </div>
                    </div>
                    <div className="bg-white/5 p-4 rounded border border-white/5">
                        <div className="text-xs text-gray-500 mb-1">VOLUME (24H)</div>
                        <div className="text-xl font-bold text-white">
                            ${(selectedToken.volume / 1000000).toFixed(2)}M
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <a
                    href={`https://www.binance.com/en/trade/${selectedToken.symbol}?type=spot`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={clsx(
                        "block w-full text-center py-4 font-bold tracking-widest uppercase transition-all duration-300 border",
                        isRising
                            ? "bg-cyan-500/10 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black"
                            : "bg-red-500/10 border-red-500 text-red-400 hover:bg-red-500 hover:text-black"
                    )}
                >
                    Trade on Binance
                </a>
            </div>
        </div>
    );
};
