import React, { useState } from 'react';
import GenerateImage from './GenerateImage';

const ImagePromptForm = ({ imagePrompts, transcribedSegments }) => {
  const [selectedImage, setSelectedImage] = useState('');

  const handleButtonClick = (image) => {
    setSelectedImage(image);
  };

  return (
    <div>
      <div className='flex flex-wrap flex-row mt-10'>
      {imagePrompts.map((image, index) => (
        
          <div key={index} className='basis-1/3 text-left'>
            <p>{image}</p>
          <button onClick={() => handleButtonClick(image)}>Select</button>
        </div>

      ))}
              </div>

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
