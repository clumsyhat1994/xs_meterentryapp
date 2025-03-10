import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export const Scanner = () => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    const success = (result) => {
      scanner.clear();
    };
    const error = (err) => {
      console.warn(err);
    };
    scanner.render(success, error);
  }, []);
  const [result, setResult] = useState("");

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
