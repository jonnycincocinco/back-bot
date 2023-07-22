import React, { useState } from 'react';
import GenerateImage from './GenerateImage';
import StyleImage1 from './assets/StyleImage1.png';
import StyleImage2 from './assets/StyleImage2.png';
import StyleImage3 from './assets/StyleImage3.png';

const ImagePromptForm = ({ imagePrompts, transcribedSegments }) => {
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);

  const handleStyleSelect = (style) => {
    setSelectedStyle(style);
  };

  const handleSelectImage = (imageUrl) => {
    const isSelected = selectedImages.includes(imageUrl);
    if (isSelected) {
      setSelectedImages((prevSelected) => prevSelected.filter((url) => url !== imageUrl));
    } else {
      setSelectedImages((prevSelected) => [...prevSelected, imageUrl]);
    }
  };

  const handleCreateJsonFile = () => {
    const jsonData = {
      selectedImages: selectedImages.map((imageUrl, index) => ({
        type: 'video',
        layerName: `additional_media${index + 1}`,
        composition: `additional_media${index + 1}`,
        src: [imageUrl],
      })),
    };

    const jsonContent = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'selected_images.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div>
        <div className='flex flex-wrap flex-row mt-10'>
          <div className='basis-1/3 text-left'>
            <img className='mb-2' src={StyleImage1} alt='Generated Story' />
            <button className='main-button' onClick={() => handleStyleSelect('v1')}>Style 1</button>
          </div>
          <div className='basis-1/3 text-left'>
            <img className='mb-2' src={StyleImage2} alt='Generated Story' />
            <button className='main-button' onClick={() => handleStyleSelect('v2')}>Style 2</button>
          </div>
          <div className='basis-1/3 text-left'>
            <img className='mb-2' src={StyleImage3} alt='Generated Story' />
            <button className='main-button' onClick={() => handleStyleSelect('v3')}>Style 3</button>
          </div>
        </div>
      </div>
      <div className='flex flex-wrap flex-row mt-10'>
        {imagePrompts.map((image, index) => (
          <div key={index} className='basis-1/3 text-left'>
            <GenerateImage
              personaName={image}
              transcribedSegments={transcribedSegments}
              style={selectedStyle}
              selectedImages={selectedImages}
              handleSelectImage={handleSelectImage}
            />
            {/* <p>{image}</p> */}
          </div>
        ))}
      </div>
      {selectedImages.length > 0 && (
        <div className='mt-10'>
          <button className='main-button' onClick={handleCreateJsonFile}>Create Images JSON File</button>
        </div>
      )}
    </div>
  );
};

export default ImagePromptForm;
