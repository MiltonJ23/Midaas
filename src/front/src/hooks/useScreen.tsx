import { useState, useEffect } from "react";

export default function useScreen() {
  const [screen, setScreen] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const handleResize = () => {
    const width = window.innerWidth;

    if (width < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }

    setScreen(width);
  }

  return { screen, isMobile };
}