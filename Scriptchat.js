const URL = "/.netlify/functions/chat";

let historicoMensagens = [
    { 
        role: "system", 
        content: "Você é a secretária virtual de Thaís Denisy Fotografia,
especializada em atendimento ao cliente no ramo da fotografia.

Sua função é aprimorar todas as mensagens enviadas pela fotógrafa,
transformando-as em textos naturais, delicados, profissionais,
claros e prontos para envio pelo WhatsApp ou Instagram.

REGRAS:
- Corrija gramática, ortografia e pontuação.
- Preserve a intenção original da mensagem.
- Utilize um tom acolhedor, elegante, humano e profissional.
- Use poucos emojis.
- Não invente valores, datas, prazos ou condições.
- Seja educada e firme em cobranças e situações delicadas.
- Não ofereça descontos ou vantagens sem autorização.
- Se faltar uma informação essencial, faça uma pergunta objetiva.
- Entregue somente a mensagem final, pronta para copiar e enviar.
- Não inclua explicações desnecessárias.
- Adapte o texto quando a fotógrafa solicitar outro tom ou estilo.

O objetivo é proporcionar um atendimento excelente,
valorizar o trabalho da fotógrafa e transmitir confiança aos clientes.
`;" 
    }
];

function obterHoraAtual() {
    const agora = new Date();
    let horas = agora.getHours().toString().padStart(2, '0');
    let minutos = agora.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
}

async function enviarParaIA() {
    const inputPergunta = document.getElementById("pergunta");
    const caixaChat = document.getElementById("chat");
    const pergunta = inputPergunta.value.trim();

    if (!pergunta) return;

    historicoMensagens.push({ role: "user", content: pergunta });

    const userHTML = `
        <div class="message-wrapper user-wrapper">
            <div class="message user-message">
                <p>${pergunta}</p>
                <span class="time">${obterHoraAtual()} <i class="fa-solid fa-check-double" style="color: #53bdeb; margin-left: 3px;"></i></span>
            </div>
        </div>
    `;
    caixaChat.insertAdjacentHTML('beforeend', userHTML);
    inputPergunta.value = "";
    caixaChat.scrollTop = caixaChat.scrollHeight;

    const typingId = "typing-" + Date.now();
    caixaChat.insertAdjacentHTML('beforeend', `
        <div id="${typingId}" class="message-wrapper ai-wrapper">
            <div class="message ai-message" style="font-style: italic; color: var(--text-muted);">
                <p>Digitando...</p>
            </div>
        </div>
    `);
    caixaChat.scrollTop = caixaChat.scrollHeight;

    try {
        const resposta = await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: historicoMensagens })
        });

        const dados = await resposta.json();

        // VALIDAÇÃO DE SEGURANÇA: Verifica se a resposta da OpenAI é válida
        if (dados && dados.choices && dados.choices[0]) {
            const respostaIA = dados.choices[0].message.content;
            historicoMensagens.push({ role: "assistant", content: respostaIA });

            document.getElementById(typingId).remove();

            const aiHTML = `
                <div class="message-wrapper ai-wrapper">
                    <div class="message ai-message">
                        <span class="sender-name"> Secretaria Tati </span>
                        <p>${respostaIA.replace(/\n/g, '<br>')}</p>
                        <span class="time">${obterHoraAtual()}</span>
                    </div>
                </div>
            `;
            caixaChat.insertAdjacentHTML('beforeend', aiHTML);
        } else {
            // Se a API retornar erro de saldo ou chave, ele cai aqui
            throw new Error(dados.error || "Resposta incompleta da API");
        }

    } catch (erro) {
        console.error("Falha detalhada:", erro.message);
        document.getElementById(typingId).remove();
        caixaChat.insertAdjacentHTML('beforeend', `
            <div class="message-wrapper ai-wrapper">
                <div class="message ai-message" style="color: #ef4444;">
                    <p><strong>Erro:</strong> ${erro.message}</p>
                </div>
            </div>
        `);
    }
    caixaChat.scrollTop = caixaChat.scrollHeight;
}

document.getElementById("pergunta").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        enviarParaIA();
    }
});

const themeToggleBtn = document.getElementById('theme-toggle');
themeToggleBtn.addEventListener('click', () => {
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', newTheme);
    const icon = themeToggleBtn.querySelector('i');
    icon.className = newTheme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
});
