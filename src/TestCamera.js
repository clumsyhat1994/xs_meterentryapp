import React, { useEffect, useRef } from "react";

export default function TestCamera() {
  const videoRef = useRef(null);

  useEffect(() => {
    // try to grab the camera and show it on the video element
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error("getUserMedia() error:", err);
      });
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: 400, margin: "auto" }}>
      <h4>Camera Test</h4>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "100%", background: "#000" }}
      />
    </div>
  );
}
