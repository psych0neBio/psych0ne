// Custom Cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

if (cursor && follower && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            follower.style.left = e.clientX - 12 + 'px';
            follower.style.top = e.clientY - 12 + 'px';
        }, 50);
    });

    // Hover effects
    const interactiveElements = document.querySelectorAll('a, button, .about-card, .contact-card, .game-card, .project-item');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            follower.style.width = '50px';
            follower.style.height = '50px';
            follower.style.borderColor = 'var(--orange)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            follower.style.width = '32px';
            follower.style.height = '32px';
            follower.style.borderColor = 'var(--purple)';
        });
    });
}

// Mobile Menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Scroll reveal animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.about-card, .game-card, .project-item, .contact-card, .mini-game').forEach(el => {
    observer.observe(el);
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.8)';
    }
    
    lastScroll = currentScroll;
});

// Glitch effect on hover
const glitchElement = document.querySelector('.glitch');
if (glitchElement) {
    const originalText = glitchElement.textContent;
    
    glitchElement.addEventListener('mouseenter', () => {
        const chars = '!<>-_\\/[]{}—=+*^?#________';
        let iterations = 0;
        
        const interval = setInterval(() => {
            glitchElement.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');
            
            if (iterations >= originalText.length) {
                clearInterval(interval);
                glitchElement.textContent = originalText;
            }
            
            iterations += 1/3;
        }, 30);
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});