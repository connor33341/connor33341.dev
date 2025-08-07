import React from 'react';
import { createTextVectors, VectorPoint } from './fontVectorLoader';

export interface ParticleAnimationOptions {
    text: string;
    fontFamily?: string;
    fontSize?: number;
    particleCount?: number;
    animationDuration?: number;
    colors?: string[];
    textWidth?: number;
    textHeight?: number;
    onComplete?: () => void;
    onFallback?: (error: any) => void;
}

export interface ParticleAnimationState {
    isRunning: boolean;
    progress: number;
}

// Bezier curve calculation helper
const bezierPoint = (t: number, p0: number, p1: number, p2: number, p3: number) => {
    const cX = 3 * (p1 - p0);
    const bX = 3 * (p2 - p1) - cX;
    const aX = p3 - p0 - cX - bX;

    return aX * Math.pow(t, 3) + bX * Math.pow(t, 2) + cX * t + p0;
};

// Particle class with bezier curve paths
class Particle {
    x: number;
    y: number;
    size: number;
    targetX: number;
    targetY: number;
    speed: number;
    color: string;
    initialX: number;
    initialY: number;
    controlPoint1X: number;
    controlPoint1Y: number;
    controlPoint2X: number;
    controlPoint2Y: number;
    progress: number;
    progressSpeed: number;
    finalPhase: boolean;
    finalAngle: number;
    finalSpeed: number;
    alpha: number;

    constructor(
        canvas: HTMLCanvasElement,
        targetX: number,
        targetY: number,
        colors: string[]
    ) {
        this.initialX = Math.random() * canvas.width;
        this.initialY = Math.random() * canvas.height;
        this.x = this.initialX;
        this.y = this.initialY;
        this.size = Math.random() * 2 + 1;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = Math.random() * 0.01 + 0.005;
        this.progress = 0;
        this.progressSpeed = Math.random() * 0.004 + 0.002;
        this.finalPhase = false;
        this.finalAngle = Math.random() * Math.PI * 2;
        this.finalSpeed = Math.random() * 3 + 1;
        this.alpha = 1;

        // Create random but smooth bezier control points
        // First control point - near start but with some randomness
        this.controlPoint1X = this.initialX + (Math.random() - 0.5) * canvas.width * 0.5;
        this.controlPoint1Y = this.initialY + (Math.random() - 0.5) * canvas.height * 0.5;

        // Second control point - near destination but with some randomness
        this.controlPoint2X = this.targetX + (Math.random() - 0.5) * canvas.width * 0.3;
        this.controlPoint2Y = this.targetY + (Math.random() - 0.5) * canvas.height * 0.3;

        // Select random color from provided palette
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update(globalProgress: number) {
        const bezierStartProgress = 0.05;
        const bezierEndProgress = 0.755;
        const animationEndGlobalProgress = 0.75;

        if (globalProgress <= animationEndGlobalProgress) {
            const rawBezierT = (globalProgress - bezierStartProgress) / (bezierEndProgress - bezierStartProgress);
            const t = Math.max(0, Math.min(1, rawBezierT));

            this.x = bezierPoint(t, this.initialX, this.controlPoint1X, this.controlPoint2X, this.targetX);
            this.y = bezierPoint(t, this.initialY, this.controlPoint1Y, this.controlPoint2Y, this.targetY);
        } else if (!this.finalPhase) {
            // Transition to final dispersing phase
            this.finalPhase = true;

            // Calculate angle away from center
            const canvas = document.querySelector('canvas');
            if (canvas) {
                const dx = this.x - canvas.width / 2;
                const dy = this.y - canvas.height / 2;
                this.finalAngle = Math.atan2(dy, dx);
            }
        } else {
            // Move outward in final phase
            const dispersionProgress = (globalProgress - 0.8) * 5; // Scale to 0-1 range
            this.x += Math.cos(this.finalAngle) * this.finalSpeed * dispersionProgress;
            this.y += Math.sin(this.finalAngle) * this.finalSpeed * dispersionProgress;

            // Fade out
            this.alpha = Math.max(0, 1 - dispersionProgress);
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        // Apply glow effect
        ctx.shadowBlur = this.size * 2;
        ctx.shadowColor = this.color;

        // Convert hex to rgba for transparency
        const hexToRgba = (hex: string, alpha: number) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };

        ctx.fillStyle = hexToRgba(this.color, this.alpha);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Reset shadow for performance
        ctx.shadowBlur = 0;
    }
}

export class ParticleAnimation {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private particles: Particle[] = [];
    private animationFrameId: number | null = null;
    private startTime: number = 0;
    private options: Required<ParticleAnimationOptions>;
    private state: ParticleAnimationState = {
        isRunning: false,
        progress: 0
    };

