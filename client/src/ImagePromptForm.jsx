import React, { useState } from 'react';
import GenerateImage from './GenerateImage';

const ImagePromptForm = ({ imagePrompts, transcribedSegments }) => {
  return (
    <div>
      <div className='flex flex-wrap flex-row mt-10'>
        {imagePrompts.map((image, index) => (
          <div key={index} className='basis-1/3 text-left'>
            <GenerateImage personaName={image} transcribedSegments={transcribedSegments} />
            {/* <p>{image}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagePromptForm;
