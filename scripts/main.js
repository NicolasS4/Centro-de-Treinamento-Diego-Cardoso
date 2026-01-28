// Menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav ul');
    const body = document.body;
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            body.classList.toggle('menu-active');
            
            // Fechar menu ao clicar em um link
            document.querySelectorAll('nav a').forEach(link => {
                link.addEventListener('click', function() {
                    nav.classList.remove('active');
                    body.classList.remove('menu-active');
                });
            });
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Verificar se é um link âncora (começa com #)
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                
                const targetId = href;
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu after clicking
                    if (nav && nav.classList.contains('active')) {
                        nav.classList.remove('active');
                        body.classList.remove('menu-active');
                    }
                }
            }
        });
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (nav && nav.classList.contains('active') && 
            !e.target.closest('nav') && 
            !e.target.closest('.menu-toggle')) {
            nav.classList.remove('active');
            body.classList.remove('menu-active');
        }
    });
    
    // Fechar menu ao redimensionar a janela
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && nav && nav.classList.contains('active')) {
            nav.classList.remove('active');
            body.classList.remove('menu-active');
        }
    });
    
    // Restante do código permanece o mesmo...
    // Animation on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature, .pricing-card, .professor-card, .benefit-item, .philosophy-item, .athlete-card, .gallery-item, .stat-item');
        
        elements.forEach(element => {
            const position = element.getBoundingClientRect();
            
            // If element is in viewport
            if(position.top < window.innerHeight - 100) {
                element.style.opacity = 1;
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initially set elements to be hidden
    document.querySelectorAll('.feature, .pricing-card, .professor-card, .benefit-item, .philosophy-item, .athlete-card, .gallery-item, .stat-item').forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(50px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Run on scroll and initially
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
    
    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Aqui você normalmente enviaria os dados do formulário para um servidor
            // Por enquanto, vamos apenas mostrar um alerta
            alert('Obrigado por sua mensagem! Entraremos em contato em breve.');
            contactForm.reset();
        });
    }
});