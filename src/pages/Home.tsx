import { useEffect, useRef, useState } from 'react';
import { useParticleAnimation } from '../utils/particleAnimation';
import { useLoading } from '../contexts/LoadingContext';

// Components
import { SEO } from '../components/SEO';
import { HeroSection } from '../components/sections/HeroSection';
import { FeaturedLinksSection } from '../components/sections/FeaturedLinksSection';
import { AboutSection } from '../components/sections/AboutSection';
import { SkillsSection } from '../components/sections/SkillsSection';
import { ProjectsSection } from '../components/sections/ProjectsSection';
import { ContributionsSection } from '../components/sections/ContributionsSection';

const Home: React.FC = () => {
    const [scrollY, setScrollY] = useState(0);
    const { isLoading, setIsLoading } = useLoading();
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

    // Reset loading state when component mounts
    useEffect(() => {
        setIsLoading(true);
    }, [setIsLoading]);

    // Start loading animation
    useEffect(() => {
        if (!isLoading || !canvasRef.current) return;

        startAnimation().catch(error => {
            console.error('Failed to start animation:', error);
            setIsLoading(false); // Fall back to showing content immediately
        });
    }, [isLoading, startAnimation, setIsLoading]); return (
        <>
            <SEO
                title="Home - Connor W - Everything Developer"
                description="Welcome to Connor W's portfolio. Everything Developer specializing in backend, frontend, mobile and embedded applications."
                url="https://connor33341.dev/"
                tags={['home', 'portfolio', 'developer']}
                image="https://avatars.githubusercontent.com/u/107011324?v=4"
            />
            {isLoading ? (<div className="bg-[#252522] fixed inset-0 flex items-center justify-center">
                <canvas ref={canvasRef} className="absolute inset-0" />
            </div>) : (
                <main className="overflow-hidden">

                    {/* Hero Section */}
                    <HeroSection scrollY={scrollY} />

                    {/* Featured Links */}
                    <FeaturedLinksSection scrollY={scrollY} />

                    {/* About Me */}
                    <AboutSection scrollY={scrollY} />

                    {/* Skills & Technologies */}
                    <SkillsSection scrollY={scrollY} />

                    {/* Projects */}
                    <ProjectsSection scrollY={scrollY} />

                    {/* Latest Poll Section */}
                    {/*<LatestPollSection scrollY={scrollY} />*/}

                    {/* Open Source Contributions */}
                    <ContributionsSection scrollY={scrollY} />

                    {/* GitHub Organizations */}
                    {/*<OrganizationsSection scrollY={scrollY} />*/}

                    {/* Contact */}
                    {/*<ContactSection scrollY={scrollY} />*/}
                </main>
            )}
        </>
    );
};

export default Home;