// Function to add header-fix.css to all pages
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the homepage
    const isHomepage = window.location.pathname === '/' || 
                      window.location.pathname === '/index.html' || 
                      window.location.pathname.endsWith('/portakal-web/') ||
                      window.location.pathname.endsWith('/portakal-web/index.html');
    
    // If not the homepage and header-fix.css is not already loaded
    if (!isHomepage && !document.querySelector('link[href*="header-fix.css"]')) {
        // Create link element
        const headerFixLink = document.createElement('link');
        headerFixLink.rel = 'stylesheet';
        
        // Determine proper path based on current location
        const isSubfolder = window.location.pathname.split('/').length > 2;
        headerFixLink.href = isSubfolder ? '../css/header-fix.css' : 'css/header-fix.css';
        
        // Append to head
        document.head.appendChild(headerFixLink);
        
        console.log('Header fix CSS added to interior page');
    }
    
    // For homepage, make sure header has the homepage-header class
    if (isHomepage) {
        const mainHeader = document.querySelector('.main-header');
        if (mainHeader && !mainHeader.classList.contains('homepage-header')) {
            mainHeader.classList.add('homepage-header');
            console.log('Homepage header class added');
        }
    }
}); 