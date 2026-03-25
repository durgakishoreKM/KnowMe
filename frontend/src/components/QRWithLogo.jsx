import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import QRCodeStyling from "qr-code-styling";
import logo from "../assets/KnowMe-logo.png";

const QRWithLogo = forwardRef(({ url }, ref) => {
  const qrRef = useRef(null);
  const qrCode = useRef(null);

  useEffect(() => {
    qrCode.current = new QRCodeStyling({
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
        margin: 0,
        imageSize: 0.35,
      },
      qrOptions: {
        errorCorrectionLevel: "H",
      },
    });

    qrRef.current.innerHTML = "";
    qrCode.current.append(qrRef.current);
  }, [url]);

  // expose download method to parent
  useImperativeHandle(ref, () => ({
    getRawData: async (ext = "png") => {
      return await qrCode.current?.getRawData(ext);
    },
  }));

  return (
    <div className="flex flex-col items-center">
      <div ref={qrRef} />
      <p className="mt-3 text-sm text-gray-600 text-center">
        Scan to view message
      </p>
    </div>
  );
});

export default QRWithLogo;