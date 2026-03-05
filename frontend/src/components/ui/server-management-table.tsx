"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export interface Server {
    id: string;
    number: string;
    serviceName: string;
    osType: "windows" | "linux" | "ubuntu";
    serviceLocation: string;
    countryCode: "de" | "us" | "fr" | "jp";
    ip: string;
    dueDate: string;
    cpuPercentage: number;
    status: "active" | "paused" | "inactive";
}

interface ServerManagementTableProps {
    title?: string;
    servers?: Server[];
    onStatusChange?: (serverId: string, newStatus: Server["status"]) => void;
    className?: string;
}

const defaultServers: Server[] = [
    {
        id: "1",
        number: "01",
        serviceName: "VPS-2 (Windows)",
        osType: "windows",
        serviceLocation: "Frankfurt, Germany",
        countryCode: "de",
        ip: "198.51.100.211",
        dueDate: "14 Oct 2027",
        cpuPercentage: 80,
        status: "active"
    },
    {
        id: "2",
        number: "02",
        serviceName: "VPS-1 (Windows)",
        osType: "windows",
        serviceLocation: "Frankfurt, Germany",
        countryCode: "de",
        ip: "203.0.113.158",
        dueDate: "14 Oct 2027",
        cpuPercentage: 90,
        status: "active"
    },
    {
        id: "3",
        number: "03",
        serviceName: "VPS-1 (Ubuntu)",
        osType: "ubuntu",
        serviceLocation: "Paris, France",
        countryCode: "fr",
        ip: "192.0.2.37",
        dueDate: "27 Jun 2027",
        cpuPercentage: 50,
        status: "paused"
    },
    {
        id: "4",
        number: "04",
        serviceName: "Cloud Server (Ubuntu)",
        osType: "ubuntu",
        serviceLocation: "California, US West",
        countryCode: "us",
        ip: "198.51.100.23",
        dueDate: "30 May 2030",
        cpuPercentage: 95,
        status: "active"
    },
    {
        id: "5",
        number: "05",
        serviceName: "Dedicated Server (Windows)",
        osType: "windows",
        serviceLocation: "Virginia, US East",
        countryCode: "us",
        ip: "203.0.113.45",
        dueDate: "15 Dec 2026",
        cpuPercentage: 25,
        status: "inactive"
    }
];

