document.addEventListener('DOMContentLoaded', function() {
    // Mobil cihaz kontrolü
    const isMobile = window.innerWidth < 768;

    // Slider Fonksiyonu
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const slideArrows = document.querySelectorAll('.slide-arrow');
    let currentSlide = 0;
    const slideInterval = isMobile ? 5000 : 7000; // Mobilde daha kısa sürede geçiş
    let slideTimer;

    // Slider başlangıç ayarları
    function initSlider() {
        slides.forEach((slide, index) => {
            if (index === 0) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });

        slideArrows.forEach(arrow => {
            arrow.addEventListener('click', nextSlide);
        });

        // Slider navigasyon butonları ekleme
        const sliderContainer = document.querySelector('.slider-container');
        const prevButton = document.createElement('div');
        const nextButton = document.createElement('div');
        
        prevButton.className = 'slider-nav prev';
        nextButton.className = 'slider-nav next';
        
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        
        sliderContainer.appendChild(prevButton);
        sliderContainer.appendChild(nextButton);
        
        prevButton.addEventListener('click', prevSlide);
        nextButton.addEventListener('click', nextSlide);

        // Otomatik slider başlat
        startSlideTimer();
        
        // Mobil cihazlarda slider yüksekliğini ayarla
        if (isMobile) {
            adjustMobileSliderHeight();
            // Ekran döndürme ve boyut değişikliğinde slider yüksekliğini ayarla
            window.addEventListener('resize', adjustMobileSliderHeight);
            window.addEventListener('orientationchange', adjustMobileSliderHeight);
            
            // Mobilde slider kaydırma desteği
            setupMobileSlider();
        }
    }

    // Mobil cihazlarda slider yüksekliğini düzenle
    function adjustMobileSliderHeight() {
        const viewportWidth = window.innerWidth;
        const sliderContainer = document.querySelector('.slider-container');
        
        if (viewportWidth <= 576) {
            sliderContainer.style.height = '350px';
            
            // Tüm slaytları aktif et
            const activeSlide = document.querySelector('.slide.active');
            if (activeSlide) {
                const slideImages = document.querySelectorAll('.slide-image');
                slideImages.forEach(img => {
                    img.style.objectFit = 'contain';
                    img.style.objectPosition = 'center';
                });
            }
        } else if (viewportWidth <= 768) {
            sliderContainer.style.height = '400px';
            
            // Tüm slaytları aktif et
            const activeSlide = document.querySelector('.slide.active');
            if (activeSlide) {
                const slideImages = document.querySelectorAll('.slide-image');
                slideImages.forEach(img => {
                    img.style.objectFit = 'contain';
                    img.style.objectPosition = 'center';
                });
            }
        }
    }

    // Mobil cihazlarda kaydırılabilir slider ayarları
    function setupMobileSlider() {
        if (window.innerWidth <= 768) {
            // Normal slider davranışına dönelim, kaydırma yerine
            // Bu işlevi iptal ediyoruz
            slides.forEach(slide => {
                if (!slide.classList.contains('active')) {
                    slide.style.display = 'none';
                }
            });
            
            // Navigasyon butonlarının görünürlüğünü arttır
            const navButtons = document.querySelectorAll('.slider-nav');
            navButtons.forEach(button => {
                button.style.opacity = '1';
                button.style.backgroundColor = '#ff7f00';
            });
        }
    }

    // Mobil ekranlarda görünür slayta göre noktaları güncelle
    function updateDots(index) {
        if (dots.length > 0) {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
    }

    // Mobile Menu Toggle ve Dropdown
    const menuButton = document.querySelector('.menu-button');
    const nav = document.querySelector('nav');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Mobil menü için kapat butonu ekle
    if (nav) {
        const closeButton = document.createElement('button');
        closeButton.className = 'close-menu';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        nav.prepend(closeButton);
        
        closeButton.addEventListener('click', function() {
            nav.classList.remove('active');
            // Body scrolling'i aktif et
            document.body.style.overflow = '';
        });
    }
    
    if (menuButton) {
        menuButton.addEventListener('click', function() {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                // Body scrolling'i aktif et
                document.body.style.overflow = '';
            } else {
                nav.classList.add('active');
                // Body scrolling'i deaktif et (menü açıkken kaydırmayı engelle)
                document.body.style.overflow = 'hidden';
            }
        });
    }
    
    // Mobil dropdown toggle
    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('a');
        
        if (dropdownLink) {
            dropdownLink.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    
                    // Diğer tüm dropdown'ları kapat
                    dropdowns.forEach(item => {
                        if (item !== dropdown && item.classList.contains('active')) {
                            item.classList.remove('active');
                        }
                    });
                    
                    // Bu dropdown'ı aç/kapat
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
    
    // Sayfa yüklendiğinde ve yeniden boyutlandırıldığında kontrol et
    function checkScreenSize() {
        if (window.innerWidth > 768) {
            // Menu'yu kapat ve dropdown'ları sıfırla
            if (nav) nav.classList.remove('active');
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
            document.body.style.overflow = '';
        }
    }
    
    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();

    // Slider zamanlayıcısını başlat
    function startSlideTimer() {
        clearInterval(slideTimer);
        // Mobil cihazlarda daha kısa zamanlayıcı
        const interval = window.innerWidth <= 768 ? 5000 : 7000;
        slideTimer = setInterval(nextSlide, interval);
    }

    // Belirli slide'a git
    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = index;
        
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }
        
        if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        
        // Animasyonları sıfırla
        resetAnimations();
        
        // Timer'ı yeniden başlat
        startSlideTimer();
    }

    // Önceki slide'a git
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    // Sonraki slide'a git
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    // Dokunmatik kaydırma desteği
    let touchStartX = 0;
    let touchEndX = 0;
    
    const sliderContainer = document.querySelector('.slider-container');
    
    if (sliderContainer) {
        sliderContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        sliderContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            if (touchEndX < touchStartX) {
                // Sola kaydırma
                nextSlide();
            } else if (touchEndX > touchStartX) {
                // Sağa kaydırma
                prevSlide();
            }
        }
    }

    // Sayfa yüklendiğinde slider'ı başlat
    initSlider();

    // Animasyonlar için görünüm kontrolü
    const sliderElements = document.querySelectorAll('.slide-title, .slide-description, .slide-features, .slide .btn');
    
    sliderElements.forEach((element) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    setTimeout(() => {
        const currentSlideElements = document.querySelectorAll('.slide.active .slide-title, .slide.active .slide-description, .slide.active .slide-features, .slide.active .btn');
        let delay = 0;
        
        currentSlideElements.forEach((element) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, delay);
            delay += 200;
        });
    }, 500);
    
    // Slide değişiminde animasyonları tekrarla
    function resetAnimations() {
        const allElements = document.querySelectorAll('.slide-title, .slide-description, .slide-features, .slide .btn');
        allElements.forEach((element) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
        });
        
        setTimeout(() => {
            const currentElements = document.querySelectorAll('.slide.active .slide-title, .slide.active .slide-description, .slide.active .slide-features, .slide.active .btn');
            let delay = 0;
            
            currentElements.forEach((element) => {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, delay);
                delay += 200;
            });
        }, 100);
    }
    
    // Slide değişikliklerinde animasyonları güncelleyelim
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class' && mutation.target.classList.contains('active')) {
                resetAnimations();
            }
        });
    });
    
    slides.forEach((slide) => {
        observer.observe(slide, { attributes: true });
    });
    
    // Scroll to top button
    window.addEventListener('scroll', function() {
        if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
            if (!document.querySelector('.scroll-top')) {
                const scrollButton = document.createElement('div');
                scrollButton.className = 'scroll-top';
                scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
                document.body.appendChild(scrollButton);
                
                scrollButton.addEventListener('click', function() {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
            }
        } else {
            const scrollButton = document.querySelector('.scroll-top');
            if (scrollButton) {
                scrollButton.remove();
            }
        }
    });

    // Form Validation
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                // Burada gerçek bir form gönderimi yapılabilir
                alert('Bültenimize başarıyla kaydoldunuz!');
                emailInput.value = '';
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Add animated entrance for elements when scrolled into view
    const animateElements = document.querySelectorAll('.section-title, .product-card, .about-content');
    
    function checkScroll() {
        const triggerBottom = (window.innerHeight / 5) * 4;
        
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.classList.add('animate-in');
            }
        });
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // İlk yükleme kontrolü
});

