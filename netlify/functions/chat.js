exports.handler = async (event) => {
  try {
    const { messages } = JSON.parse(event.body);
    const CHAVE = process.env.OPENAI_API_KEY;

    // Mude a URL abaixo para a do seu provedor (Exemplo: OpenRouter ou Together AI)
    const PROVIDER_URL = "https://openrouter.ai/api/v1/chat/completions"; 

    const response = await fetch(PROVIDER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CHAVE}`
      },
      body: JSON.stringify({
        model: "gpt-oss-120b", // Certifique-se de usar o ID exato do modelo aqui
        messages: messages,
        max_tokens: 1000
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.error?.message || "Erro no provedor OSS" })
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
