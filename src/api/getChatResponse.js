import axios from "axios";

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

export const getChatGPTResponse = async (promptText) => {
  try {
    const data = {
      // model: "gpt-4",
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: promptText,
        },
      ],
    };

    const config = {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      data,
      config
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      "Error fetching ChatGPT response:",
      error.response ? error.response.data : error
    );
    return null;
  }
};

export const getDalleResponse = async (promptText) => {
  try {
    const data = {
      prompt: promptText,
      n: 1,
      size: "1024x1024",
    };

    const config = {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      data,
      config
    );
    const imageUrl = response.data.data[0].url;

    return imageUrl;
  } catch (error) {
    console.error(
      "Error fetching DALL·E response:",
      error.response ? error.response.data : error
    );
    return null;
  }
};
