import { Canvas } from "@react-three/fiber";
import { ARButton, XR } from "@react-three/xr";
import { useCallback, useState, useEffect, useRef, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import XrGallery from "./XrGallery";
import Interface from "./Interface";
import PageOverlayProgressBar from "../PageOverlayProgressBar";
import { isAndroid, isIOS, isDesktop } from "react-device-detect";
import { Alert, Button, Popover } from "antd";
import { QRCodeCanvas } from "qrcode.react";
import { generateLaunchUrl } from "../IOSUrlGenerator";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const XrGalleryContainer = () => {
  const [overlayContent, setOverlayContent] = useState(null);
  const { category, modelid } = useParams();
  const divRef = useRef();
  const [deviceType, setDeviceType] = useState("");
  const [progress, setProgress] = useState(0);
  const [appAvailable, setAppAvailable] = useState(null);
  let query = useQuery();

  let params = query.get("p");
  let topbar = params && params.charAt(0) === "b";
  let redirect =
    params && (params.charAt(1) === "r" || params.charAt(0) === "r");

  const androidAppScheme =
    "intent://send?text=Hello#Intent;scheme=whatsapp;package=com.whatsapp;end"; // Deep link
  const androidplayStoreUrl =
    "https://play.google.com/store/apps/details?id=com.rv.augmentor";

  const iosAppScheme =
    "intent://send?text=Hello#Intent;scheme=whatsapp;package=com.whatsapp;end"; // Deep link
  const iosAppStoreUrl =
    "https://play.google.com/store/apps/details?id=com.rv.augmentor";

  let interfaceRef = useCallback((node) => {
    if (node !== null) {
      setOverlayContent(node);
    }
  });

  useEffect(() => {
    if (isAndroid) {
      setDeviceType("Android");
    } else if (isIOS) {
      setDeviceType("iOS");

      // if (!redirect) {
      //   // redirect
      //   const launchUrl = generateLaunchUrl(window.location.href);
      //   window.location.href = launchUrl;
      // }
    }
  }, []);

  var getAndroidMessage = function () {
    if (appAvailable === null) {
      return <p>🔍 Checking app availability...</p>;
    } else if (appAvailable === true) {
      return (
        <a href={androidAppScheme} style={{ color: "green" }}>
          ✅ Open WhatsApp here
        </a>
      );
    } else if (appAvailable === false)
      return (
        <a href={androidplayStoreUrl} style={{ color: "red" }}>
          ❌ WhatsApp not installed. Download here
        </a>
      );
  };

  var getIOSdMessage = function () {
    if (appAvailable === null) {
      return <p>🔍 Checking app availability...</p>;
    } else if (appAvailable === true) {
      return (
        <a href={iosAppScheme} style={{ color: "green" }}>
          ✅ Open WhatsApp here
        </a>
      );
    } else if (appAvailable === false)
      return (
        <a href={iosAppStoreUrl} style={{ color: "red" }}>
          ❌ WhatsApp not installed. Download here
        </a>
      );
  };

  const qrCodeSize = window.innerWidth < 768 ? 150 : 200;

  return (
    <>
      {progress >= 100 && topbar && (
        <div className="container-fluid bg-dark text-light py-2">
          <div className="row w-100">
            <div className="col-12 col-md-10" >
              <div className="row d-flex" >
                <div className="col-12 col-lg-5 col-md-7 d-flex align-items-center">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    style={{
                      height: "50px",
                      width: "50px",
                      marginRight: "10px"
                    }}
                  />
                  <span
                    style={{
                      fontWeight: 400,
                      fontSize: "40px",
                      fontFamily: "'Rampart One', sans-serif"
                    }}
                  >
                    AugmentoR
                  </span>
                </div>
                <div className="d-none d-md-flex col-lg-7 col-md-12 p-3">
                  For the ultimate AR experience, download the AugmentoR app
                  now!
                </div>
              </div>
            </div>

            <div className="d-none d-md-flex col-md-2 align-items-center justify-content-end">
              <Popover
                content={
                  <div style={{ textAlign: "center" }}>
                    <QRCodeCanvas
                      value="https://play.google.com/store/apps/details?id=com.rv.augmentor"
                      size={qrCodeSize}
                    />
                  </div>
                }
                title="Android App"
                trigger="hover"
                placement="bottom"
                overlayStyle={{ maxWidth: "90vw" }}
              >
                <Button
                  className="me-2 p-0 border-0"
                  type="text"
                  style={{ width: "auto" }}
                >
                  <img
                    src="/buttons/play-store-3.png"
                    alt="Download Android"
                    className="img-fluid"
                    style={{ maxWidth: "100%", height: "55px" }}
                  />
                </Button>
              </Popover>
            </div>
          </div>
        </div>
      )}

      {progress >= 100 && (
        <ARButton
          className="ar-button"
          sessionInit={{
            requiredFeatures: ["hit-test"],
            optionalFeatures: ["dom-overlay"],
            domOverlay: { root: overlayContent },
          }}
        />
      )}
      <Canvas ref={divRef} style={{maxHeight:"90vh"}}>
        <XR>
          <XrGallery
            category={category}
            modelid={modelid}
            setProgress={setProgress}
          />
        </XR>
      </Canvas>
      <Interface ref={interfaceRef} />
      {progress < 100 && (
        <PageOverlayProgressBar progress={Math.trunc(progress)} />
      )}
    </>
  );
};

export default XrGalleryContainer;
