import * as React from "react";
import { cn } from "@/lib/utils";
 


const Checkbox = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, type = "checkbox", ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "h-4 w-4 rounded border border-input bg-background shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };