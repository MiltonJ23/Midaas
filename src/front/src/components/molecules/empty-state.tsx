import { Button } from "@/components/atoms/button";

type EmptyStateProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  actionLabel: string;
  onAction: () => void;
};

export default function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-16 px-4 bg-background rounded-lg border border-border/30">
      <div className="mb-4 text-gray-400">{icon}</div>
      <h3 className="text-lg font-MontserratBold mb-2 text-gray-700">
        {title}
      </h3>
      <p className="text-sm text-gray-500 text-center mb-6 max-w-md">
        {description}
      </p>
      <Button onClick={onAction} className="px-6">
        {actionLabel}
      </Button>
    </div>
  );
}
