// Font Vector Loader - Converts font glyphs to vector paths for particle animations

export interface VectorPoint {
    x: number;
    y: number;
}

export interface FontVectorOptions {
    fontSize: number;
    letterSpacing?: number;
    strokeWidth?: number;
    resolution?: number; // Points per unit for curve approximation
}

export class FontVectorLoader {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d')!;
    }

    /**
     * Converts text to vector points using font rendering
     */
    async loadTextAsVectors(
        text: string,
        fontFamily: string = 'Arial',
        options: FontVectorOptions = { fontSize: 100 }
    ): Promise<VectorPoint[]> {
        const {
            fontSize = 100,
            letterSpacing = 0,
            strokeWidth = fontSize * 0.05,
            resolution = 2
        } = options;

        // Wait for font to load if it's a web font
        await this.waitForFont(fontFamily);

        // Set up canvas with proper dimensions
        const padding = fontSize * 0.5;
        this.canvas.width = (text.length * fontSize + letterSpacing * (text.length - 1)) + padding * 2;
        this.canvas.height = fontSize * 1.5 + padding * 2;

        // Configure font rendering
        this.ctx.font = `${fontSize}px ${fontFamily}`;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = 'white';

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render each character
        let currentX = padding;
        const centerY = this.canvas.height / 2;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            this.ctx.fillText(char, currentX, centerY);
            
            const charWidth = this.ctx.measureText(char).width;
            currentX += charWidth + letterSpacing;
        }

        // Extract vector points from rendered text
        return this.extractVectorPoints(strokeWidth, resolution);
    }

    /**
     * Wait for a font to be loaded and ready
     */
    private async waitForFont(fontFamily: string, timeout: number = 3000): Promise<void> {
        if (!document.fonts) return;

        try {
            await document.fonts.load(`16px ${fontFamily}`);
            await document.fonts.ready;
        } catch (error) {
            console.warn(`Failed to load font ${fontFamily}, using fallback`);
        }
    }

    /**
     * Extract vector points from canvas image data
     */
    private extractVectorPoints(strokeWidth: number, resolution: number): VectorPoint[] {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;

        // Find all filled pixels
        const filledPixels: VectorPoint[] = [];
        for (let y = 0; y < height; y += resolution) {
            for (let x = 0; x < width; x += resolution) {
                const index = (y * width + x) * 4;
                const alpha = data[index + 3];
                
                if (alpha > 128) { // Pixel is filled
                    filledPixels.push({ x, y });
                }
            }
        }

        // Create outline points by finding edge pixels
        const outlinePoints: VectorPoint[] = [];
        const stepSize = Math.max(1, Math.floor(strokeWidth / 4));

        for (const pixel of filledPixels) {
            if (this.isEdgePixel(pixel.x, pixel.y, data, width, height)) {
                // Add multiple points around the edge for better stroke width
                for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
                    const offsetX = Math.cos(angle) * strokeWidth * 0.5;
                    const offsetY = Math.sin(angle) * strokeWidth * 0.5;
                    
                    outlinePoints.push({
                        x: pixel.x + offsetX,
                        y: pixel.y + offsetY
                    });
                }
            }
        }

        // If we don't have enough outline points, use all filled pixels
        if (outlinePoints.length < 50) {
            return filledPixels;
        }

        return outlinePoints;
    }

    /**
     * Check if a pixel is on the edge of the text
     */
    private isEdgePixel(x: number, y: number, data: Uint8ClampedArray, width: number, height: number): boolean {
        const checkRadius = 2;
        
        for (let dy = -checkRadius; dy <= checkRadius; dy++) {
            for (let dx = -checkRadius; dx <= checkRadius; dx++) {
                const nx = x + dx;
                const ny = y + dy;
                
                if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
                    return true; // Edge of canvas
                }
                
                const index = (ny * width + nx) * 4;
                const alpha = data[index + 3];
                
                if (alpha <= 128) {
                    return true; // Adjacent to empty pixel
                }
            }
        }
        
        return false;
    }

    /**
     * Center and scale points to fit within given dimensions
     */
    static transformPoints(
        points: VectorPoint[],
        targetWidth: number,
        targetHeight: number,
        centerX: number,
        centerY: number
    ): VectorPoint[] {
        if (points.length === 0) return points;

        // Find bounds
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        for (const point of points) {
            minX = Math.min(minX, point.x);
            maxX = Math.max(maxX, point.x);
            minY = Math.min(minY, point.y);
            maxY = Math.max(maxY, point.y);
        }

        const sourceWidth = maxX - minX;
        const sourceHeight = maxY - minY;
        const sourceCenterX = minX + sourceWidth / 2;
        const sourceCenterY = minY + sourceHeight / 2;

        // Calculate scale to fit within target dimensions
        const scaleX = targetWidth / sourceWidth;
        const scaleY = targetHeight / sourceHeight;
        const scale = Math.min(scaleX, scaleY) * 0.8; // Leave some padding

        // Transform points
        return points.map(point => ({
            x: centerX + (point.x - sourceCenterX) * scale,
            y: centerY + (point.y - sourceCenterY) * scale
        }));
    }

    /**
     * Load Google Fonts dynamically
     */
    static async loadGoogleFont(fontFamily: string, weights: string[] = ['400', '700']): Promise<void> {
        const weightsParam = weights.join(',');
        const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@${weightsParam}&display=swap`;
        
        // Check if already loaded
        const existingLink = document.querySelector(`link[href*="${fontFamily.replace(/\s+/g, '+')}"]`);
        if (existingLink) return;

        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = fontUrl;
            
            link.onload = () => {
                // Wait a bit for the font to be processed
                setTimeout(resolve, 100);
            };
            link.onerror = reject;
            
            document.head.appendChild(link);
        });
    }
}

// Utility function for easy use
export async function createTextVectors(
    text: string,
    fontFamily: string = 'Inter',
    options: FontVectorOptions & { 
        centerX: number; 
        centerY: number; 
        targetWidth: number; 
        targetHeight: number;
    }
): Promise<VectorPoint[]> {
    const loader = new FontVectorLoader();
    
    // Load font if it's a Google Font
    if (fontFamily !== 'Arial' && fontFamily !== 'serif' && fontFamily !== 'sans-serif') {
        try {
            await FontVectorLoader.loadGoogleFont(fontFamily);
        } catch (error) {
            console.warn(`Failed to load Google Font ${fontFamily}, using fallback`);
            fontFamily = 'Arial';
        }
    }
    
    const rawPoints = await loader.loadTextAsVectors(text, fontFamily, options);
    
    return FontVectorLoader.transformPoints(
        rawPoints,
        options.targetWidth,
        options.targetHeight,
        options.centerX,
        options.centerY
    );
}
