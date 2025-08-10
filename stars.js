const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

// Responsive canvas setup
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resize();

// Enhanced resize handler
function handleResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Recalculate halo center
    const HALO_CX = canvas.width / 2;
    const HALO_CY = canvas.height / 2;
    
    // Adjust halo radius based on screen size
    let HALO_RADIUS = 210;
    if (window.innerWidth < 768) {
        HALO_RADIUS = 150;
    } else if (window.innerWidth < 480) {
        HALO_RADIUS = 100;
    }
    
    // Reset all stars with new dimensions
    stars.forEach(star => resetStar(star));
}

window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', handleResize);

// Responsive halo settings
let HALO_CX = canvas.width / 2;
let HALO_CY = canvas.height / 2;
let HALO_RADIUS = window.innerWidth < 768 ? 150 : (window.innerWidth < 480 ? 100 : 210);

const STAR_COUNT = window.innerWidth < 480 ? 60 : (window.innerWidth < 768 ? 80 : 98);

function resetStar(star) {
    // Start: random edge position
    const edge = Math.floor(Math.random() * 4);
    if (edge === 0) { // top edge
        star.x = Math.random() * canvas.width;
        star.y = -20;
    } else if (edge === 1) { // bottom
        star.x = Math.random() * canvas.width;
        star.y = canvas.height + 20;
    } else if (edge === 2) { // left
        star.x = -20;
        star.y = Math.random() * canvas.height;
    } else { // right
        star.x = canvas.width + 20;
        star.y = Math.random() * canvas.height;
    }

    // Direction: unit vector toward halo center
    const dx = HALO_CX - star.x;
    const dy = HALO_CY - star.y;
    const dist = Math.sqrt(dx*dx + dy*dy) || 1;
    star.vx = dx / dist * (2 + Math.random() * 1.15);
    star.vy = dy / dist * (2 + Math.random() * 1.15);
    star.radius = 1 + Math.random() * 1.2;
    star.opacity = 0.45 + Math.random() * 0.35;
    star.travelled = 0;
    star.totalDist = dist;
}

