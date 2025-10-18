// Features Grid Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Tool-Karten interaktiv machen
    const toolCards = document.querySelectorAll('.tool-card, .feature-card');
    
    toolCards.forEach(card => {
        card.addEventListener('click', function() {
            const toolName = this.querySelector('h5, h6')?.textContent || 'Tool';
            const modal = document.getElementById('toolModal');
            if (modal) {
                document.getElementById('toolModalLabel').textContent = toolName;
                document.getElementById('toolModalBody').innerHTML = `
                    <p>Hier können Sie das Tool "${toolName}" verwenden:</p>
                    <div class="alert alert-info">
                        <strong>Hinweis:</strong> Dieses Tool wird in Kürze verfügbar sein.
                    </div>
                `;
                new bootstrap.Modal(modal).show();
            }
        });
        
        // Hover-Effekte
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        });
    });
});
