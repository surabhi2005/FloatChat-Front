import React from 'react';
import Beams from './Beams';

const BeamsBackground = ({ 
    beamWidth = 3,
    beamHeight = 20,
    beamNumber = 15,
    lightColor = "#ffffff",
    speed = 1.5,
    noiseIntensity = 0.2,
    scale = 0.03,
    rotation = 0
}) => {
    return (
        <div className="beams-background">
            <Beams
                beamWidth={beamWidth}
                beamHeight={beamHeight}
                beamNumber={beamNumber}
                lightColor={lightColor}
                speed={speed}
                noiseIntensity={noiseIntensity}
                scale={scale}
                rotation={rotation}
            />
        </div>
    );
};

export default BeamsBackground;