// Sayfa tam yüklendiğinde yükleme ekranını kaldır
window.addEventListener('load', function() {
    const loaderOverlay = document.querySelector('.loader-overlay');
    if (loaderOverlay) {
        loaderOverlay.style.opacity = '0';
        setTimeout(() => {
            loaderOverlay.style.display = 'none';
        }, 500);
    }
    
    // Görüntülerin yüklenmesini bekleyin
    const slideImages = document.querySelectorAll('.slide-image');
    let loadedCount = 0;
    
    slideImages.forEach(img => {
        if (img.complete) {
            imageLoaded();
        } else {
            img.addEventListener('load', imageLoaded);
            img.addEventListener('error', imageLoaded);
        }
    });
    
    function imageLoaded() {
        loadedCount++;
        if (loadedCount === slideImages.length) {
            // Tüm görüntüler yüklendi
            document.querySelector('.slider-container').classList.add('images-loaded');
        }
    }
    
    // Slider arka planını ayarla
    const sliderContainer = document.querySelector('.slider-container');
    sliderContainer.style.maxWidth = '100vw';
    document.body.style.overflowX = 'hidden';
    
    // Ürün kartlarındaki görüntüleri ortalama
    centerProductImages();
    window.addEventListener('resize', centerProductImages);

    // Ürün kartları büyütme özelliğini ayarla
    setupProductCards();
    window.addEventListener('resize', function() {
        // Ekran boyutu değişirse ürün kartlarını yeniden ayarla
        setupProductCards();
    });
});

