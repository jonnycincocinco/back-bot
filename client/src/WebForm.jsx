import React, { useState } from 'react';

const WebForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [sentences, setSentences] = useState([]);
  const [specialVideoFile, setSpecialVideoFile] = useState(null);

  const handleButtonClicked = () => {
    setShowForm(true);
    fetchData();
  };
  const handleFormSubmit = (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.target);
  
    const jsonOutput = [];
  
    const specialFileInput = document.getElementById('specialVideoInput').files[0];
    const specialIsVideo = specialFileInput && specialFileInput.type.includes('video');
  
    if (specialFileInput) {
      const specialMediaData = {
        type: specialIsVideo ? 'video' : 'image',
        layerName: 'media_special',
        src: `file:///Users/jonathanlarson/sites/back-bot/ae/elements/_V0/${specialFileInput.name}`
      };
  
      jsonOutput.push(specialMediaData);
    }
  
    sentences.forEach((sentenceObj, index) => {
      const fileInput = formData.get(`media_${index}`);
      const isVideo = fileInput && fileInput.type.includes('video');
      const isImage = fileInput && fileInput.type.includes('image');
  
      const textData = {
        type: 'data',
        layerName: `text${index + 1}`,
        property: 'Source Text',
        value: sentenceObj.sentence
      };
  
      jsonOutput.push(textData);
  
      if (isVideo) {
        const mediaData = {
          type: 'video',
          layerName: `media${index + 1}`,
          src: `file:///Users/jonathanlarson/sites/back-bot/ae/elements/_V0/${fileInput.name}`
        };
  
        jsonOutput.push(mediaData);
      } else if (isImage) {
        const mediaData = {
          type: 'image',
          layerName: `media${index + 1}`,
          src: `file:///Users/jonathanlarson/sites/back-bot/ae/elements/_V0/${fileInput.name}`
        };
  
        jsonOutput.push(mediaData);
      }
  
      const additionalFileInput = formData.get(`additional_media_${index}`);
      const isAdditionalVideo = additionalFileInput && additionalFileInput.type.includes('video');
      const isAdditionalImage = additionalFileInput && additionalFileInput.type.includes('image');
  
      if (isAdditionalVideo || isAdditionalImage) {
        const additionalMediaType = isAdditionalVideo ? 'video' : 'image';
  
        const additionalMediaData = {
          type: additionalMediaType,
          layerName: `additional_media${index + 1}`,
          src: `file:///Users/jonathanlarson/sites/back-bot/ae/elements/_V0/${additionalFileInput.name}`
        };
  
        jsonOutput.push(additionalMediaData);
      } else {
        const mediaData = {
          type: 'video',
          layerName: `additional_media${index + 1}`,
          src: ''
        };
  
        jsonOutput.push(mediaData);
      }
    });
  
    const jsonData = JSON.stringify(jsonOutput, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  

  const handleFileInputChange = (event, index) => {
    const file = event.target.files[0];
    if (index === -1) {
      setSpecialVideoFile(file);
    } else {
      console.log(`File ${index + 1} selected:`, file);
    }
  };

  const handleAdditionalMediaInputChange = (event, index) => {
    const file = event.target.files[0];
    console.log(`Additional Media ${index + 1} selected:`, file);
    // Handle the selected file as per your requirements
  };
  

  const fetchData = () => {
    fetch('/src/assets/sentences.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch JSON data');
        }
        return response.json();
      })
      .then((data) => {
        setSentences(data);
      })
      .catch((error) => {
        console.error('Error fetching JSON data:', error);
      });
  };

  return (
    <div>
      {!showForm && (
        <button className="cta text-fancy-rg inline-flex items-center px-6 py-4 mt-8 font-semibold text-white transition-all duration-200 bg-pink-300 hover:bg-pink-400 focus:bg-pink-400" onClick={handleButtonClicked}>Create Form</button>
      )}

      {showForm && (
        <form onSubmit={handleFormSubmit}>
          {sentences.map((sentenceObj, index) => (
  <div className="mb-10" key={index}>
    <p>{sentenceObj.sentence}</p>
    <input
      type="file"
      name={`media_${index}`}
      onChange={(event) => {
        handleFileInputChange(event, index);
      }}
    />
    <input
  type="file"
  name={`additional_media_${index}`}
  onChange={(event) => {
    handleAdditionalMediaInputChange(event, index);
  }}
/>


  </div>
))}


          <div>
            <p>Avatar video file:</p>
            <input
              type="file"
              id="specialVideoInput"
              onChange={(event) => handleFileInputChange(event, -1)}
            />
          </div>

          <button className="cta text-fancy-rg inline-flex items-center px-6 py-4 mt-8 font-semibold text-white transition-all duration-200 bg-pink-300 hover:bg-pink-400 focus:bg-pink-400" type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default WebForm;
