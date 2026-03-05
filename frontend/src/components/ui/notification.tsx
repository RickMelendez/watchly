import React from "react";
import { motion } from "framer-motion";

interface NotificationCardProps {
    aiName?: string;
    userName?: string;
    paperTopic?: string;
    doctorName?: string;
    earnings?: string;
    weekTotal?: string;
}

const Notification = ({
    aiName = "Watchly AI",
    userName = "User",
    paperTopic = "your website",
    doctorName = "Alert Engine",
    earnings = "99.98%",
    weekTotal = "100%",
}: NotificationCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay: 0.5,
                type: "spring",
                stiffness: 100,
                damping: 10,
                duration: 0.6,
            }}
            className="relative mx-auto max-w-md overflow-hidden rounded-lg bg-card border border-border shadow-md"
            role="alert"
            aria-live="polite"
        >
            <div className="p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                    className="relative mb-4 flex items-center"
                >
                    <div className="relative mr-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-700 text-xl font-bold text-white">
                            {aiName[0]}
                        </div>
                    </div>
                    <span className="text-lg font-semibold text-foreground">{aiName}</span>
                </motion.div>

                <div className="relative">
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "calc(100% - 20px)" }}
                        transition={{ delay: 1.0, duration: 0.6, ease: "easeInOut" }}
                        className="absolute left-[19px] top-0 mt-3 w-1 bg-muted"
                    />

                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ delay: 1.0, duration: 0.8, type: "tween" }}
                        style={{ overflow: "hidden" }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.6 }}
                            className="mb-4 pl-12 text-foreground"
                        >
                            <p>
                                Hey {userName}, {paperTopic} was checked by{" "}
                                <span className="underline text-green-500">{doctorName}</span>{" "}
                                and is currently operational.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.4, duration: 0.6 }}
                            className="ml-12 rounded-md p-3 bg-muted"
                        >
                            <div className="flex items-start">
                                <p className="text-sm text-muted-foreground">
                                    Uptime this check: <strong className="text-green-500">{earnings}</strong>. This week's overall uptime: <strong className="text-green-500">{weekTotal}</strong>.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default Notification;
