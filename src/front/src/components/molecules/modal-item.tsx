import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
	title: string;
	value?: React.ReactNode;
	icon?: React.ReactNode;
	after?: React.ReactNode;
	onClick?: () => void;
};

export default function ModalItem({
	title,
	value,
	icon,
	after,
	onClick,
}: Props) {
	return (
		<div
			onClick={onClick}
			className={twMerge(
				"w-full rounded-2xl bg-background flex items-center justify-between p-4",
				onClick && "cursor-pointer"
			)}
		>
			<div className='flex items-center gap-4'>
				<span>{icon}</span>
				<div className='flex flex-col gap-2'>
					<h3 className='text-black/60 text-[16px]'>{title}</h3>
					{value && <span className='text-[16px]'>{value}</span>}
				</div>
			</div>

			<span>
				{after ? (
					after
				) : (
					<svg
						width='18'
						height='18'
						viewBox='0 0 24 24'
						fill='none'
						className='stroke-black/60 rotate-180'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							d='M15 19L8 12L15 5'
							stroke='black'
							strokeWidth='1.5'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
				)}
			</span>
		</div>
	);
}
