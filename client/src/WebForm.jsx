import React, { useState } from 'react';

const WebForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [sentences, setSentences] = useState([]);

  const handleButtonClicked = () => {
    setShowForm(true);
    fetchData();
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const jsonOutput = [];

sentences.forEach((item, index) => {
  const fileInput = formData.get(`media_${index}`);
  const isVideo = fileInput && fileInput.type.includes('video');
  const isImage = fileInput && fileInput.type.includes('image');

  const textData = {
    type: 'text',
    layerName: `text${index + 1}`,
    property: 'Source Text',
    value: item.sentence
  };

  // jsonOutput.push(textData);

  if (isVideo) {
    const mediaData = {
      type: 'video',
      layerName: `media${index + 1}`,
      src: `file:///Users/jonathanlarson/sites/back-bot/ae/elements/${fileInput.name}`
    };

    jsonOutput.push(mediaData);
  } else if (isImage) {
    const mediaData = {
      type: 'image',
      layerName: `media${index + 1}`,
      src: `file:///Users/jonathanlarson/sites/back-bot/ae/elements/${fileInput.name}`
    };

    jsonOutput.push(mediaData);
  } else {
    const mediaData = {
      type: 'video',
      layerName: `media${index + 1}`,
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
    console.log(`File ${index + 1} selected:`, event.target.files[0]);
  };

  const fetchData = () => {
    fetch('/src/sentences.json')
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
      <div key={index}>
        <p>{sentenceObj.sentence}</p>
        <input
          type="file"
          name={`media_${index}`}
          onChange={(event) => {
            handleFileInputChange(event, index);
          }}
        />
      </div>
    ))}
    <button className="cta text-fancy-rg inline-flex items-center px-6 py-4 mt-8 font-semibold text-white transition-all duration-200 bg-pink-300 hover:bg-pink-400 focus:bg-pink-400" type="submit">Submit</button>
  </form>
)}
    </div>
  );
};

export default WebForm;
