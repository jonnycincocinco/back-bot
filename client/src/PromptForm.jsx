import React, { useState } from 'react';

const PromptForm = ({ updatePrompt }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    updatePrompt(inputValue);
    setInputValue('');
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        cols="80" rows="10"
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Enter a new prompt"
      />
      <button type="submit">Update</button>
    </form>
  );
};

export default PromptForm;
