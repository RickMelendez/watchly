"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Activity, Share2, Server, TerminalSquare } from "lucide-react";
import { Button } from "../../components/ui/button";

export type TimeLine_01Entry = {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    subtitle: string;
    description: string;
    items?: string[];
    image?: string;
    button?: {
        url: string;
        text: string;
    };
};

export interface TimeLine_01Props {
    title?: string;
    description?: string;
    entries?: TimeLine_01Entry[];
    className?: string;
}

export const defaultEntries: TimeLine_01Entry[] = [
    {
        icon: Activity,
        title: "Global Analytics & API Monitoring",
        subtitle: "New Feature • Available Now",
        description:
            "Dive deep into web traffic, geographical insights, platform costs, and API latency metrics with visually engaging Recharts graph data.",
        items: [
            "Real-time AreaCharts analyzing request and traffic trends",
            "Categorized BarCharts tracking resource spending",
            "Comprehensive tracking of top endpoints and sources",
        ],
        image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    },
    {
        icon: Share2,
        title: "CI/CD Pipeline History",
        subtitle: "New Feature • Available Now",
        description:
            "Track complex software deployment and integration cycles directly from your Watchly platform.",
        items: [
            "Step-by-step progress bars (Build → Test → Deploy → Verify)",
            "Developer attribution and hash commit tracking",
            "Elapsed time intervals highlighting performance bottlenecks",
        ],
        image:
            "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80&w=800",
    },
    {
        icon: TerminalSquare,
        title: "Advanced Log Explorer",
        subtitle: "New Feature • Available Now",
        description:
            "Investigate microservices payload dumps and API error codes instantly via Watchly's new color-coded Log Terminal.",
        items: [
            "Dynamic filtering to isolate DEBUG, WARN, and ERROR instances",
            "Detailed payload inspection",
            "Highlighted status colors allowing for quick scanning",
        ],
        image:
            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
    },
    {
        icon: Server,
        title: "Server & Container Fleet Overview",
        subtitle: "New Feature • Available Now",
        description:
            "Oversee runtime containers and virtual instances. Diagnose runaway CPU spikes or high memory footprints before outages occur.",
        items: [
            "Instance level CPU and RAM percentage charts",
            "Network port mapping references",
            "Quick-view server statuses indicating UP or DOWN states",
        ],
        image:
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
    },
];

