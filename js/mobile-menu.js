// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobil Menü Toggle işlevselliği
    const menuButton = document.querySelector('.menu-button');
    const nav = document.querySelector('nav');
    
    if (menuButton && nav) {
        // Kapat butonu oluştur (eğer yoksa)
        if (!nav.querySelector('.close-menu')) {
            const closeButton = document.createElement('button');
            closeButton.className = 'close-menu';
            closeButton.innerHTML = '<i class="fas fa-times"></i>';
            nav.prepend(closeButton);
            
            closeButton.addEventListener('click', function() {
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Menü butonuna tıklama olayı ekle
        menuButton.addEventListener('click', function() {
            console.log('Menu button clicked');
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                document.body.style.overflow = '';
            } else {
                nav.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
        
        // Dropdown işlevselliği
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const dropdownLink = dropdown.querySelector('a');
            
            if (dropdownLink) {
                dropdownLink.addEventListener('click', function(e) {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        
                        // Diğer dropdown'ları kapat
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
    }
}); 