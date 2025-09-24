document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Master-Fix lädt...');
    
    // 1. CHATBOT SOFORT ERSTELLEN
    const chatHTML = `
        <div id="chat-toggle" style="position:fixed;bottom:20px;right:20px;width:60px;height:60px;background:linear-gradient(135deg,#28c76f,#20a85a);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:9999;box-shadow:0 4px 20px rgba(40,199,111,0.4);">
            <i class="bi bi-chat-dots-fill" style="font-size:24px;color:white;"></i>
        </div>
        <div id="chat-widget" style="position:fixed;bottom:20px;right:20px;width:350px;height:500px;background:white;border-radius:15px;box-shadow:0 10px 40px rgba(0,0,0,0.2);z-index:9999;display:none;overflow:hidden;">
            <div style="background:linear-gradient(135deg,#0a2540,#1e3a5f);padding:15px;color:white;display:flex;justify-content:space-between;align-items:center;">
                <h6 style="margin:0;">SmartLiving Berlin</h6>
                <button id="chat-close" style="background:none;border:none;color:white;font-size:18px;cursor:pointer;">×</button>
            </div>
            <div id="chat-messages" style="height:350px;overflow-y:auto;padding:15px;"></div>
            <div style="padding:15px;border-top:1px solid #eee;">
                <input type="text" id="chat-input" placeholder="Ihre Frage..." style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-bottom:10px;">
                <button id="chat-send" style="width:100%;background:#28c76f;color:white;border:none;padding:8px;border-radius:5px;cursor:pointer;">Senden</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', chatHTML);
    
    // 2. CHATBOT EVENTS
    document.getElementById('chat-toggle').onclick = () => {
        document.getElementById('chat-widget').style.display = 'block';
        document.getElementById('chat-toggle').style.display = 'none';
        addMessage('Hallo! Ich bin Ihr SmartLiving Berlin Assistent. Fragen Sie mich zu Immobilien, Finanzierung oder Smart Home!', true);
    };
    
    document.getElementById('chat-close').onclick = () => {
        document.getElementById('chat-widget').style.display = 'none';
        document.getElementById('chat-toggle').style.display = 'flex';
    };
    
    document.getElementById('chat-send').onclick = sendMessage;
    document.getElementById('chat-input').onkeypress = (e) => e.key === 'Enter' && sendMessage();
    
    function sendMessage() {
        const input = document.getElementById('chat-input');
        const msg = input.value.trim();
        if (!msg) return;
        
        addMessage(msg, false);
        input.value = '';
        
        setTimeout(() => {
            const responses = {
                'kaufnebenkosten': 'In Berlin: Grunderwerbsteuer 6%, Notar 1-1,5%, Grundbuch 0,5%, Makler 3,57%. Bei 500k€ = ca. 50k€ Nebenkosten.',
                'finanzierung': 'Aktuelle Zinsen Berlin: 3,8-4,2%. Empfehlung: 20% Eigenkapital + Nebenkosten. KfW-Förderung verfügbar.',
                'smart home': 'Smart Home ROI: Thermostat 15% Heizersparnis, LED 80% Stromersparnis. Wertsteigerung 3-5%.',
                'mietrecht': 'Berlin: Mietpreisbremse aktiv, Kappungsgrenze 15% in 3 Jahren, Modernisierungsumlage max. 8%.'
            };
            
            let response = 'Interessante Frage! Ich helfe bei: Kaufnebenkosten, Finanzierung, Smart Home, Mietrecht Berlin. Was interessiert Sie?';
            for (const [key, val] of Object.entries(responses)) {
                if (msg.toLowerCase().includes(key)) {
                    response = val;
                    break;
                }
            }
            addMessage(response, true);
        }, 1000);
    }
    
    function addMessage(text, isBot) {
        const container = document.getElementById('chat-messages');
        const div = document.createElement('div');
        div.style.cssText = `margin-bottom:10px;padding:8px 12px;border-radius:18px;max-width:80%;${isBot ? 'background:#f1f3f4;color:#333;' : 'background:#28c76f;color:white;margin-left:auto;'}`;
        div.textContent = text;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }
    
    // 3. BILDER REPARIEREN
    const images = document.querySelectorAll('img[src*="assets/images"]');
    images.forEach(img => {
        const filename = img.src.split('/').pop();
        const unsplashMap = {
            'hero-bg.jpg': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80',
            'smart-home.jpg': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
            'berlin-skyline.jpg': 'https://images.unsplash.com/photo-1587330979470-3016b6702d89?w=800&q=80',
            'calculator.jpg': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80',
            'modern-apartment.jpg': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80'
        };
        if (unsplashMap[filename] ) {
            img.src = unsplashMap[filename];
            img.onerror = () => img.style.display = 'none';
        }
    });
    
    // 4. HOMESTAGING SLIDER
    const sliderHTML = `
        <section style="padding:60px 0;background:#f8f9fa;">
            <div class="container">
                <div class="row"><div class="col-12 text-center mb-5">
                    <h2>Homestaging Vorher/Nachher</h2>
                    <p>Ziehen Sie den Regler für den Vergleich</p>
                </div></div>
                <div class="row">
                    <div class="col-md-6 mb-4">
                        <div class="before-after" style="position:relative;overflow:hidden;border-radius:10px;cursor:ew-resize;" data-before="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80" data-after="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80">
                            <img style="width:100%;display:block;" src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80">
                            <img style="position:absolute;top:0;left:0;width:100%;clip-path:inset(0 50% 0 0 );" src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80">
                            <div style="position:absolute;top:0;bottom:0;width:4px;background:white;left:50%;transform:translateX(-50% );box-shadow:0 0 10px rgba(0,0,0,0.5);">
                                <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:20px;height:20px;background:white;border-radius:50%;"></div>
                            </div>
                        </div>
                        <p class="text-center mt-2"><small>Wohnzimmer</small></p>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    // Slider nach dem letzten section einfügen
    const lastSection = document.querySelector('main section:last-of-type') || document.querySelector('section:last-of-type');
    if (lastSection) {
        lastSection.insertAdjacentHTML('afterend', sliderHTML);
        
        // Slider-Funktionalität
        document.querySelectorAll('.before-after').forEach(slider => {
            const afterImg = slider.querySelector('img:last-of-type');
            const handle = slider.querySelector('div:last-of-type');
            
            slider.onmousemove = (e) => {
                const rect = slider.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = (x / rect.width) * 100;
                const clampedPercentage = Math.max(0, Math.min(100, percentage));
                
                afterImg.style.clipPath = `inset(0 ${100 - clampedPercentage}% 0 0)`;
                handle.style.left = `${clampedPercentage}%`;
            };
        });
    }
    
    console.log('✅ Master-Fix komplett!');
});
