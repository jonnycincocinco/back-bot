import React from 'react';
import outputArray from './outputArray.json';

function GenerateJson() {
  function generateAssetObject(item, index) {
    const fade = 1;
    const fadeIn = `(time - ${item.start}) / ${fade}`;
    const fadeOut = `(${item.end} - time) / ${fade}`;
    const expression = `fade = 1;fadeIn = ${fadeIn};fadeOut = ${fadeOut};if (time < ${item.start} + fade) {ease(fadeIn, 0, 1) * value;} else if (time >= ${item.start + 1} && time <= ${item.end - 1}) {100;} else if (time > ${item.end} - fade) {ease(fadeOut, 0, 1) * value;} else {0;}`;

    return [
      {
        type: 'data',
        layerName: `text${index + 1}`,
        property: 'Source Text',
        value: item.text,
      },
      {
        type: 'data',
        layerName: `text${index + 1}`,
        property: 'opacity',
        expression: expression,
      }, 
      {
        type: 'data',
        layerName: `text${index + 1}`,
        property: 'position',
        value: [100, 74],
      },
    ];
  }

  function handleGenerateJSON() {
    const filteredArray = outputArray.filter((item) => item.text !== '');

    const assetsArray = filteredArray.flatMap((item, index) =>
      generateAssetObject(item, index)
    );

    filteredArray.forEach((item, index) => {
      item.assets = generateAssetObject(item, index);
      delete item.id;
      delete item.end;
      delete item.start;
      delete item.seek;
      delete item.tokens;
      delete item.avg_logprob;
      delete item.temperature;
      delete item.no_speech_prob;
      delete item.compression_ratio;
      delete item.text;
    });

    const jsonObject = {
      assets: assetsArray,
    };

    const jsonContent = JSON.stringify(jsonObject, null, 2);

    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.json';
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <button onClick={handleGenerateJSON}>Generate JSON</button>
    </div>
  );
}

export default GenerateJson;
