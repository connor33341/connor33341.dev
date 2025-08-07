# Particle Animation Utility

A reusable TypeScript utility for creating particle-based text animations in React applications. The animation creates particles that move along bezier curves to form text shapes, then disperse in a visually appealing way.

## Features

- **Text-based animations**: Convert any text into vector paths for particle targeting
- **Customizable appearance**: Configure colors, particle count, animation duration, and more
- **Bezier curve motion**: Smooth particle movement using bezier curves
- **Font fallback**: Automatically falls back to Arial if custom fonts fail to load
- **React integration**: Includes a React hook for easy component integration
- **TypeScript support**: Full type safety and intellisense

## Installation

The utility is already included in the project. Import it from the utils directory:

```typescript
import { useParticleAnimation, ParticleAnimation } from '../utils/particleAnimation';
```

## Usage

### React Hook (Recommended)

```typescript
import React, { useRef, useState } from 'react';
import { useParticleAnimation } from '../utils/particleAnimation';

const MyComponent: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { start: startAnimation } = useParticleAnimation(canvasRef, {
        text: 'Hello',
        fontFamily: 'Inter',
        colors: ['#8847BB', '#5E4290', '#F9BAEE'],
        onComplete: () => {
            setIsLoading(false);
        }
    });

    React.useEffect(() => {
        if (isLoading) {
            startAnimation();
        }
    }, [isLoading, startAnimation]);

    return (
        <div>
            {isLoading && (
                <div className="fixed inset-0 bg-black flex items-center justify-center">
                    <canvas ref={canvasRef} className="absolute inset-0" />
                </div>
            )}
            {!isLoading && (
                <div>Your content here</div>
            )}
        </div>
    );
};
```

### Direct Class Usage

```typescript
import { ParticleAnimation } from '../utils/particleAnimation';

const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const animation = new ParticleAnimation(canvas, {
    text: 'Welcome',
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1']
});

await animation.start();
```

## Configuration Options

### ParticleAnimationOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `text` | `string` | Required | The text to animate |
| `fontFamily` | `string` | `'Inter'` | Font family for text rendering |
| `fontSize` | `number` | Auto-calculated | Font size in pixels |
| `particleCount` | `number` | Auto-calculated | Number of particles to create |
| `animationDuration` | `number` | `2800` | Animation duration in milliseconds |
| `colors` | `string[]` | `['#8847BB', '#5E4290', '#F9BAEE']` | Array of hex colors for particles |
| `textWidth` | `number` | Auto-calculated | Target width for text |
| `textHeight` | `number` | Auto-calculated | Target height for text |
| `onComplete` | `function` | `() => {}` | Callback when animation completes |
| `onFallback` | `function` | Console warning | Callback when font loading fails |

## Examples

### Loading Screen

```typescript
const LoadingScreen: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const { start } = useParticleAnimation(canvasRef, {
        text: 'LOADING',
        fontFamily: 'Arial Black',
        colors: ['#00FF00', '#0080FF', '#FF0080'],
        animationDuration: 3000,
        onComplete: () => setIsLoading(false)
    });

    useEffect(() => {
        start();
    }, [start]);

    return isLoading ? (
        <div className="fixed inset-0 bg-black">
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    ) : null;
};
```

### Interactive Animation

```typescript
const InteractiveDemo: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [text, setText] = useState('DEMO');

    const { start, state } = useParticleAnimation(canvasRef, {
        text,
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
        animationDuration: 2500
    });

    return (
        <div>
            <input 
                value={text}
                onChange={(e) => setText(e.target.value.toUpperCase())}
                placeholder="Enter text"
            />
            <button 
                onClick={start}
                disabled={state.isRunning}
            >
                Animate
            </button>
            <canvas 
                ref={canvasRef}
                className="w-full h-64 border"
            />
        </div>
    );
};
```

### Custom Branding

```typescript
const BrandAnimation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const { start } = useParticleAnimation(canvasRef, {
        text: 'BRAND',
        fontFamily: 'Helvetica Neue',
        colors: ['#1E40AF', '#3B82F6', '#60A5FA'], // Brand blues
        particleCount: 300,
        animationDuration: 3500,
        textWidth: 600,
        textHeight: 200
    });

    return (
        <div className="brand-intro">
            <canvas ref={canvasRef} className="w-full h-screen" />
        </div>
    );
};
```

## Technical Details

### Animation Phases

1. **Initialization**: Particles spawn at random positions across the canvas
2. **Bezier Motion**: Particles follow smooth bezier curves toward target text positions
3. **Formation**: Particles briefly form the text shape
4. **Dispersion**: Particles fade out while moving away from the center

### Performance Considerations

- Particle count is automatically limited based on screen size
- Canvas is cleared and redrawn each frame for smooth animation
- Shadow effects are reset after each particle to maintain performance
- Animation automatically stops when complete to free resources

### Browser Compatibility

- Requires Canvas 2D API support
- Uses modern JavaScript features (async/await, arrow functions)
- Optimized for modern browsers (Chrome 60+, Firefox 60+, Safari 12+)

## Dependencies

- React 16.8+ (for hooks)
- `fontVectorLoader` utility (included in project)
- Canvas 2D API support

## Troubleshooting

### Font Loading Issues
If custom fonts fail to load, the animation automatically falls back to Arial. Ensure web fonts are properly loaded before starting the animation.

### Performance Issues
Reduce `particleCount` for better performance on slower devices:

```typescript
const { start } = useParticleAnimation(canvasRef, {
    text: 'HELLO',
    particleCount: Math.min(window.innerWidth * 0.1, 150) // Reduced count
});
```

### Canvas Sizing
The canvas automatically resizes to fill the window. For custom sizing, set canvas dimensions before initializing:

```typescript
useEffect(() => {
    if (canvasRef.current) {
        canvasRef.current.width = 800;
        canvasRef.current.height = 600;
    }
}, []);
```
