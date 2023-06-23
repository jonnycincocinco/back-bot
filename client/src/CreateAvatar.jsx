import React, { useState } from 'react';
import PromptForm from './PromptForm';

const CreateTalkButton = () => {

    const [personaStoryPrompt, setPersonaStoryPrompt] = useState('');

    const updatePrompt = (newPrompt) => {
      setPersonaStoryPrompt(newPrompt);
    };

    const handleClick = () => {
      const data = {
        script: {
          type: 'text',
          subtitles: 'false',
          provider: {
            type: 'microsoft',
            voice_id: 'en-US-JennyNeural'
          },
          ssml: 'false',
          input: {personaStoryPrompt},
        },
        config: {
          fluent: 'false',
          pad_audio: '0.0'
        },
        webhook: 'https://localhost:8000/webhook',
        source_url: 'https://cdn.discordapp.com/attachments/1117865131272052787/1119006849920934019/jonlarsony_just_one_person_ecb819fc-68db-4c5a-a49f-345273413a79.png'
      };
  
      axios.post('https://localhost:8000/create-talk', data)
        .then(response => {
          // Handle the successful response here
          console.log('Talk ID:', response.data);
        })
        .catch(error => {
          // Handle any errors that occurred during the request
          console.error(error);
        });
    };
  
    return (
    <div>
        <PromptForm updatePrompt={updatePrompt} />
        <button className="cta text-fancy-rg inline-flex items-center px-6 py-4 mt-8 font-semibold text-white transition-all duration-200 bg-pink-300 hover:bg-pink-400 focus:bg-pink-400" onClick={handleClick}>Create Avatar</button>
    </div>
    );     
};

export default CreateTalkButton;
