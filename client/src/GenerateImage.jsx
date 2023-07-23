import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GenerateImage = ({ personaName, transcribedSegmentsData, style, selectedImages, handleSelectImage }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [videoUrls, setVideoUrls] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleGenerateImage = () => {
    generateStoryImage(personaName, style)
      .then((imageData) => {
        const urls = imageData.output;
        setImageUrls((prevUrls) => [...prevUrls, ...urls]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const generateStoryImage = async (personaName, style) => {
    try {
      const response = await axios.post(`/generate-story-image-${style}`, { personaName });
      // console.log(personaName);
      return response.data;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  };
  
  const handleGenerateVideo = () => {
    axios
      .post(`/generate-video`, { prompt: personaName })
      .then((response) => {
        // Assuming the video URL is provided in the response data as a property named "video_url"
        const videoUrl = response.data;
        setVideoUrls((prevUrls) => [...prevUrls, videoUrl]);
        console.log('Video generated:', videoUrl);
      })
      .catch((error) => {
        console.error('Error generating video:', error);
      });
  };

  
  const handleDownloadImage = (imageUrl) => {
    const newTab = window.open(imageUrl, '_blank');
    if (newTab) {
      newTab.focus();
    }
  };
  

  const handleCreateJsonFile = () => {
    // ...
    // Create the JSON content
    const jsonContent = JSON.stringify(jsonData, null, 2);
  
    // Call setGeneratedJson to update the state in ImagePromptForm
    setGeneratedJson(jsonContent);
    // ...
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    handleGenerateImage();
  };

 const handleSubmitVideo = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    handleGenerateVideo(personaName); // Call handleGenerateVideo with the current value of personaName
  };

  const handleChange = (e) => {
    setPersonaName(e.target.value);
  };

  useEffect(() => {
    if (style) {
      handleGenerateImage();
    }
  }, [style]);

  return (
    <div className='flex flex-col'>
      <form onSubmit={handleSubmit}>
        <textarea
          cols='32'
          rows='7'
          type='text'
          value={personaName}
          onChange={handleChange}
          placeholder='Enter image prompt'
        />
        <button className='main-button' type='submit'>Generate Images</button>

      </form>
      <form onSubmit={handleSubmitVideo}>
        <textarea
          cols='0'
          rows='0'
          type='text'
          value={personaName}
          onChange={handleChange}
          placeholder='Enter image prompt'
        />
        <button className='main-button' type='submit'>Generate Video</button>
      </form>


      {imageUrls.length > 0 && (
        <div className='mb-20'>
          <h2>Generated Images:</h2>
          {imageUrls.map((imageUrl, index) => (
            <div key={index} className='generated-image'>
              <img src={imageUrl} alt='Generated Story' />
              
              <div>
                <button onClick={() => handleDownloadImage(imageUrl)}>Download Image</button>
                <label>
                  <input type='checkbox' onChange={() => handleSelectImage(imageUrl)} />
                  Select Image
                </label>
              </div>
            </div>
          ))}
          
        </div>
      )}
      {videoUrls.map((videoUrl, index) => (
            <div key={index} className='generated-video'>
              <video controls>
                <source src={videoUrl} type='video/mp4' />
              </video>
              <div>
                <a href={videoUrl} download>Download Video</a>
              </div>
            </div>
          ))}
    </div>
  );
};

export default GenerateImage;
