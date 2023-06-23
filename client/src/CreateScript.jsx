import React from 'react';

const personaStoryPrompt = "write a 25 second news bulletin.  Make sure to begin the script with the question: do you expect driverless cars to take over your city in 2024? Group and label the remainder of the script into three distinct sections, each one focusing on a clear point that is approximately 5 seconds long.Finish the script with the following CTA, download the backchannel app to shape the conversation and see the results! base the bulletin off the following article:Tesla’s plan to develop a fully-driverless taxi without pedals or a steering wheel has prompted RBC Capital Markets to raise its price target on the company’s shares by more than 40 per cent. In a note to clients on Thursday, analyst Tom Narayan predicted robotaxis and autonomous vehicles in general could “transform society more than anything else in our lifetimes,” saving “millions of lives and trillions of hours.” He raised his price target on Nasdaq-listed Tesla shares (TSLA) from US$212 to US$305, while maintaining an “outperform” rating. CEO Elon Musk has said a robotaxi will be ready for launch in 2024, his latest timeline for an autonomous ride-sharing vehicle originally planned to hit the market in 2020. His envisions a cheaper cost per mile than public transportation. “Given how much value and convenience they offer and low pricing, given the elimination of the driver, we see consumers switching away from private car ownership,” Tom Narayan wrote on Thursday. “We anticipate private cars being banned in many cities around the globe.” Narayan says increasing sales volumes at a lower profitability, coupled with a greater focus on autonomous driving, is a winning strategy for the American automaker. Over time, he says, robotaxis could make up 70 per cent of Tesla’s value, with sales of autonomous driving software and vehicle sales representing the remaining 30 per cent.Tesla recently struck deals allowing Ford (F) and General Motors (GM) vehicles to use Tesla's Supercharger network. Narayan says this shows the company's ability to leverage its products to create partnerships. Many believe this will serve as a trojan horse and enable software licensing in the future, he wrote."

const CreateScriptBtn = () => {
    const createScript = async () => {
        try {
          const response = await fetch('http://localhost:8000/generate-script', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ personaStoryPrompt }),
          });
      
          const data = await response.json();
          console.log(data);
      
          if (!data.story) {
            console.error('Invalid sentence data:', data);
            return;
          }
      
          const sentences = data.story.split('.').map(sentence => sentence.trim());
          const sentencesData = sentences.map(sentence => ({ sentence }));
          const jsonData = JSON.stringify(sentencesData, null, 2);
      
          const blob = new Blob([jsonData], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
      
          const a = document.createElement('a');
          a.href = url;
          a.download = 'sentences.json';
      
          document.body.appendChild(a);
          a.click();
      
          URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } catch (error) {
          console.error('Error generating story:', error);
        }
      };
      
      

  return (
    <div>
      <button className="cta text-fancy-rg inline-flex items-center px-6 py-4 mt-8 font-semibold text-white transition-all duration-200 bg-pink-300 hover:bg-pink-400 focus:bg-pink-400" onClick={createScript}>Generate Script</button>
    </div>
  );
};

export default CreateScriptBtn;
