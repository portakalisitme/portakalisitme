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
            mobileSliderContainer.style.height = 'auto';
            
            // Mobil slayt resimlerinin boyutunu düzelt - tüm mobil cihazlarda 230px olsun
            const mobileSlideImages = document.querySelectorAll('.mobile-slide-image');
            mobileSlideImages.forEach(img => {
                img.style.objectFit = 'cover';
                img.style.width = '100%';
                img.style.height = '230px';
            });
            
            // Mobil slider'da ileri geri tuşlarının konumunu ayarla
            const prevButton = document.querySelector('.mobile-slider-nav.prev');
            const nextButton = document.querySelector('.mobile-slider-nav.next');
            
            if (prevButton && nextButton) {
                // İleri geri tuşlarını ortalayarak yerleştir (mobil slayt resmi yüksekliği 230px)
                const buttonOffset = 115; // 230px'in yarısı
                
                prevButton.style.top = buttonOffset + 'px';
                nextButton.style.top = buttonOffset + 'px';
            }
        } else {
            sliderContainer.style.display = 'block';
            mobileSliderContainer.style.display = 'none';
            
            // Normal slider yüksekliğini ekran boyutuna göre ayarla
            if (viewportWidth >= 1900) {
                sliderContainer.style.height = '1400px';
            } else if (viewportWidth >= 1400) {
                sliderContainer.style.height = '800px';
            } else if (viewportWidth >= 992) {
                sliderContainer.style.height = '650px';
            } else {
                sliderContainer.style.height = '500px';
            }
            
            // Tüm slaytlarda görüntü ayarlarını düzenle
            const slideImages = document.querySelectorAll('.slide-image');
            slideImages.forEach(img => {
                img.style.objectFit = 'cover';
                img.style.objectPosition = 'center';
                img.style.width = '100%';
                img.style.height = '100%';
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
    
    // Mobil menü için kapat butonu ekle (sadece mobil cihazlarda)
    if (nav) {
        const closeButton = document.createElement('button');
        closeButton.className = 'close-menu';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.style.display = window.innerWidth <= 768 ? 'block' : 'none';
        nav.prepend(closeButton);
        
        closeButton.addEventListener('click', function() {
            nav.classList.remove('active');
            // Body scrolling'i aktif et
            document.body.style.overflow = '';
        });
        
        // Pencere boyutu değiştiğinde kapat butonunun görünürlüğünü ayarla
        window.addEventListener('resize', function() {
            closeButton.style.display = window.innerWidth <= 768 ? 'block' : 'none';
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

    // Ürün Kartları Kaydırma İşlevselliği
    function setupProductCardsScroll() {
        const productCards = document.querySelector('.product-cards');
        if (!productCards) return;
        
        // Mobil cihazda ürün kartlarının soldan başlamasını sağlayalım
        if(window.innerWidth <= 991) {
            // Başlangıçta sıfır pozisyondan başlat (setTimeout ile gecikmeli uygula)
            setTimeout(() => {
                productCards.scrollLeft = 0;
            }, 100);
            
            // Dokunma hareketleri için destek ekleyelim
            let startX, scrollLeft;
            let isDown = false;
            
            productCards.addEventListener('mousedown', (e) => {
                isDown = true;
                startX = e.pageX - productCards.offsetLeft;
                scrollLeft = productCards.scrollLeft;
                productCards.style.cursor = 'grabbing';
            });
            
            productCards.addEventListener('mouseleave', () => {
                isDown = false;
                productCards.style.cursor = 'grab';
            });
            
            productCards.addEventListener('mouseup', () => {
                isDown = false;
                productCards.style.cursor = 'grab';
            });
            
            productCards.addEventListener('mousemove', (e) => {
                if(!isDown) return;
                e.preventDefault();
                const x = e.pageX - productCards.offsetLeft;
                const walk = (x - startX) * 2; // Kaydırma hızı
                productCards.scrollLeft = scrollLeft - walk;
            });
            
            // Dokunmatik ekran için
            productCards.addEventListener('touchstart', (e) => {
                isDown = true;
                startX = e.touches[0].pageX - productCards.offsetLeft;
                scrollLeft = productCards.scrollLeft;
            }, { passive: true });
            
            productCards.addEventListener('touchend', () => {
                isDown = false;
            });
            
            productCards.addEventListener('touchcancel', () => {
                isDown = false;
            });
            
            productCards.addEventListener('touchmove', (e) => {
                if(!isDown) return;
                const x = e.touches[0].pageX - productCards.offsetLeft;
                const walk = (x - startX) * 2;
                productCards.scrollLeft = scrollLeft - walk;
            }, { passive: true });
        }
    }
    
    // Sayfa yüklendiğinde başlat
    if (document.querySelector('.slider')) {
        initSlider();
    }
    
    if (document.querySelector('.mobile-slider')) {
        initMobileSlider();
    }
    
    // Ürün kartları kaydırma işlevini başlat
    setupProductCardsScroll();
    
    // Sayfa tamamen yüklendiğinde ürün kartlarının başlangıç konumunu garantileyelim
    window.addEventListener('load', function() {
        // Ürün kartlarını başlangıçta sola hizala
        const productCards = document.querySelector('.product-cards');
        if (productCards && window.innerWidth <= 991) {
            // İlk başta sıfırla
            productCards.scrollLeft = 0;
            
            // Yüklenme sonrasında tekrar sıfırla (Bazı tarayıcıların scroll pozisyonunu hatırlaması için)
            setTimeout(() => {
                productCards.scrollLeft = 0;
            }, 100);
            
            // Biraz daha bekleyip, DOM tam yerleştikten sonra tekrar sıfırla
            setTimeout(() => {
                productCards.scrollLeft = 0;
                
                // Ürün kartlarının görünürlüğünü güçlendir
                const firstCard = productCards.querySelector('.product-card:first-child');
                if (firstCard) {
                    firstCard.style.opacity = '1';
                }
            }, 500);
        }
        setupProductCardsScroll();
    });
    
    // DOMContentLoaded sonrasında da scrollLeft'i sıfırla (bazı durumlar için ek güvenlik)
    document.addEventListener('DOMContentLoaded', function() {
        const productCards = document.querySelector('.product-cards');
        if (productCards && window.innerWidth <= 991) {
            productCards.scrollLeft = 0;
        }
    });
    
    // Pencerenin yeniden boyutlandırılması durumunda ürün kartlarını yeniden düzenle
    window.addEventListener('resize', function() {
        setupProductCardsScroll();
    });
    
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

    // SSS (Sıkça Sorulan Sorular) Akordiyon Fonksiyonu
    initFaqAccordion();
    
    // Sayfadaki tüm animasyon efektlerinin başlatılması
    initPageAnimations();

    // Ürün sayfası testimonial slider işlevi
    initTestimonialSlider();

    // Kategori Seçimi İşlevselliği
    const categoryOptions = document.querySelectorAll('.category-option');
    const seriesBoxes = document.querySelectorAll('.series-box');
    
    if (categoryOptions.length > 0 && seriesBoxes.length > 0) {
        // Sayfa yüklendiğinde varsayılan olarak 'kulak-disi' kategorisini aktif et
        let activeCategory = 'kulak-disi';
        const defaultCategory = document.querySelector('.category-option[data-category="kulak-disi"]');
        if (defaultCategory) {
            defaultCategory.classList.add('active');
        }
        
        // Kategori seçeneklerine tıklama olaylarını ekle
        categoryOptions.forEach(option => {
            option.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                // Tüm seçeneklerin 'active' sınıfını kaldır
                categoryOptions.forEach(opt => opt.classList.remove('active'));
                
                // Tıklanan seçeneği aktif et
                this.classList.add('active');
                
                // Seçilen kategoriye göre ürün serilerini filtrele ve göster/gizle
                seriesBoxes.forEach(box => {
                    const boxCategory = box.getAttribute('data-category');
                    
                    if (boxCategory === category) {
                        box.style.display = 'flex';
                        // Sayfa kaydırma işlemi
                        setTimeout(() => {
                            const seriesSection = document.querySelector('.product-series-section');
                            if (seriesSection) {
                                seriesSection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }, 100);
                    } else {
                        box.style.display = 'none';
                    }
                });
                
                // Aktif kategoriyi güncelle
                activeCategory = category;
            });
        });
        
        // Sayfa ilk yüklendiğinde varsayılan kategoriye göre ürünleri filtrele
        seriesBoxes.forEach(box => {
            const boxCategory = box.getAttribute('data-category');
            if (boxCategory !== activeCategory) {
                box.style.display = 'none';
            }
        });
    }

    // Kategori etiketlerini ekleyelim
    addCategoryTags();
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
            // Büyüteç özelliği kaldırıldı
            
            // Kart tıklaması için fonksiyonu ekle
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

// SSS (Sıkça Sorulan Sorular) Akordiyon Fonksiyonu
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Diğer tüm açık olan SSS öğelerini kapat
                const activeFaqs = document.querySelectorAll('.faq-item.active');
                activeFaqs.forEach(activeFaq => {
                    if (activeFaq !== item) {
                        activeFaq.classList.remove('active');
                    }
                });
                
                // Tıklanan öğeyi aç/kapat
                item.classList.toggle('active');
            });
        });
        
        // İlk SSS öğesini varsayılan olarak aç
        faqItems[0].classList.add('active');
    }
}

