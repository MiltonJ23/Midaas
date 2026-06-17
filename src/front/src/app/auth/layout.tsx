"use client";

type Props = {
	children: React.ReactNode;
}

export default function Layout({ children }: Props) {
	return (
		<section className='bg-background w-screen h-screen flex overflow-hidden'>
			<main className='w-full h-full bg-background overflow-hidden'>
				{children}
			</main>
		</section>
	);
}
