import { cn } from "@/lib/utils";

interface Props {
  title: string;
  value: number | string;
  icon: React.ReactElement<unknown>;
  variant?: "default" | "primary";
  subtitle?: string;
}

export default function StatisticCard({
  title,
  value,
  icon,
  variant = "default",
  subtitle,
}: Props) {
  const isPrimary = variant === "primary";

  return (
    <article
      className={cn(
        "min-w-[200px] rounded-xl px-6 py-6 flex flex-col items-start justify-start gap-3 border border-slate-200 bg-white",
        isPrimary && "bg-primary text-white border-primary"
      )}
    >
      <div className="flex items-center justify-center [&_svg]:w-8 [&_svg]:h-8 [&_svg]:text-primary">
        {icon}
      </div>

      <div className="flex flex-col justify-center gap-1 w-full">
        <span className={cn("text-3xl font-bold", isPrimary ? "text-white" : "text-slate-900")}>
          {value}
        </span>
        <span className={cn("text-sm font-medium", isPrimary ? "text-white/80" : "text-slate-500")}>
          {title}
        </span>
        {subtitle && (
          <span className="text-xs text-primary font-medium mt-0.5">
            {subtitle}
          </span>
        )}
      </div>
    </article>
  );
}
