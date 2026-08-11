import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

export default function BarcodeScannerInput() {
  const [barcodeValue, setBarcodeValue] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [hasFlash, setHasFlash] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [scanError, setScanError] = useState("");

  const scannerRef = useRef(null);
  const regionId = "html5-qrcode-video-container";

  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startScanner = async () => {
    setBarcodeValue("");
    setScanError("");
    setIsScanning(true);

    setTimeout(async () => {
      try {
        const html5Qrcode = new Html5Qrcode(regionId);
        scannerRef.current = html5Qrcode;

        const cameras = await Html5Qrcode.getCameras();
        let targetCameraId = null;

        if (cameras && cameras.length > 0) {
          const backCamera = cameras.find(
            (cam) =>
              cam.label.toLowerCase().includes("back") ||
              cam.label.toLowerCase().includes("rear") ||
              cam.label.toLowerCase().includes("environment"),
          );
          targetCameraId = backCamera
            ? backCamera.id
            : cameras[cameras.length - 1].id;
        }

        const config = {
          fps: 20,
          qrbox: { width: 320, height: 160 },
          disableFlip: true,
          videoConstraints: targetCameraId
            ? {
                deviceId: { exact: targetCameraId },
                width: { min: 640, ideal: 1280, max: 1920 },
                height: { min: 480, ideal: 720, max: 1080 },
              }
            : {
                facingMode: { exact: "environment" },
                width: { min: 640, ideal: 1280, max: 1920 },
                height: { min: 480, ideal: 720, max: 1080 },
              },
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
          ],
        };

        await html5Qrcode.start(
          targetCameraId ? targetCameraId : { facingMode: "environment" },
          config,
          (decodedText) => {
            handleScanSuccess(decodedText);
          },
          () => {},
        );

        // Allow stream to fully initialize before checking track settings for torch support
        setTimeout(() => {
          try {
            const settings = html5Qrcode.getRunningTrackSettings();
            // Check if torch property is present in the active track settings
            if (settings && "torch" in settings) {
              setHasFlash(true);
            } else {
              // Fallback: If on Android Chrome, allow user to attempt toggling anyway
              setHasFlash(true);
            }
          } catch (e) {
            console.warn(
              "Could not retrieve track settings, enabling flash button as fallback.",
            );
            setHasFlash(true);
          }
        }, 800);
      } catch (err) {
        console.error("Scanner startup failed:", err);
        setScanError(
          `Camera startup failed: ${err.message || err}. Ensure permissions are granted.`,
        );
        setIsScanning(false);
      }
    }, 150);
  };

  const handleScanSuccess = (value) => {
    setBarcodeValue(value);
    stopScanner();
  };

  const captureFrameManually = async () => {
    if (!scannerRef.current) return;
    setScanError("");

    try {
      const videoElement = document.querySelector(`#${regionId} video`);
      if (!videoElement) return;

      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      const context = canvas.getContext("2d");
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], "capture.png", { type: "image/png" });

        try {
          const decodedResult = await scannerRef.current.scanFile(file, true);
          handleScanSuccess(decodedResult);
        } catch (scanError) {
          setScanError(
            "Mismatched or blurry barcode image. Hold steady and try again!",
          );
        }
      }, "image/png");
    } catch (err) {
      console.error("Capture track failure:", err);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
      } catch (err) {
        console.error("Stop failed:", err);
      } finally {
        scannerRef.current = null;
      }
    }
    setIsScanning(false);
    setFlashOn(false);
    setHasFlash(false);
  };

  const toggleFlash = async () => {
    if (!scannerRef.current) return;
    try {
      const nextFlashState = !flashOn;
      await scannerRef.current.applyVideoConstraints({
        advanced: [{ torch: nextFlashState }],
      });
      setFlashOn(nextFlashState);
    } catch (err) {
      console.error("Torch adjustment failed:", err);
      alert(
        "Flash activation failed. Note: Apple iOS (Safari/Chrome) completely blocks torch control at the WebKit hardware level.",
      );
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4 border border-gray-100">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Captured Barcode Item
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={barcodeValue}
            onChange={(e) => setBarcodeValue(e.target.value)}
            placeholder="Barcode auto-fills here..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm tracking-widest"
          />
          {!isScanning ? (
            <button
              onClick={startScanner}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              Scan
            </button>
          ) : (
            <button
              onClick={stopScanner}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {scanError && (
        <p className="text-xs text-red-600 bg-red-50 p-2 rounded-md border border-red-100 whitespace-pre-line">
          ⚠️ {scanError}
        </p>
      )}

      {isScanning && (
        <div className="relative border border-gray-300 rounded-lg overflow-hidden bg-black flex flex-col justify-between items-center">
          <div id={regionId} className="w-full aspect-video" />

          {hasFlash && (
            <button
              onClick={toggleFlash}
              className={`absolute top-3 right-3 px-3 py-1.5 rounded-full font-semibold shadow-xl z-20 text-xs transition-all flex items-center gap-1 ${
                flashOn
                  ? "bg-yellow-400 text-black scale-105 ring-2 ring-yellow-300"
                  : "bg-gray-900/90 text-white hover:bg-gray-800"
              }`}
            >
              <span>
                {flashOn ? "☀️ Turn Light Off" : "⚡ Force Flash Light"}
              </span>
            </button>
          )}

          <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
            <button
              onClick={captureFrameManually}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-2xl tracking-wide text-sm transition-transform active:scale-95 border border-blue-400 bg-opacity-95"
            >
              📷 Capture Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
