import React, { useState, useEffect } from 'react';
import CreateTreatment from './CreateTreatment';
import ImagePromptForm from './ImagePromptForm';
import GenerateImage from './GenerateImage'; // Import the GenerateImage component
import axios from 'axios';

const TranscribeAudio = () => {
    const [audioUrl, setAudioUrl] = useState('');
    const [transcript, setTranscript] = useState('');
    const [transcribedSegments, setTranscribedSegments] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
  

  const transcribeSegments = async () => {
    try {
      const response = await axios.post('/transcribe-segments', { audioUrl });
      const { transcript } = response.data;

      // Check if transcript is an array
      if (!Array.isArray(transcript)) {
        console.error('Invalid transcript data:', transcript);
        return;
      }

      const transcribedSegmentsData = transcript.map(segment => ({
        end: segment.end,
        start: segment.start,
        text: segment.text
      }));

      console.log(transcribedSegmentsData);

      // Save the transcribed segments
      setTranscribedSegments(prevSegments => [...prevSegments, ...transcribedSegmentsData]);
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
      setSelectedImages(prevSelected => prevSelected.filter(url => url !== imageUrl));
    } else {
      // Image is not selected, add it to the selected images
      setSelectedImages(prevSelected => [...prevSelected, imageUrl]);
    }
  };

  const handleGenerateJsonFile = () => {
    const jsonData = {
      transcribedSegmentsData: transcribedSegments.map((item, index) => {
        const expression = `if (time < ${item.start}) { 0; } else { time - 4; }`;
  
        return [
          {
            type: 'data',
            layerName: `text${index + 1}`,
            property: 'Source Text',
            value: item.text,
          },
          {
            type: 'data',
            layerName: `outer_text${index + 1}`,
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

  return (
    <div>
      <h1>Transcribe Audio</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Audio URL:
          <input type="text" value={audioUrl} onChange={handleInputChange} />
        </label>
        <button type="submit">Transcribe</button>
      </form>
      {transcript && (
        <div>
          <h2>Transcript</h2>
          {/* <p>{transcript}</p> */}
          <CreateTreatment personaStoryPrompt={"write a treatment for a music video. Start with an overview and then label each scene with the word 'scene' and then a numeral. Then create image prompts for each scene, labeling them with the word 'image' and then a numeral. Base the treatment on the following lyrics: " + transcript} />
        </div>
      )}

    {transcribedSegments.length > 0 && (
        <div>
          <h2>Image Prompts</h2>
        <GenerateImage 
            transcribedSegmentsData={transcribedSegments} 
            selectedImages={selectedImages}
            handleSelectImage={handleSelectImage}
        />

          <button onClick={handleGenerateJsonFile}>Create JSON File</button>
        </div>
      )}
    </div>
  );
};

export default TranscribeAudio;
