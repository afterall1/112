import { TimeframeSelector } from './TimeframeSelector';
import { DetailPanel } from './DetailPanel';
import { useMarketStore } from '../../store/useMarketStore';
import { fetchMarketData } from '../../services/binance';

export const Overlay = () => {
    const { tokens, isLoading, error } = useMarketStore();

    return (
        <div className="w-full h-full relative flex flex-col justify-between p-8 font-rajdhani">
            {/* Top Bar */}
            <div className="flex justify-between items-start pointer-events-none">
                {/* Brand */}
                <div className="pointer-events-auto">
                    <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 opacity-90">
                        EVENT HORIZON
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)] ${error ? 'bg-red-500 animate-bounce' : 'bg-green-500 animate-pulse'}`}></div>
                        <span className={`text-xs tracking-[0.3em] ${error ? 'text-red-400' : 'text-green-400'}`}>
                            {error ? 'SYSTEM FAILURE' : 'SYSTEM ONLINE'}
                        </span>
                    </div>
                </div>

                {/* Center: Timeframe */}
                {!error && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-8 pointer-events-auto">
                        <TimeframeSelector />
                    </div>
                )}

                {/* Right: Stats */}
                <div className="text-right pointer-events-auto">
                    <div className="text-4xl font-mono text-white/90">{tokens.length}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest">Active Entities</div>
                </div>
            </div>

            {/* Bottom Bar / Status Area */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* LOADING STATE */}
                {isLoading && !error && tokens.length === 0 && (
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4 opacity-80"></div>
                        <span className="text-cyan-500/80 text-xl tracking-[0.5em] animate-pulse block">
                            SCANNING SECTOR...
                        </span>
                    </div>
                )}

                {/* ERROR STATE */}
                {error && (
                    <div className="text-center bg-black/80 p-8 rounded-lg border border-red-500/30 backdrop-blur-md pointer-events-auto">
                        <div className="text-red-500 text-6xl mb-4">⚠</div>
                        <h2 className="text-2xl text-red-400 font-bold mb-2 tracking-widest">CONNECTION LOST</h2>
                        <p className="text-gray-400 mb-6 text-sm">{error}</p>
                        <button
                            onClick={() => fetchMarketData()}
                            className="bg-red-500/20 hover:bg-red-500 hover:text-white text-red-400 border border-red-500 px-8 py-2 rounded transition-all duration-300 uppercase tracking-widest text-sm font-bold"
                        >
                            Retry Uplink
                        </button>
                    </div>
                )}

                {/* DEBUG DATA DISPLAY */}
            </div>

            {/* Slide-over Panel */}
            <DetailPanel />
        </div>
    );
};
