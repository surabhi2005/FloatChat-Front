// import React from 'react';
// import Beams from './Beams';

// const BeamsBackground = ({ 
//     beamWidth = 3,
//     beamHeight = 20,
//     beamNumber = 15,
//     lightColor = "#ffffff",
//     speed = 1.5,
//     noiseIntensity = 0.2,
//     scale = 0.03,
//     rotation = 0
// }) => {
//     return (
//         <div className="beams-background">
//             <Beams
//                 beamWidth={beamWidth}
//                 beamHeight={beamHeight}
//                 beamNumber={beamNumber}
//                 lightColor={lightColor}
//                 speed={speed}
//                 noiseIntensity={noiseIntensity}
//                 scale={scale}
//                 rotation={rotation}
//             />
//         </div>
//     );
// };

// export default BeamsBackground;
// BackgroundBeam.js
import React, { useEffect } from "react";

const BackgroundBeam = () => {
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.id = "beamCanvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "-1";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const beams = Array.from({ length: 5 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 200 + 100,
      speed: Math.random() * 1 + 0.5,
      angle: Math.random() * Math.PI * 2,
      color: `rgba(59, 130, 246, ${Math.random() * 0.3 + 0.2})`,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      beams.forEach((b) => {
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(
          b.x + Math.cos(b.angle) * b.length,
          b.y + Math.sin(b.angle) * b.length
        );
        ctx.strokeStyle = b.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        b.x += Math.cos(b.angle) * b.speed;
        b.y += Math.sin(b.angle) * b.speed;

        if (b.x > width) b.x = 0;
        if (b.x < 0) b.x = width;
        if (b.y > height) b.y = 0;
        if (b.y < 0) b.y = height;
      });
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      document.body.removeChild(canvas);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return null;
};

export default BackgroundBeam;

