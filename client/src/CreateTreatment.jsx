import React, { useState, useEffect } from 'react';
import ImagePromptForm from './ImagePromptForm';

const CreateTreatment = ({ personaStoryPrompt }) => {
  const [scriptData, setScriptData] = useState('');
  const [imagePrompts, setImagePrompts] = useState([]);
  const [selectedImages, handleSelectImage] = useState([]);


  useEffect(() => {
    generateScript();
  }, []);

  const generateScript = async () => {
    try {
      // Create script
      const response = await fetch('https://localhost:8000/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ personaStoryPrompt }),
      });

      const data = await response.json();
      console.log(personaStoryPrompt);
      console.log('story', data.story);

      if (!data.story) {
        console.error('Invalid sentence data:', data);
        return;
      }

      const sentences = data.story.split('.').map(sentence => sentence.trim());
      const imagePrompts = sentences.map(sentence => sentence.replace('Image Prompt:', '').trim());
  
      // Set image prompts state
      setImagePrompts(imagePrompts);

      // Set script data state
      setScriptData(data.story);
    } catch (error) {
      console.error('Error generating story:', error);
    }
  };

  const handleSelectedImages = (selectedImages) => {
    console.log('selected', selectedImages);
  };

  return (
    <div>
      <div className='create-avatar'>
        <p className='white text-left'></p>
      </div>
      <div className='mt-10 text-left' id='output'>
        {scriptData}
      </div>
      {imagePrompts.length > 0 && (
        <div className='mt-10'>
          <h2>Image Prompts</h2>
          <button onClick={() => handleSelectedImages(selectedImages)}>Log Selected Images</button>

          <ImagePromptForm 
            imagePrompts={imagePrompts} 
            selectedImages={selectedImages}
            handleSelectImage={handleSelectImage}
          />
        </div>
      )}
    </div>
  );
};

export default CreateTreatment;
