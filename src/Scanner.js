import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export const Scanner = ({ onScan }) => {
  const [error, setError] = useState(null);
  const ref_html5QrCode = useRef(null);
  const ref_running = useRef(false);

  useEffect(() => {
    const qrRegionId = "qr-reader";
    const html5QrCode = new Html5Qrcode(qrRegionId);
    ref_html5QrCode.current = html5QrCode;

    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          onScan(decodedText);
          html5QrCode.stop();
        },
        (scanError) => {
          console.warn(scanError);
          setError(scanError);
        }
      )
      .then(() => {
        ref_running.current = true;
      })
      .catch((err) => {
        console.log(err);
        setError(err);
      });

    return () => {
      if (ref_running.current) html5QrCode.stop().catch((e) => console.log(e));
    };
  }, [onScan]);

  return (
    <>
      <div className="text-center p-3">
        <h4>请扫描二维码v1</h4>
        {error && (
          <div className="alert alert-danger">启动摄像头失败：{error}</div>
        )}
        <div
          id="qr-reader"
          style={{ width: 250, height: 250, margin: "auto" }}
        />
      </div>
    </>
  );
};
