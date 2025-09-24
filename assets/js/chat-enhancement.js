// Chat-Enhancement für ChatGPT's System
document.addEventListener('DOMContentLoaded', function() {
    // Nur Chat-Button hinzufügen, OHNE andere Systeme zu stören
    if (!document.getElementById('smart-chat-btn')) {
        const chatBtn = document.createElement('div');
        chatBtn.id = 'smart-chat-btn';
        chatBtn.innerHTML = `
            <div style="position:fixed;bottom:20px;right:20px;width:60px;height:60px;background:linear-gradient(135deg,#28c76f,#20a85a);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:9999;box-shadow:0 4px 20px rgba(40,199,111,0.4);" onclick="toggleSmartChat()">
                <i class="bi bi-chat-dots-fill" style="font-size:24px;color:white;"></i>
            </div>
            <div id="smart-chat-widget" style="position:fixed;bottom:20px;right:20px;width:350px;height:500px;background:white;border-radius:15px;box-shadow:0 10px 40px rgba(0,0,0,0.2);z-index:9999;display:none;overflow:hidden;">
                <div style="background:linear-gradient(135deg,#0a2540,#1e3a5f);padding:15px;color:white;display:flex;justify-content:space-between;align-items:center;">
                    <h6 style="margin:0;">SmartLiving Berlin</h6>
                    <button onclick="toggleSmartChat()" style="background:none;border:none;color:white;font-size:18px;cursor:pointer;">×</button>
                </div>
                <div id="smart-chat-messages" style="height:350px;overflow-y:auto;padding:15px;"></div>
                <div style="padding:15px;border-top:1px solid #eee;">
                    <input type="text" id="smart-chat-input" placeholder="Ihre Frage..." style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-bottom:10px;" onkeypress="if(event.key==='Enter')sendSmartMessage()">
                    <button onclick="sendSmartMessage()" style="width:100%;background:#28c76f;color:white;border:none;padding:8px;border-radius:5px;cursor:pointer;">Senden</button>
                </div>
            </div>
        `;
        document.body.appendChild(chatBtn);
        
        // Chat-Funktionen global definieren
        window.toggleSmartChat = function() {
            const widget = document.getElementById('smart-chat-widget');
            const isVisible = widget.style.display !== 'none';
            widget.style.display = isVisible ? 'none' : 'block';
            
            if (!isVisible && !widget.hasWelcome) {
                addSmartMessage('Hallo! Ich bin Ihr SmartLiving Berlin Assistent für Immobilien, Finanzierung und Smart Home!', true);
                widget.hasWelcome = true;
            }
        };
        
        window.sendSmartMessage = function() {
            const input = document.getElementById('smart-chat-input');
            const message = input.value.trim();
            if (!message) return;
            
            addSmartMessage(message, false);
            input.value = '';
            
            setTimeout(() => {
                const responses = {
                    'kaufnebenkosten': 'Berlin Kaufnebenkosten: Grunderwerbsteuer 6%, Notar 1-1,5%, Grundbuch 0,5%, Makler 3,57%. Bei 500k€ = ca. 50k€ Nebenkosten.',
                    'finanzierung': 'Aktuelle Zinsen Berlin: 3,8-4,2%. Empfehlung: 20% Eigenkapital + Nebenkosten. KfW-Förderung verfügbar.',
                    'smart home': 'Smart Home ROI: Thermostat 15% Heizersparnis, LED 80% Stromersparnis. Wertsteigerung 3-5%.',
                    'mietrecht': 'Berlin: Mietpreisbremse aktiv, Kappungsgrenze 15% in 3 Jahren, Modernisierungsumlage max. 8%.'
                };
                
                let response = 'Interessante Frage! Ich helfe bei: Kaufnebenkosten, Finanzierung, Smart Home, Mietrecht Berlin. Was interessiert Sie?';
                for (const [key, val] of Object.entries(responses)) {
                    if (message.toLowerCase().includes(key)) {
                        response = val;
                        break;
                    }
                }
                addSmartMessage(response, true);
            }, 1000);
        };
        
        window.addSmartMessage = function(text, isBot) {
            const container = document.getElementById('smart-chat-messages');
            const div = document.createElement('div');
            div.style.cssText = `margin-bottom:10px;padding:8px 12px;border-radius:18px;max-width:80%;${isBot ? 'background:#f1f3f4;color:#333;' : 'background:#28c76f;color:white;margin-left:auto;'}`;
            div.textContent = text;
            container.appendChild(div);
            container.scrollTop = container.scrollHeight;
        };
    }
});
