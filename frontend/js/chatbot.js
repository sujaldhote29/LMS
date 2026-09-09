// ==========================================================================
// Savant AI Assistant - Chatbot Widget Logic
// ==========================================================================

(function () {
    const CHAT_STORAGE_KEY = 'savant_chat_history';

    let isTyping = false;
    let messages = [];

    // DOM Elements
    const launcher = document.getElementById('chatbot-launcher');
    const windowEl = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('chatbot-close-btn');
    const clearBtn = document.getElementById('chatbot-clear-btn');
    const messagesContainer = document.getElementById('chatbot-messages');
    const chipsContainer = document.getElementById('chatbot-chips');
    const inputEl = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send-btn');
    const badge = document.getElementById('chatbot-badge');

    if (!launcher || !windowEl) return;

    // Load conversation from session
    try {
        const saved = sessionStorage.getItem(CHAT_STORAGE_KEY);
        if (saved) {
            messages = JSON.parse(saved);
        }
    } catch (e) {
        messages = [];
    }

    // Toggle Chat Window
    function toggleChat(open) {
        const shouldOpen = open !== undefined ? open : !windowEl.classList.contains('active');
        if (shouldOpen) {
            windowEl.classList.add('active');
            if (badge) badge.style.display = 'none';
            if (inputEl) inputEl.focus();
            scrollToBottom();
        } else {
            windowEl.classList.remove('active');
        }
    }

    launcher.addEventListener('click', () => toggleChat());
    closeBtn.addEventListener('click', () => toggleChat(false));
    
    clearBtn.addEventListener('click', () => {
        messages = [];
        sessionStorage.removeItem(CHAT_STORAGE_KEY);
        renderInitialGreeting();
    });

    // Send on Enter
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });

    sendBtn.addEventListener('click', handleSend);

    function formatText(text) {
        if (!text) return '';
        let formatted = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Bold **text**
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Line breaks
        formatted = formatted.replace(/\n/g, '<br>');
        return formatted;
    }

    function appendMessage(sender, text, books = [], chips = []) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const msgObj = { sender, text, books, chips, time };
        messages.push(msgObj);

        try {
            sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
        } catch (e) {}

        renderMessageBubble(msgObj);
        renderChips(chips);
        scrollToBottom();
    }

    function renderMessageBubble(msg) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${msg.sender}`;

        let booksHtml = '';
        if (msg.books && msg.books.length > 0) {
            booksHtml = `
                <div class="chat-books-list">
                    ${msg.books.map(b => `
                        <div class="chat-book-card">
                            <div class="chat-book-title">${b.Title}</div>
                            <div class="chat-book-meta">
                                <span><i class="ph ph-tag"></i> ${b.Category || 'General'} · ISBN: ${b.ISBN}</span>
                                <span class="chat-book-stock ${b.Stock > 0 ? 'in-stock' : 'out-stock'}">
                                    ${b.Stock > 0 ? `In Stock (${b.Stock})` : 'Unavailable'}
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        msgDiv.innerHTML = `
            <div class="chat-bubble">
                ${formatText(msg.text)}
                ${booksHtml}
            </div>
            <div class="chat-time">${msg.time}</div>
        `;

        messagesContainer.appendChild(msgDiv);
    }

    function renderChips(chips = []) {
        chipsContainer.innerHTML = '';
        if (!chips || chips.length === 0) return;

        chips.forEach(chipText => {
            const chip = document.createElement('button');
            chip.className = 'chatbot-chip';
            chip.textContent = chipText;
            chip.onclick = () => {
                inputEl.value = chipText.replace(/^[^\w\s]+\s*/, ''); // strip leading emojis
                handleSend();
            };
            chipsContainer.appendChild(chip);
        });
    }

    function showTypingIndicator() {
        if (isTyping) return;
        isTyping = true;
        sendBtn.disabled = true;

        const typingDiv = document.createElement('div');
        typingDiv.id = 'chat-typing-indicator';
        typingDiv.className = 'chat-msg bot';
        typingDiv.innerHTML = `
            <div class="chat-typing">
                <div class="chat-typing-dot"></div>
                <div class="chat-typing-dot"></div>
                <div class="chat-typing-dot"></div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        scrollToBottom();
    }

    function hideTypingIndicator() {
        isTyping = false;
        sendBtn.disabled = false;
        const typingDiv = document.getElementById('chat-typing-indicator');
        if (typingDiv) typingDiv.remove();
    }

    function scrollToBottom() {
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 50);
    }

    async function handleSend() {
        const query = inputEl.value.trim();
        if (!query || isTyping) return;

        inputEl.value = '';
        appendMessage('user', query);
        showTypingIndicator();

        try {
            // Determine active API URL
            const apiUrl = typeof API_URL !== 'undefined' ? API_URL : '/api';
            const res = await fetch(`${apiUrl}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: query })
            });

            const data = await res.json();
            hideTypingIndicator();

            if (res.ok) {
                appendMessage('bot', data.reply, data.books, data.chips);
            } else {
                appendMessage('bot', data.error || "Sorry, I couldn't process that request right now.", [], ["🔍 Search books"]);
            }
        } catch (err) {
            console.error("Chat error:", err);
            hideTypingIndicator();
            appendMessage('bot', "Connection error. Please ensure the backend service is running.", [], ["🔄 Try again"]);
        }
    }

    function renderInitialGreeting() {
        messagesContainer.innerHTML = '';
        appendMessage(
            'bot',
            "👋 Hi there! I'm **Savant AI**, your smart library assistant.\n\nAsk me about available books, borrowing rules, course syllabus books, or fine policies!",
            [],
            [
                "🔍 Find DBMS books",
                "📚 3rd semester books",
                "💻 Web programming",
                "📖 Borrowing rules",
                "💰 Fine policy",
                "🕒 Library hours"
            ]
        );
    }

    // Render stored messages or show greeting
    if (messages.length > 0) {
        messages.forEach(m => renderMessageBubble(m));
        const lastBot = [...messages].reverse().find(m => m.sender === 'bot');
        if (lastBot && lastBot.chips) {
            renderChips(lastBot.chips);
        }
    } else {
        renderInitialGreeting();
    }

})();
