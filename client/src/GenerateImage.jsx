import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';

const GenerateImage = ({ personaName, transcribedSegmentsData }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

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
    // Check if the image is already selected
    const isSelected = selectedImages && selectedImages.includes(imageUrl);
    console.log('selected')
  
    if (isSelected) {
      // Image is already selected, remove it from the selected images
      setSelectedImages(prevSelected => prevSelected.filter(url => url !== imageUrl));
    } else {
      // Image is not selected, add it to the selected images
      setSelectedImages(prevSelected => [...prevSelected, imageUrl]);
    }
  };
  

  const handleCreateJsonFile = () => {
    const jsonData = {
      selectedImages: selectedImages.map((imageUrl, index) => ({
        type: 'video',
        layerName: `additional_media${index + 1}`,
        composition: `additional_media${index + 1}`,
        src: [imageUrl]
      }))
    };

    const jsonContent = JSON.stringify(jsonData, null, 2);

    // Create a blob object from the JSON content
    const blob = new Blob([jsonContent], { type: 'application/json' });

    // Generate a temporary URL for the blob object
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element to download the file
    const link = document.createElement('a');
    link.href = url;
    link.download = 'selected_images.json';
    link.click();

    // Release the temporary URL resource
    URL.revokeObjectURL(url);
  };

  const handleSubmit = e => {
    e.preventDefault();
    handleGenerateImage();
  };

  const handleChange = e => {
    setPersonaName(e.target.value);
  };

  return (
    
    <div className='flex flex-col'>
      <form onSubmit={handleSubmit}>
        <textarea
          cols="32"
          rows="7"
          type="text"
          value={personaName}
          onChange={handleChange}
          placeholder="Enter image prompt"
        />
        <button type="submit">Generate Images</button>
      </form>
      {imageUrls.length > 0 && (
        <div className='mb-20'>
          <h2>Generated Images:</h2>
          <div>
            {/* <button onClick={handleCreateJsonFile}>Create Images JSON File</button> */}
          </div>
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
