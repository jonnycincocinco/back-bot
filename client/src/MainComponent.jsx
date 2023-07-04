// ParentComponent.jsx

import React, { useState } from 'react';
import GenerateImage from './GenerateImage';
import ImagePromptForm from './ImagePromptForm';

const MainComponent = () => {
  const [transcribedSegments, setTranscribedSegments] = useState([]);

  // Handle the retrieval of transcribedSegments
  const handleTranscribedSegments = (segments) => {
    setTranscribedSegments(segments);
  };

  return (
    <div>
      <ImagePromptForm transcribedSegments={transcribedSegments} />
      <GenerateImage onTranscribedSegments={handleTranscribedSegments} />
    </div>
  );
};

export default MainComponent;
