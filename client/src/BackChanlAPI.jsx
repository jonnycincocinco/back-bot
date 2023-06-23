import React, { useState } from 'react';
import axios from 'axios';

const Backchanl = () => {
  const [data, setData] = useState(null);

  const fetchData = () => {
    axios.get('/backchanl-api')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <button onClick={fetchData}>Query BackChannel API</button>
      {data && (
        <div>
          <h2>{data.question}</h2>
          <ul>
            {data.urls.map((url, index) => (
              <li key={index}>
                <a href={url}>{url}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Backchanl;
