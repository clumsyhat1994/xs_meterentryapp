import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export const CustomScanner = () => {
  const scannerRef = useRef(null);
  const [result, setResult] = useState("");

  useEffect(() => {
    scannerRef.current = new Html5Qrcode("reader");
    const scanner = new Html5Qrcode("reader");
  }, []);

  return (
    <>
      <div id="reader"></div>
      <p>
        <span>Last result:</span>
        <span>{result}</span>
      </p>
    </>
  );
};
