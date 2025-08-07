import React, { useRef, useState } from 'react';
import { SEO } from '../components/SEO';
import { useParticleAnimation } from '../utils/particleAnimation';

const Home: React.FC = () => {
    const [showAnimation, setShowAnimation] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const { start: startAnimation, state } = useParticleAnimation(canvasRef, {
        text: 'Hello',
        fontFamily: 'Inter',
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
        animationDuration: 2000,
        onComplete: () => {
            setTimeout(() => setShowAnimation(false), 500);
        }
    });

    const handleShowAnimation = () => {
        setShowAnimation(true);
        startAnimation();
    };

    return (
        <>
            <SEO 
                title="Home - Connor W - Everything Developer"
                description="Welcome to Connor W's portfolio. Everything Developer specializing in backend, frontend, mobile and embedded applications."
                url="https://connor33341.dev/"
                tags={['home', 'portfolio', 'developer']}
            />
            <div className="relative">
                <h1>Welcome to a Website</h1>
                <p>This is the homepage where you can find information about me and my projects.</p>
                
                <button 
                    onClick={handleShowAnimation}
                    disabled={state.isRunning}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {state.isRunning ? 'Animation Running...' : 'Show Particle Animation'}
                </button>

                {showAnimation && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                        <canvas ref={canvasRef} className="absolute inset-0" />
                    </div>
                )}
            </div>
        </>
    );
};

export default Home;