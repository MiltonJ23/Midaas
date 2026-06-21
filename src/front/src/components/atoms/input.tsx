import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-input bg-transparent px-4 py-3 text-base shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

interface MUIInputProps
  extends React.ComponentProps<"input"> {
  label: string;
  before?: React.ReactNode;
  after?: React.ReactNode;
}

const MUIInput = React.forwardRef<HTMLInputElement, MUIInputProps>(
  ({ className, type, label, before, after, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="space-y-2">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground"
        >
          {label}
          {props.required && (
            <span className="text-destructive ml-0.5">*</span>
          )}
        </label>
        <div className="relative">
          {before && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
              {before}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            id={inputId}
            className={cn(
              "flex h-11 w-full rounded-lg border border-input bg-transparent px-4 py-3 text-base shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
              before && "pl-10",
              after && "pr-10",
              className
            )}
            {...props}
          />
          {after && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {after}
            </div>
          )}
        </div>
      </div>
    );
  }
);
MUIInput.displayName = "MUIInput";

const MUITextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & { label: string }
>(({ className, label, id, ...props }, ref) => {
  const inputId = id || React.useId();

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          "flex min-h-[100px] w-full rounded-lg border border-input bg-transparent px-4 py-3 text-base shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 resize-none",
          className
        )}
        {...props}
      />
    </div>
  );
});
MUITextarea.displayName = "MUITextarea";

export { Input, MUIInput, MUITextarea };
