import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, Info, Settings, Code, Accessibility } from "lucide-react";

export interface AccordionItemData {
    id: string;
    icon: any;
    title: string;
    content: React.ReactNode;
}

interface AccordianProps {
    items?: AccordionItemData[];
    title?: string;
}

const defaultItems = [
    {
        id: "1",
        icon: Info,
        title: "What is Website Monitor?",
        content:
            "A real-time monitoring platform that tracks your website uptime, performance metrics, and more.",
    },
    {
        id: "2",
        icon: Settings,
        title: "How do I setup alerts?",
        content:
            "Navigate to the dashboard and configure triggers for downtime or performance drops across various channels.",
    },
    {
        id: "3",
        icon: Code,
        title: "Is there an API available?",
        content:
            "Yes! Developer-centric infrastructure allows integration via our robust REST and GraphQL APIs.",
    },
    {
        id: "4",
        icon: Accessibility,
        title: "Compliance and Security?",
        content:
            "Top tier security principles following industry standards. Compliance is at the core of our platform.",
    },
];

export const Accordian = ({ items = defaultItems, title = "FAQs" }: AccordianProps) => {
    const [openItem, setOpenItem] = useState<string | null>(null);
    const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const toggleItem = (id: string) => {
        setOpenItem((current) => (current === id ? null : id));
    };

    return (
        <div
            className="
        max-w-xl
        bg-white/5 dark:bg-black/40
        backdrop-blur-md
        border border-gray-200/20 dark:border-gray-800/50
        rounded-2xl
        shadow-lg
        transition-colors duration-500
      "
        >
            <h2 className="text-2xl font-extrabold text-foreground px-6 pt-6 pb-2 select-none">
                {title}
            </h2>

            <div className="flex flex-col">
                {items.map(({ id, icon: Icon, title, content }) => {
                    const isOpen = openItem === id;

                    return (
                        <div
                            key={id}
                            className="border-t border-gray-200/20 dark:border-gray-800/50 last:border-b-0"
                        >
                            <button
                                onClick={() => toggleItem(id)}
                                aria-expanded={isOpen}
                                className={`
                                    flex items-center justify-between w-full
                                    px-6 py-5
                                    text-foreground
                                    text-base font-medium
                                    cursor-pointer
                                    bg-transparent
                                    transition-colors duration-300
                                    hover:bg-black/5 dark:hover:bg-white/5
                                    select-none
                                    focus:outline-none
                                    `}
                            >
                                <div className="flex items-center gap-4">
                                    <Icon
                                        className="w-5 h-5 text-primary"
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />
                                    <span>{title}</span>
                                </div>

                                <div className="relative w-5 h-5 flex-shrink-0">
                                    <Plus
                                        className={`absolute inset-0 text-foreground transition-opacity duration-300 ${isOpen ? "opacity-0" : "opacity-100"
                                            }`}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />
                                    <Minus
                                        className={`absolute inset-0 text-foreground transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
                                            }`}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />
                                </div>
                            </button>

                            <motion.div
                                initial={false}
                                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                style={{ overflow: "hidden" }}
                            >
                                <div
                                    ref={(el) => {
                                        contentRefs.current[id] = el;
                                    }}
                                    className="px-6 pb-6 pt-2 text-muted-foreground text-sm leading-relaxed select-text"
                                >
                                    {content}
                                </div>
                            </motion.div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
