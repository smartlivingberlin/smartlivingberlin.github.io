class LiveChat {
    constructor() {
        this.isOpen = false;
        this.init();
    }
    
    init() {
        this.createWidget();
        this.bindEvents();
        this.addWelcomeMessage();
    }
    
    createWidget() {
        const widget = document.createElement('div');
        widget.innerHTML = `
            <div id="chat-toggle" class="chat-toggle">
                <i class="bi bi-chat-dots-fill"></i>
                <span class="chat-pulse"></span>
            </div>
            
            <div id="chat-widget" class="chat-widget">
                <div class="chat-header">
                    <div class="d-flex align-items-center">
                        <div class="chat-avatar me-2">SL</div>
                        <div>
                            <h6 class="mb-0 text-white">SmartLiving Assistent</h6>
                            <small class="text-white-50">● Online</small>
                        </div>
                    </div>
                    <button id="chat-close" class="btn btn-sm text-white">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                
                <div id="chat-messages" class="chat-messages"></div>
                
                <div class="chat-input">
                    <div class="input-group">
                        <input type="text" id="chat-input" class="form-control" 
                               placeholder="Frage zu Immobilien, Finanzierung...">
                        <button id="chat-send" class="btn btn-primary">
                            <i class="bi bi-send-fill"></i>
                        </button>
                    </div>
                    <div class="quick-buttons mt-2">
                        <button class="btn btn-sm btn-outline-secondary me-1" onclick="liveChat.quickMessage('Kaufnebenkosten Berlin')">Kaufnebenkosten</button>
                        <button class="btn btn-sm btn-outline-secondary me-1" onclick="liveChat.quickMessage('Finanzierung Tipps')">Finanzierung</button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="liveChat.quickMessage('Mietrecht Berlin')">Mietrecht</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(widget);
    }
    
    bindEvents() {
        document.getElementById('chat-toggle').onclick = () => this.toggleChat();
        document.getElementById('chat-close').onclick = () => this.closeChat();
        document.getElementById('chat-send').onclick = () => this.sendMessage();
        document.getElementById('chat-input').onkeypress = (e) => {
            if (e.key === 'Enter') this.sendMessage();
        };
    }
    
    toggleChat() {
        this.isOpen = !this.isOpen;
        document.getElementById('chat-widget').style.display = this.isOpen ? 'block' : 'none';
        document.getElementById('chat-toggle').style.display = this.isOpen ? 'none' : 'flex';
    }
    
    closeChat() {
        this.isOpen = false;
        document.getElementById('chat-widget').style.display = 'none';
        document.getElementById('chat-toggle').style.display = 'flex';
    }
    
    addWelcomeMessage() {
        this.addMessage('Hallo! 👋 Ich bin Ihr SmartLiving Assistent für Berlin. Fragen Sie mich zu Immobilien, Finanzierung, Mietrecht oder Smart Home!', true);
    }
    
    quickMessage(text) {
        document.getElementById('chat-input').value = text;
        this.sendMessage();
    }
    
    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        if (!message) return;
        
        this.addMessage(message, false);
        input.value = '';
        
        this.showTyping();
        
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            const data = await response.json();
            
            this.hideTyping();
            this.addMessage(data.response, true);
        } catch (error) {
            this.hideTyping();
            this.addMessage('Entschuldigung, ich bin gerade nicht erreichbar. Versuchen Sie es gleich nochmal! 🔄', true);
        }
    }
    
    addMessage(text, isBot) {
        const container = document.getElementById('chat-messages');
        const div = document.createElement('div');
        div.className = `message ${isBot ? 'bot' : 'user'}`;
        div.innerHTML = `
            <div class="message-content">${text}</div>
            <div class="message-time">${new Date().toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'})}</div>
        `;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }
    
    showTyping() {
        const container = document.getElementById('chat-messages');
        const div = document.createElement('div');
        div.id = 'typing';
        div.className = 'message bot typing';
        div.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }
    
    hideTyping() {
        const typing = document.getElementById('typing');
        if (typing) typing.remove();
    }
}

// Chat-Widget Styles
const chatStyles = `
.chat-toggle {
    position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px;
    background: linear-gradient(135deg, #28c76f 0%, #20a85a 100%);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    cursor: pointer; box-shadow: 0 4px 20px rgba(40,199,111,0.4); z-index: 1000;
    transition: all 0.3s ease;
}
.chat-toggle:hover { transform: scale(1.1); box-shadow: 0 6px 25px rgba(40,199,111,0.6); }
.chat-toggle i { font-size: 24px; color: white; }
.chat-pulse { position: absolute; width: 100%; height: 100%; border-radius: 50%;
    background: rgba(40,199,111,0.3); animation: pulse 2s infinite; }
@keyframes pulse { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.4); opacity: 0; } }

.chat-widget {
    position: fixed; bottom: 20px; right: 20px; width: 350px; height: 500px;
    background: white; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    z-index: 1000; display: none; overflow: hidden;
}
.chat-header {
    background: linear-gradient(135deg, #0a2540 0%, #1e3a5f 100%);
    padding: 15px; display: flex; justify-content: space-between; align-items: center;
}
.chat-avatar {
    width: 35px; height: 35px; background: rgba(255,255,255,0.2); border-radius: 50%;
    display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;
}
.chat-messages { height: 350px; overflow-y: auto; padding: 15px; }
.chat-input { padding: 15px; border-top: 1px solid #eee; }
.quick-buttons button { font-size: 11px; }

.message { margin-bottom: 12px; display: flex; flex-direction: column; }
.message.user { align-items: flex-end; }
.message.bot { align-items: flex-start; }
.message-content {
    max-width: 80%; padding: 8px 12px; border-radius: 18px; word-wrap: break-word;
}
.message.user .message-content { background: #28c76f; color: white; }
.message.bot .message-content { background: #f1f3f4; color: #333; }
.message-time { font-size: 11px; color: #999; margin-top: 4px; }

.typing-dots { display: flex; gap: 4px; padding: 8px 12px; }
.typing-dots span {
    width: 8px; height: 8px; border-radius: 50%; background: #999;
    animation: typing 1.4s infinite ease-in-out;
}
.typing-dots span:nth-child(1) { animation-delay: -0.32s; }
.typing-dots span:nth-child(2) { animation-delay: -0.16s; }
@keyframes typing { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

@media (max-width: 768px) {
    .chat-widget { width: calc(100vw - 40px); height: 400px; left: 20px; }
}
`;

const style = document.createElement('style');
style.textContent = chatStyles;
document.head.appendChild(style);

// Chat initialisieren
let liveChat;
document.addEventListener('DOMContentLoaded', () => {
    liveChat = new LiveChat();
});
