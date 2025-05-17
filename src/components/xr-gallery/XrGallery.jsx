import { OrbitControls } from "@react-three/drei";
import { useThree, useLoader } from "@react-three/fiber";
import { Interactive, useHitTest, useXR } from "@react-three/xr";
import { Fragment, useRef, useState, useEffect } from "react";
import Model from "./Model";
import { getModelUrl, getDownloadURLFromStorage } from "../Firebase";
import * as THREE from "three";

const categoryMap = {
  a1B2c3D4: "Animals",
  E5f6G7h8: "Astronautics",
  i9J0kLmN: "Cars",
  OpQrStUv: "Furniture",
  WxYz1234: "Housing",
  "5678AbCd": "Interiors",
  EfGhIjKl: "Vesak",
  Xlsk5TsL: "Robots",
};

const XrOverlay = ({ category, modelid, setProgress }) => {
  const reticleRef = useRef();
  const [models, setModels] = useState([]);
  const [isModelPlaced, setIsModelPlaced] = useState(false);
  const [modelUrl, setModelUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [audio, setAudio] = useState(null);
  let downloadProgress = 10;

  const { isPresenting } = useXR();

  const texture = useLoader(THREE.TextureLoader, "/reticle-min.png");

  var calculateDownloadProgress = function (fileSize, speed) {
    if (!fileSize || !speed || speed <= 0) {
      console.error("Invalid file size or speed");
      return;
    }

    const totalSeconds = fileSize / speed;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed++;
      downloadProgress = Math.min((elapsed / totalSeconds) * 100, 100);
      setProgress(downloadProgress);

      if (downloadProgress >= 100) {
        clearInterval(interval);
        setProgress(100);
      }
    }, 500);
  };

  useEffect(() => {
    let nodeUrl = "Models/" + categoryMap[category] + "/-" + modelid;
    getModelUrl(nodeUrl).then((data) => {

      const modelUrl = data.modelUrl;
      const audioUrl = data.audioUrl;

      setModelUrl(modelUrl);
      setAudioUrl(audioUrl);

      fetch(modelUrl, { method: "HEAD" }).then((response) => {
        if (!response.ok) throw new Error("HEAD request failed");
        const size = response.headers.get("Content-Length");
        calculateDownloadProgress(size, 500000);
      });
    });
  }, []);

  useThree(({ camera }) => {
    if (!isPresenting) {
      camera.position.z = 3;
    }
  });

  useHitTest((hitMatrix, hit) => {
    if (isModelPlaced) return;

    hitMatrix.decompose(
      reticleRef.current.position,
      reticleRef.current.quaternion,
      reticleRef.current.scale
    );

    reticleRef.current.rotation.set(-Math.PI / 2, 0, 0);
  });

  const placeModel = (e) => {
    if (isModelPlaced) return;

    // play audio
    if (audio != null) {
      audio.play();
    }

    let position = e.intersection.object.position.clone();
    let id = Date.now();
    setModels([{ position, id }]);
    setIsModelPlaced(true);
  };

  return (
    <>
      <OrbitControls />
      <ambientLight />
      {isPresenting &&
        models.map(({ position, id }) => {
          return (
            <Fragment key={id}>
              {modelUrl.length > 0 && (
                <Model position={position} modelSrc={modelUrl} audioSrc={audioUrl} setAudio={setAudio} />
              )}
            </Fragment>
          );
        })}
      {isPresenting && (
        <Interactive onSelect={placeModel}>
          <mesh ref={reticleRef} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[0.1, 0.2, 32]} />
            <meshStandardMaterial color={"#6495ED"} />
            {/* <planeGeometry args={[0.5, 0.5]} />
            <meshBasicMaterial
              map={texture}
              transparent={true}
              toneMapped={false} // Optional, avoids unexpected darkening
            /> */}
          </mesh>
        </Interactive>
      )}
      {modelUrl.length > 0 && !isPresenting && (
        <Model modelSrc={modelUrl} audioSrc={audioUrl} setAudio={setAudio} />
      )}
    </>
  );
};

export default XrOverlay;
