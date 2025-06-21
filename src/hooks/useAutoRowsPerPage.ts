import { useEffect, useRef, useState } from "react";

export function useAutoRowsPerPage(rowHeight: number = 72) {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculate = () => {
      const headerHeight = headerRef.current?.offsetHeight || 0;
      const footerHeight = footerRef.current?.offsetHeight || 0;
      const windowHeight = window.innerHeight;
      const margin = 60; // padding/margen extra

      const availableHeight = windowHeight - headerHeight - footerHeight - margin;
      const estimated = Math.floor(availableHeight / rowHeight);
      setRowsPerPage(Math.max(1, estimated));
    };

    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, [rowHeight]);

  return { rowsPerPage, headerRef, footerRef };
}