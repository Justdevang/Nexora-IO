const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const HALO_CX = canvas.width / 2; // Halo center X
const HALO_CY = canvas.height / 2; // Halo center Y
const HALO_RADIUS = 210; // Half your 420px halo (adjust if needed)
const STAR_COUNT = 98	;

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
  star.vx = dx / dist * (2 + Math.random() * 1.15); // speed inwards
  star.vy = dy / dist * (2 + Math.random() * 1.15);
  star.radius = 1 + Math.random() * 1.2;
  star.opacity = 0.45 + Math.random() * 0.35;
  star.travelled = 0;
  star.totalDist = dist; // For fading/size calc
}

const stars = [];
for (let i = 0; i < STAR_COUNT; i++) {
  const s = {};
  resetStar(s);
  stars.push(s);
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // (Recalculate halo center on resize)
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
    let scale = 0.3 + 0.7 * fadeValue; // shrink as it approaches

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





window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelector('.tagline').classList.add('loaded');
  }, 50); // Small delay to ensure the DOM is ready
});


// Reveal logos with staggered fade-in-slide-left animation
window.addEventListener('DOMContentLoaded', () => {
  const logos = document.querySelectorAll('.logo-item');
  logos.forEach((logo, i) => {
    setTimeout(() => {
      logo.classList.add('in-view');
    }, 350 + i * 260); // adjust timing for desired stagger
  });
});

// OPTIONAL: To enable continuous sliding like a carousel, uncomment below
/*
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('logos').classList.add('sliding');
});
*/


  document.addEventListener('DOMContentLoaded', () => {
    const banner = document.querySelector('.brand-banner');

    if ('IntersectionObserver' in window && banner) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            banner.classList.add('visible');
            observer.unobserve(banner);  // Animate once
          }
        });
      }, {
        threshold: 0.1  // Fire when 10% is visible, adjust as needed
      });
      observer.observe(banner);
    } else {
      // Fallback: immediately show banner if IntersectionObserver unsupported
      banner.classList.add('visible');
    }
  });
