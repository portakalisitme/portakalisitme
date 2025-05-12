// Immediate execution script for the menu button
(function() {
    console.log('Menu fix script executing immediately');
    
    // Function to fix menu button - will run immediately and also on load
    function fixMenuButton() {
        console.log('Fixing menu button...');
        
        // Get menu elements
        const menuButton = document.querySelector('.menu-button');
        const nav = document.querySelector('nav');
        
        if (!menuButton || !nav) {
            console.error('Menu button or nav not found');
            return;
        }
        
        console.log('Menu elements found');
        
        // Function to toggle menu
        function toggleMenu(event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            console.log('Toggle menu clicked');
            
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                document.body.style.overflow = '';
            } else {
                nav.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
        
        // Add multiple event types to ensure it works
        ['click', 'touchstart', 'mousedown'].forEach(eventType => {
            menuButton.addEventListener(eventType, function(e) {
                e.preventDefault();
                console.log(eventType + ' detected on menu button');
                toggleMenu();
            }, { passive: false });
        });
        
        // Explicitly set menu button styling to ensure it's visible and clickable
        menuButton.style.display = 'block';
        menuButton.style.cursor = 'pointer';
        menuButton.style.zIndex = '9999';
        
        // Add click handler to document to close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (nav.classList.contains('active') && 
                !nav.contains(e.target) && 
                e.target !== menuButton && 
                !menuButton.contains(e.target)) {
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        console.log('Menu button has been fixed');
    }
    
    // Run immediately
    fixMenuButton();
    
    // Also run on load to ensure everything is ready
    window.addEventListener('load', fixMenuButton);
    
    // Run again after a slight delay (backup)
    setTimeout(fixMenuButton, 1000);
})(); 