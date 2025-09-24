// Homestaging Before/After Slider
document.addEventListener('DOMContentLoaded', function( ) {
    const sliders = document.querySelectorAll('.before-after-slider');
    
    sliders.forEach(slider => {
        const beforeImg = slider.querySelector('.before-image');
        const afterImg = slider.querySelector('.after-image');
        const handle = slider.querySelector('.slider-handle');
        
        if (!beforeImg || !afterImg || !handle) return;
        
        let isDragging = false;
        
        function updateSlider(percentage) {
            percentage = Math.max(0, Math.min(100, percentage));
            afterImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
            handle.style.left = `${percentage}%`;
        }
        
        function handleMove(e) {
            if (!isDragging) return;
            
            const rect = slider.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            const percentage = (x / rect.width) * 100;
            updateSlider(percentage);
        }
        
        handle.addEventListener('mousedown', () => isDragging = true);
        handle.addEventListener('touchstart', () => isDragging = true);
        
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('touchmove', handleMove);
        
        document.addEventListener('mouseup', () => isDragging = false);
        document.addEventListener('touchend', () => isDragging = false);
        
        // Initial position
        updateSlider(50);
    });
});
