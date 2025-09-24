class SmartLivingChat {
    constructor() {
        this.isOpen = false;
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.createChatWidget();
        this.bindEvents();
        this.addWelcomeMessage();
        console.log('✅ SmartLiving Chat initialisiert');
    }
    
    createChatWidget() {
        const toggleBtn = document.createElement('div');
        toggleBtn.id = 'chat-toggle';
        toggleBtn.className = 'chat-toggle';
        toggleBtn.innerHTML = '<i class="bi bi-chat-dots-fill"></i>';
        
        const chatWidget = document.createElement('div');
        chatWidget.id = 'chat-widget';
        chatWidget.className = 'chat-widget';
        chatWidget.innerHTML = `
            <div class="chat-header">
                <h6 class="text-white mb-0">SmartLiving Berlin</h6>
                <button id="chat-close" class="btn btn-sm text-white">×</button>
            </div>
            <div id="chat-messages" class="chat-messages"></div>
            <div class="chat-input">
                <input type="text" id="chat-input" class="form-control" placeholder="Ihre Frage...">
                <button id="chat-send" class="btn btn-primary mt-2">Senden</button>
            </div>
        `;
        
        document.body.appendChild(toggleBtn);
        document.body.appendChild(chatWidget);
    }
    
    bindEvents() {
        document.getElementById('chat-toggle').onclick = () => this.openChat();
        document.getElementById('chat-close').onclick = () => this.closeChat();
        document.getElementById('chat-send').onclick = () => this.sendMessage();
    }
    
    openChat() {
        document.getElementById('chat-widget').style.display = 'block';
        document.getElementById('chat-toggle').style.display = 'none';
    }
    
    closeChat() {
        document.getElementById('chat-widget').style.display = 'none';
        document.getElementById('chat-toggle').style.display = 'flex';
    }
    
    addWelcomeMessage() {
        this.addMessage('Hallo! Ich bin Ihr SmartLiving Berlin Assistent!', true);
    }
    
    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        if (!message) return;
        
        this.addMessage(message, false);
        input.value = '';
        
        setTimeout(() => {
            this.addMessage('Danke für Ihre Nachricht! Ich helfe gerne bei Immobilien-Fragen.', true);
        }, 1000);
    }
    
    addMessage(text, isBot) {
        const container = document.getElementById('chat-messages');
        const div = document.createElement('div');
        div.className = `message ${isBot ? 'bot' : 'user'}`;
        div.innerHTML = `<div class="message-content">${text}</div>`;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }
}

let smartChat = new SmartLivingChat();
