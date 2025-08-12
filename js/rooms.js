// Room navigation system with GSAP
let currentRoom = 0;
const totalRooms = 6;
const roomsContainer = document.querySelector('.rooms-container');
const roomDots = document.querySelectorAll('.room-dot');

// Navigate to specific room with GSAP animation
function navigateToRoom(roomIndex) {
    if (roomIndex < 0 || roomIndex >= totalRooms) return;
    
    currentRoom = roomIndex;

    // Check for mobile view
    if (window.innerWidth <= 768) {
        const roomElement = document.querySelectorAll('.room')[roomIndex];
        if (roomElement) {
            roomElement.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        const translateX = -(roomIndex * 100);
        
        // Dispatch custom event for 3D animation
        document.dispatchEvent(new CustomEvent('roomChanged', {
            detail: { currentRoom: roomIndex }
        }));
        
        // Use GSAP for smooth room transitions
        gsap.to(roomsContainer, {
            x: `${translateX}vw`,
            duration: 1.2,
            ease: "power3.inOut"
        });
    }
    
    // Update active dot with GSAP
    roomDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === roomIndex);
        
        if (index === roomIndex) {
            gsap.to(dot, {
                scale: 1.2,
                duration: 0.3,
                ease: "back.out(1.7)"
            });
        } else {
            gsap.to(dot, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });
    
    updateRoomVisibility();
}

// Room dot click handlers with GSAP feedback
roomDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        gsap.to(dot, {
            scale: 0.9,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
        navigateToRoom(index);
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowLeft':
            navigateToRoom(currentRoom - 1);
            break;
        case 'ArrowRight':
            navigateToRoom(currentRoom + 1);
            break;
        case 'Home':
            navigateToRoom(0);
            break;
        case 'End':
            navigateToRoom(totalRooms - 1);
            break;
    }
});

// Swipe detection for mobile
let startX = 0;
let startY = 0;

document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    if (!startX || !startY) return;
    
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    
    const diffX = startX - endX;
    const diffY = startY - endY;
    
    // Only trigger if horizontal swipe is dominant
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
            // Swipe left - go to next room
            navigateToRoom(currentRoom + 1);
        } else {
            // Swipe right - go to previous room
            navigateToRoom(currentRoom - 1);
        }
    }
    
    startX = 0;
    startY = 0;
});

// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon i');
const body = document.body;

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    // Switch between moon and sun icons
    themeIcon.classList.toggle('bxs-moon');
    themeIcon.classList.toggle('bxs-sun');
    localStorage.setItem('theme', newTheme);
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
if (savedTheme === 'dark') {
    themeIcon.classList.remove('bxs-moon');
    themeIcon.classList.add('bxs-sun');
}

// Mode Toggle (Creative/Tech) with GSAP animations
const modeOptions = document.querySelectorAll('.mode-option');
let currentMode = 'creative';

function switchMode(newMode) {
    if (newMode === currentMode) return;
    
    const creativeModes = document.querySelectorAll('.creative-mode');
    const techModes = document.querySelectorAll('.tech-mode');
    
    // Update room navigation icons
    const creativeIcons = document.querySelectorAll('.creative-icon');
    const techIcons = document.querySelectorAll('.tech-icon');
    const room3Dot = document.querySelector('.room-dot[data-room="3"]');
    
    if (newMode === 'tech') {
        // Switch to tech icons
        creativeIcons.forEach(icon => icon.style.display = 'none');
        techIcons.forEach(icon => icon.style.display = 'block');
        if (room3Dot) room3Dot.setAttribute('title', 'projects');
        
        // Fade out creative content
        gsap.to(creativeModes, {
            opacity: 0,
            y: -20,
            duration: 0.3,
            stagger: 0.1,
            onComplete: () => {
                creativeModes.forEach(el => el.style.display = 'none');
                techModes.forEach(el => el.style.display = 'block');
                
                // Fade in tech content
                gsap.fromTo(techModes, 
                    { opacity: 0, y: 20 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.4, 
                        stagger: 0.1,
                        ease: "power2.out"
                    }
                );
            }
        });
    } else {
        // Switch to creative icons
        techIcons.forEach(icon => icon.style.display = 'none');
        creativeIcons.forEach(icon => icon.style.display = 'block');
        if (room3Dot) room3Dot.setAttribute('title', 'visuals');
        
        // Fade out tech content
        gsap.to(techModes, {
            opacity: 0,
            y: -20,
            duration: 0.3,
            stagger: 0.1,
            onComplete: () => {
                techModes.forEach(el => el.style.display = 'none');
                creativeModes.forEach(el => el.style.display = 'block');
                
                // Fade in creative content
                gsap.fromTo(creativeModes,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        stagger: 0.1,
                        ease: "power2.out"
                    }
                );
            }
        });
    }
    
    currentMode = newMode;
}

modeOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Prevent multiple rapid clicks
        if (option.disabled) return;
        option.disabled = true;
        
        // Button feedback animation
        gsap.to(option, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
            onComplete: () => {
                option.disabled = false;
            }
        });
        
        // Update active states properly
        modeOptions.forEach(opt => {
            opt.classList.remove('active');
            // Clear any stuck GSAP transforms
            gsap.set(opt, { scale: 1, clearProps: "transform" });
        });
        option.classList.add('active');
        
        // Switch mode
        switchMode(option.dataset.mode);
    });
});

// Random Thought Generator
const thoughts = [
    "Why do I always get my best ideas in the shower?",
    "Swimming pools at 2am have a different energy than swimming pools at 2pm",
    "The perfect photo probably already exists in one of my undeveloped rolls",
    "Government websites from the 90s had better typography than most modern sites",
    "Frank Ocean's voice has healing properties",
    "The sound of film advancing is one of the most satisfying sounds in the world",
    "Empty coffee shops at 7am feel like secret worlds",
    "I think my peak creativity happens around 10:30pm",
    "Rain sounds different when you're inside vs outside",
    "The internet should feel more like finding someone's journal than reading their resume",
    "Why do convenience stores at 3am feel like liminal spaces?",
    "I've never finished a tube of chapstick and probably never will",
    "The perfect morning routine exists, I just haven't found it yet",
    "Book spines are basically tiny posters for your personality",
    "There's a perfect song for every moment, I just haven't found them all yet",
    "Film grain is the soul of a photograph",
    "Code comments are love letters to your future self",
    "The best conversations happen after midnight"
];

function generateThought() {
    const thoughtElement = document.getElementById('random-thought');
    const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)];
    
    // GSAP animation for thought generation
    gsap.to(thoughtElement, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        onComplete: () => {
            thoughtElement.textContent = '"' + randomThought + '"';
            gsap.to(thoughtElement, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "power2.out"
            });
        }
    });
}

// Interactive elements with GSAP
document.querySelectorAll('.about-card, .tech-card, .project-card, .photo-frame, .book-spine, .game-account').forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            y: -8,
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    card.addEventListener('click', () => {
        gsap.to(card, {
            scale: 0.98,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
    });
});

