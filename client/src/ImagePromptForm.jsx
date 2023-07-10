import React, { useState } from 'react';
import GenerateImage from './GenerateImage';

const ImagePromptForm = ({ imagePrompts, transcribedSegments }) => {

  const [selectedStyle, setSelectedStyle] = useState('');

  const handleStyleSelect = (style) => {
    setSelectedStyle(style);
    console.log('style', selectedStyle)
  };
  
  return (
    <div>
      <div>
      <button onClick={() => handleStyleSelect('v1')}>Style 1</button>
      <button onClick={() => handleStyleSelect('v2')}>Style 2</button>
 
      </div>
      <div className='flex flex-wrap flex-row mt-10'>     
        {imagePrompts.map((image, index) => (
          <div key={index} className='basis-1/3 text-left'>
            <GenerateImage personaName={image} transcribedSegments={transcribedSegments} style={selectedStyle} />
            {/* <p>{image}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagePromptForm;
