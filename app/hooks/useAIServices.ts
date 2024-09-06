import axios from 'axios';
import Constants from 'expo-constants';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = Constants.expoConfig?.extra?.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.error('GROQ_API_KEY is not set in the environment');
}

export const interpretWish = async (wish: string): Promise<string> => {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'mixtral-8x7b-32768',  // or any other model Groq supports
        messages: [
          { role: 'system', content: 'You are a clever AI that interprets wishes and finds amusing loopholes.Try to give a short response.' },
          { role: 'user', content: `Interpret this wish and find a clever loophole: "${wish}"` }
        ],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response);
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error calling Groq API:', error);
    return 'Sorry, I couldn\'t process that wish right now.';
  }
};