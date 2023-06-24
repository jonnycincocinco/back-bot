import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GenerateImage = () => {
  const [personaName, setPersonaName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    handleGenerateImage();
  }, []);

  const handleGenerateImage = () => {
    generateStoryImage(personaName)
      .then(imageData => {
        // Handle the generated image data
        console.log(imageData);

        // Access the generated image URL
        const imageUrl = imageData.output[0]; // Assuming there is only one image URL in the output array

        // Store the image URL in your persona object or variable
        const persona = {
          name: personaName,
          imageUrl: imageUrl,
          // Other persona properties
        };

        // Use the persona object or variable later in your code
        console.log('img', persona.imageUrl); // Example usage

        // Set the imageUrl state variable
        setImageUrl(imageUrl);
      })
      .catch(error => {
        // Handle the error
        console.error(error);
      });
  };

  const generateStoryImage = async personaName => {
    try {
      const response = await axios.post('/generate-story-image', { personaName });
      return response.data;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  };

  const handleDownloadImage = () => {
    const newTab = window.open(imageUrl, '_blank');
    if (newTab) {
      newTab.focus();
    }
  };  

  const handleSubmit = e => {
    e.preventDefault();
    handleGenerateImage();
  };

  const handleChange = e => {
    setPersonaName(e.target.value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
        cols="50" rows="5"
        type="text"
          value={personaName}
          onChange={handleChange}
          placeholder="Enter persona name"
        />
        <button type="submit">Generate Image</button>
      </form>
      {imageUrl && (
        <div>
          <img src={imageUrl} alt="Generated Story" />
          <button onClick={handleDownloadImage}>Download Image</button>
        </div>
      )}
    </div>
  );
};

export default GenerateImage;