// Sayfa animasyon efektleri
function initPageAnimations() {
    // Sayfadaki animasyon efekti verilecek elementleri seç
    const animatedElements = document.querySelectorAll(
        '.process-step, .value-box, .type-box, .stat-box, ' +
        '.service-card, .mission-box, .vision-box, .goals-section'
    );
    
    if (animatedElements.length > 0) {
        // IntersectionObserver ile viewport'a giren elementlere animasyon efekti ekle
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated-visible');
                    // Elementi bir kez görünür yaptıktan sonra izlemeyi bırak
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 // Element %10 görünür olduğunda tetikle
        });
        
        // Her elementi izlemeye başla
        animatedElements.forEach(element => {
            element.classList.add('animated-item'); // Animasyon için CSS sınıfı ekle
            observer.observe(element);
        });
    }
}

// Ürün sayfası testimonial slider işlevi
function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.testimonial-dots');
    const prevBtn = document.querySelector('.prev-testimonial');
    const nextBtn = document.querySelector('.next-testimonial');
    
    if (slides.length === 0) return; // Slider yoksa işlemi sonlandır
    
    let currentSlide = 0;
    
    // Dot'ları oluştur
    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('div');
        dot.classList.add('testimonial-dot');
        if (i === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            goToSlide(i);
        });
        
        dotsContainer.appendChild(dot);
    }
    
    // İlk slide'ı aktif yap
    slides[0].classList.add('active');
    
    // Önceki slide'a git
    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(currentSlide);
    });
    
    // Sonraki slide'a git
    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    });
    
    // Belirli bir slide'a git
    function goToSlide(slideIndex) {
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        const dots = document.querySelectorAll('.testimonial-dot');
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        slides[slideIndex].classList.add('active');
        dots[slideIndex].classList.add('active');
        currentSlide = slideIndex;
    }
    
    // Otomatik geçiş
    let slideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    }, 5000);
    
    // Kullanıcı etkileşiminde otomatik geçişi sıfırla
    const sliderContainer = document.querySelector('.testimonials-slider');
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            goToSlide(currentSlide);
        }, 5000);
    });
}

// Kategori etiketlerini ekleyen fonksiyon
function addCategoryTags() {
    // Tüm ürün kartlarını seçelim
    const seriesBoxes = document.querySelectorAll('.series-box');
    
    // Her kart için kategori etiketi ekleyelim
    seriesBoxes.forEach(box => {
        const category = box.getAttribute('data-category');
        if (category) {
            const categoryTag = document.createElement('div');
            categoryTag.className = `category-tag ${category}`;
            
            // Kategori adını Türkçe'ye çevirelim
            let categoryText = 'Kategori';
            if (category === 'kulak-ici') {
                categoryText = 'Kulak İçi';
            } else if (category === 'kulak-disi') {
                categoryText = 'Kulak Arkası';
            }
            
            categoryTag.textContent = categoryText;
            box.appendChild(categoryTag);
        }
    });
} 