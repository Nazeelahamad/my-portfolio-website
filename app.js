// Particle system removed for cleaner, more professional look

// Sticky Navigation
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

mobileMenuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  
  const spans = mobileMenuToggle.querySelectorAll('span');
  if (navMenu.classList.contains('active')) {
    spans[0].style.transform = 'rotate(45deg) translateY(8px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
  } else {
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
  }
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    const spans = mobileMenuToggle.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
  });
});

// Smooth Scrolling (backup for browsers that don't support CSS scroll-behavior)
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 70;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// Skills Animation - Animate progress bars when in viewport
const observerOptions = {
  threshold: 0.5,
  rootMargin: '0px 0px -100px 0px'
};

const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const progressBars = entry.target.querySelectorAll('.skill-progress');
      progressBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        setTimeout(() => {
          bar.style.width = progress + '%';
        }, 200);
      });
      skillsObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

const skillsSection = document.querySelector('.skills-section');
if (skillsSection) {
  skillsObserver.observe(skillsSection);
}

// Add ripple effect to buttons
const addRippleEffect = () => {
  const buttons = document.querySelectorAll('.btn, .project-btn, .cert-view-link');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple-effect');
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
};

// Contact Form Validation and Submission with EmailJS
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.textContent = '');
    
    let isValid = true;
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Validate name
    if (name === '') {
      document.getElementById('nameError').textContent = '⚠ Please enter your name';
      isValid = false;
    } else if (name.length < 2) {
      document.getElementById('nameError').textContent = '⚠ Name must be at least 2 characters';
      isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
      document.getElementById('emailError').textContent = '⚠ Please enter your email';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      document.getElementById('emailError').textContent = '⚠ Please enter a valid email address';
      isValid = false;
    }
    
    // Validate subject
    if (subject === '') {
      document.getElementById('subjectError').textContent = '⚠ Please enter a subject';
      isValid = false;
    } else if (subject.length < 3) {
      document.getElementById('subjectError').textContent = '⚠ Subject must be at least 3 characters';
      isValid = false;
    }
    
    // Validate message
    if (message === '') {
      document.getElementById('messageError').textContent = '⚠ Please enter a message';
      isValid = false;
    } else if (message.length < 10) {
      document.getElementById('messageError').textContent = '⚠ Message must be at least 10 characters';
      isValid = false;
    }
    
    // If form is valid, send with EmailJS
    if (isValid) {
      // Add sending animation to button
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;
      
      try {
        // Send email using EmailJS
        const result = await emailjs.send(
          "service_4vu35er", // Replace with your EmailJS service ID
          "template_vv3ui94", // Replace with your EmailJS template ID
          {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message,
            to_name: "Nazeel", // Your name
            reply_to: email,
          }
        );

        // Show success UI
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
        
        formSuccess.style.display = 'block';
        formSuccess.style.opacity = '0';
        formSuccess.style.transform = 'scale(0.9) translateY(-10px)';
        formSuccess.classList.add('show');
        formSuccess.setAttribute('role', 'status'); // For accessibility
        
        setTimeout(() => {
          formSuccess.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
          formSuccess.style.opacity = '1';
          formSuccess.style.transform = 'scale(1) translateY(0)';
          formSuccess.focus(); // Move focus to success message
        }, 10);
        
        contactForm.reset();
        
        // Reset button after delay
        setTimeout(() => {
          submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
          submitBtn.disabled = false;
        }, 2000);
        
        // Hide success message after 6 seconds
        setTimeout(() => {
          formSuccess.style.opacity = '0';
          formSuccess.style.transform = 'scale(0.9) translateY(-10px)';
          setTimeout(() => {
            formSuccess.classList.remove('show');
            formSuccess.style.display = 'none';
          }, 500);
        }, 6000);

      } catch (error) {
        // Log full error to console for debugging
        console.error('EmailJS send error:', error);

        // Prepare readable message for UI
        let errMsg = 'Sorry, message could not be sent. Please try again.';
        try {
          if (error && error.status) {
            errMsg += ` (Status: ${error.status})`;
          }
          if (error && error.text) {
            errMsg += ` - ${error.text}`;
          }
          // Some EmailJS errors include a `message` property
          if (error && error.message) {
            errMsg += ` - ${error.message}`;
          }
        } catch (e) {
          // ignore any formatting errors
        }

        // Show error UI
        submitBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed to send';
        formSuccess.style.display = 'block';
        formSuccess.style.backgroundColor = '#ff5252';
        formSuccess.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${errMsg}`;
        formSuccess.setAttribute('role', 'alert'); // For accessibility

        // Reset button after delay
        setTimeout(() => {
          submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
          submitBtn.disabled = false;

          // Hide error message
          formSuccess.style.opacity = '0';
          setTimeout(() => {
            formSuccess.style.display = 'none';
            formSuccess.style.backgroundColor = ''; // Reset color
            // Restore default content
            formSuccess.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! Your message has been sent successfully.';
            formSuccess.setAttribute('role', 'status');
          }, 500);
        }, 5000);
      }
    }
  });
}

// Enhanced fade observer for smooth animations
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-visible');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -30px 0px'
});

// Observe sections for fade-in animation with staggered effect
const sections = document.querySelectorAll('.section');
sections.forEach((section, index) => {
  section.classList.add('section-animate');
  fadeObserver.observe(section);
});

// Animate stats cards with enhanced entrance
const animateStats = () => {
  const statCards = document.querySelectorAll('.stat-card-new');
  
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
          // Add pop effect
          setTimeout(() => {
            entry.target.style.transform = 'translateY(-10px) scale(1.05)';
            setTimeout(() => {
              entry.target.style.transform = 'translateY(0) scale(1)';
            }, 200);
          }, 300);
        }, index * 150);
        statsObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });
  
  statCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px) scale(0.9)';
    card.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    statsObserver.observe(card);
  });
};

// Animate tech badges with enhanced effects
const animateTechBadges = () => {
  const techCategories = document.querySelectorAll('.tech-category');
  
  const techObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const badges = entry.target.querySelectorAll('.tech-badge');
        badges.forEach((badge, badgeIndex) => {
          setTimeout(() => {
            badge.style.opacity = '1';
            badge.style.transform = 'translateY(0) scale(1)';
            // Add bounce effect
            setTimeout(() => {
              badge.style.transform = 'translateY(-5px) scale(1.05)';
              setTimeout(() => {
                badge.style.transform = 'translateY(0) scale(1)';
              }, 150);
            }, 200);
          }, badgeIndex * 50);
        });
        techObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3
  });
  
  techCategories.forEach(category => {
    const badges = category.querySelectorAll('.tech-badge');
    badges.forEach(badge => {
      badge.style.opacity = '0';
      badge.style.transform = 'translateY(20px) scale(0.9)';
      badge.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    techObserver.observe(category);
  });
};





// Animate featured achievement with dramatic entrance
const animateFeaturedAchievement = () => {
  const achievementCard = document.querySelector('.featured-achievement-card');
  if (!achievementCard) return;
  
  const achievementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
          
          // Animate icon separately
          const icon = entry.target.querySelector('.achievement-icon-large');
          if (icon) {
            icon.style.animation = 'pulse 2s ease-in-out infinite';
          }
          
          // Animate stats with stagger
          const stats = entry.target.querySelectorAll('.achievement-stats-mini span');
          stats.forEach((stat, index) => {
            stat.style.opacity = '0';
            stat.style.transform = 'translateX(-20px)';
            setTimeout(() => {
              stat.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
              stat.style.opacity = '1';
              stat.style.transform = 'translateX(0)';
            }, 400 + (index * 100));
          });
        }, 100);
        achievementObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3
  });
  
  achievementCard.style.opacity = '0';
  achievementCard.style.transform = 'translateY(40px) scale(0.95)';
  achievementCard.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
  achievementObserver.observe(achievementCard);
};

// Add visible class to sections when they come into view
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      sectionObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

sections.forEach(section => {
  sectionObserver.observe(section);
});

// Animate cards with staggered entrance and bounce
const animateCards = () => {
  const cards = document.querySelectorAll('.stat-card, .skill-category, .project-card, .certificate-card, .timeline-item');
  
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
          // Add bounce effect
          setTimeout(() => {
            entry.target.style.transform = 'translateY(-8px) scale(1.02)';
            setTimeout(() => {
              entry.target.style.transform = 'translateY(0) scale(1)';
            }, 200);
          }, 250);
        }, index * 120);
        cardObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });
  
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px) scale(0.95)';
    card.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
    cardObserver.observe(card);
  });
};

// Animate contact section with enhanced effects
const animateContactSection = () => {
  const contactSection = document.querySelector('.contact-section');
  if (!contactSection) return;
  
  const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const formContainer = entry.target.querySelector('.contact-form-container');
        if (formContainer) {
          setTimeout(() => {
            formContainer.style.opacity = '1';
            formContainer.style.transform = 'translateX(0) scale(1)';
          }, 150);
        }
        
        const infoItems = entry.target.querySelectorAll('.contact-info-item');
        infoItems.forEach((item, index) => {
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0) scale(1)';
            // Add pulse effect
            setTimeout(() => {
              item.style.transform = 'translateX(0) scale(1.05)';
              setTimeout(() => {
                item.style.transform = 'translateX(0) scale(1)';
              }, 150);
            }, 200);
          }, 350 + (index * 120));
        });
        
        const socialLinks = entry.target.querySelectorAll('.social-link');
        socialLinks.forEach((link, index) => {
          setTimeout(() => {
            link.style.opacity = '1';
            link.style.transform = 'translateY(0) scale(1)';
            // Add bounce
            setTimeout(() => {
              link.style.transform = 'translateY(-5px) scale(1.05)';
              setTimeout(() => {
                link.style.transform = 'translateY(0) scale(1)';
              }, 150);
            }, 200);
          }, 700 + (index * 100));
        });
        
        contactObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });
  
  const formContainer = contactSection.querySelector('.contact-form-container');
  if (formContainer) {
    formContainer.style.opacity = '0';
    formContainer.style.transform = 'translateX(-30px) scale(0.95)';
    formContainer.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
  }
  
  const infoItems = contactSection.querySelectorAll('.contact-info-item');
  infoItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(30px) scale(0.9)';
    item.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
  });
  
  const socialLinks = contactSection.querySelectorAll('.social-link');
  socialLinks.forEach(link => {
    link.style.opacity = '0';
    link.style.transform = 'translateY(30px) scale(0.9)';
    link.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
  });
  
  contactObserver.observe(contactSection);
};

// Count-up animation for stats
const animateCountUp = (element, target, suffix = '+', duration = 2000) => {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + suffix;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + suffix;
    }
  }, 16);
};

// Trigger count-up animations when stats section is visible
const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll('.stat-number-new');
        statNumbers.forEach(statNum => {
          const text = statNum.textContent.trim();
          // Handle different formats (2+, 3+, 4+, 2025)
          if (text.includes('+')) {
            const number = parseInt(text.replace('+', ''));
            statNum.textContent = '0';
            setTimeout(() => {
              animateCountUp(statNum, number, '+', 2000);
            }, 200);
          } else {
            // For year (2025)
            const number = parseInt(text);
            statNum.textContent = '2000';
            setTimeout(() => {
              animateCountUp(statNum, number, '', 2000);
            }, 200);
          }
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });
  
  statsObserver.observe(statsSection);
}

// Add magnetic button effect
const addMagneticEffect = () => {
  const magneticElements = document.querySelectorAll('.btn, .hero-social-link, .project-btn');
  
  magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
};

// Animate project icons
const animateProjectIcons = () => {
  const projectIcons = document.querySelectorAll('.project-icon');
  projectIcons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
      icon.style.animation = 'none';
      setTimeout(() => {
        icon.style.animation = 'projectIconFloat 2s ease-in-out infinite';
      }, 10);
    });
  });
};



// Initialize all animations
const initAllAnimations = () => {
  animateCards();
  animateStats();
  animateTechBadges();
  animateFeaturedAchievement();
  animateContactSection();
  addMagneticEffect();
  animateProjectIcons();
  addRippleEffect();
  addIconHoverEffects();
};

// Add hover effects to icons throughout the page
const addIconHoverEffects = () => {
  const icons = document.querySelectorAll('.stat-icon, .tech-icon, .skill-icon, .fa, .fas, .fab');
  
  icons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
      icon.style.transform = 'scale(1.2) rotate(10deg)';
      icon.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    
    icon.addEventListener('mouseleave', () => {
      icon.style.transform = 'scale(1) rotate(0deg)';
    });
  });
};

// Parallax removed for cleaner experience

// Floating animation removed for professional aesthetic

// Smooth scroll reveal with enhanced animations
const addSmoothScrollReveal = () => {
  const revealElements = document.querySelectorAll('.skill-tag');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) rotate(0deg)';
          // Add wiggle effect
          setTimeout(() => {
            entry.target.style.transform = 'translateY(0) rotate(2deg)';
            setTimeout(() => {
              entry.target.style.transform = 'translateY(0) rotate(-2deg)';
              setTimeout(() => {
                entry.target.style.transform = 'translateY(0) rotate(0deg)';
              }, 100);
            }, 100);
          }, 200);
        }, index * 50);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px) rotate(-5deg)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(el);
  });
};

// Call after DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initAllAnimations();
    addSmoothScrollReveal();
  });
} else {
  initAllAnimations();
  addSmoothScrollReveal();
}

// Active navigation link highlighting based on scroll position
const updateActiveNav = () => {
  const sections = document.querySelectorAll('section');
  const scrollPos = window.scrollY + 100;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
};

window.addEventListener('scroll', updateActiveNav);

// Project Modal Functionality
const projectsData = [
  {
    title: "E-commerce Platform - Puppy Emporium",
    icon: "🛒",
    description: "Full-stack e-commerce solution with secure payment gateway. Built with PHP and MySQL, featuring user authentication, product management, inventory tracking, and admin dashboard for order management.",
    technologies: ["PHP", "MySQL", "Payment Gateway", "Full-Stack"],
    features: [
      "User authentication and profile management",
      "Secure payment gateway integration",
      "Real-time inventory tracking",
      "Admin dashboard for order management"
    ],
    impact: "Successfully handles product catalog management for 100+ items with secure transactions",
    github: "https://github.com/Nazeelahamad/miniproject-puppyemporium"
  },
  {
    title: "AI Mental Health Support Chatbot",
    icon: "🤖",
    description: "Intelligent chatbot powered by NLP (Natural Language Processing) and AI. Provides empathetic support for mental health conversations, trained on mental health datasets to deliver context-aware and supportive responses.",
    technologies: ["react","mongodb","Tailwind CSS","Node.js","NLP", "JavaScript", "AI"],
    features: [
      "Natural Language Processing for context understanding",
      "ML-trained on mental health datasets",
      "Empathetic response generation",
      "24/7 availability for support"
    ],
    impact: "Demonstrates advanced NLP techniques and AI capabilities in real-world application",
    github: "https://github.com/Nazeelahamad/aichatbot-mentalhealth"
  }
];

const projectModal = document.getElementById('projectModal');
const projectModalClose = document.getElementById('projectModalClose');
const projectCards = document.querySelectorAll('.project-card');

// Open project modal
function openProjectModal(index) {
  const project = projectsData[index];
  
  // Update modal content
  document.getElementById('projectModalIcon').textContent = project.icon;
  document.getElementById('projectModalTitle').textContent = project.title;
  document.getElementById('projectModalDescription').textContent = project.description;
  
  // Update technologies
  const techContainer = document.getElementById('projectModalTech');
  techContainer.innerHTML = '';
  project.technologies.forEach((tech, i) => {
    const badge = document.createElement('div');
    badge.className = 'project-modal-tech-badge';
    badge.textContent = tech;
    badge.style.opacity = '0';
    badge.style.transform = 'translateY(20px)';
    techContainer.appendChild(badge);
    
    // Animate tech badges
    setTimeout(() => {
      badge.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      badge.style.opacity = '1';
      badge.style.transform = 'translateY(0)';
    }, 100 + (i * 80));
  });
  
  // Update features
  const featuresContainer = document.getElementById('projectModalFeatures');
  featuresContainer.innerHTML = '';
  project.features.forEach((feature, i) => {
    const li = document.createElement('li');
    li.textContent = feature;
    li.style.opacity = '0';
    li.style.transform = 'translateX(-20px)';
    featuresContainer.appendChild(li);
    
    // Animate features
    setTimeout(() => {
      li.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      li.style.opacity = '1';
      li.style.transform = 'translateX(0)';
    }, 300 + (i * 100));
  });
  
  // Update impact
  document.getElementById('projectModalImpact').textContent = project.impact;
  
  // Update GitHub link
  document.getElementById('projectModalGithub').href = project.github;
  
  // Show modal
  projectModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close project modal
function closeProjectModal() {
  projectModal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Event listeners for project cards
projectCards.forEach((card) => {
  card.addEventListener('click', () => {
    const projectIndex = parseInt(card.getAttribute('data-project'));
    openProjectModal(projectIndex);
  });
  
  // Add cursor pointer
  card.style.cursor = 'pointer';
});

// Close modal events
if (projectModalClose) {
  projectModalClose.addEventListener('click', closeProjectModal);
}

if (projectModal) {
  // Close when clicking overlay
  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal || e.target.classList.contains('project-modal-overlay')) {
      closeProjectModal();
    }
  });
}

// Keyboard navigation for project modal
document.addEventListener('keydown', (e) => {
  if (projectModal && projectModal.classList.contains('active')) {
    if (e.key === 'Escape') {
      closeProjectModal();
    }
  }
});

// Certificate Modal Functionality
const certificatesData = [
  {
    title: "HackManthan 2025 - Participation Certificate",
    issuer: "EventEye, GeeksforGeeks, Lovely Professional University",
    date: "October 2025",
    description: "Participated in 24-hour HackManthan 2025 hackathon at LPU, demonstrating innovation and collaboration in building tech solutions",
    file: "Nazeel-hackathon-certificate.jpg",
    type: "image"
  },
  {
    title: "Problem Solving Through Programming in C",
    issuer: "NPTEL (IIT Kharagpur)",
    date: "January - April 2023",
    description: "12-week intensive course with 55% consolidated score. Covered data structures, algorithms, and problem-solving techniques in C programming.",
    file: "c-certificatee.jpg",
    type: "image"
  },
  {
    title: "IBM SkillsBuild Winter Certification - Data Analytics",
    issuer: "IBM SkillsBuild & CSRBOX",
    date: "December 2024 - January 2025",
    description: "Intensive program on 'Turning Data into Decisions using Python' covering data analysis, visualization, and Python programming for analytics",
    file: "ibmskillbuild.pdf",
    type: "pdf"
  },
  {
    title: "HackManthan 2025 - Workshop Participation",
    issuer: "EventEye, GeeksforGeeks, Growbinar",
    date: "October 3-4, 2025",
    description: "Attended workshops on Full Stack Development and How to Ace Hackathons during HackManthan 2025",
    file: "hackmanthangrowbinar.png",
    type: "image"
  }
];

let currentCertIndex = 0;

// Removed typing animation for professional aesthetic

const modal = document.getElementById('certificateModal');
const modalClose = document.getElementById('modalClose');
const prevCertBtn = document.getElementById('prevCert');
const nextCertBtn = document.getElementById('nextCert');
const viewCertBtns = document.querySelectorAll('.view-cert-btn');

// Open modal with specific certificate
function openCertModal(index) {
  currentCertIndex = index;
  updateModalContent();
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close modal
function closeCertModal() {
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Update modal content
function updateModalContent() {
  const cert = certificatesData[currentCertIndex];
  document.getElementById('modalTitle').textContent = cert.title;
  document.getElementById('modalIssuer').textContent = cert.issuer;
  document.getElementById('modalDate').textContent = cert.date;
  document.getElementById('modalDescription').textContent = cert.description;

  const certImage = document.getElementById('certImage');
  const certPlaceholder = document.getElementById('certPlaceholder');

  if (cert.type === 'image') {
    certImage.src = cert.file;
    certImage.style.display = 'block';
    certPlaceholder.style.display = 'none';
  } else if (cert.type === 'pdf') {
    // Open pdf in new tab immediately
    window.open(cert.file, '_blank');
    // Keep modal hidden for pdfs
    closeCertModal();
  }
}

// Navigate to previous certificate
function showPrevCert() {
  currentCertIndex = (currentCertIndex - 1 + certificatesData.length) % certificatesData.length;
  updateModalContent();
}

// Navigate to next certificate
function showNextCert() {
  currentCertIndex = (currentCertIndex + 1) % certificatesData.length;
  updateModalContent();
}

// Event listeners for certificate modal
viewCertBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = btn.closest('.certificate-card');
    const index = parseInt(card.getAttribute('data-cert'), 10);
    const type = card.getAttribute('data-type');
    if (type === 'pdf') {
      const file = card.getAttribute('data-file');
      window.open(file, '_blank');
      return;
    }
    openCertModal(index);
  });
});

// Allow clicking on certificate cards to open modal
const certCards = document.querySelectorAll('.certificate-card');
certCards.forEach((card) => {
  card.addEventListener('click', () => {
    const certIndex = parseInt(card.getAttribute('data-cert'));
    const type = card.getAttribute('data-type');
    if (type === 'pdf') {
      const file = card.getAttribute('data-file');
      window.open(file, '_blank');
      return;
    }
    openCertModal(certIndex);
  });
});

modalClose.addEventListener('click', closeCertModal);
prevCertBtn.addEventListener('click', showPrevCert);
nextCertBtn.addEventListener('click', showNextCert);

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeCertModal();
  }
});

// Keyboard navigation for modal
document.addEventListener('keydown', (e) => {
  if (modal.classList.contains('active')) {
    if (e.key === 'Escape') {
      closeCertModal();
    } else if (e.key === 'ArrowLeft') {
      showPrevCert();
    } else if (e.key === 'ArrowRight') {
      showNextCert();
    }
  }
});

// Typing Animation for Hero Subtitle
const typedTextElement = document.getElementById('typedText');
if (typedTextElement) {
  const typedStrings = [
    'Data Science Student',
    'Full-Stack Developer',
    'AI Enthusiast',
    'Problem Solver',
    'Tech Innovator'
  ];
  
  let stringIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  
  function typeText() {
    const currentString = typedStrings[stringIndex];
    
    if (isDeleting) {
      typedTextElement.textContent = currentString.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typedTextElement.textContent = currentString.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentString.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      stringIndex = (stringIndex + 1) % typedStrings.length;
      typingSpeed = 500; // Pause before next word
    }
    
    setTimeout(typeText, typingSpeed);
  }
  
  // Start typing animation
  setTimeout(typeText, 1000);
}

// Force light mode - always use light theme regardless of system preferences

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateActiveNav();
  
  // Enhanced entrance animation for hero elements with bounce
  const heroElements = document.querySelectorAll('.hero-profile-image, .hero-title, .hero-subtitle-container, .hero-institution, .hero-location, .hero-social, .hero-buttons');
  heroElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px) scale(0.9)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0) scale(1)';
      
      // Add bounce effect
      setTimeout(() => {
        el.style.transform = 'translateY(-8px) scale(1.02)';
        setTimeout(() => {
          el.style.transform = 'translateY(0) scale(1)';
        }, 200);
      }, 300);
    }, 100 * index);
  });
  
  // Animate social icons individually
  const socialIcons = document.querySelectorAll('.hero-social-link');
  socialIcons.forEach((icon, index) => {
    icon.style.opacity = '0';
    icon.style.transform = 'scale(0)';
    setTimeout(() => {
      icon.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      icon.style.opacity = '1';
      icon.style.transform = 'scale(1)';
    }, 600 + (index * 100));
  });
  
  // Animate buttons with stagger
  const heroButtons = document.querySelectorAll('.hero-buttons .btn');
  heroButtons.forEach((btn, index) => {
    btn.style.opacity = '0';
    btn.style.transform = 'translateY(20px)';
    setTimeout(() => {
      btn.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      btn.style.opacity = '1';
      btn.style.transform = 'translateY(0)';
    }, 800 + (index * 100));
  });
  
  // Add smooth scroll indicator
  addScrollIndicator();
});

// Scroll indicator simplified for professional design
function addScrollIndicator() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  const scrollIndicator = document.createElement('div');
  scrollIndicator.className = 'scroll-indicator';
  scrollIndicator.innerHTML = '<div class="scroll-arrow"></div>';
  scrollIndicator.style.cssText = `
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    cursor: pointer;
    z-index: 10;
    opacity: 0.6;
    transition: opacity 0.3s;
  `;
  
  const arrow = scrollIndicator.querySelector('.scroll-arrow');
  arrow.style.cssText = `
    width: 24px;
    height: 24px;
    border-left: 2px solid var(--color-primary);
    border-bottom: 2px solid var(--color-primary);
    transform: rotate(-45deg);
  `;
  
  scrollIndicator.addEventListener('click', () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
  
  scrollIndicator.addEventListener('mouseenter', () => {
    scrollIndicator.style.opacity = '1';
  });
  
  scrollIndicator.addEventListener('mouseleave', () => {
    scrollIndicator.style.opacity = '0.6';
  });
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.pointerEvents = 'none';
    } else {
      scrollIndicator.style.opacity = '0.6';
      scrollIndicator.style.pointerEvents = 'all';
    }
  });
  
  hero.appendChild(scrollIndicator);
}