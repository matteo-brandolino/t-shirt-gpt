"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import { Vector3 } from "three";
import TShirt from "./canvas/Shirt_baked";
import { useContext, useRef } from "react";
import { easing } from "maath";
import type { ThreeElements } from "@react-three/fiber";
import { TshirtContextType } from "@/types/ThishirtContextType";
import { TshirtContext } from "@/app/context/ThshirtContext";
import CustomLoader from "./Loader";

type CameraRigProps = ThreeElements["group"];
const CameraRig = ({ children }: CameraRigProps) => {
  const group = useRef<THREE.Group>(null!);
  // const snap = useSnapshot(state);
  useFrame((state, delta) => {
    const isBreakpoint = window.innerWidth <= 1100;
    const isMobile = window.innerWidth <= 700;

    // set the initial position of the model
    let targetPosition = [0, -0.05, 2];

    // if (isBreakpoint) targetPosition = [0, 0, 2];
    // if (isMobile) targetPosition = [0, 0.2, 2.5];

    easing.damp3(
      state.camera.position,
      new Vector3(...targetPosition),
      0.25,
      delta
    );

    // set the model rotation smoothly
    easing.dampE(
      group.current?.rotation,
      [-state.pointer.y / 5, state.pointer.x / 2, 0],
      0.25,
      delta
    );
  });

  return <group ref={group}>{children}</group>;
};

//TODO
// - error TypeError: a is not a function
//     at __webpack_require__ (/home/matteob/t-shirt-gpt/client/.next/server/webpack-runtime.js:33:43)
//     at eval (./components/Tshirt3D.tsx:8:75)
//     at (sc_client)/./components/Tshirt3D.tsx (/home/matteob/t-shirt-gpt/client/.next/server/app/page.js:4082:1)
//     at __webpack_require__ (/home/matteob/t-shirt-gpt/client/.next/server/webpack-runtime.js:33:43)
// null
export default function TShirt3D() {
  const { settings } = useContext(TshirtContext) as TshirtContextType;

  return (
    <div className="h-4/6">
      {settings.image.isLoading ? (
        <CustomLoader />
      ) : (
        <Canvas
          className="h-full w-full"
          shadows
          camera={{ position: [0, 0, 0], fov: 25 }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <CameraRig>
            <Center>
              <TShirt />
            </Center>
          </CameraRig>
          <ambientLight intensity={1} />
        </Canvas>
      )}
    </div>
  );
}
