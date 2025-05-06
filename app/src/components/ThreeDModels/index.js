// 3D Models Component
// Renders interactive 3D anatomical models for exercise visualization

import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import MDBox from 'components/MDBox';

const ThreeDModels = ({ modelData }) => {
  const canvasRef = useRef();

  useEffect(() => {
    // Perform any necessary setup or cleanup for the 3D canvas
    return () => {
      // Cleanup logic if needed
    };
  }, []);

  return (
    <MDBox>
      <Canvas ref={canvasRef}>
        <OrbitControls />
        {/* Render the 3D model using the provided modelData */}
        {modelData}
      </Canvas>
    </MDBox>
  );
};

export default ThreeDModels;
