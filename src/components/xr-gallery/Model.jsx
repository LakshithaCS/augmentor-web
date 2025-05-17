import React, { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { Suspense } from "react";

export default function Model({ position, modelSrc, audioSrc, setAudio}) {
  const group = useRef();
  const glb = useGLTF(modelSrc);
  const { actions } = useAnimations(glb.animations, group);

  const listener = new THREE.AudioListener();
  const sound = new THREE.Audio(listener);
  const audioLoader = new THREE.AudioLoader();

  React.useEffect(() => {
    group.current.add(listener);

    if (audioSrc != null && audioSrc != undefined && audioSrc.length > 0) {
      audioLoader.load(audioSrc, (buffer) => {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
        setAudio(sound);
      });
    }

    const animationKeys = Object.keys(actions).filter(
      (key) => key.startsWith("animation") || key.startsWith("Animation")
    );

    if (animationKeys != undefined && animationKeys.length > 0) {
      actions[animationKeys[0]].play();
    }
  }, [actions]);

  return (
    <Suspense fallback={null}>
      <primitive position={position} object={glb.scene} ref={group}/>
    </Suspense>
  );
}

// useGLTF.preload("/models/pug.glb");
