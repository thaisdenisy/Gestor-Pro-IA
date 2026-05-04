exports.handler = async (event) => {
  try {
    const { messages } = JSON.parse(event.body);
    const CHAVE = process.env.OPENAI_API_KEY; // O Netlify vai usar a chave que você salvou lá

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CHAVE}` // Garante que o cabeçalho de autenticação seja enviado
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768", // Ou o ID específico do modelo que você pegou no Groq
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
