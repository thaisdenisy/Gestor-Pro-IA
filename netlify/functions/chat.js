

exports.handler = async (event) => {
  const { messages } = JSON.parse(event.body);
  const CHAVE = process.env.OPENAI_API_KEY; // A chave ficará guardada no servidor do Netlify

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${CHAVE}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 800
    })
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
