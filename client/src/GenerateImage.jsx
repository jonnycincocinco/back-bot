import React, { useState } from 'react';
import axios from 'axios';

const GenerateImage = ({ personaName }) => {
  const [imageUrls, setImageUrls] = useState([]);

  const handleGenerateImage = () => {
    generateStoryImage(personaName)
      .then(imageData => {
        // Handle the generated image data
        console.log(imageData);

        // Access the generated image URLs
        const urls = imageData.output; // Assuming the output is an array of image URLs

        // Add the new image URLs to the existing ones
        setImageUrls(prevUrls => [...prevUrls, ...urls]);
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

  const handleDownloadImage = (imageUrl) => {
    const newTab = window.open(imageUrl, '_blank');
    if (newTab) {
      newTab.focus();
    }
  };

  const handleSelectImage = (imageUrl) => {
    // Handle the selected image
    console.log('Selected image:', imageUrl);
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
          cols="50"
          rows="5"
          type="text"
          value={personaName}
          onChange={handleChange}
          placeholder="Enter image prompt"
        />
        <button type="submit">Generate Images</button>
      </form>
      {imageUrls.length > 0 && (
        <div>
          <h2>Generated Images:</h2>
          {imageUrls.map((imageUrl, index) => (
            <div key={index} className='generated-image'>
              <img src={imageUrl} alt="Generated Story" />
              <div>
                <button onClick={() => handleDownloadImage(imageUrl)}>Download Image</button>
                <label>
                  <input
                    type="checkbox"
                    onChange={() => handleSelectImage(imageUrl)}
                  />
                  Select Image
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenerateImage;
