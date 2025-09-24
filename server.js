const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(compression());
app.use(express.json());

// Statische Dateien servieren
app.use(express.static(__dirname));

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    const responses = {
        'kaufnebenkosten': 'In Berlin betragen die Kaufnebenkosten ca. 9-12%: Grunderwerbsteuer (6%), Notar (1-1,5%), Grundbuch (0,5%), Makler (3,57%).',
        'finanzierung': 'Aktuelle Zinssätze in Berlin: 3,8-4,2% für 10 Jahre. Empfehlung: 20% Eigenkapital + Nebenkosten.',
        'mietrecht': 'Berlin Mietrecht: Mietpreisbremse aktiv, Kappungsgrenze 15% in 3 Jahren, Modernisierungsumlage max. 8%.',
        'smart home': 'Smart Home ROI Berlin: Thermostat 200€ → 15% Heizersparnis, LED-System 300€ → 80% Stromersparnis.'
    };
    
    const lowerMessage = message.toLowerCase();
    let response = 'Interessante Frage! Ich helfe gerne bei: Kaufnebenkosten, Finanzierung, Mietrecht, Smart Home. Können Sie spezifischer werden?';
    
    for (const [key, value] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            response = value;
            break;
        }
    }
    
    res.json({ response, timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SmartLiving Berlin läuft auf http://localhost:${PORT}` );
});
