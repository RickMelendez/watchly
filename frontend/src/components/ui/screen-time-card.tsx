import * as React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "../../lib/utils";

interface AppUsage {
    icon: React.ReactNode;
    name: string;
    duration: string;
    color?: string;
}

interface ScreenTimeCardProps {
    totalHours: number;
    totalMinutes: number;
    barData: number[];
    timeLabels?: string[];
    topApps: AppUsage[];
    className?: string;
}

export const ScreenTimeCard = ({
    totalHours,
    totalMinutes,
    barData,
    timeLabels = ["5 AM", "11 AM", "5 PM"],
    topApps,
    className,
}: ScreenTimeCardProps) => {
    const maxValue = Math.max(...barData, 1);
    const normalizedData = barData.map((value) => value / maxValue);

    const barVariants: Variants = {
        hidden: { scaleY: 0 },
        visible: (i: number) => ({
            scaleY: 1,
            transition: {
                delay: i * 0.02,
                type: "spring",
                stiffness: 100,
                damping: 12,
            },
        }),
    };

    return (
        <div
            className={cn(
                "w-full max-w-md rounded-2xl border bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 dark:from-green-950/20 dark:via-emerald-950/10 dark:to-teal-950/20 text-card-foreground shadow-lg px-5 py-6 backdrop-blur-sm",
                className
            )}
        >
            <div className="flex gap-12">
                <div className="flex-1">
                    <div className="mb-4">
                        <div className="text-sm font-medium text-muted-foreground mb-1">Total Uptime</div>
                        <div className="text-3xl font-bold tracking-tight">
                            {totalHours}h {totalMinutes}m
                        </div>
                    </div>

                    <div className="relative mt-6">
                        <div className="absolute -right-11 top-0 flex h-32 flex-col justify-between text-xs text-muted-foreground font-medium">
                            <span>100%</span>
                            <span>50%</span>
                            <span>0%</span>
                        </div>

                        <div className="absolute inset-0 flex h-32 flex-col justify-between pointer-events-none">
                            <div className="h-px border-t border-dashed border-border/40" />
                            <div className="h-px border-t border-dashed border-border/40" />
                            <div className="h-px border-t border-dashed border-border/40" />
                        </div>

                        <div className="mb-2 flex h-32 items-end gap-[3px] relative z-10">
                            {normalizedData.map((height, index) => {
                                const isHighlighted = height > 0.8;
                                const barColor = isHighlighted
                                    ? "bg-gradient-to-t from-primary/80 to-primary"
                                    : "bg-muted dark:bg-muted/50";

                                return (
                                    <motion.div
                                        key={index}
                                        custom={index}
                                        variants={barVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className={cn(
                                            "flex-1 rounded-t-sm origin-bottom transition-colors hover:bg-primary/50",
                                            barColor
                                        )}
                                        style={{ height: `${height * 100}%` }}
                                    />
                                );
                            })}
                        </div>

                        <div className="flex justify-between text-xs font-medium text-muted-foreground px-1">
                            {timeLabels.map((label, index) => (
                                <span key={index}>{label}</span>
                            ))}
                            <span>Now</span>
                        </div>
                    </div>
                </div>

                <div className="w-px bg-border/50 self-stretch relative left-6" />

                <div className="flex flex-col gap-4 justify-center pl-2">
                    {topApps.map((app, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                            className="flex items-center gap-3"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/50 border border-border/50 text-foreground">
                                {app.icon}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-medium text-muted-foreground">{app.name}</span>
                                <span className="text-sm font-bold whitespace-nowrap">{app.duration}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
