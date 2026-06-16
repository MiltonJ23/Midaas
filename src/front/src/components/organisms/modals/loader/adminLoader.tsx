import Image from "next/image";

export default function AdminLoader() {
  return (
    <div className="fixed top-0 left-0 z-50 w-full h-full bg-white opacity-75">
      <div className="flex flex-col justify-center items-center h-full">
        <Image
          src="/logo.png"
          alt="Midaas logo"
          width={227}
          height={56}
          className="animate-pulse"
        />
        {/* <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div> */}
      </div>
    </div>
  );
}
