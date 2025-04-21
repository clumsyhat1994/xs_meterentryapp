import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useZxing } from "react-zxing";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faTimes } from "@fortawesome/free-solid-svg-icons";
import api from "./api";

const QRScanner = () => {
  const [scannedData, setScannedData] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  console.log("mediaDevices:", navigator.mediaDevices);
  const { ref: scanRef, error } = useZxing({
    constraints: { video: { facingMode: "environment" } },
    onDecodeResult(result) {
      console.log(result.getText());
      setIsScanning(false);
    },
  });

  useEffect(() => {
    if (error) {
      console.error("QR Scanner error:", error);
    }
  }, [error]);

  return (
    <div className="row mb-2">
      {!isScanning ? (
        <button
          type="button"
          className="btn btn secondary w-100 mb-3"
          onClick={() => setIsScanning(true)}
        >
          <FontAwesomeIcon icon={faCamera} size="lg" />
        </button>
      ) : (
        <div>
          <h4>请扫描二维码v1.2</h4>
          <video
            ref={scanRef}
            autoPlay
            playsInline
            muted
            className="w-100 rounded shadow-sm"
          />
          <button
            type="button"
            className="btn btn-danger w-100 mt-3"
            onClick={() => setIsScanning(false)}
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default QRScanner;
