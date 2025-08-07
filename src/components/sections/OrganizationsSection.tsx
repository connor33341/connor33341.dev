import { useRef, useEffect, useState } from 'react';

interface OrganizationsSectionProps {
    scrollY: number;
}

export function OrganizationsSection({ scrollY }: OrganizationsSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const isVisible = scrollY > (sectionRef.current?.offsetTop || 0) - 500;
    
    const [organizations, setOrganizations] = useState<Array<{
        name: string;
        description: string;
        url: string;
        logo: string;
        role: string;
    }>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://legacy.connor33341.dev/static/config/organizations.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
                // Ensure data is an array before setting it
                if (Array.isArray(data)) {
                    setOrganizations(data);
                } else {
                    throw new Error('Invalid data format: expected an array');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch organizations');
                console.error('Error fetching organizations:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrganizations();
    }, []);

    return (
        <section ref={sectionRef} className="py-20 md:py-32 bg-[var(--background)] transition-colors duration-300" id="organizations">
            <div className="container mx-auto px-6">
                <div className="mx-auto max-w-5xl">
                    <div className="neu-card text-center mb-16">
                        <h2
                            className={`mb-4 text-3xl font-bold transition-all duration-700 md:text-4xl ${
                                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                            }`}
                        >
                            GitHub <span className="bg-gradient-to-r from-[#8847BB] to-[#F9BAEE] bg-clip-text text-transparent">Organizations</span>
                        </h2>

                        <p
                            className={`mb-6 max-w-2xl mx-auto text-[#706f6c] transition-all delay-200 duration-700 dark:text-[#A1A09A] ${
                                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                            }`}
                        >
                            I'm also a member of several GitHub organizations, where I collaborate with amazing developers around the world.
                        </p>
                    </div>

                    {loading && (
                        <div className="neu-card flex justify-center items-center py-12">
                            <div className="neu-loading-spinner w-8 h-8"></div>
                        </div>
                    )}

                    {error && (
                        <div className="neu-card neu-error text-center py-8 mb-8">
                            <p className="text-red-600 dark:text-red-400 mb-2">⚠️ Failed to load organizations</p>
                            <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">{error}</p>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="grid gap-6 md:grid-cols-3">
                            {organizations.map((org, index) => (
                                <OrganizationCard key={index} organization={org} isVisible={isVisible} index={index} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

interface OrganizationCardProps {
    organization: {
        name: string;
        description: string;
        url: string;
        logo: string;
        role: string;
    };
    isVisible: boolean;
    index: number;
}

function OrganizationCard({ organization, isVisible, index }: OrganizationCardProps) {
    const delay = 300 + index * 150;

    return (
        <a
            href={organization.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`neu-card group transition-all duration-500 hover:neu-hover ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="flex flex-col items-center text-center">
                <div className="mb-4 h-20 w-20 overflow-hidden rounded-full neu-inset">
                    <img
                        src={organization.logo}
                        alt={organization.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>

                <h3 className="mb-2 font-semibold text-lg">{organization.name}</h3>
                <span className="mb-3 px-3 py-1 text-xs font-medium neu-badge bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-full">
                    {organization.role}
                </span>

                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{organization.description}</p>
            </div>
        </a>
    );
}