// Ürün kartlarındaki görüntüleri ortala
function centerProductImages() {
    const productImages = document.querySelectorAll('.product-card img');
    productImages.forEach(img => {
        // Görsel yüklendiyse işlem yap
        if (img.complete) {
            ensureImageIsCentered(img);
        } else {
            img.addEventListener('load', function() {
                ensureImageIsCentered(img);
            });
        }
    });
}

// Görselin ortalanmasını sağla
function ensureImageIsCentered(img) {
    // Görsel boyutlarına bakarak gerekirse ek stil ekle
    const parentWidth = img.parentElement.offsetWidth;
    const imgWidth = img.naturalWidth;
    
    // Eğer görsel konteynerden daha geniş ise
    if (imgWidth > parentWidth) {
        img.style.maxWidth = '85%';
        img.style.transform = 'translateX(0)';
    } else {
        img.style.maxWidth = '90%';
        img.style.transform = 'translateX(0)';
    }
}

// Mobil cihazlar için ürün kartları büyütme özelliği
function setupProductCards() {
    if (window.innerWidth <= 768) {
        // Ürün kartları büyütme düğmesi ekle
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach((card, index) => {
            // Zoom ikonu ekle
            const zoomIcon = document.createElement('div');
            zoomIcon.className = 'zoom-icon';
            zoomIcon.innerHTML = '<i class="fas fa-search-plus"></i>';
            card.appendChild(zoomIcon);
            
            // Tıklama olayı ekle
            zoomIcon.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                showProductModal(card, index);
            });
            
            // Kart tıklaması için de aynı fonksiyonu ekle (opsiyonel)
            card.addEventListener('click', function() {
                showProductModal(card, index);
            });
        });
        
        // Sayfanın sonuna modal ekle
        if (!document.querySelector('.product-modal')) {
            createProductModal();
        }
    }
}

// Ürün modalını oluştur
function createProductModal() {
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    
    const content = document.createElement('div');
    content.className = 'modal-content';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.addEventListener('click', closeProductModal);
    
    const image = document.createElement('div');
    image.className = 'modal-image';
    
    const title = document.createElement('h3');
    title.className = 'modal-title';
    
    const description = document.createElement('p');
    description.className = 'modal-description';
    
    const features = document.createElement('div');
    features.className = 'modal-features';
    
    const button = document.createElement('button');
    button.className = 'modal-btn';
    button.textContent = 'Detaylar';
    
    content.appendChild(closeBtn);
    content.appendChild(image);
    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(features);
    content.appendChild(button);
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Arka plana tıklayınca modalı kapat
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeProductModal();
        }
    });
}

// Ürün modalını göster
function showProductModal(card, index) {
    const modal = document.querySelector('.product-modal');
    if (!modal) return;
    
    const modalImage = modal.querySelector('.modal-image');
    const modalTitle = modal.querySelector('.modal-title');
    const modalDesc = modal.querySelector('.modal-description');
    const modalFeatures = modal.querySelector('.modal-features');
    const modalBtn = modal.querySelector('.modal-btn');
    
    // Verileri doldur
    const cardImage = card.querySelector('img');
    const cardTitle = card.querySelector('h3');
    const cardDesc = card.querySelector('p');
    const cardFeatures = card.querySelectorAll('.product-features span');
    
    // Resim oluştur
    modalImage.innerHTML = '';
    const img = document.createElement('img');
    img.src = cardImage.src;
    img.alt = cardImage.alt;
    modalImage.appendChild(img);
    
    // Diğer bilgileri doldur
    modalTitle.textContent = cardTitle.textContent;
    modalDesc.textContent = cardDesc.textContent;
    
    // Özellikleri doldur
    modalFeatures.innerHTML = '';
    cardFeatures.forEach(feature => {
        const span = document.createElement('span');
        span.textContent = feature.textContent;
        modalFeatures.appendChild(span);
    });
    
    // Buton linki (opsiyonel)
    const cardLink = card.querySelector('a.btn');
    if (cardLink) {
        modalBtn.addEventListener('click', function() {
            window.location.href = cardLink.href;
        });
    }
    
    // Modalı göster
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Scroll'u devre dışı bırak
}

// Ürün modalını kapat
function closeProductModal() {
    const modal = document.querySelector('.product-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Scroll'u tekrar etkinleştir
    }
}

// Scroll Top Button ve Animasyon Stilleri
document.head.insertAdjacentHTML('beforeend', `
<style>
.scroll-top {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background-color: #ff7f00;
    color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s, transform 0.3s;
    z-index: 99;
}

.scroll-top:hover {
    background-color: #e67300;
    transform: translateY(-5px);
}

.animate-in {
    animation: fadeIn 0.8s ease forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Loader overlay */
.loader-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    transition: opacity 0.5s ease;
}

.loader {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #ff7f00;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.slider-container.images-loaded .slide-image {
    opacity: 0.9;
}

/* Slider animasyonları */
.slide-title, .slide-description, .slide-features, .slide .btn {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.slide.active .slide-title, 
.slide.active .slide-description, 
.slide.active .slide-features, 
.slide.active .btn {
    opacity: 1;
    transform: translateY(0);
}
</style>
`); 