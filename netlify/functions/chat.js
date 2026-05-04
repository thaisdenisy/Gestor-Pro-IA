
exports.handler = async (event) => {
  try {
    const { messages } = JSON.parse(event.body);
    const CHAVE = process.env.OPENAI_API_KEY;

    // Usando o fetch nativo do Node.js (mais estável no Netlify)
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

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.error?.message || "Erro na OpenAI" })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro no servidor: " + error.message })
    };
  }
};
