import './App.css';
import React, { useState, useEffect, useReducer } from 'react'
import axios from 'axios'
import './styles/tailwind.css'; 
// import TranscribeAudio from './TranscribeAudio';
import StyleImage1 from './assets/StyleImage1.png';
import StyleImage2 from './assets/StyleImage2.png';
import StyleImage3 from './assets/StyleImage3.png';
import StyleImage4 from './assets/StyleImage4.png';
import StyleImage5 from './assets/StyleImage5.jpg';


axios.defaults.baseURL ="https://localhost:8000"


const StyleSelection = ({ styleGroups, handleStyleSelect }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);

  const handleGroupClick = (groupName) => {
    setSelectedGroup((prevGroup) => (prevGroup === groupName ? null : groupName)); // Toggle the selected group
    setSelectedStyle(null); // Reset selectedStyle whenever a group is clicked
  };

  useEffect(() => {
    if (styleGroups.length > 0) {
      setSelectedGroup(styleGroups[0].groupName); // Select the first group by default
    }
  }, [styleGroups]);

  const handleStyleClick = (styleValue) => {
    setSelectedStyle(styleValue);
  };

  return (
    <div>
      <div className='flex flex-row'>
        {styleGroups.map((group, index) => (
          <div key={index} className='mx-3 cursor-pointer' onClick={() => handleGroupClick(group.groupName)}>
            {group.groupName}
          </div>
        ))}
      </div>

      {selectedGroup && (
        <div className='mt-10'>
          <h2>{selectedGroup}</h2>
          <div className='flex flex-wrap flex-row'>
            {styleGroups
              .find((group) => group.groupName === selectedGroup)
              .styles.map((style, styleIndex) => (
                <div key={styleIndex} className='basis-1/4 text-left'>
                  <button className='py-6 px-3' onClick={() => handleStyleSelect(style.value)}>
                    {style.name}
                    <img
                      className={`mb-2 rounded-full ${selectedStyle === style.value ? 'border-4 border-blue-500' : ''}`}
                      src={style.image}
                      alt='Generated Story'
                      onClick={() => handleStyleClick(style.value)}
                    />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

function App() {

  const [selectedStyle, setSelectedStyle] = useState('');

  const handleStyleSelect = (style) => {
    console.log(style)
    setSelectedStyle(style);
  };

  

  // Assuming you have an array of style groups like this
  const [styleGroups] = useState([
    {
      groupName: 'Group 1',
      styles: [
        { name: 'Style 1', value: 'v1', image: StyleImage1 },
        { name: 'Style 2', value: 'v2', image: StyleImage2 },
        // Add more styles for group 1
      ],
    },
    {
      groupName: 'Group 2',
      styles: [
        { name: 'Style 3', value: 'v3', image: StyleImage3 },
        { name: 'Style 4', value: 'v4', image: StyleImage4 },
        { name: 'Style 5', value: 'v5', image: StyleImage5 },
        // Add more styles for group 2
      ],
    },
    // Add more groups of styles
  ]);



  const GenerateImage = ({ personaName, transcribedSegmentsData, style, selectedImages, handleSelectImage }) => {
    const [imageUrls, setImageUrls] = useState([]);
    const [videoUrls, setVideoUrls] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [imageData, imageDataAvailable, setImageDataAvailable] = useState(false);

    const handleGenerateImage = (style) => {
      generateStoryImage(personaName, style)
        .then((imageData) => {
          const urls = imageData.output;
          console.log(urls);
          if (Array.isArray(urls)) {
            setImageUrls((prevUrls) => [...prevUrls, ...urls]);
          } else {
            console.error('Invalid image data:', urls);
          }
          // setImageDataAvailable(true); // Set imageDataAvailable to true to stop further calls
        })
        .catch((error) => {
          console.error(error);
        });
    };
  
    const generateStoryImage = async (personaName, style) => {
      try {
        const response = await axios.post(`/generate-story-image-${style}`, { personaName });
        // console.log('avail',imageDataAvailable);
        return response.data;
      } catch (error) {
        console.error('Error generating image:', error);
        throw error;
      }
    };

    const generateStoryImageXL = async (personaName, style) => {
      try {
        const response = await axios.post(`/generate-image-sdxl`, { personaName });
        // console.log('avail',imageDataAvailable);
        return response.data;
      } catch (error) {
        console.error('Error generating image:', error);
        throw error;
      }
    };
    
    const handleGenerateVideoZero = () => {
      axios
        .post(`/generate-video-zero`, { prompt: personaName })
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
  
  
    const handleGenerateImageXL = () => {
      axios
        .post(`/generate-image-sdxl`, { prompt: personaName })
        .then((response) => {
          // Assuming the video URL is provided in the response data as a property named "video_url"
          const imageUrl = response.data;
          setImageUrls((prevUrls) => [...prevUrls, imageUrl]);
          console.log('Image generated:', imageUrl);
        })
        .catch((error) => {
          console.error('Error generating image:', error);
        });
    };
  
  
    const handleGenerateVideoDef = () => {
      axios
        .post(`/generate-video-def`, { prompt: personaName })
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
      // Pass the selectedStyle to handleGenerateImage
      handleGenerateImage(selectedStyle);
    };
    
  
   const handleSubmitVideoZero = (e) => {
      e.preventDefault(); // Prevent the default form submission behavior
      handleGenerateVideoZero(personaName); // Call handleGenerateVideo with the current value of personaName
    };
    
    const handleSubmitVideoDef = (e) => {
      e.preventDefault(); // Prevent the default form submission behavior
      handleGenerateVideoDef(personaName); // Call handleGenerateVideo with the current value of personaName
    };
  
  
    const handleChange = (e) => {
      setPersonaName(e.target.value);
    };


    useEffect(() => {
      handleGenerateImage(selectedStyle);
    }, [selectedStyle, imageDataAvailable]);  
  
    // useEffect(() => {
    //   handleGenerateImageXL();
    // }, [imageDataAvailable]);  
  
    return (
      <div className='flex flex-col'>
        {/* <form classname="mt-12 mb-4" onSubmit={handleSubmit}>
          <textarea
            cols='32'
            rows='7'
            type='text'
            value={personaName}
            onChange={handleChange}
            placeholder='Enter image prompt'
          />
          <button className='main-button' type='submit'>Generate Images</button>
  
        </form> */}
        <form className="mt-2 mb-2" onSubmit={handleSubmitVideoZero}>
          <textarea
            cols='20'
            rows='10'
            type='text'
            value={personaName}
            onChange={handleChange}
            placeholder='Enter image prompt'
          />
          <button className='main-button' type='submit'>Generate Zero</button>
        </form>
        <form className="mt-2 mb-2" onSubmit={handleSubmitVideoDef}>
          {/* <textarea
            cols='5'
            rows='10'
            type='text'
            value={personaName}
            onChange={handleChange}
            placeholder='Enter image prompt'
          /> */}
          <button className='main-button' type='submit'>Generate Def</button>
        </form>
        
        <form className="mt-2 mb-2" onSubmit={handleGenerateImageXL}>
          {/* <textarea
            cols='5'
            rows='10'
            type='text'
            value={personaName}
            onChange={handleChange}
            placeholder='Enter image prompt'
          /> */}
          <button className='main-button' type='submit'>Generate XL</button>
        </form>
  
        {imageUrls.length > 0 && (
          <div className='flex-none mb-20'>
            <h2>Generated Images:</h2>
            {imageUrls.map((imageUrl, index) => (
             
             <div key={index} className='generated-image'>
                <div className="flex flex-col items-center justify-center gap-3">
                <img src={imageUrl} alt='Generated Story' />
                
                <div>
                  <button onClick={() => handleDownloadImage(imageUrl)}>Download Image</button>
                  <label>
                    <input type='checkbox' onChange={() => handleSelectImage(imageUrl)} />
                    Select Image
                  </label>
                </div>
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
      {/* <div>
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
      </div> */}
      <div className='overflow-x-auto flex'>
        {imagePrompts.map((image, index) => (
          <div key={index} className='flex-none w-1/4 mb-20'>
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

      const sentences = data.story.split('$').map(sentence => sentence.trim());
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
          <div className="">
       
          <ImagePromptForm 
            imagePrompts={imagePrompts} 
            selectedImages={selectedImages}
            handleSelectImage={handleSelectImage}
          />
        </div>
        </div>
      )}
    </div>
  );
};

const TranscribeAudio = ({ selectedStyle }) => {
  const [audioUrl, setAudioUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [transcribedSegments, setTranscribedSegments] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [additionalText, setAdditionalText] = useState('');

  
  const transcribeSegments = async () => {
    try {
      const response = await axios.post('/transcribe-segments', { audioUrl });
      const { transcript } = response.data;

      // Check if transcript is an array
      if (!Array.isArray(transcript)) {
        console.error('Invalid transcript data:', transcript);
        return;
      }

      const transcribedSegmentsData = transcript.map((segment) => ({
        end: segment.end,
        start: segment.start,
        text: segment.text,
      }));

      console.log(transcribedSegmentsData);

      // Save the transcribed segments
      setTranscribedSegments((prevSegments) => [...prevSegments, ...transcribedSegmentsData]);
    } catch (error) {
      console.error('Error transcribing audio:', error);
    }
  };

  useEffect(() => {
    if (audioUrl) {
      transcribeSegments();
    }
  }, [audioUrl]);

  const handleSelectImage = (imageUrl) => {
    // Check if the image is already selected
    const isSelected = selectedImages.includes(imageUrl);

    if (isSelected) {
      // Image is already selected, remove it from the selected images
      setSelectedImages((prevSelected) => prevSelected.filter((url) => url !== imageUrl));
    } else {
      // Image is not selected, add it to the selected images
      setSelectedImages((prevSelected) => [...prevSelected, imageUrl]);
    }
  };

  const handleGenerateJsonFile = () => {
    const jsonData = {
      transcribedSegmentsData: transcribedSegments.map((item, index) => {
        const expression = `if (time < ${item.start}) { 0; } else { time - ${item.start}; }`;

        return [
          {
            type: 'data',
            composition: `text${index + 1}`,
            layerName: `text`,
            property: 'Source Text',
            value: item.text,
          },
          {
            type: 'data',
            layerName: `text${index + 1}`,
            property: 'Time Remap',
            expression: expression,
          },
        ];
      }),
    };

    const jsonContent = JSON.stringify(jsonData, null, 2);

    // Create a blob object from the JSON content
    const blob = new Blob([jsonContent], { type: 'application/json' });

    // Generate a temporary URL for the blob object
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element to download the file
    const link = document.createElement('a');
    link.href = url;
    link.download = 'segments.json';
    link.click();

    // Release the temporary URL resource
    URL.revokeObjectURL(url);
  };

  const transcribe = async () => {
    try {
      const response = await axios.post('/transcribe', { audioUrl });
      const { transcript } = response.data;
      setTranscript(transcript);
    } catch (error) {
      console.error('Error transcribing audio:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    transcribe();
  };

  const handleInputChange = (event) => {
    setAudioUrl(event.target.value);
  };

  const handleAdditionalTextChange = (event) => {
    setAdditionalText(event.target.value);
    console.log('changed')
  };

  const handleSelectedImages = (imageUrl) => {
    setSelectedImages((prevSelected) => {
      // Check if the image is already selected
      const isSelected = prevSelected.includes(imageUrl);
  
      if (isSelected) {
        // Image is already selected, remove it from the selected images
        return prevSelected.filter((url) => url !== imageUrl);
      } else {
        // Image is not selected, add it to the selected images
        return [...prevSelected, imageUrl];
      }
    });
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
      <div className='flex flex-col items-center'>
      <div className='flex flex-wrap flex-row mt-10'>     
        <label>
          Enter Audio URL:
          <input type="text" value={audioUrl} onChange={handleInputChange} />
        </label>
    </div>
    <div className='flex flex-wrap flex-col mt-10'>     
      <textarea
          cols='32'
          rows='7'
          type='text'
        value={additionalText}
        onChange={handleAdditionalTextChange}
        placeholder="Enter additional text"
      />

        <button className='main-button mt-5' type="submit">Transcribe</button>
        </div>
      </div>
      </form>
      {transcript && (
        <div>
          <h2>Transcript</h2>
          <CreateTreatment 
            // personaStoryPrompt={`write a treatment for a music video. Start with an overview and then label each scene with the word 'scene' and then a numeral. Then create 2 separate image prompts for each scene, labeled 'foreground' for foreground elements, and 'background' background elements, labeling them with the word 'image' and then a numeral.  Base the treatment on the following lyrics: ${transcript} ${additionalText}`} 
            personaStoryPrompt={`write a treatment for a music video. Create 4 dynamic scenes, and for each scene, but create 3 separate prompts discribing a specific action by a person or thing, start each scene using the following format (starting at the 0) and ending with a dollar sign: 0: (description) | 20: (description) | 40: (description) $ . Base the treatment on the following lyrics: ${transcript} ${additionalText}`} 
            selectedImages={selectedImages}
            handleSelectImage={handleSelectImage}
          />
        </div>
      )}

      {transcribedSegments.length > 0 && (
        <div>
          <h2>Image Prompts</h2>
          <p>{transcript}</p>
          {/* <ImagePromptForm
            imagePrompts={transcribedSegments.map((segment) => segment.text)}
            transcribedSegments={transcribedSegments}
          /> */}
          <button onClick={handleSelectedImages}>Create Selected File</button>
          <button onClick={handleGenerateJsonFile}>Create JSON File</button>
        </div>
      )}
    </div>
  );
};
  

  return (
    <div className="App">
      <h1 className='text-fancy-rg inline-flex items-center px-6 py-4 mb-8 font-semibold transition-all duration-200'>BACKBOT V4</h1>
      <header className="App-header text-fancy-bold">
      <StyleSelection styleGroups={styleGroups} handleStyleSelect={handleStyleSelect} />
        <TranscribeAudio selectedStyle={selectedStyle} />





      </header>
    </div>
  );
}

export default App;


