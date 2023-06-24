import React, { useState } from 'react';
import PromptForm from './PromptForm';
import axios from 'axios'

const CreateTalkButton = () => {

    const [personaStoryPrompt, setPersonaStoryPrompt] = useState('');

    const updatePrompt = (newPrompt) => {
      setPersonaStoryPrompt(newPrompt);
    };

    const handleClick = () => {
        const requestData = {
          personaStoryPrompt: personaStoryPrompt // Include personaStoryPrompt in the request body
        };

        console.log(personaStoryPrompt);
      
        fetch('https://localhost:8000/create-talk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData), // Pass the request data as the body of the request
        })
          .then((response) => response)
          .then((talkId) => {
            console.log('Talk ID:', talkId);
            // Handle the talkId or perform additional actions
          })
          .catch((error) => {
            console.error('Error creating talk:', error);
          });
      };
      
      
  
    return (
    <div className='create-avatar'>
        <PromptForm updatePrompt={updatePrompt} />
        <button className="cta text-fancy-rg inline-flex items-center px-6 py-4 mt-8 font-semibold text-white transition-all duration-200 bg-pink-300 hover:bg-pink-400 focus:bg-pink-400" onClick={handleClick}>Create Avatar</button>
    </div>
    );     
};

export default CreateTalkButton;
