import React, { useState, useRef } from "react";
import CanvasDraw from "react-canvas-draw";
import "./App.css";

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [maskImage, setMaskImage] = useState(null);
  const [brushSize, setBrushSize] = useState(5);
  const canvasRef = useRef(null);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.onload = () => setUploadedImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a JPEG or PNG image.");
    }
  };

  // Export the mask image
  const handleExportMask = () => {
    if (canvasRef.current) {
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = canvasRef.current.props.canvasWidth;
      maskCanvas.height = canvasRef.current.props.canvasHeight;
      const ctx = maskCanvas.getContext("2d");

      // Create a black canvas
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

      // Overlay the white mask
      const mask = new Image();
      mask.onload = () => {
        ctx.drawImage(mask, 0, 0);
        const maskImageURL = maskCanvas.toDataURL("image/png");
        setMaskImage(maskImageURL);
      };
      mask.src = canvasRef.current.canvas.drawing.toDataURL();
    }
  };

  // Clear the canvas
  const handleClearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
  };

  // Adjust brush size
  const handleBrushSizeChange = (increment) => {
    setBrushSize((prevSize) => Math.max(1, prevSize + increment));
  };

  return (
    <div className="app">
      <h1>Image Inpainting Widget</h1>
      <input
        type="file"
        accept="image/jpeg, image/png"
        onChange={handleImageUpload}
      />

      {uploadedImage && (
        <div className="canvas-wrapper">
          <CanvasDraw
            ref={canvasRef}
            imgSrc={uploadedImage}
            canvasWidth={500}
            canvasHeight={500}
            brushRadius={brushSize}
            lazyRadius={0}
            hideGrid={true}
          />
        </div>
      )}

      {uploadedImage && (
        <div className="controls">
          <button onClick={handleExportMask}>Export Mask</button>
          <button onClick={handleClearCanvas}>Clear Canvas</button>
          <div className="brush-controls">
            <button onClick={() => handleBrushSizeChange(-1)}>-</button>
            <span>Brush Size: {brushSize}px</span>
            <button onClick={() => handleBrushSizeChange(1)}>+</button>
          </div>
        </div>
      )}

      {maskImage && (
        <div className="result">
          <h2>Result</h2>
          <div className="image-pair">
            <img src={uploadedImage} alt="Original" />
            <img src={maskImage} alt="Mask" />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
