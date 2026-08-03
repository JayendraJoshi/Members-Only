const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: "meta/llama-3.3-70b-instruct",
    messages: [{ role: "user", content: "" }],
    temperature: 0.2,
    top_p: 0.7,
    max_tokens: 1024,
    stream: false,
  });

  process.stdout.write(completion.choices[0]?.message?.content);
}

main();
