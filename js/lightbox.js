// Lightbox fonksiyonları
document.addEventListener('DOMContentLoaded', function() {
    // Lightbox elemanlarını oluştur ve body'e ekle
    if (!document.getElementById('image-lightbox')) {
        const lightboxHtml = `
            <div id="image-lightbox" class="lightbox">
                <span class="lightbox-close">&times;</span>
                <div class="lightbox-nav">
                    <span class="lightbox-prev"><i class="fas fa-chevron-left"></i></span>
                    <span class="lightbox-next"><i class="fas fa-chevron-right"></i></span>
                </div>
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
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    // Lightbox sınıfı olan tüm görsellere tıklama olayı ekle
    const lightboxableImages = document.querySelectorAll('.lightbox-image');
    let currentImageIndex = 0;
    let lightboxableImagesArray = Array.from(lightboxableImages);
    
    lightboxableImages.forEach(function(image, index) {
        image.style.cursor = 'pointer';
        image.addEventListener('click', function(e) {
            // Stop event propagation to prevent slider navigation when clicking on slider images
            e.stopPropagation();
            
            // Prevent default action (important for links)
            e.preventDefault();
            
            currentImageIndex = index;
            openLightbox(this.getAttribute('src'), this.getAttribute('alt'));
        });
    });
    
    function openLightbox(src, alt) {
        lightbox.style.display = 'block';
        lightboxImg.src = src;
        lightboxCaption.textContent = alt;
        document.body.style.overflow = 'hidden';
        
        // Show/hide navigation based on number of images
        if (lightboxableImagesArray.length <= 1) {
            lightboxPrev.style.display = 'none';
            lightboxNext.style.display = 'none';
        } else {
            lightboxPrev.style.display = 'block';
            lightboxNext.style.display = 'block';
        }
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
    
    // Önceki resim butonuna tıklandığında
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (currentImageIndex > 0) {
                currentImageIndex--;
            } else {
                currentImageIndex = lightboxableImagesArray.length - 1;
            }
            
            const prevImage = lightboxableImagesArray[currentImageIndex];
            openLightbox(prevImage.getAttribute('src'), prevImage.getAttribute('alt'));
        });
    }
    
    // Sonraki resim butonuna tıklandığında
    if (lightboxNext) {
        lightboxNext.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (currentImageIndex < lightboxableImagesArray.length - 1) {
                currentImageIndex++;
            } else {
                currentImageIndex = 0;
            }
            
            const nextImage = lightboxableImagesArray[currentImageIndex];
            openLightbox(nextImage.getAttribute('src'), nextImage.getAttribute('alt'));
        });
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
        
        // Yön tuşları ile navigasyon
        if (lightbox.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                lightboxPrev.click();
            } else if (e.key === 'ArrowRight') {
                lightboxNext.click();
            }
        }
    });
}); 