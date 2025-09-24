// Präzise Bild-Ladung für ChatGPT-System
document.addEventListener('DOMContentLoaded', function() {
    // Hero-Bilder setzen
    const heroElements = document.querySelectorAll('[data-bg-image]');
    heroElements.forEach(el => {
        const imageName = el.getAttribute('data-bg-image');
        el.style.backgroundImage = `url('assets/images/${imageName}')`;
    });
    
    // Listing-Bilder laden
    const listingImages = document.querySelectorAll('.listing-image');
    listingImages.forEach((img, index) => {
        img.src = `assets/images/listing-${index + 1}.jpg`;
        img.onerror = () => {
            img.src = `https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80`;
        };
    } );
    
    // Tool-Icons setzen
    const toolIcons = {
        'calculator': 'assets/images/calculator-icon.jpg',
        'contract': 'assets/images/contract-icon.jpg',
        'keys': 'assets/images/keys-icon.jpg'
    };
    
    Object.entries(toolIcons).forEach(([tool, imagePath]) => {
        const elements = document.querySelectorAll(`[data-tool-icon="${tool}"]`);
        elements.forEach(el => {
            if (el.tagName === 'IMG') {
                el.src = imagePath;
            } else {
                el.style.backgroundImage = `url('${imagePath}')`;
            }
        });
    });
    
    console.log('✅ Alle Bilder präzise geladen');
});
