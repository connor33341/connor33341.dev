//import { User } from '@/types';
import { Link } from '@inertiajs/react';
import { LogInIcon, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import SmoothScrollLink from '../ui/SmoothScrollLink';

// Soon(tm)
interface User {};

interface NavBarProps {
    auth: {
        user: User | null;
    };
}

export function NavBar({ auth }: NavBarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [isDarkMode, setIsDarkMode] = useState(true); // Default to true for dark mode

    // Detect dark mode on initial load
    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setIsDarkMode(isDark);
    }, []);

    // Toggle dark mode
    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        }
        setIsDarkMode(!isDarkMode);
    };

    // not using this at the moment
    function route(arg0: string) {
        console.error("Function 'route' is not implemented.")
        return "#not-implemented"
    }

    return (
        <>
            <header
                className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
                    scrolled ? 'py-2' : 'py-4'
                }`}
            >
                <nav className={`container mx-auto px-4 sm:px-6 ${
                    scrolled ? 'neu-nav rounded-lg mx-4 px-6 py-3' : ''
                }`}>
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-xl font-bold tracking-tight">
                            connor33341.dev
                        </Link>

                        <div className="flex items-center gap-4 md:gap-8">
                            {/* Desktop Navigation */}
                            <div className="hidden space-x-8 md:flex">
                                <SmoothScrollLink href="/#about" className="text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]">
                                    About
                                </SmoothScrollLink>
                                <SmoothScrollLink href="/#skills" className="text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]">
                                    Skills
                                </SmoothScrollLink>
                                <SmoothScrollLink href="/#projects" className="text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]">
                                    Projects
                                </SmoothScrollLink>
                                <SmoothScrollLink href="/#contact" className="text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]">
                                    Contact
                                </SmoothScrollLink>
                                <Link href={route('apps.index')} className="text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]">
                                    Apps
                                </Link>
                                <Link href="https://legacy.connor33341.dev" className="text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]">
                                    Legacy Site
                                </Link>
                            </div>

                            <div className="hidden border-l-2 border-[#19140035] md:block dark:border-[#3E3E3A]">&nbsp;</div>

                            <Link href={route('availability')} className="hidden md:block">
                                Availability
                            </Link>

                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="hidden neu-button px-5 py-1.5 text-sm leading-normal md:inline-block"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="hidden neu-surface rounded-full p-2 transition-all hover:scale-105 md:inline-block"
                                >
                                    <LogInIcon className="size-4 text-center text-[#706f6c] dark:text-[#A1A09A]" />
                                </Link>
                            )}

                            <button
                                onClick={toggleDarkMode}
                                className="neu-surface rounded-full p-2 text-[#706f6c] transition-all hover:scale-105 dark:text-[#A1A09A]"
                                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {isDarkMode ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                )}
                            </button>

                            {/* Mobile menu button */}
                            <button
                                className="neu-surface rounded-md p-2 text-gray-700 transition-all hover:scale-105 md:hidden dark:text-gray-300"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                <Menu size={24} />
                            </button>
                        </div>
                    </div>
                </nav>
            </header>
            
            {/* Mobile Navigation Menu - Positioned outside header */}
            <div 
                className={`fixed inset-0 z-[100] transition-opacity duration-300 ease-in-out ${
                    mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`} 
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, height: '100vh' }}
            >
                <div className="fixed inset-0 bg-black/70" onClick={() => setMobileMenuOpen(false)}></div>
                <div className={`fixed top-0 right-0 bottom-0 z-10 h-full w-64 overflow-y-auto neu-card transition-transform duration-300 ease-in-out ${
                    mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                    <div className="flex h-full flex-col overflow-y-auto p-5">
                        <div className="mb-8 flex justify-between">
                            <h2 className="text-lg font-bold">Menu</h2>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="neu-surface rounded-full p-1 transition-all hover:scale-105"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <nav className="flex flex-col space-y-4">
                            <SmoothScrollLink
                                href="/#about"
                                className="neu-surface rounded-md px-4 py-2 text-sm transition-all hover:scale-[1.02] hover:text-[#8847BB] dark:hover:text-[#F9BAEE]"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                About
                            </SmoothScrollLink>
                            <SmoothScrollLink
                                href="/#skills"
                                className="neu-surface rounded-md px-4 py-2 text-sm transition-all hover:scale-[1.02] hover:text-[#8847BB] dark:hover:text-[#F9BAEE]"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Skills
                            </SmoothScrollLink>
                            <SmoothScrollLink
                                href="/#projects"
                                className="neu-surface rounded-md px-4 py-2 text-sm transition-all hover:scale-[1.02] hover:text-[#8847BB] dark:hover:text-[#F9BAEE]"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Projects
                            </SmoothScrollLink>
                            <SmoothScrollLink
                                href="/#contact"
                                className="neu-surface rounded-md px-4 py-2 text-sm transition-all hover:scale-[1.02] hover:text-[#8847BB] dark:hover:text-[#F9BAEE]"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Contact
                            </SmoothScrollLink>
                            <Link
                                href={route('apps.index')}
                                className="neu-surface rounded-md px-4 py-2 text-sm transition-all hover:scale-[1.02] hover:text-[#8847BB] dark:hover:text-[#F9BAEE]"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Apps
                            </Link>
                            <Link
                                href="https://legacy.connor33341.dev"
                                className="neu-surface rounded-md px-4 py-2 text-sm transition-all hover:scale-[1.02] hover:text-[#8847BB] dark:hover:text-[#F9BAEE]"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Legacy Site
                            </Link>
                            <Link
                                href={route('availability')}
                                className="neu-surface rounded-md px-4 py-2 text-sm transition-all hover:scale-[1.02] hover:text-[#8847BB] dark:hover:text-[#F9BAEE]"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Availability
                            </Link>
                            
                            <div className="my-2 border-t border-[#19140035] dark:border-[#3E3E3A]"></div>
                            
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="neu-button neu-button-primary text-center text-sm leading-normal"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="neu-button flex items-center justify-center text-sm leading-normal"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <LogInIcon className="mr-2 size-4 text-[#706f6c] dark:text-[#A1A09A]" />
                                    <span>Login</span>
                                </Link>
                            )}
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
}