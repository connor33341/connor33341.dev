import { useRef } from 'react';

interface SkillsSectionProps {
    scrollY: number;
}

export function SkillsSection({ scrollY }: SkillsSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const isVisible = scrollY > (sectionRef.current?.offsetTop || 0) - 500;

    // Define your skills
    const frontendSkills = [
        { name: 'React', level: 97 },
        { name: 'JavaScript', level: 95 },
        { name: 'TypeScript', level: 85 },
        { name: 'HTML/CSS', level: 90 },
        { name: 'Tailwind CSS', level: 65 },
    ];

    const backendSkills = [
        { name: 'Node.js', level: 96 },
        { name: 'Golang', level: 88 },
        { name: 'Rust', level: 76 },
        { name: 'C/C++', level: 85 },
        { name: 'PostgreSQL', level: 90 },
    ];

    const toolsSkills = [
        { name: 'Git', level: 93 },
        { name: 'Docker', level: 75 },
        { name: 'CI/CD', level: 80 },
        { name: 'Testing', level: 85 },
        { name: 'Serverless', level: 45 },
    ];

    return (
        <section ref={sectionRef} className="py-20 md:py-32 relative bg-[var(--background)] transition-colors duration-300" id="skills">
            {/* Neumorphic background with subtle pattern */}
            <div className="absolute inset-0" style={{ 
                background: `
                    radial-gradient(circle at 30% 80%, var(--background) 0%, 
                    color-mix(in oklch, var(--background) 97%, var(--primary)) 30%, 
                    var(--background) 100%)
                `
            }} />
            
            <div className="relative container mx-auto px-6">
                <div className="mx-auto max-w-4xl">
                    <div className="neu-card text-center mb-16">
                        <h2
                            className={`mb-4 text-3xl font-bold transition-all duration-700 md:text-4xl ${
                                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                            }`}
                        >
                            Skills & <span className="bg-gradient-to-r from-[#8847BB] to-[#F9BAEE] bg-clip-text text-transparent">Technologies</span>
                        </h2>

                        <p
                            className={`mb-6 max-w-2xl mx-auto text-[#706f6c] transition-all delay-200 duration-700 dark:text-[#A1A09A] ${
                                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                            }`}
                        >
                            I've worked with many programming languages, frameworks, and tools. Here is a preview of some of them and my
                            experience/confidence in working with them (you can view more on{' '}
                            <a href="https://wakatime.com/@Connor33341" className="text-[#8847BB] hover:text-[#F9BAEE] transition-colors dark:text-[#F9BAEE] dark:hover:text-[#8847BB]" target="_blank">
                                Wakatime
                            </a>
                            ):
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        <SkillCategory title="Frontend" skills={frontendSkills} isVisible={isVisible} delay={300} />

                        <SkillCategory title="Backend" skills={backendSkills} isVisible={isVisible} delay={500} />

                        <SkillCategory title="Tools & Others" skills={toolsSkills} isVisible={isVisible} delay={700} />
                    </div>
                </div>
            </div>
        </section>
    );
}

interface SkillCategoryProps {
    title: string;
    skills: { name: string; level: number }[];
    isVisible: boolean;
    delay: number;
}

function SkillCategory({ title, skills, isVisible, delay }: SkillCategoryProps) {
    return (
        <div
            className={`neu-card transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <h3 className="mb-6 text-xl font-medium text-center">{title}</h3>
            <div className="space-y-6">
                {skills.map((skill, index) => (
                    <div key={index}>
                        <div className="mb-2 flex justify-between">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-sm text-[#706f6c] dark:text-[#A1A09A]">{skill.level}%</span>
                        </div>
                        <div className="neu-progress relative">
                            <div
                                className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                                style={{
                                    width: isVisible ? `${skill.level}%` : '0%',
                                    background: `linear-gradient(90deg, var(--primary), var(--accent))`,
                                    transitionDelay: `${delay + index * 100}ms`,
                                    boxShadow: `
                                        2px 2px 4px rgba(0, 0, 0, 0.2),
                                        -2px -2px 4px rgba(255, 255, 255, 0.6)
                                    `
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}