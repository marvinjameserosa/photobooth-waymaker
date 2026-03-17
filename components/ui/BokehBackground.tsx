"use client";
import React from 'react';

interface BokehBackgroundProps {
  className?: string;
}

/**
 * BokehBackground component creates the blurred light effect circles
 * seen in the Arduino Day Philippines website design
 */
const BokehBackground: React.FC<BokehBackgroundProps> = ({ className = '' }) => {
  return (
    <div className={`bokeh-container ${className}`}>
      {/* Orange/Gold bokeh circles */}
      <div className="bokeh-circle bokeh-circle-1" />
      <div className="bokeh-circle bokeh-circle-2" />
      <div className="bokeh-circle bokeh-circle-3" />
      <div className="bokeh-circle bokeh-circle-4" />
      {/* Teal accent bokeh */}
      <div className="bokeh-circle bokeh-circle-5" />
      
      {/* Gradient overlay for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(13, 27, 42, 0.4) 100%)',
        }}
      />
    </div>
  );
};

export default BokehBackground;