const stars = [];
for (let i = 0; i < STAR_COUNT; i++) {
    const s = {};
    resetStar(s);
    stars.push(s);
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Recalculate halo center on resize
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    
    for (let star of stars) {
        // Move toward halo
        star.x += star.vx;
        star.y += star.vy;
        star.travelled += Math.sqrt(star.vx*star.vx + star.vy*star.vy);

        // Get distance to halo center for fade/size
        const distToCenter = Math.sqrt((star.x-cx)**2 + (star.y-cy)**2);

        // Fade in as it nears; shrink too
        let fadeValue = Math.min(1, distToCenter / star.totalDist);
        let scale = 0.3 + 0.7 * fadeValue;

        ctx.globalAlpha = fadeValue * star.opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * scale, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(200,180,255,1)`;
        ctx.shadowColor = '#a679ff';
        ctx.shadowBlur = 9 + (star.radius*scale) * 10;
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha = 1;

        // If close to or inside the halo, respawn at edge
        if (distToCenter < HALO_RADIUS + 10) {
            resetStar(star);
        }
    }

    requestAnimationFrame(drawStars);
}

drawStars();

// Enhanced animations and interactions
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const tagline = document.querySelector('.tagline');
        if (tagline) {
            tagline.classList.add('loaded');
        }
    }, 50);
});

// Brand banner animation
document.addEventListener('DOMContentLoaded', () => {
    const banner = document.querySelector('.brand-banner');
    if ('IntersectionObserver' in window && banner) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    banner.classList.add('visible');
                    observer.unobserve(banner);
                }
            });
        }, {
            threshold: 0.1
        });
        observer.observe(banner);
    } else if (banner) {
        banner.classList.add('visible');
    }
});

// Main content animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Handle specific section animations
                if (entry.target.classList.contains('scroll-animate-left')) {
                    const animatedContainer = entry.target.querySelector('.animated-container');
                    const featureItems = entry.target.querySelectorAll('.feature-item');
                    
                    setTimeout(() => {
                        if (animatedContainer) {
                            animatedContainer.classList.add('animate');
                        }
                    }, 200);
                    
                    featureItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animate');
                        }, 800 + (index * 200));
                    });
                }

                if (entry.target.classList.contains('scroll-animate-right')) {
                    const statItems = entry.target.querySelectorAll('.stat-item');
                    statItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animate');
                        }, 300 + (index * 200));
                    });
                }
            }
        });
    }, observerOptions);

    // Observe header elements
    const headerElements = [
        document.querySelector('.services-tag'),
        document.querySelector('.main-title'),
        document.querySelector('.subtitle')
    ];

    headerElements.forEach((element, index) => {
        if (element) {
            const headerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('animate');
                        }, index * 200);
                    }
                });
            }, observerOptions);
            headerObserver.observe(element);
        }
    });

    // Observe scroll elements
    const scrollElements = document.querySelectorAll('.scroll-animate-left, .scroll-animate-right, .scroll-animate');
    scrollElements.forEach(element => {
        observer.observe(element);
    });
});

// Second section animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate1');
                
                if (entry.target.classList.contains('scroll-animate-right1')) {
                    const animatedContainer = entry.target.querySelector('.animated-container1');
                    const featureItems = entry.target.querySelectorAll('.feature-item1');
                    
                    setTimeout(() => {
                        if (animatedContainer) {
                            animatedContainer.classList.add('animate1');
                        }
                    }, 200);
                    
                    featureItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animate1');
                        }, 800 + (index * 200));
                    });
                }

                if (entry.target.classList.contains('scroll-animate-left1')) {
                    const statItems = entry.target.querySelectorAll('.stat-item1');
                    statItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animate1');
                        }, 300 + (index * 200));
                    });
                }
            }
        });
    }, observerOptions);

    const headerElements = [
        document.querySelector('.services-tag1'),
        document.querySelector('.main-title1'),
        document.querySelector('.subtitle1')
    ];

    headerElements.forEach((element, index) => {
        if (element) {
            const headerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('animate1');
                        }, index * 200);
                    }
                });
            }, observerOptions);
            headerObserver.observe(element);
        }
    });

    const scrollElements = document.querySelectorAll('.scroll-animate-left1, .scroll-animate-right1, .scroll-animate1');
    scrollElements.forEach(element => {
        observer.observe(element);
    });
});

// Process section animator
class ProcessAnimator2 {
    constructor() {
        this.init();
        this.setupIntersectionObserver();
        this.setupInteractiveElements();
        this.startChecklistAnimation();
        this.startProgressAnimation();
    }

    init() {
        setTimeout(() => {
            const title = document.querySelector('.main-title2');
            const subtitle = document.querySelector('.subtitle2');
            if (title) title.classList.add('visible2');
            if (subtitle) subtitle.classList.add('visible2');
        }, 500);
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStepCard(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.step-card2').forEach(card => {
            observer.observe(card);
        });
    }

    animateStepCard(card) {
        const stepNumber = card.dataset.step;
        const delay = parseInt(stepNumber) * 200;
        
        setTimeout(() => {
            card.classList.add('visible2');
            this.animateStepElements(card);
        }, delay);
    }

    animateStepElements(card) {
        const elements = [
            card.querySelector('.step-number2'),
            card.querySelector('.step-title2'),
            card.querySelector('.step-description2'),
            card.querySelector('.step-visual2')
        ];

        elements.forEach((element, index) => {
            if (element) {
                setTimeout(() => {
                    element.classList.add('visible2');
                }, index * 150);
            }
        });
    }

    setupInteractiveElements() {
        // Radar interaction
        const radar = document.getElementById('radar12');
        if (radar) {
            radar.addEventListener('click', () => {
                this.pulseRadar();
            });
        }

        // Window buttons interaction
        document.querySelectorAll('.window-button2').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleWindowButton(e.target);
            });
        });

        // Lines container interaction
        const linesContainer = document.getElementById('linesContainer2');
        if (linesContainer) {
            linesContainer.addEventListener('mouseenter', () => {
                this.intensifyLines(linesContainer);
            });
            linesContainer.addEventListener('mouseleave', () => {
                this.normalizeLines(linesContainer);
            });
        }

        // Chart icon interaction
        const chartIcon = document.getElementById('chartIcon2');
        if (chartIcon) {
            chartIcon.addEventListener('click', () => {
                this.animateChart();
            });
        }
    }

    pulseRadar() {
        const radar = document.getElementById('radar12');
        if (radar) {
            radar.style.animation = 'none';
            radar.style.transform = 'scale(1.2)';
            radar.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.6)';
            
            setTimeout(() => {
                radar.style.transform = 'scale(1)';
                radar.style.boxShadow = 'none';
            }, 300);
        }
    }

    handleWindowButton(button) {
        const allButtons = document.querySelectorAll('.window-button2');
        allButtons.forEach(btn => btn.style.transform = 'scale(1)');
        
        button.style.transform = 'scale(1.5)';
        button.style.boxShadow = '0 0 10px currentColor';
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = 'none';
        }, 200);

        if (button.classList.contains('close2')) {
            this.simulateWindowClose();
        }
    }

    simulateWindowClose() {
        const windowContainer = document.querySelector('.window-container2');
        if (windowContainer) {
            windowContainer.style.opacity = '0.5';
            setTimeout(() => {
                windowContainer.style.opacity = '1';
            }, 500);
        }
    }

    intensifyLines(container) {
        const lines = container.querySelectorAll('.line2');
        lines.forEach(line => {
            line.style.animationDuration = '0.8s';
            line.style.background = 'linear-gradient(90deg, #8b5cf6, #a855f7, #10b981, #06b6d4)';
            line.style.filter = 'brightness(1.5) saturate(1.2)';
        });
    }

    normalizeLines(container) {
        const lines = container.querySelectorAll('.line2');
        lines.forEach(line => {
            line.style.animationDuration = '1.5s';
            line.style.background = 'linear-gradient(90deg, #8b5cf6, #10b981)';
            line.style.filter = 'brightness(1) saturate(1)';
        });
    }

    animateChart() {
        const chartIcon = document.getElementById('chartIcon2');
        if (chartIcon) {
            chartIcon.style.animation = 'none';
            chartIcon.style.transform = 'scale(1.3) rotate(360deg)';
            chartIcon.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            setTimeout(() => {
                chartIcon.style.transform = 'scale(1) rotate(0deg)';
                chartIcon.style.background = 'linear-gradient(135deg, #8b5cf6, #a855f7)';
                chartIcon.style.animation = 'chartBounce2 1s ease-in-out infinite';
            }, 500);
        }
    }

    startChecklistAnimation() {
        const checklistItems = document.querySelectorAll('.checklist-item2');
        let currentItem = 0;

        const animateNextItem = () => {
            if (currentItem < checklistItems.length) {
                const item = checklistItems[currentItem];
                
                setTimeout(() => {
                    item.classList.add('visible2');
                }, 300);

                setTimeout(() => {
                    if (currentItem < 2) {
                        item.classList.add('checked2');
                    }
                    currentItem++;
                    if (currentItem < checklistItems.length) {
                        setTimeout(animateNextItem, 500);
                    }
                }, 600);
            }
        };

        const step1Card = document.querySelector('[data-step="1"]');
        if (step1Card) {
            const step1Observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(animateNextItem, 800);
                        step1Observer.unobserve(entry.target);
                    }
                });
            });
            step1Observer.observe(step1Card);
        }
    }

    startProgressAnimation() {
        const progressItems = document.querySelectorAll('.progress-item2');
        
        const animateProgressItems = () => {
            progressItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('visible2');
                }, index * 300);
            });
        };

        const step4Card = document.querySelector('[data-step="4"]');
        if (step4Card) {
            const step4Observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(animateProgressItems, 800);
                        step4Observer.unobserve(entry.target);
                    }
                });
            });
            step4Observer.observe(step4Card);
        }
    }
}

// Initialize process animator
document.addEventListener('DOMContentLoaded', () => {
    new ProcessAnimator2();
});

// 3D card hover effects (for desktop only)
if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.step-card2');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.02)`;
            } else {
                card.style.transform = '';
            }
        });
    });

    document.addEventListener('mouseleave', () => {
        document.querySelectorAll('.step-card2').forEach(card => {
            card.style.transform = '';
        });
    });
}

// Spinner animation
const spinnerContainer = document.querySelector('.spinner-container');
if (spinnerContainer) {
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    observer.observe(spinnerContainer);
}

// Performance optimization for mobile
if (window.innerWidth < 768) {
    // Reduce animation complexity on mobile
    const style = document.createElement('style');
    style.textContent = `
        .spinning-halo, .spinning-halo1 {
            animation-duration: 20s !important;
        }
        .logos-container {
            animation-duration: 15s !important;
        }
    `;
    document.head.appendChild(style);
}

// Touch device optimization
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // Auto-check the checkbox on touch devices after a delay
    setTimeout(() => {
        const checkbox = document.getElementById('checkbox8');
        if (checkbox) {
            checkbox.checked = true;
        }
    }, 3000);
}

// Add this to the end of your existing stars.js file

// Hamburger Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    // Close mobile menu
    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Event listeners
    hamburger.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Close menu on window resize if switching to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    // Handle escape key to close menu
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
});
