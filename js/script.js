document.addEventListener('DOMContentLoaded', function() {
    // Mobil cihaz kontrolü
    const isMobile = window.innerWidth < 768;

    // Normal Slider Fonksiyonu
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const slideInterval = isMobile ? 5000 : 7000; // Mobilde daha kısa sürede geçiş
    let slideTimer;
    
    // Mobil Slider Fonksiyonu
    const mobileSlides = document.querySelectorAll('.mobile-slide');
    const mobileDots = document.querySelectorAll('.mobile-dot');
    let currentMobileSlide = 0;
    let mobileSlideTimer;
    const mobileSlideInterval = 5000;

    // Slider başlangıç ayarları
    function initSlider() {
        // Önce tüm slaytları gizle
        slides.forEach(slide => {
            slide.style.display = 'none';
        });
        
        // İlk slaytı göster
        if (slides.length > 0) {
            slides[0].style.display = 'block';
            slides[0].classList.add('active');
        }

        // Nokta navigasyonu için tıklama olayları ekle
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });

        // Slider navigasyon butonları ekleme
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
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
        }

        // Otomatik slider başlat
        startSlideTimer();
        
        // Mobil cihazlarda slider yüksekliğini ayarla
        adjustSliderHeight();
        
        // Ekran döndürme ve boyut değişikliğinde slider yüksekliğini ayarla
        window.addEventListener('resize', function() {
            adjustSliderHeight();
            checkScreenSize();
        });
        
        window.addEventListener('orientationchange', adjustSliderHeight);
        
        // Dokunmatik ekran desteği ekle
        setupTouchNavigation();
    }
    
    // Mobil Slider başlangıç ayarları
    function initMobileSlider() {
        // Önce tüm slaytları gizle
        mobileSlides.forEach(slide => {
            slide.style.display = 'none';
        });
        
        // İlk slaytı göster
        if (mobileSlides.length > 0) {
            mobileSlides[0].style.display = 'flex';
            mobileSlides[0].classList.add('active');
        }
        
        // Nokta navigasyonu için tıklama olayları ekle
        mobileDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToMobileSlide(index);
            });
        });
        
        // Slider navigasyon butonları ekleme
        const mobileSliderContainer = document.querySelector('.mobile-slider-container');
        if (mobileSliderContainer) {
            const prevButton = document.createElement('div');
            const nextButton = document.createElement('div');
            
            prevButton.className = 'mobile-slider-nav prev';
            nextButton.className = 'mobile-slider-nav next';
            
            prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
            nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
            
            mobileSliderContainer.appendChild(prevButton);
            mobileSliderContainer.appendChild(nextButton);
            
            prevButton.addEventListener('click', prevMobileSlide);
            nextButton.addEventListener('click', nextMobileSlide);
        }
        
        // Otomatik slider başlat
        startMobileSlideTimer();
        
        // Dokunmatik ekran desteği ekle
        setupMobileTouchNavigation();
    }

    // Normal ve Mobil slider'ın yüksekliğini düzenle
    function adjustSliderHeight() {
        const viewportWidth = window.innerWidth;
        const sliderContainer = document.querySelector('.slider-container');
        const mobileSliderContainer = document.querySelector('.mobile-slider-container');
        
        if (!sliderContainer || !mobileSliderContainer) return;
        
        // Mobil cihazlarda mobil slider'ı göster, diğer koşullarda normal slider'ı göster
        if (viewportWidth <= 768) {
            sliderContainer.style.display = 'none';
            mobileSliderContainer.style.display = 'block';
            
            // Mobil slider yüksekliğini ayarla
            if (viewportWidth <= 576) {
                mobileSliderContainer.style.height = '460px'; // Updated for small screens
            } else {
                mobileSliderContainer.style.height = '480px'; // Updated for medium screens
            }
        } else {
            sliderContainer.style.display = 'block';
            mobileSliderContainer.style.display = 'none';
            sliderContainer.style.height = '550px';
            
            // Tüm slaytlarda görüntü ayarlarını düzenle
            const slideImages = document.querySelectorAll('.slide-image');
            slideImages.forEach(img => {
                img.style.objectFit = 'cover';
                img.style.objectPosition = 'center';
            });
        }
    }

    // Slider zamanlayıcısını başlat
    function startSlideTimer() {
        clearInterval(slideTimer);
        slideTimer = setInterval(nextSlide, slideInterval);
    }
    
    // Mobil slider zamanlayıcısını başlat
    function startMobileSlideTimer() {
        clearInterval(mobileSlideTimer);
        mobileSlideTimer = setInterval(nextMobileSlide, mobileSlideInterval);
    }

    // Belirli slide'a git (normal slider)
    function goToSlide(index) {
        // Mevcut slaytı gizle
        slides[currentSlide].classList.remove('active');
        slides[currentSlide].style.display = 'none';
        dots[currentSlide].classList.remove('active');
        
        // Yeni slayt indeksini ayarla
        currentSlide = index;
        
        // Sınırları kontrol et
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }
        
        if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }
        
        // Yeni slaytı göster
        slides[currentSlide].classList.add('active');
        slides[currentSlide].style.display = 'block';
        dots[currentSlide].classList.add('active');
        
        // Timer'ı yeniden başlat
        startSlideTimer();
    }
    
    // Belirli mobile slide'a git
    function goToMobileSlide(index) {
        // Mevcut slaytı gizle
        mobileSlides[currentMobileSlide].classList.remove('active');
        mobileSlides[currentMobileSlide].style.display = 'none';
        mobileDots[currentMobileSlide].classList.remove('active');
        
        // Yeni slayt indeksini ayarla
        currentMobileSlide = index;
        
        // Sınırları kontrol et
        if (currentMobileSlide >= mobileSlides.length) {
            currentMobileSlide = 0;
        }
        
        if (currentMobileSlide < 0) {
            currentMobileSlide = mobileSlides.length - 1;
        }
        
        // Yeni slaytı göster
        mobileSlides[currentMobileSlide].classList.add('active');
        mobileSlides[currentMobileSlide].style.display = 'flex';
        mobileDots[currentMobileSlide].classList.add('active');
        
        // Timer'ı yeniden başlat
        startMobileSlideTimer();
    }

    // Önceki slide'a git (normal slider)
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    // Sonraki slide'a git (normal slider)
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    // Önceki mobile slide'a git
    function prevMobileSlide() {
        goToMobileSlide(currentMobileSlide - 1);
    }
    
    // Sonraki mobile slide'a git
    function nextMobileSlide() {
        goToMobileSlide(currentMobileSlide + 1);
    }

    // Dokunmatik kaydırma desteği (normal slider)
    function setupTouchNavigation() {
        const sliderContainer = document.querySelector('.slider-container');
        
        if (!sliderContainer) return;
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        sliderContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            
            // Otomatik geçişi durdur
            clearInterval(slideTimer);
        }, false);
        
        sliderContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            
            // Otomatik geçişi yeniden başlat
            startSlideTimer();
        }, false);
        
        function handleSwipe() {
            const swipeThreshold = 30; // Min. kaydırma mesafesi (daha duyarlı)
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) >= swipeThreshold) {
                if (swipeDistance < 0) {
                    // Sola kaydırma
                    nextSlide();
                } else {
                    // Sağa kaydırma
                    prevSlide();
                }
            }
        }
    }
    
    // Dokunmatik kaydırma desteği (mobil slider)
    function setupMobileTouchNavigation() {
        const mobileSliderContainer = document.querySelector('.mobile-slider-container');
        
        if (!mobileSliderContainer) return;
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        mobileSliderContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            
            // Otomatik geçişi durdur
            clearInterval(mobileSlideTimer);
        }, false);
        
        mobileSliderContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            
            // Otomatik geçişi yeniden başlat
            startMobileSlideTimer();
        }, false);
        
        function handleSwipe() {
            const swipeThreshold = 30; // Min. kaydırma mesafesi (daha duyarlı)
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) >= swipeThreshold) {
                if (swipeDistance < 0) {
                    // Sola kaydırma
                    nextMobileSlide();
                } else {
                    // Sağa kaydırma
                    prevMobileSlide();
                }
            }
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

    // Sayfa yüklendiğinde normal ve mobil slider'ı başlat
    initSlider();
    initMobileSlider();
    
    // Sayfa yüklendiğinde slider görünümünü ayarla
    adjustSliderHeight();
    
    // Görüntülerin doğru yüklenmesi için olay dinleyicileri ekle
    window.addEventListener('load', function() {
        // Yükleme ekranını kaldır
        const loaderOverlay = document.querySelector('.loader-overlay');
        if (loaderOverlay) {
            loaderOverlay.style.opacity = '0';
            setTimeout(() => {
                loaderOverlay.style.display = 'none';
            }, 500);
        }
        
        const slideImages = document.querySelectorAll('.slide-image, .mobile-slide-image');
        
        slideImages.forEach(img => {
            // Eğer görüntü zaten yüklendiyse
            if (img.complete) {
                img.style.opacity = '1';
            } else {
                // Görüntü yüklendiğinde
                img.addEventListener('load', function() {
                    img.style.opacity = '1';
                });
                
                // Yükleme hatası durumunda
                img.addEventListener('error', function() {
                    console.error('Görüntü yüklenemedi:', img.src);
                    // Hata durumunda alternatif görüntü göster veya stil değiştir
                    img.style.backgroundColor = '#f1f1f1';
                });
            }
        });
        
        const sliderContainer = document.querySelector('.slider-container');
        const mobileSliderContainer = document.querySelector('.mobile-slider-container');
        
        if (sliderContainer) {
            sliderContainer.classList.add('images-loaded');
            sliderContainer.style.maxWidth = '100vw';
        }
        
        if (mobileSliderContainer) {
            mobileSliderContainer.classList.add('images-loaded');
        }
        
        document.body.style.overflowX = 'hidden';
        
        // Ürün kartlarındaki görüntüleri ortalama
        centerProductImages();
        
        // Ürün kartları büyütme özelliğini ayarla
        setupProductCards();
    });
    
    // Sayfa boyutu değiştiğinde kontrol et
    function checkScreenSize() {
        if (window.innerWidth > 768) {
            // Menu'yu kapat ve dropdown'ları sıfırla
            if (nav) nav.classList.remove('active');
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
            document.body.style.overflow = '';
        }
        
        // Slider görünümünü ayarla
        adjustSliderHeight();
        
        // Ürün kartları ve görüntüleri de güncelle
        centerProductImages();
        setupProductCards();
    }

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
    
    // Görsel konteynerden daha geniş ise
    if (imgWidth > parentWidth) {
        img.style.maxWidth = '85%';
    } else {
        img.style.maxWidth = '90%';
    }
    
    // Görsel merkezde olacak şekilde ayarla
    img.style.display = 'block';
    img.style.margin = '0 auto';
}

// Mobil cihazlar için ürün kartları büyütme özelliği
function setupProductCards() {
    if (window.innerWidth <= 768) {
        // Ürün kartları büyütme düğmesi ekle
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach((card, index) => {
            // Önceden eklenmiş zoom ikonlarını kontrol et
            if (!card.querySelector('.zoom-icon')) {
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
                
                // Kart tıklaması için de aynı fonksiyonu ekle
                card.addEventListener('click', function() {
                    showProductModal(card, index);
                });
            }
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

.slider-container.images-loaded .slide-image,
.mobile-slider-container.images-loaded .mobile-slide-image {
    opacity: 0.9;
}

/* Slider animasyonları */
.slide-title, .slide-description, .slide-features, .slide .btn,
.mobile-slide-title, .mobile-slide-description, .mobile-slide-features, .mobile-slide .btn {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.slide.active .slide-title, 
.slide.active .slide-description, 
.slide.active .slide-features, 
.slide.active .btn,
.mobile-slide.active .mobile-slide-title,
.mobile-slide.active .mobile-slide-description,
.mobile-slide.active .mobile-slide-features,
.mobile-slide.active .btn {
    opacity: 1;
    transform: translateY(0);
}
</style>
`); 