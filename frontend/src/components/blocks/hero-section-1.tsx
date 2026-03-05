import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Menu, X, Activity } from 'lucide-react';
import { Button } from '../ui/button';
import { AnimatedGroup } from '../ui/animated-group';
import { cn } from '../../lib/utils';


const transitionVariants = {
    item: {
        hidden: { opacity: 0, filter: 'blur(12px)', y: 12 },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: { type: 'spring' as const, bounce: 0.3, duration: 1.5 },
        },
    },
};

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
];

const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-20 w-full px-2 group"
            >
                <div className={cn(
                    'mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12',
                    isScrolled && 'bg-background/80 max-w-4xl rounded-2xl border border-border backdrop-blur-lg lg:px-5'
                )}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link to="/" aria-label="home" className="flex items-center gap-2">
                                <Activity className="h-6 w-6 text-primary" />
                                <span className="font-bold text-lg text-foreground">Watchly</span>
                            </Link>
                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                            >
                                <Menu className="group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <a href={item.href} className="text-muted-foreground hover:text-foreground block duration-150">
                                            <span>{item.name}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-border p-6 shadow-2xl md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <a href={item.href} className="text-muted-foreground hover:text-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <Button asChild variant="outline" size="sm" className={cn(isScrolled && 'lg:hidden')}>
                                    <Link to="/login"><span>Login</span></Link>
                                </Button>
                                <Button asChild size="sm" className={cn(isScrolled && 'lg:hidden')}>
                                    <Link to="/register"><span>Get Started</span></Link>
                                </Button>
                                <Button asChild size="sm" className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                                    <Link to="/login"><span>Get Started</span></Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden">
                <div
                    aria-hidden
                    className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block"
                >
                    <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(var(--primary)/0.15)_0,transparent_50%,transparent_80%)]" />
                    <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(var(--primary)/0.1)_0,transparent_80%,transparent_100%)] [translate:5%_-50%]" />
                </div>

                <section>
                    <div className="relative pt-24 md:pt-36">
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: { transition: { delayChildren: 1 } },
                                },
                                item: {
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, bounce: 0.3, duration: 2 } },
                                },
                            }}
                            className="absolute inset-0 -z-20"
                        >
                            <div className="absolute inset-x-0 top-0 -z-20 hidden lg:top-0 dark:block bg-gradient-to-b from-background via-background/80 to-background h-full" />
                        </AnimatedGroup>

                        <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]" />

                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants}>
                                    <a
                                        href="#features"
                                        className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border border-border p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
                                    >
                                        <span className="text-foreground text-sm">Now with real-time global monitoring</span>
                                        <span className="dark:border-background block h-4 w-0.5 border-l bg-border dark:bg-zinc-700" />
                                        <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6"><ArrowRight className="m-auto size-3" /></span>
                                                <span className="flex size-6"><ArrowRight className="m-auto size-3" /></span>
                                            </div>
                                        </div>
                                    </a>

                                    <h1 className="mt-8 max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem] font-bold">
                                        Real-Time Website{' '}
                                        <span className="bg-gradient-to-r from-primary via-primary/80 to-emerald-400 bg-clip-text text-transparent">
                                            Monitoring
                                        </span>
                                    </h1>
                                    <p className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground">
                                        Know the moment your site goes down. Monitor uptime, track performance, and receive instant alerts when your website experiences issues.
                                    </p>
                                </AnimatedGroup>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: { transition: { staggerChildren: 0.05, delayChildren: 0.75 } },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                                >
                                    <div className="bg-foreground/10 rounded-[14px] border border-border p-0.5">
                                        <Button asChild size="lg" className="rounded-xl px-5 text-base">
                                            <Link to="/register">
                                                <span className="text-nowrap">Start Monitoring Free</span>
                                            </Link>
                                        </Button>
                                    </div>
                                    <Button asChild size="lg" variant="ghost" className="h-10.5 rounded-xl px-5">
                                        <Link to="/dashboard">
                                            <span className="text-nowrap">View Dashboard Demo</span>
                                        </Link>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>

                        <AnimatedGroup
                            variants={{
                                container: { visible: { transition: { staggerChildren: 0.05, delayChildren: 0.75 } } },
                                ...transitionVariants,
                            }}
                        >
                            <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                                <div aria-hidden className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%" />
                                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                                    <img
                                        className="aspect-15/8 relative rounded-2xl w-full hidden dark:block"
                                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2700&q=75&auto=format"
                                        alt="Dashboard preview"
                                        width="2700"
                                        height="1440"
                                    />
                                    <img
                                        className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border w-full dark:hidden"
                                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2700&q=75&auto=format"
                                        alt="Dashboard preview"
                                        width="2700"
                                        height="1440"
                                    />
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>

                {/* Trusted By / Logos */}
                <section className="bg-background pb-16 pt-16 md:pb-32">
                    <div className="group relative m-auto max-w-5xl px-6">
                        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-14">
                            {['stripe', 'shopify', 'github', 'slack', 'vercel', 'netflix', 'airbnb', 'spotify'].map((brand) => (
                                <div key={brand} className="flex items-center justify-center">
                                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide opacity-50 hover:opacity-80 transition-opacity">
                                        {brand}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
