// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mobile menu script loaded');
    
    // Directly select the menu button and nav elements
    const menuButton = document.querySelector('.menu-button');
    const nav = document.querySelector('nav');
    
    // Check if elements exist
    console.log('Menu button found:', menuButton !== null);
    console.log('Nav found:', nav !== null);
    
    // Add direct click event handler to menu button
    if (menuButton) {
        // Remove any existing click handlers
        menuButton.removeEventListener('click', toggleMenu);
        
        // Add new click handler
        menuButton.addEventListener('click', toggleMenu);
        
        // Also add touch event for mobile
        menuButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            toggleMenu();
        });
        
        console.log('Click event added to menu button');
    }
    
    function toggleMenu() {
        console.log('Menu button clicked');
        
        if (!nav) return;
        
        if (nav.classList.contains('active')) {
            nav.classList.remove('active');
            document.body.style.overflow = '';
            console.log('Menu closed');
        } else {
            nav.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('Menu opened');
        }
    }
    
    // Ensure close button exists and works
    if (nav) {
        // Remove any existing close button
        const existingCloseButton = nav.querySelector('.close-menu');
        if (existingCloseButton) {
            existingCloseButton.remove();
        }
        
        // Create new close button
        const closeButton = document.createElement('button');
        closeButton.className = 'close-menu';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.style.display = 'block';
        nav.prepend(closeButton);
        
        // Add click event to close button
        closeButton.addEventListener('click', function() {
            nav.classList.remove('active');
            document.body.style.overflow = '';
            console.log('Menu closed via close button');
        });
        
        console.log('Close button added to nav');
        
        // Handle dropdown menus
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const dropdownLink = dropdown.querySelector('a');
            
            if (dropdownLink) {
                // Remove any existing click handlers
                dropdownLink.removeEventListener('click', toggleDropdown);
                
                // Add new click handler for dropdown
                dropdownLink.addEventListener('click', function(e) {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        
                        // Close other dropdowns
                        dropdowns.forEach(item => {
                            if (item !== dropdown && item.classList.contains('active')) {
                                item.classList.remove('active');
                            }
                        });
                        
                        // Toggle this dropdown
                        dropdown.classList.toggle('active');
                        console.log('Dropdown toggled');
                    }
                });
            }
        });
    }

    // Manually trigger a click event on menu button after a short delay to check functionality
    setTimeout(() => {
        if (menuButton) {
            console.log('Testing click event on menu button');
            // Create and dispatch a test click event
            const testEvent = new Event('click');
            menuButton.dispatchEvent(testEvent);
            
            // Reset menu state after test
            setTimeout(() => {
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    document.body.style.overflow = '';
                    console.log('Test complete - reset menu state');
                }
            }, 500);
        }
    }, 2000);
}); 