//for the right

		  // Wait for DOM to fully load
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM loaded - initializing animations');

            // Intersection Observer options
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            // Create intersection observer
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        console.log('Element entering viewport:', entry.target.className);
                        entry.target.classList.add('animate');
                        
                        // Handle animated container
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
                        
                        // Handle workflow section elements
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

            // Observe header elements for scroll-triggered animation
            const headerElements = [
                document.querySelector('.services-tag'),
                document.querySelector('.main-title'),
                document.querySelector('.subtitle')
            ];

            // Observe header elements with staggered delays
            headerElements.forEach((element, index) => {
                if (element) {
                    const headerObserver = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                setTimeout(() => {
                                    entry.target.classList.add('animate');
                                }, index * 200); // 0ms, 200ms, 400ms delays
                            }
                        });
                    }, observerOptions);
                    
                    headerObserver.observe(element);
                }
            });

            // Observe all scroll animate elements
            const scrollElements = document.querySelectorAll('.scroll-animate-left, .scroll-animate-right, .scroll-animate');
            console.log('Found elements to animate:', scrollElements.length);
            
            scrollElements.forEach(element => {
                observer.observe(element);
            });

            // Add smooth scrolling
            document.documentElement.style.scrollBehavior = 'smooth';
        });
		
		
		
		// for the left
		 // Wait for DOM to fully load
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM loaded - initializing animations');

            // Intersection Observer options
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            // Create intersection observer
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        console.log('Element entering viewport:', entry.target.className);
                        entry.target.classList.add('animate1');
                        
                        // Handle animated container (now on the right side)
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
                        
                        // Handle workflow section elements (now on the left side)
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

            // Observe header elements for scroll-triggered animation
            const headerElements = [
                document.querySelector('.services-tag1'),
                document.querySelector('.main-title1'),
                document.querySelector('.subtitle1')
            ];

            // Observe header elements with staggered delays
            headerElements.forEach((element, index) => {
                if (element) {
                    const headerObserver = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                setTimeout(() => {
                                    entry.target.classList.add('animate1');
                                }, index * 200); // 0ms, 200ms, 400ms delays
                            }
                        });
                    }, observerOptions);
                    
                    headerObserver.observe(element);
                }
            });

            // Observe all scroll animate elements
            const scrollElements = document.querySelectorAll('.scroll-animate-left1, .scroll-animate-right1, .scroll-animate1');
            console.log('Found elements to animate:', scrollElements.length);
            
            scrollElements.forEach(element => {
                observer.observe(element);
            });

            // Add smooth scrolling
            document.documentElement.style.scrollBehavior = 'smooth';
        });
		
		//part 3
		
		 // Enhanced JavaScript Animations
        class ProcessAnimator2 {
            constructor() {
                this.init();
                this.setupIntersectionObserver();
                this.setupInteractiveElements();
                this.startChecklistAnimation();
                this.startProgressAnimation();
            }

            init() {
                // Animate header on load
                setTimeout(() => {
                    document.querySelector('.main-title2').classList.add('visible2');
                    document.querySelector('.subtitle2').classList.add('visible2');
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
                // Enhanced radar interaction
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

                // Circular integration interaction
                const circularIntegration = document.getElementById('circularIntegration2');
                if (circularIntegration) {
                    circularIntegration.addEventListener('click', () => {
                        this.accelerateCircular(circularIntegration);
                    });
                }

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
                radar.style.animation = 'none';
                radar.style.transform = 'scale(1.2)';
                radar.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.6)';
                
                setTimeout(() => {
                    radar.style.transform = 'scale(1)';
                    radar.style.boxShadow = 'none';
                }, 300);
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
                windowContainer.style.opacity = '0.5';
                setTimeout(() => {
                    windowContainer.style.opacity = '1';
                }, 500);
            }

            accelerateCircular(circle) {
                circle.style.animationDuration = '0.8s';
                circle.style.transform = 'scale(1.15)';
                circle.style.boxShadow = '0 0 25px rgba(139, 92, 246, 0.5)';
                
                setTimeout(() => {
                    circle.style.animationDuration = '4s';
                    circle.style.transform = 'scale(1)';
                    circle.style.boxShadow = 'none';
                }, 2000);
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
                chartIcon.style.animation = 'none';
                chartIcon.style.transform = 'scale(1.3) rotate(360deg)';
                chartIcon.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                
                setTimeout(() => {
                    chartIcon.style.transform = 'scale(1) rotate(0deg)';
                    chartIcon.style.background = 'linear-gradient(135deg, #8b5cf6, #a855f7)';
                    chartIcon.style.animation = 'chartBounce2 1s ease-in-out infinite';
                }, 500);
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
                            if (currentItem < 2) { // First two items get checked
                                item.classList.add('checked2');
                            }
                            currentItem++;
                            if (currentItem < checklistItems.length) {
                                setTimeout(animateNextItem, 500);
                            }
                        }, 600);
                    }
                };

                // Start animation when step 1 is visible
                const step1Card = document.querySelector('[data-step="1"]');
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

            startProgressAnimation() {
                const progressItems = document.querySelectorAll('.progress-item2');
                
                const animateProgressItems = () => {
                    progressItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible2');
                        }, index * 300);
                    });
                };

                // Start animation when step 4 is visible
                const step4Card = document.querySelector('[data-step="4"]');
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

        // Initialize enhanced animations when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new ProcessAnimator2();
        });

        // Additional interactive features
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

        // Reset card transforms when mouse leaves
        document.addEventListener('mouseleave', () => {
            document.querySelectorAll('.step-card2').forEach(card => {
                card.style.transform = '';
            });
        });
	//circles
	 // Intersection Observer for fade-in effect when scrolled into view
    const spinnerContainer = document.querySelector('.spinner-container');

    const observerOptions = {
      threshold: 0.3, // Trigger when 30% of element is visible
      rootMargin: '0px 0px -100px 0px' // Trigger before fully visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add fade-in class when element comes into view
          entry.target.classList.add('fade-in');
          
          // Optional: Remove observer after first trigger to prevent re-triggering
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Start observing the spinner container
    observer.observe(spinnerContainer);

    // Original spinner animation delays
    const spinners = document.querySelectorAll('.spinner');
    spinners.forEach((spinner, index) => {
      spinner.style.animationDelay = `${index * 0.3}s`;
    });
	
	
	//scrool effect
	
	