export function ServerManagementTable({
    title = "Active Services",
    servers: initialServers = defaultServers,
    onStatusChange,
    className = ""
}: ServerManagementTableProps = {}) {
    const [servers, setServers] = useState<Server[]>(initialServers);
    // setHoveredServer removed
    const [selectedServer, setSelectedServer] = useState<Server | null>(null);

    const handleStatusChange = (serverId: string, newStatus: Server["status"]) => {
        if (onStatusChange) {
            onStatusChange(serverId, newStatus);
        }

        setServers(prev => prev.map(server =>
            server.id === serverId ? { ...server, status: newStatus } : server
        ));
    };

    const openServerModal = (server: Server) => {
        setSelectedServer(server);
    };

    const closeServerModal = () => {
        setSelectedServer(null);
    };

    // Update selected server when servers change (for real-time updates)
    useEffect(() => {
        if (selectedServer) {
            const updatedServer = servers.find(s => s.id === selectedServer.id);
            if (updatedServer) {
                setSelectedServer(updatedServer);
            }
        }
    }, [servers, selectedServer]);

    const getOSIcon = (osType: Server["osType"]) => {
        switch (osType) {
            case "windows":
                return (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center p-1.5 border border-border/30">
                        <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                            <path className="fill-white" d="M30,15H17c-0.6,0-1-0.4-1-1V3.3c0-0.5,0.4-0.9,0.8-1l13-2.3c0.3,0,0.6,0,0.8,0.2C30.9,0.4,31,0.7,31,1v13 C31,14.6,30.6,15,30,15z" />
                            <path className="fill-white" d="M13,15H1c-0.6,0-1-0.4-1-1V6c0-0.5,0.4-0.9,0.8-1l12-2c0.3,0,0.6,0,0.8,0.2C13.9,3.4,14,3.7,14,4v10 C14,14.6,13.6,15,13,15z" />
                            <path className="fill-white" d="M30,32c-0.1,0-0.1,0-0.2,0l-13-2.3c-0.5-0.1-0.8-0.5-0.8-1V18c0-0.6,0.4-1,1-1h13c0.6,0,1,0.4,1,1v13 c0,0.3-0.1,0.6-0.4,0.8C30.5,31.9,30.2,32,30,32z" />
                            <path className="fill-white" d="M13,29c-0.1,0-0.1,0-0.2,0l-12-2C0.4,26.9,0,26.5,0,26v-8c0-0.6,0.4-1,1-1h12c0.6,0,1,0.4,1,1v10 c0,0.3-0.1,0.6-0.4,0.8C13.5,28.9,13.2,29,13,29z" />
                        </svg>
                    </div>
                );
            case "ubuntu":
                return (
                    // NOTE: Simplistic representation
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold border border-border/30">
                        U
                    </div>
                );
            case "linux":
                return (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center border border-border/30">
                        <div className="text-white text-xs font-mono font-bold">L</div>
                    </div>
                );
        }
    };

    const getCountryFlag = (countryCode: Server["countryCode"]) => {
        return <span className="uppercase font-bold text-xs">{countryCode}</span>;
    };

    const getCPUBars = (percentage: number, status: Server["status"]) => {
        const filledBars = Math.round((percentage / 100) * 10);

        const getBarColor = (index: number) => {
            if (index >= filledBars) {
                return "bg-muted/40 border border-border/30";
            }

            switch (status) {
                case "active":
                    return "bg-green-500";
                case "paused":
                    return "bg-yellow-500";
                case "inactive":
                    return "bg-red-500";
                default:
                    return "bg-foreground/60";
            }
        };

        return (
            <div className="flex items-center gap-3">
                <div className="flex gap-1">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <div
                            key={index}
                            className={`w-1.5 h-5 rounded-full transition-all duration-500 ${getBarColor(index)}`}
                        />
                    ))}
                </div>
                <span className="text-sm font-mono text-foreground font-medium min-w-[3rem]">
                    {percentage}%
                </span>
            </div>
        );
    };

    const getStatusBadge = (status: Server["status"]) => {
        switch (status) {
            case "active":
                return (
                    <div className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                        <span className="text-green-500 text-sm font-medium">Active</span>
                    </div>
                );
            case "paused":
                return (
                    <div className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
                        <span className="text-yellow-500 text-sm font-medium">Paused</span>
                    </div>
                );
            case "inactive":
                return (
                    <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                        <span className="text-red-500 text-sm font-medium">Inactive</span>
                    </div>
                );
        }
    };

    const getStatusGradient = (status: Server["status"]) => {
        switch (status) {
            case "active":
                return "from-green-500/10 to-transparent";
            case "paused":
                return "from-yellow-500/10 to-transparent";
            case "inactive":
                return "from-red-500/10 to-transparent";
        }
    };

    return (
        <div className={`w-full max-w-7xl mx-auto p-6 ${className}`}>
            <div className="relative border border-border/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <h1 className="text-xl font-medium text-foreground">{title}</h1>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {servers.filter(s => s.status === "active").length} Servers • {servers.filter(s => s.status === "inactive").length} Servers
                        </div>
                    </div>
                </div>

                {/* Table */}
                <motion.div
                    className="space-y-2"
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.08,
                                delayChildren: 0.1,
                            }
                        }
                    }}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Headers */}
                    <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <div className="col-span-1">No</div>
                        <div className="col-span-2">Service Name</div>
                        <div className="col-span-2">Service Location</div>
                        <div className="col-span-2">IP</div>
                        <div className="col-span-2">Due Date</div>
                        <div className="col-span-2">CPU</div>
                        <div className="col-span-1">Status</div>
                    </div>

                    {/* Server Rows */}
                    {servers.map((server) => (
                        <motion.div
                            key={server.id}
                            variants={{
                                hidden: {
                                    opacity: 0,
                                    x: -25,
                                    scale: 0.95,
                                    filter: "blur(4px)"
                                },
                                visible: {
                                    opacity: 1,
                                    x: 0,
                                    scale: 1,
                                    filter: "blur(0px)",
                                    transition: {
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 28,
                                        mass: 0.6,
                                    },
                                },
                            }}
                            className="relative cursor-pointer"
                            onClick={() => openServerModal(server)}
                        >
                            <motion.div
                                className="relative bg-background/50 border border-border/50 rounded-xl p-4 overflow-hidden"
                                whileHover={{
                                    y: -1,
                                    transition: { type: "spring", stiffness: 400, damping: 25 }
                                }}
                            >
                                {/* Status gradient overlay */}
                                <div
                                    className={`absolute inset-0 bg-gradient-to-l ${getStatusGradient(server.status)} pointer-events-none`}
                                    style={{
                                        backgroundSize: "30% 100%",
                                        backgroundPosition: "right",
                                        backgroundRepeat: "no-repeat"
                                    }}
                                />

                                {/* Grid Content */}
                                <div className="relative grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-1">
                                        <span className="text-xl font-bold text-muted-foreground">
                                            {server.number}
                                        </span>
                                    </div>

                                    <div className="col-span-2 flex items-center gap-3">
                                        {getOSIcon(server.osType)}
                                        <span className="text-foreground font-medium text-sm">
                                            {server.serviceName}
                                        </span>
                                    </div>

                                    <div className="col-span-2 flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full overflow-hidden border border-border/30 flex items-center justify-center bg-muted">
                                            {getCountryFlag(server.countryCode)}
                                        </div>
                                        <span className="text-foreground text-sm">
                                            {server.serviceLocation}
                                        </span>
                                    </div>

                                    <div className="col-span-2">
                                        <span className="text-foreground font-mono text-sm">
                                            {server.ip}
                                        </span>
                                    </div>

                                    <div className="col-span-2">
                                        <span className="text-foreground text-sm">
                                            {server.dueDate}
                                        </span>
                                    </div>

                                    <div className="col-span-2">
                                        {getCPUBars(server.cpuPercentage, server.status)}
                                    </div>

                                    <div className="col-span-1">
                                        {getStatusBadge(server.status)}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Server Management Overlay */}
                <AnimatePresence>
                    {selectedServer && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 bg-background/80 backdrop-blur-md flex flex-col rounded-2xl z-10 overflow-hidden"
                        >
                            {/* Overlay Modal implementation elided for brevity - just simple details view */}
                            <div className="relative bg-card/80 p-6 border-b border-border/50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="text-3xl font-bold text-primary/70">
                                        {selectedServer.number}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground">
                                            {selectedServer.serviceName}
                                        </h3>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <motion.button
                                        className="w-10 h-10 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center border border-border/50"
                                        onClick={closeServerModal}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </div>

                            <div className="flex-1 p-6 space-y-4">
                                <div className="bg-muted/30 rounded-lg p-4 border border-border/40">
                                    <label className="text-sm font-medium text-muted-foreground uppercase mb-3 block">
                                        CPU Usage
                                    </label>
                                    {getCPUBars(selectedServer.cpuPercentage, selectedServer.status)}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
