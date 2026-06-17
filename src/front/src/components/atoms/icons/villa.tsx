interface Props {
	active?: boolean;
}

export default function VillaIcon({ active }: Props) {
	return (
		<>
			{active ? (
				<svg
					width='64'
					height='64'
					viewBox='0 0 64 64'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<rect
						x='0.5'
						y='0.5'
						width='63'
						height='63'
						fill='url(#pattern0_2230_9128)'
					/>
					<defs>
						<pattern
							id='pattern0_2230_9128'
							patternContentUnits='objectBoundingBox'
							width='1'
							height='1'
						>
							<use href='#image0_2230_9128' transform='scale(0.01)' />
						</pattern>
						<image
							id='image0_2230_9128'
							width='100'
							height='100'
							href='data:image/png;base64,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'
						/>
					</defs>
				</svg>
			) : (
				<svg width='64' height='64' viewBox='0 0 64 64' fill='none'>
					<rect
						id='Residence'
						x='0.5'
						y='0.5'
						width='63'
						height='63'
						fill='url(#pattern0_2230_8052)'
					/>
					<defs>
						<pattern
							id='pattern0_2230_8052'
							patternContentUnits='objectBoundingBox'
							width='1'
							height='1'
						>
							<use href='#image0_2230_8052' transform='scale(0.01)' />
						</pattern>
						<image
							id='image0_2230_8052'
							width='100'
							height='100'
							href='data:image/png;base64,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'
						/>
					</defs>
				</svg>
			)}
		</>
	);
}
