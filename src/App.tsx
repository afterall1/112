import { useEffect } from 'react';
import { MarketScene } from './components/visuals/MarketScene';
import { Overlay } from './components/ui/Overlay';
import { fetchMarketData } from './services/binance';

function App() {
  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050505] text-white font-sans">
      {/* Layer 1: WebGL Scene */}
      <div className="absolute inset-0 z-0">
        <MarketScene />
      </div>

      {/* Layer 2: UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Overlay />
      </div>
    </div>
  );
}

export default App;