    constructor(canvas: HTMLCanvasElement, options: ParticleAnimationOptions) {
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get 2D context from canvas');
        }
        this.ctx = ctx;

        // Set default options
        this.options = {
            text: options.text,
            fontFamily: options.fontFamily || 'Inter',
            fontSize: options.fontSize || Math.min(canvas.width * 0.3, 200),
            particleCount: options.particleCount || Math.min(canvas.width * 0.2, 250),
            animationDuration: options.animationDuration || 2800,
            colors: options.colors || ['#8847BB', '#5E4290', '#F9BAEE'],
            textWidth: options.textWidth || Math.min(canvas.width * 0.6, 400),
            textHeight: options.textHeight || Math.min(canvas.width * 0.6, 400) * 0.6,
            onComplete: options.onComplete || (() => {}),
            onFallback: options.onFallback || ((error) => console.warn('Animation fallback:', error))
        };
    }

    private async createTextPath(): Promise<VectorPoint[]> {
        const { textWidth, textHeight, fontSize, fontFamily, text } = this.options;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        try {
            const vectors = await createTextVectors(text, fontFamily, {
                fontSize: Math.min(textWidth, textHeight),
                letterSpacing: textWidth * 0.05,
                strokeWidth: textWidth * 0.04,
                resolution: 2,
                centerX,
                centerY,
                targetWidth: textWidth,
                targetHeight: textHeight
            });

            return vectors;
        } catch (error) {
            this.options.onFallback(error);
            
            // Fallback to Arial
            const vectors = await createTextVectors(text, 'Arial', {
                fontSize: Math.min(textWidth, textHeight) * 0.8,
                letterSpacing: textWidth * 0.05,
                strokeWidth: textWidth * 0.04,
                resolution: 2,
                centerX,
                centerY,
                targetWidth: textWidth,
                targetHeight: textHeight
            });

            return vectors;
        }
    }

    private animate = () => {
        const now = Date.now();
        const elapsed = now - this.startTime;
        const progress = Math.min(elapsed / this.options.animationDuration, 1);

        this.state.progress = progress;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dark background for better contrast with particles
        this.ctx.fillStyle = 'rgba(37, 37, 34, 0.3)'; // Dark background with slight transparency
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach((particle) => {
            particle.update(progress);
            particle.draw(this.ctx);
        });

        if (progress >= 1) {
            // Animation complete
            this.state.isRunning = false;
            setTimeout(() => {
                this.options.onComplete();
            }, 100);
            return;
        }

        this.animationFrameId = requestAnimationFrame(this.animate);
    };

    async start(): Promise<void> {
        if (this.state.isRunning) {
            return;
        }

        try {
            this.state.isRunning = true;
            this.state.progress = 0;

            // Create text path
            const path = await this.createTextPath();
            
            // Clear existing particles
            this.particles = [];

            // Create particles
            for (let i = 0; i < this.options.particleCount; i++) {
                const pathPoint = path[Math.floor(Math.random() * path.length)];
                this.particles.push(new Particle(
                    this.canvas,
                    pathPoint.x,
                    pathPoint.y,
                    this.options.colors
                ));
            }

            this.startTime = Date.now();
            this.animate();
        } catch (error) {
            this.state.isRunning = false;
            this.options.onFallback(error);
            this.options.onComplete(); // Still call complete to allow fallback behavior
        }
    }

    stop(): void {
        this.state.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    getState(): ParticleAnimationState {
        return { ...this.state };
    }

    updateOptions(newOptions: Partial<ParticleAnimationOptions>): void {
        Object.assign(this.options, newOptions);
    }
}

// Hook for React components
export const useParticleAnimation = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    options: ParticleAnimationOptions
) => {
    const animationRef = React.useRef<ParticleAnimation | null>(null);
    const [state, setState] = React.useState<ParticleAnimationState>({
        isRunning: false,
        progress: 0
    });

    React.useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        
        // Set canvas dimensions
        const updateCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        // Create animation instance
        animationRef.current = new ParticleAnimation(canvas, {
            ...options,
            onComplete: () => {
                setState(prev => ({ ...prev, isRunning: false }));
                options.onComplete?.();
            }
        });

        return () => {
            window.removeEventListener('resize', updateCanvasSize);
            if (animationRef.current) {
                animationRef.current.stop();
            }
        };
    }, [canvasRef.current]);

    const start = React.useCallback(async () => {
        if (animationRef.current) {
            setState(prev => ({ ...prev, isRunning: true }));
            await animationRef.current.start();
        }
    }, []);

    const stop = React.useCallback(() => {
        if (animationRef.current) {
            animationRef.current.stop();
            setState(prev => ({ ...prev, isRunning: false }));
        }
    }, []);

    return { start, stop, state };
};
