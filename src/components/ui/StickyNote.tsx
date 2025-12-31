import React from "react";
import { cn } from "@/lib/utils";

interface StickyNoteProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    bgColor?: string; // Expecting a hex code or color value for inline style usually, or tailwind class if carefully managed
    foldColor?: string; // Essential for the flap color
    showHoles?: boolean;
    holeColor?: string;
}

export default function StickyNote({
    children,
    className,
    bgColor = "#b5cad6", // Defaulting to hex as per reference implying dynamic color
    foldColor = "#8aa3b0",
    showHoles = true,
    holeColor = "bg-white",
    ...props
}: StickyNoteProps) {

    // Check if bgColor is a tailwind class (starts with 'bg-') or a raw color
    const isTailwindBg = bgColor.startsWith("bg-");
    const containerStyle = isTailwindBg ? {} : { backgroundColor: bgColor };

    // Logic for shadows from reference
    const shadowStyle = {
        boxShadow: `
        0 15px 35px rgba(0,0,0,0.12),
        0 5px 15px rgba(0,0,0,0.08)
    `,
        ...containerStyle
    };

    return (
        <div
            className={cn(
                "relative w-full h-full rounded-[2rem] flex flex-col transition-all duration-500 overflow-hidden",
                "group cursor-pointer", // Keeping group for hover effects if any
                // Note: User previously hated hover-translate, but reference has it. 
                // I will keep it subtle or remove the translate based on mixed signals, 
                // but the prompt said "TUH REFERENSINYA COBA IMPELEMENTASIKAN".
                // I will omit the translation to be safe, but keep the transition.
                isTailwindBg ? bgColor : undefined,
                className
            )}
            style={shadowStyle}
            {...props}
        >
            {/* Binder Holes - WHITE with Stronger INNER SHADOW */}
            {showHoles && (
                <div className="absolute top-5 left-1/2 -translate-x-1/2 flex gap-4 z-20">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className={cn("w-4 h-4 rounded-full", holeColor)}
                            style={{
                                boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3), inset 1px 1px 2px rgba(0,0,0,0.2)'
                            }}
                        ></div>
                    ))}
                </div>
            )}

            {/* Content */}
            <div className="flex flex-col gap-5 mt-6 relative z-10 h-full p-8">
                {children}
            </div>

            {/* Folded Corner using Borders for Perfect Triangles */}
            <div className="absolute bottom-0 right-0 w-[80px] h-[80px] drop-shadow-[-4px_-4px_6px_rgba(0,0,0,0.15)] pointer-events-none">
                {/* Shadow Triangle (Bottom-Right) - The 'Peel' or 'Back' */}
                <div
                    className="absolute bottom-0 right-0 w-0 h-0"
                    style={{
                        borderStyle: 'solid',
                        borderWidth: '0 0 80px 80px',
                        borderColor: 'transparent transparent rgba(0,0,0,0.25) transparent',
                    }}
                ></div>

                {/* Fold Triangle (Top-Left) - The 'Flap' */}
                <div
                    className="absolute bottom-0 right-0 w-0 h-0 z-20"
                    style={{
                        borderStyle: 'solid',
                        borderWidth: '80px 80px 0 0',
                        borderColor: `${foldColor} transparent transparent transparent`,
                    }}
                ></div>
            </div>
        </div>
    );
}
