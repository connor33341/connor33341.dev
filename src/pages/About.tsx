import React from 'react';
import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { SEO } from '../components/SEO';
import { useParticleAnimation } from '../utils/particleAnimation';

const About: React.FC = () => {
    const [scrollY, setScrollY] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Use the particle animation hook
    const { start: startAnimation } = useParticleAnimation(canvasRef, {
        text: 'CW',
        fontFamily: 'Inter',
        colors: ['#8847BB', '#5E4290', '#F9BAEE'],
        onComplete: () => {
            setTimeout(() => {
                setIsLoading(false);

                setTimeout(() => {
                    if (!window.location.href.includes('#')) {
                        return;
                    }

                    const duration = 800;
                    const offset = 0;

                    const element = document.getElementById(window.location.href.split('#')[1]);

                    if (element) {
                        // Calculate where to scroll to
                        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
                        const startPosition = window.pageYOffset;
                        const distance = targetPosition - startPosition;

                        let startTime: number | null = null;

                        // Smooth scroll animation function
                        const animation = (currentTime: number) => {
                            if (startTime === null) startTime = currentTime;
                            const timeElapsed = currentTime - startTime;
                            const progress = Math.min(timeElapsed / duration, 1);

                            // Easing function - easeInOutCubic
                            const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1);

                            window.scrollTo(0, startPosition + distance * ease(progress));

                            if (timeElapsed < duration) {
                                requestAnimationFrame(animation);
                            }
                        };

                        requestAnimationFrame(animation);
                    }
                }, 100);
            }, 100);
        },
        onFallback: (error) => {
            console.warn('Failed to load font vectors, using fallback', error);
        }
    });

    // Track scroll position
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Start loading animation
    useEffect(() => {
        if (!isLoading || !canvasRef.current) return;

        startAnimation().catch(error => {
            console.error('Failed to start animation:', error);
            setIsLoading(false); // Fall back to showing content immediately
        });
    }, [isLoading, startAnimation]);
    return (
        <>
            <SEO
                title="About - Connor W - Everything Developer"
                description="Learn more about Connor W, an Everything Developer with expertise in backend, frontend, mobile and embedded applications."
                url="https://connor33341.dev/about"
                tags={['about', 'developer', 'portfolio']}
            />
            {isLoading ? (<div className="bg-background fixed inset-0 flex items-center justify-center">
                <canvas ref={canvasRef} className="absolute inset-0" />
            </div>) : (<div>
                <h1>About Me</h1>
                <p>This is the about page of my personal website.</p>
                <p>Here you can include information about yourself, your interests, and your work.</p>
            </div>)}
        </>
    );
};

export default About;