export default function TimeLine_01({
    title = "Unlock A Comprehensive Observatory",
    description = "The newest updates transform Watchly from a ping checker into a fully-fledged developer platform tracking metrics across your entire infrastructure.",
    entries = defaultEntries,
}: TimeLine_01Props) {
    const [activeIndex, setActiveIndex] = useState(0);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const sentinelRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Create stable setters for refs inside map
    const setItemRef = (el: HTMLDivElement | null, i: number) => {
        itemRefs.current[i] = el;
    };
    const setSentinelRef = (el: HTMLDivElement | null, i: number) => {
        sentinelRefs.current[i] = el;
    };

    useEffect(() => {
        if (!sentinelRefs.current.length) return;

        let frame = 0;
        const updateActiveByProximity = () => {
            frame = requestAnimationFrame(updateActiveByProximity);
            const centerY = window.innerHeight / 3;
            let bestIndex = 0;
            let bestDist = Infinity;
            sentinelRefs.current.forEach((node, i) => {
                if (!node) return;
                const rect = node.getBoundingClientRect();
                const mid = rect.top + rect.height / 2;
                const dist = Math.abs(mid - centerY);
                if (dist < bestDist) {
                    bestDist = dist;
                    bestIndex = i;
                }
            });
            if (bestIndex !== activeIndex) setActiveIndex(bestIndex);
        };

        frame = requestAnimationFrame(updateActiveByProximity);
        return () => cancelAnimationFrame(frame);
    }, [activeIndex]);

    useEffect(() => {
        setActiveIndex(0);
    }, []);

    return (
        <section className="py-32 bg-background relative z-10 w-full overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] bg-[size:50px_50px]" />

            <div className="container relative z-10 mx-auto px-6">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="mb-4 text-4xl font-extrabold tracking-tight md:text-6xl bg-gradient-to-br from-indigo-300 to-fuchsia-400 bg-clip-text text-transparent">
                        {title}
                    </h2>
                    <p className="mb-6 text-xl text-neutral-400">
                        {description}
                    </p>
                </div>

                <div className="mx-auto mt-20 max-w-4xl space-y-16 md:mt-32 md:space-y-32">
                    {entries.map((entry, index) => {
                        const isActive = index === activeIndex;

                        return (
                            <div
                                key={index}
                                className="relative flex flex-col gap-6 md:flex-row md:gap-12"
                                ref={(el) => setItemRef(el, index)}
                                aria-current={isActive ? "true" : "false"}
                            >
                                {/* Sticky meta column */}
                                <div className="top-24 flex h-min w-72 shrink-0 items-start gap-4 md:sticky group">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl border transition-all duration-500 shadow-2xl ${isActive
                                                ? "bg-gradient-to-br from-indigo-600 to-fuchsia-600 border-indigo-400 text-white scale-110"
                                                : "bg-neutral-900 border-neutral-800 text-neutral-500"
                                            }`}>
                                            <entry.icon className="h-6 w-6" />
                                        </div>
                                        <div className="flex flex-col mt-1">
                                            <span className={`text-lg font-bold tracking-wide transition-colors duration-300 ${isActive ? "text-indigo-100" : "text-neutral-400"}`}>
                                                {entry.title}
                                            </span>
                                            <span className="text-sm font-medium text-fuchsia-500/80">
                                                {entry.subtitle}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    ref={(el) => setSentinelRef(el, index)}
                                    aria-hidden
                                    className="absolute -top-32 left-0 h-12 w-12 opacity-0"
                                />

                                {/* Content column */}
                                <article
                                    className={
                                        "flex flex-col rounded-3xl border p-4 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform " +
                                        (isActive
                                            ? "border-indigo-500/30 bg-neutral-900/80 backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(99,102,241,0.3)] scale-[1.02] translate-x-2"
                                            : "border-neutral-800/50 bg-neutral-950/40 opacity-50 grayscale-[50%]")
                                    }
                                >
                                    {entry.image && (
                                        <div className="overflow-hidden rounded-2xl mb-6 border border-white/5">
                                            <img
                                                src={entry.image}
                                                alt={`${entry.title} visual`}
                                                className={`w-full h-80 object-cover transition-transform duration-[2000ms] ${isActive ? "scale-105" : "scale-100"}`}
                                                loading="lazy"
                                            />
                                        </div>
                                    )}
                                    <div className="space-y-5 px-2 pb-2">
                                        <div className="space-y-3">
                                            <h3
                                                className={
                                                    "text-2xl font-bold leading-tight tracking-tight transition-colors duration-300 " +
                                                    (isActive ? "text-white" : "text-white/40")
                                                }
                                            >
                                                {entry.title}
                                            </h3>

                                            <p
                                                className={
                                                    "text-base leading-relaxed transition-all duration-300 " +
                                                    (isActive
                                                        ? "text-neutral-300"
                                                        : "text-neutral-600 line-clamp-2")
                                                }
                                            >
                                                {entry.description}
                                            </p>
                                        </div>

                                        <div
                                            aria-hidden={!isActive}
                                            className={
                                                "grid transition-all duration-700 ease-in-out " +
                                                (isActive
                                                    ? "grid-rows-[1fr] opacity-100"
                                                    : "grid-rows-[0fr] opacity-0")
                                            }
                                        >
                                            <div className="overflow-hidden">
                                                <div className="space-y-5 pt-4">
                                                    {entry.items && entry.items.length > 0 && (
                                                        <div className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-md p-6 shadow-inner">
                                                            <ul className="space-y-4">
                                                                {entry.items.map((item, itemIndex) => (
                                                                    <li
                                                                        key={itemIndex}
                                                                        className="flex items-start gap-3 text-sm font-medium text-neutral-300"
                                                                    >
                                                                        <div className="mt-1 h-2 w-2 rounded-full bg-gradient-to-br from-fuchsia-400 to-purple-600 flex-shrink-0 shadow-[0_0_10px_rgba(192,38,211,0.5)]" />
                                                                        <span className="leading-relaxed">{item}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {entry.button && (
                                                        <div className="flex justify-start pb-2">
                                                            <Button
                                                                variant="default"
                                                                size="lg"
                                                                className="group bg-white text-black hover:bg-neutral-200 font-bold tracking-wide rounded-xl shadow-xl transition-all duration-300 hover:scale-105"
                                                                asChild
                                                            >
                                                                <a href={entry.button.url} target="_blank" rel="noreferrer">
                                                                    {entry.button.text}
                                                                    <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