document.querySelectorAll('.thought-bubble').forEach(bubble => {
    bubble.addEventListener('mouseenter', () => {
        gsap.to(bubble, {
            scale: 1.05,
            duration: 0.2,
            ease: "back.out(1.7)"
        });
    });
    
    bubble.addEventListener('mouseleave', () => {
        gsap.to(bubble, {
            scale: 1,
            duration: 0.2,
            ease: "power2.out"
        });
    });
    
    bubble.addEventListener('click', () => {
        console.log('Thought clicked:', bubble.textContent);
        gsap.to(bubble, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
    });
});

// Add entrance animations with GSAP
function addEntranceAnimations() {
    const rooms = document.querySelectorAll('.room');
    
    // Set initial states
    gsap.set(rooms, { opacity: 0.3 });
    gsap.set(rooms[0], { opacity: 1 });
    
    // Update room visibility with GSAP
    updateRoomVisibility();
}

// Update room visibility based on current room
function updateRoomVisibility() {
    const rooms = document.querySelectorAll('.room');
    
    rooms.forEach((room, index) => {
        const distance = Math.abs(index - currentRoom);
        let targetOpacity;
        
        if (distance === 0) targetOpacity = 1;
        else if (distance === 1) targetOpacity = 0.5;
        else targetOpacity = 0.2;
        
        gsap.to(room, {
            opacity: targetOpacity,
            duration: 0.8,
            ease: "power2.out"
        });
    });
}

// Initialize with GSAP
document.addEventListener('DOMContentLoaded', () => {
    // Set up initial timeline
    const tl = gsap.timeline();
    
    // Animate room navigator entrance
    tl.from('.room-navigator', {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    })
    .from('.social-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.4")
    .from('.hero-intro', {
        opacity: 0,
        y: 20,
        duration: 0.6
    }, "-=0.2")
    .from('.hero-title', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.4")
    .from('.hero-subtitle', {
        opacity: 0,
        y: 20,
        duration: 0.6
    }, "-=0.4")
    .from('.hero-status', {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        ease: "back.out(1.7)"
    }, "-=0.2");
    
    addEntranceAnimations();
    
    // Add helpful hint for first-time visitors
    setTimeout(() => {
        if (!localStorage.getItem('visited-before')) {
            gsap.from('.hero-nav-hint', {
                opacity: 0,
                x: 20,
                duration: 0.8,
                ease: "power2.out"
            });
            localStorage.setItem('visited-before', 'true');
        }
    }, 3000);
});

// Smooth scrolling prevention with better UX
document.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    // Add subtle feedback when users try to scroll
    const hint = document.querySelector('.hero-nav-hint');
    if (hint) {
        gsap.to(hint, {
            scale: 1.1,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
    }
}, { passive: false });

// Handle window resize with GSAP
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        const translateX = -(currentRoom * 100);
        gsap.set(roomsContainer, { x: `${translateX}vw` });
    } else {
        // Clear GSAP transforms for mobile scrolling
        gsap.set(roomsContainer, { clearProps: "transform" });
    }
});

// Discord Popup Functions
function showDiscordPopup() {
    const popup = document.getElementById('discord-popup');
    popup.classList.add('active');
    
    // GSAP animation for popup entrance
    gsap.fromTo(popup.querySelector('.popup-content'), 
        { 
            scale: 0.8, 
            y: 30, 
            opacity: 0 
        },
        { 
            scale: 1, 
            y: 0, 
            opacity: 1, 
            duration: 0.4, 
            ease: "back.out(1.7)" 
        }
    );
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function hideDiscordPopup() {
    const popup = document.getElementById('discord-popup');
    
    // GSAP animation for popup exit
    gsap.to(popup.querySelector('.popup-content'), {
        scale: 0.8,
        y: 30,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
            popup.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

function copyDiscordUsername() {
    const username = document.getElementById('discord-username').textContent;
    const copyBtn = document.querySelector('.copy-btn');
    
    // Copy to clipboard
    navigator.clipboard.writeText(username).then(() => {
        // Visual feedback
        copyBtn.classList.add('copied');
        const originalIcon = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="bx bx-check"></i>';
        
        // GSAP success animation
        gsap.to(copyBtn, {
            scale: 1.2,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
        
        // Reset after delay
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = originalIcon;
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = username;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        // Same visual feedback
        copyBtn.classList.add('copied');
        setTimeout(() => copyBtn.classList.remove('copied'), 2000);
    });
}

// Close popup on overlay click
document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('discord-popup');
    if (popup) {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                hideDiscordPopup();
            }
        });
    }
    
    // Close popup on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
            hideDiscordPopup();
        }
    });
});
