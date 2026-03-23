import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import logo from "../assets/KnowMe-logo.png";

function QRWithLogo({ url }) {
  const qrRef = useRef(null);

  useEffect(() => {
    const qrCode = new QRCodeStyling({
      width: 220,
      height: 220,
      data: url,

      image: logo,

      dotsOptions: {
        color: "#000000",
        type: "rounded",
      },

      cornersSquareOptions: {
        type: "extra-rounded",
      },

      imageOptions: {
        crossOrigin: "anonymous",
        margin: 0, // spacing around logo
        imageSize: 0.35, // 👈 MAX 0.25 (25%)
      },

      qrOptions: {
        errorCorrectionLevel: "H", // VERY IMPORTANT
      },
    });

    qrRef.current.innerHTML = ""; // clear before re-render
    qrCode.append(qrRef.current);

  }, [url]);

  return (
    <div className="flex flex-col items-center">
      <div ref={qrRef} />

      <p className="mt-3 text-sm text-gray-600 text-center">
        Scan to view message
      </p>
    </div>
  );
}

export default QRWithLogo;