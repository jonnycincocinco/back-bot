import React, { useState } from 'react';
import CreateTreatment from './CreateTreatment';
import axios from 'axios'

const TranscribeAudio = () => {
  const [audioUrl, setAudioUrl] = useState('');
  const [transcript, setTranscript] = useState('');

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
          <CreateTreatment personaStoryPrompt={"write a treatment for a music video. Start with an overview and then label each scene with the word 'scene' and then a numeral. Then create image prompts for each scene, creating a javascript array like this: ['prompt for image 1, prompt for image 2]. Base the treatment on the following lyrics: " + transcript} />
        </div>
      )}

      {/* Pass the transcript to CreateScriptBtn */}
      

    </div>
  );
};

export default TranscribeAudio;
