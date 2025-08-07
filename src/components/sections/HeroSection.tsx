import { Link } from '@inertiajs/react';
import SmoothScrollLink from '../ui/SmoothScrollLink';

interface HeroSectionProps {
    scrollY: number;
}

export function HeroSection({ scrollY }: HeroSectionProps) {
    const opacity = Math.max(0, 1 - scrollY / 500);
    const translateY = scrollY * 0.3;

    return (
        <section className="relative flex h-screen items-center justify-center overflow-hidden bg-[var(--background)] transition-colors duration-300" id="home">
            {/* Neumorphic background with subtle gradient */}
            <div
                className="absolute inset-0 z-0"
                style={{ 
                    opacity: 1,
                    background: `
                        radial-gradient(circle at 30% 20%, var(--background) 0%, 
                        color-mix(in oklch, var(--background) 95%, var(--accent)) 50%, 
                        var(--background) 100%)
                    `
                }}
            />

            {/* Large neumorphic decorative circles */}
            <div
                className="absolute top-[15%] right-[8%] neu-circle neu-circle-large opacity-60"
                style={{ 
                    transform: `translateY(${translateY * 0.7}px)`,
                    background: `linear-gradient(145deg, 
                        color-mix(in oklch, var(--secondary) 95%, white),
                        color-mix(in oklch, var(--secondary) 105%, black)
                    )`
                }}
            />
            <div
                className="absolute bottom-[15%] left-[12%] neu-circle opacity-50"
                style={{ 
                    transform: `translateY(${translateY * 0.4}px)`,
                    width: '150px',
                    height: '150px',
                    background: `linear-gradient(145deg, 
                        color-mix(in oklch, var(--accent) 95%, white),
                        color-mix(in oklch, var(--accent) 105%, black)
                    )`
                }}
            />
            
            {/* Smaller floating neumorphic elements */}
            <div
                className="absolute top-[40%] left-[5%] neu-surface opacity-40"
                style={{ 
                    transform: `translateY(${translateY * 0.6}px) rotate(45deg)`,
                    width: '60px',
                    height: '60px'
                }}
            />
            <div
                className="absolute top-[25%] left-[85%] neu-surface opacity-30"
                style={{ 
                    transform: `translateY(${translateY * 0.8}px) rotate(-30deg)`,
                    width: '40px',
                    height: '40px'
                }}
            />

            {/* Main content in neumorphic container */}
            <div
                className="relative z-10 container mx-auto px-6"
                style={{
                    transform: `translateY(${translateY * 0.2}px)`,
                    opacity,
                }}
            >
                <div className="neu-card neu-card-interactive mx-auto max-w-4xl text-center backdrop-blur-sm">
                    <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                        Hi, I'm <span className="bg-gradient-to-r from-[#8847BB] to-[#F9BAEE] bg-clip-text text-transparent">Connor W</span>
                    </h1>
                    <p className="mx-auto mb-10 max-w-2xl text-xl text-[#706f6c] dark:text-[#A1A09A]">
                        A computer nerd, who enjoys pretty much anything related to technology, from coding to gaming, and everything in between.
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                        <SmoothScrollLink
                            href="#projects"
                            className="neu-button neu-button-primary font-medium"
                        >
                            View My Work
                        </SmoothScrollLink>
                        <SmoothScrollLink
                            href="#contact"
                            className="neu-button font-medium"
                        >
                            Contact Me
                        </SmoothScrollLink>
                    </div>

                    <div className="mt-16 flex justify-center space-x-8">
                        <SocialIcon href="https://github.com/connor33341" type="github" />
                        <SocialIcon href="https://linkedin.com/in/NOTUSEDYET" type="linkedin" />
                        <SocialIcon href="https://twitter.com/Connor33341" type="twitter" />
                    </div>
                </div>
            </div>

            {/* Neumorphic scroll indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                <div className="neu-surface p-3 rounded-full animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>

            {/* Neumorphic floating action button */}
            <div className="animate-bounce-slow absolute right-6 bottom-6">
                <Link
                    href="/utils"
                    className="neu-card group flex items-center space-x-3 px-5 py-3 backdrop-blur-sm"
                >
                    <div className="neu-surface p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="text-primary h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <span className="text-sm font-medium">Developer Tools</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </section>
    );
}

interface SocialIconProps {
    href: string;
    type: 'github' | 'linkedin' | 'twitter';
}

function SocialIcon({ href, type }: SocialIconProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group neu-surface h-10 w-10 rounded-full p-2 transition-all hover:scale-110"
        >
            {type === 'github' && (
                <svg
                    className="h-full w-full text-[#1b1b18] group-hover:text-[#8847BB] dark:text-[#EDEDEC] dark:group-hover:text-[#F9BAEE]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
            )}
            {type === 'linkedin' && (
                <svg
                    className="h-full w-full text-[#1b1b18] group-hover:text-[#8847BB] dark:text-[#EDEDEC] dark:group-hover:text-[#F9BAEE]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
            )}
            {type === 'twitter' && (
                <svg
                    className="h-full w-full text-[#1b1b18] group-hover:text-[#8847BB] dark:text-[#EDEDEC] dark:group-hover:text-[#F9BAEE]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
            )}
        </a>
    );
}