const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config({ path: '../.env' });

async function generateStory(transactionData) {
  const transactions = transactionData.map((transaction) => {
    const categories = transaction.category.join(', ');
    return `Category: ${categories}\nAmount: ${transaction.amount}`;
  });

  const prompt = `Once upon a time, there were some transactions:\n${transactions.join(
    '\n'
  )}\n\nWrite a story based on these transactions:`;

  // Set up your OpenAI API client
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  let story; // Declare the 'story' variable

  // Generate the story using OpenAI's GPT-3.5 model
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt,
    temperature: 0.7,
    max_tokens: 200,
  });

  console.log('OpenAI API Response:', {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    data: {
      id: response.data.id,
      object: response.data.object,
      created: response.data.created,
      model: response.data.model,
      usage: response.data.usage,
    },
  });

  if (!response.choices || response.choices.length === 0) {
    throw new Error('Invalid response from OpenAI API');
  }

  story = response.choices[0].text.trim(); // Initialize the 'story' variable

  console.log('Generated Story:', story); // Log the generated story

  return story;
}

module.exports = generateStory;


const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const response = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: "Create a story based on spending transactions that are provided as json\n\nOnce upon a time, there lived a young man named John who loved to shop. He spent most of his free time browsing the latest trends and shopping for the latest items.\n\nOne day, John decided to review his spending transactions to understand where his money was going. He pulled up his online banking account and was surprised to see a long list of transactions in the form of JSON.\n\nJohn was shocked to see how much money he had spent in the past month. He was spending money on frivolous items like expensive clothes, dinners out, and even a few trips to the spa.\n\nJohn realized that he was living beyond his means and needed to make a change. He decided to start tracking his spending more carefully and set a budget he could stick to.\n\nHe also decided to start using cash instead of credit and debit cards for his purchases. This way, he could more easily keep track of how much he was spending and make sure he stayed within his budget.\n\nJohn also started to look for ways to make extra money so he could save up for some of the bigger items he wanted. He started selling some of his unused items online and taking on a few extra hours at work.\n\nWithin a few months, John had saved up",
  temperature: 0.7,
  max_tokens: 256,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
});