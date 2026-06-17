import { twMerge } from "tailwind-merge";

interface StatusProps {
	text: string;
	variant?: "success" | "warning" | "error";
}

export default function Status({ text, variant = "success" }: StatusProps) {
	const bgColor = {
		success: "bg-primary/10",
		warning: "bg-warning/10",
		error: "bg-destructive/10",
	}[variant];

  const dotColor = {
    success: "bg-primary",
    warning: "bg-warning",
    error: "bg-destructive",
  }[variant];

	const textColor = {
		success: "text-primary",
		warning: "text-warning",
		error: "text-destructive",
	}[variant];

	return (
		<div
			className={twMerge(
				"inline-flex items-center gap-2 px-4 py-1 rounded-full",
				bgColor
			)}
		>
			<span
				className={twMerge("w-2 h-2 rounded-full", dotColor)}
			></span>
			<span className={twMerge("", textColor)}>{text}</span>
		</div>
	);
}
