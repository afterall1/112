import { useEffect, useRef } from 'react';
import { Application, Container, Graphics } from 'pixi.js';
import { useMarketStore } from '../../store/useMarketStore';
import { type TokenData } from '../../types/market';

// Constants
const COLOR_RISER = 0x00f3ff;
const COLOR_FALLER = 0xff0055;
const NEUTRAL_RADIUS = 150; // The Event Horizon Radius
const ANIMATION_SPEED = 0.002; // Rotation speed of the cosmos

class Orb {
    public graphics: Graphics;
    public targetX: number = 0;
    public targetY: number = 0;
    public currentX: number = 0;
    public currentY: number = 0;
    public angle: number;
    public radius: number = 0;
    public baseScale: number = 1;
    public targetScale: number = 1;

    constructor() {
        this.graphics = new Graphics();
        this.angle = Math.random() * Math.PI * 2;

        // Interaction Setup
        this.graphics.eventMode = 'static';
        this.graphics.cursor = 'pointer';

        this.graphics.on('pointerover', this.onHover.bind(this));
        this.graphics.on('pointerout', this.onOut.bind(this));
        this.graphics.on('pointerdown', this.onClick.bind(this));
    }

    onHover() {
        this.targetScale = 1.5; // Scale up to 150%
        this.graphics.alpha = 1.0;
        this.graphics.parent?.addChild(this.graphics); // Bring to front
    }

    onOut() {
        this.targetScale = 1.0; // Return to normal
        this.graphics.alpha = 0.8;
    }

    onClick() {
        // @ts-ignore
        const token = this.graphics.tokenData as TokenData;
        if (token) {
            useMarketStore.getState().setSelectedToken(token);
        }
    }

    updateData(token: TokenData) {
        // 1. Calculate Size based on Volume (Logarithmic)
        // Clamp min/max for visibility
        const size = Math.max(2, Math.min(20, Math.log(token.volume || 1) * 0.8));

        // 2. Determine Physics (Radius from center)
        const absChange = Math.abs(token.percentChange);
        let dist = NEUTRAL_RADIUS;

        if (token.status === 'rising') {
            // Risers: Fly OUTWARDS. 
            // Scale: 10% change = +100px roughly
            dist = NEUTRAL_RADIUS + (absChange * 15);
        } else if (token.status === 'falling') {
            // Fallers: Pulled INWARDS to Singularity.
            // Be careful not to cross 0.
            dist = Math.max(0, NEUTRAL_RADIUS - (absChange * 5));
        }

        // CLAMP for safety during debug
        dist = Math.min(dist, 800);

        // 3. Update Visuals
        this.graphics.clear();
        // FORCE DEBUG VISUAL
        this.graphics.rect(-10, -10, 20, 20);
        this.graphics.fill(0xFF0000); // RED
        this.graphics.alpha = 1.0;

        // Attach data for interaction
        // @ts-ignore
        this.graphics.tokenData = token;

        // 4. Calculate Target Coordinates (Polar -> Cartesian)
        this.radius = dist;
        this.targetX = Math.cos(this.angle) * dist;
        this.targetY = Math.sin(this.angle) * dist;
    }

    animate(lerpFactor: number) {
        // Smoothly interpolate current position to target
        this.currentX += (this.targetX - this.currentX) * lerpFactor;
        this.currentY += (this.targetY - this.currentY) * lerpFactor;

        this.graphics.x = this.currentX;
        this.graphics.y = this.currentY;

        // Log occasionally for the first orb via a global or hack, but simpler:
        // just trust visual for now. 
        // Actually, if x/y are NaN, that explains it.
        if (Number.isNaN(this.graphics.x)) {
            console.error("DEBUG: Orb X is NaN!");
            this.graphics.x = 0;
            this.currentX = 0;
        }

        // Scale Animation (Hover Effect)
        // We act on the graphics scale property
        const currentScale = this.graphics.scale.x;
        const newScale = currentScale + (this.targetScale - currentScale) * 0.2;
        this.graphics.scale.set(newScale);
    }
}

export const MarketScene = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<Application | null>(null);
    const mainContainerRef = useRef<Container | null>(null);
    const orbsRef = useRef<Map<string, Orb>>(new Map());

    const tokens = useMarketStore(state => state.tokens);

    // 1. Initialize PixiJS
    useEffect(() => {
        if (!containerRef.current) return;

        const initPixi = async () => {
            const app = new Application();
            await app.init({
                resizeTo: window,
                backgroundAlpha: 0, // Transparent, let CSS handle background #050505
                antialias: true,
                resolution: window.devicePixelRatio || 1,
            });

            containerRef.current!.appendChild(app.canvas);
            appRef.current = app;

            // Main Container to center everything
            const mainContainer = new Container();
            mainContainer.x = app.screen.width / 2;
            mainContainer.y = app.screen.height / 2;

            app.stage.addChild(mainContainer);
            mainContainerRef.current = mainContainer;

            // Animation Loop
            app.ticker.add(() => {
                if (mainContainer) {
                    // Rotate the entire universe properly
                    mainContainer.rotation += ANIMATION_SPEED;

                    // Animate Orbs
                    orbsRef.current.forEach(orb => orb.animate(0.05));
                }
            });
        };

        if (!appRef.current) {
            initPixi();
        }

        return () => {
            if (appRef.current) {
                appRef.current.destroy({ removeView: true });
                appRef.current = null;
            }
        };
    }, []);

    // 2. Handle Resize for Center Point
    useEffect(() => {
        const handleResize = () => {
            if (appRef.current && mainContainerRef.current) {
                mainContainerRef.current.x = appRef.current.screen.width / 2;
                mainContainerRef.current.y = appRef.current.screen.height / 2;
                // No need to recalculate orb positions as they are relative to the container center
            }
        };

        let timeout: ReturnType<typeof setTimeout>; // Fixed NodeJS.Timeout error
        const debouncedResize = () => {
            clearTimeout(timeout);
            timeout = setTimeout(handleResize, 100);
        };

        window.addEventListener('resize', debouncedResize);
        return () => window.removeEventListener('resize', debouncedResize);
    }, []);

    // 3. Sync Data -> Visuals
    useEffect(() => {
        if (!mainContainerRef.current) return;

        const currentOrbs = orbsRef.current;
        const activeSymbols = new Set(tokens.map(t => t.symbol));

        console.log("DEBUG: Visual update triggered. Token count:", tokens.length);

        // Create or Update Orbs
        tokens.forEach((token, index) => {
            let orb = currentOrbs.get(token.symbol);

            if (!orb) {
                orb = new Orb();
                mainContainerRef.current!.addChild(orb.graphics);
                currentOrbs.set(token.symbol, orb);
            }

            orb.updateData(token);

            // Log first orb to check validity
            if (index === 0) {
                console.log(`DEBUG: Orb[0] (${token.symbol}) - Target: ${orb.targetX.toFixed(2)}, ${orb.targetY.toFixed(2)} Radius: ${orb.radius} Size logic: Vol=${token.volume}`);
            }
        });

        // Remove old Orbs
        currentOrbs.forEach((orb, symbol) => {
            if (!activeSymbols.has(symbol)) {
                mainContainerRef.current?.removeChild(orb.graphics);
                orb.graphics.destroy();
                currentOrbs.delete(symbol);
            }
        });

    }, [tokens]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 w-full h-full z-0 pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
};
