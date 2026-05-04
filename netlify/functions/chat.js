exports.handler = async (event) => {
  try {
    const { messages } = JSON.parse(event.body);
    const CHAVE = process.env.OPENAI_API_KEY; 

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CHAVE}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Este é o modelo atual e potente do Groq
        messages: messages,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.error?.message || "Erro na GroqCloud" })
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
