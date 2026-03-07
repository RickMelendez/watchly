import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "../../lib/utils";

interface DockItemProps {
  icon: React.ReactNode;
  label?: string;
  onClick?: () => void;
  className?: string;
}

interface DockProps {
  items: DockItemProps[];
  className?: string;
}

function DockItem({
  icon,
  label,
  onClick,
  mouseX,
  className,
}: DockItemProps & { mouseX: ReturnType<typeof useMotionValue<number>> }) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return 9999;
    const center = bounds.left + bounds.width / 2;
    return Math.abs(val - center);
  });

  const size = useSpring(
    useTransform(distance, [0, 80, 160], [64, 52, 40]),
    { stiffness: 300, damping: 28 }
  );

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center rounded-2xl bg-neutral-900 border border-white/10 cursor-pointer hover:border-white/20 transition-colors",
        className
      )}
      style={{ width: size, height: size }}
      title={label}
    >
      <span className="flex items-center justify-center w-full h-full">{icon}</span>
      {label && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-xs bg-neutral-800 text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none">
          {label}
        </span>
      )}
    </motion.div>
  );
}

export function Dock({ items, className }: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "flex items-end gap-3 px-4 py-3 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl",
        className
      )}
    >
      {items.map((item, i) => (
        <DockItem key={i} {...item} mouseX={mouseX} />
      ))}
    </motion.div>
  );
}
