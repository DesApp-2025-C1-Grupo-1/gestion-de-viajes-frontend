import { useEffect, useRef, useState } from "react";

export function useAutoRowsPerPage(rowHeight: number = 72) {
  const [rowsPerPage, setRowsPerPage] = useState(5); // Valor inicial razonable
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const tableHeaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    const calculate = () => {
      const headerHeight = headerRef.current?.offsetHeight || 0;
      const footerHeight = footerRef.current?.offsetHeight || 0;
      const filterHeight = filterRef.current?.offsetHeight || 0;
      const tableHeaderHeight = tableHeaderRef.current?.offsetHeight || 0;
      
      // Espacio adicional para márgenes y padding
      const EXTRA_SPACE = 80; 
      
      const availableHeight = window.innerHeight - headerHeight - footerHeight - filterHeight - tableHeaderHeight - EXTRA_SPACE;

      const calculatedRows = Math.floor(availableHeight / rowHeight);
      setRowsPerPage(Math.max(2, calculatedRows)); // Mínimo 2 filas
    }

    // Llamada inicial
    calculate();

    const resizeListener = () => calculate();
    window.addEventListener("resize", resizeListener);

    const filterElement = filterRef.current;
    let resizeObserver: ResizeObserver | undefined;
    if (filterElement) {
      resizeObserver = new ResizeObserver(() => calculate());
      resizeObserver.observe(filterElement);
    }

    return () => {
      window.removeEventListener("resize", resizeListener);
      resizeObserver?.disconnect();
    };
  }, [rowHeight]);

  return { rowsPerPage, headerRef, footerRef, filterRef, tableHeaderRef };
}