import { useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import React from "react";

if (typeof Promise.withResolvers === "undefined") {
	if (window)
		// @ts-expect-error This does not exist outside of polyfill which this is doing
		window.Promise.withResolvers = function () {
			let resolve, reject;
			const promise = new Promise((res, rej) => {
				resolve = res;
				reject = rej;
			});
			return { promise, resolve, reject };
		};
}

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/legacy/build/pdf.worker.min.mjs",
	import.meta.url
).toString();

type Props = {
	url: string;
};

const PDFViewer = ({ url }: Props) => {
	const [numPages, setNumPages] = useState<number>();
	const [scale, setScale] = useState<number>(1);

	function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
		setNumPages(numPages);
	}

	const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
	const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

	return (
		<div>
			<div style={{ marginBottom: "8px" }}>
				<button onClick={zoomOut} disabled={scale <= 0.5}>-</button>
				<span style={{ margin: "0 8px" }}>Zoom: {(scale * 100).toFixed(0)}%</span>
				<button onClick={zoomIn} disabled={scale >= 3}>+</button>
			</div>
			<Document
				file={url}
				onLoadSuccess={onDocumentLoadSuccess}
				className={"max-w-full"}
			>
				{numPages &&
					Array.from({ length: numPages }, (_, i) => (
						<Page key={i + 1} pageNumber={i + 1} className={"w-full"} scale={scale} />
					))}
			</Document>
			<p>
				{numPages ? `Total pages: ${numPages}` : "Loading..."}
			</p>
		</div>
	);
};

export default PDFViewer;
