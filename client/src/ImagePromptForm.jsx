import React, { useState } from 'react';
import GenerateImage from './GenerateImage'; // Import the GenerateImage component

const ImagePromptForm = ({ imagePrompts }) => {
  const [selectedImage, setSelectedImage] = useState('');

  const handleButtonClick = (image) => {
    setSelectedImage(image);
  };

  return (
    <div>
      {imagePrompts.map((image, index) => (
        <div key={index} className='mt-10'>
          <p>{image}</p>
          <button onClick={() => handleButtonClick(image)}>Select</button>
        </div>
      ))}

      {selectedImage && (
        <div className='mt-10'>
          <h2>Selected Image Prompt:</h2>
          <p>{selectedImage}</p>
          {/* Render the GenerateImage component with the selectedImage as personaName */}
          <GenerateImage personaName={selectedImage} />
        </div>
      )}
    </div>
  );
};

export default ImagePromptForm;
