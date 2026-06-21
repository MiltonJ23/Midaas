import Image from "next/image";
import pdfFile from "@/assets/images/icons/pdf-file.svg";
import imageFile from "@/assets/images/icons/png-file.svg";

type FileItemProps = {
  type: "pdf" | "image" | "file";
  url: string;
  name: string;
  size: string;
  onDelete?: () => void;
};

export default function FileItem({
  type,
  name,
  size,
  onDelete,
}: FileItemProps) {
  const truncate = (str: string, n: number) => {
    return str.length > n - 4
      ? str.substring(0, n - 1) + "[...]." + str.split(".").pop()
      : str;
  };

  return (
    <div className="relative w-full flex items-center justify-between border p-2 rounded-md bg-white">
      <div className="w-full flex items-center gap-2">
        <Image
          src={type === "pdf" ? pdfFile : imageFile}
          alt="files"
          width={60}
          height={60}
          className="w-[30px] h-auto"
        />
        <p className="font-sans">{truncate(name, 20)}</p>
      </div>

      <span className="text-sm whitespace-nowrap">{size}</span>

      {onDelete && (
        <button
          className="absolute -top-3 -right-3 p-2 bg-red-200 rounded-full"
          onClick={onDelete}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 8.586l3.293-3.293 1.414 1.414L11.414 10l3.293 3.293-1.414 1.414L10 11.414l-3.293 3.293-1.414-1.414L8.586 10 5.293 6.707l1.414-1.414L10 8.586zM10 18a8 8 0 100-16 8 8 0 000 16z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
