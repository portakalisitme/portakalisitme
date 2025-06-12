// Lightbox fonksiyonları
document.addEventListener('DOMContentLoaded', function() {
    // Lightbox elemanlarını oluştur ve body'e ekle
    if (!document.getElementById('image-lightbox')) {
        const lightboxHtml = `
            <div id="image-lightbox" class="lightbox">
                <span class="lightbox-close">&times;</span>
                <div class="lightbox-content">
                    <img id="lightbox-image">
                    <div id="lightbox-caption"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightboxHtml);
    }
    
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    // Lightbox sınıfı olan tüm görsellere tıklama olayı ekle
    const lightboxableImages = document.querySelectorAll('.lightbox-image');
    
    lightboxableImages.forEach(function(image) {
        image.style.cursor = 'pointer';
        image.addEventListener('click', function(e) {
            // Stop event propagation to prevent slider navigation when clicking on slider images
            e.stopPropagation();
            
            // Prevent default action (important for links)
            e.preventDefault();
            
            openLightbox(this.getAttribute('src'), this.getAttribute('alt'));
        });
    });
    
    function openLightbox(src, alt) {
        lightbox.style.display = 'block';
        lightboxImg.src = src;
        lightboxCaption.textContent = alt;
        document.body.style.overflow = 'hidden';
    }
    
    // Çarpı işaretine tıklandığında lightbox'ı kapat
    if (lightboxClose) {
        lightboxClose.addEventListener('click', function() {
            closeLightbox();
        });
    }
    
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Lightbox dışındaki bir yere tıklandığında kapat
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // ESC tuşuna basıldığında kapat
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'block') {
            closeLightbox();
        }
    });
}); 