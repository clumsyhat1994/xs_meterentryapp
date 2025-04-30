import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export const Scanner = ({ onScan }) => {
  const [error, setError] = useState(null);
  const ref_html5QrCode = useRef(null);
  const ref_running = useRef(false);
  const [scanResult, setScanResult] = useState("");
  useEffect(() => {
    const qrRegionId = "qr-reader";
    const html5QrCode = new Html5Qrcode(qrRegionId);
    ref_html5QrCode.current = html5QrCode;

    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 }, verbose: false },
        (decodedText) => {
          setError(null);
          setScanResult(decodedText);
          onScan(decodedText);
          html5QrCode.stop();
        },
        (scanError) => {
          console.debug("Scan error: ", scanError);
        }
      )
      .then(() => {
        ref_running.current = true;
      })
      .catch((err) => {
        setError("启动摄像头失败：", err);
      });

    return () => {
      if (ref_running.current) html5QrCode.stop().catch((e) => console.log(e));
    };
  }, [onScan]);

  return (
    <>
      <div className="position-relative overflow-hidden vw-100 vh-100">
        <div id="qr-reader" className="w-100 h-100" />
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-between align-items-center text-white p-3 pe-none z-1">
          <h4 className="pe-auto">请扫描二维码v1</h4>
          {error && <div className="alert alert-danger">{error}</div>}
          {scanResult && (
            <div className="pe-auto">
              <strong>扫描结果：</strong>
              {scanResult}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
