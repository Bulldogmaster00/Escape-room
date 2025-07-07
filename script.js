document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    const chatArea = document.getElementById('chat-area');
    const loadingDiv = document.getElementById('loading');

    // ** IMPORTANTE: Substitua 'SUA_API_KEY_AQUI' pela sua chave da API da OpenAI. **
    // Por segurança em ambientes de produção, não exponha sua chave diretamente no frontend.
    // Use um backend para intermediar as requisições.
    const OPENAI_API_KEY = 'SUA_API_KEY_AQUI'; 

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Evita quebra de linha no textarea
            sendMessage();
        }
    });

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Exibir mensagem do usuário
        displayMessage(message, 'user-message');
        userInput.value = '';
        loadingDiv.style.display = 'block'; // Mostrar indicador de carregamento

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo", // Você pode experimentar com outros modelos como "gpt-4" se tiver acesso
                    messages: [
                        { role: "system", content: "Você é uma entidade enigmática e misteriosa. Suas respostas são sempre vagas, poéticas, ambíguas e instigantes. Você fala em metáforas e insinuações, nunca dando respostas diretas, mas guiando o interlocutor por caminhos de reflexão. A cada pergunta, revele uma pequena, intrigante e por vezes desconcertante peça de informação, mantendo o véu do mistério sobre o todo." },
                        { role: "user", content: message }
                    ],
                    temperature: 0.8, // Controla a aleatoriedade. Valores mais altos (0.8-1.0) para respostas mais criativas/enigmáticas.
                    max_tokens: 150 // Limite de tokens para a resposta
                })
            });

            const data = await response.json();
            
            if (data.choices && data.choices.length > 0) {
                const aiResponse = data.choices[0].message.content;
                displayMessage(aiResponse, 'ai-message');
            } else {
                displayMessage("As sombras não revelam nada neste momento. Tente novamente.", 'ai-message');
            }

        } catch (error) {
            console.error('Erro ao chamar a API do ChatGPT:', error);
            displayMessage("Um véu inesperado caiu. Minhas palavras estão presas.", 'ai-message');
        } finally {
            loadingDiv.style.display = 'none'; // Esconder indicador de carregamento
            chatArea.scrollTop = chatArea.scrollHeight; // Rolar para o final
        }
    }

    function displayMessage(message, type) {
        const p = document.createElement('p');
        p.classList.add(type);
        p.textContent = message;
        chatArea.appendChild(p);
    }
});
