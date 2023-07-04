import React, { useState } from 'react';
import GenerateImage from './GenerateImage';

const ImagePromptForm = ({ imagePrompts, transcribedSegments }) => {
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
          <GenerateImage personaName={selectedImage} />
        </div>
      )}
    </div>
  );
};

export default ImagePromptForm;
