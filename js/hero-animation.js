document.addEventListener('DOMContentLoaded', () => {
    const blurCircles = document.querySelectorAll('.circle-blur');
    const solidCircles = document.querySelectorAll('.circle-solid');
    const allCircles = [...blurCircles, ...solidCircles];

    // Overlay tint
    function createColorOverlay() {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
            mixBlendMode: 'overlay',    
            // background: 'linear-gradient(135deg, rgba(255,100,100,0.1), rgba(100,150,255,0.1))',
        });

        const heroBackground = document.querySelector('.hero-background');
        heroBackground.appendChild(overlay);

        // Optional: animate overlay for dynamic feel
        // gsap.to(overlay, {
        //     duration: 10,
        //     background: 'linear-gradient(135deg, rgba(255,200,50,0.15), rgba(150,100,255,0.15))',
        //     repeat: -1,
        //     yoyo: true,
        //     ease: 'sine.inOut'
        // });
    }

    // Circle background gradients
    const colors = [
        'radial-gradient(circle, rgba(59,202,152,0.7), rgba(59,202,152,0.1))',
        'radial-gradient(circle, rgba(255,71,87,0.7), rgba(255,71,87,0.1))',
    ];

    // Position circles on semi-circle
   function positionCirclesOnSemiCircle() {
        if (allCircles.length === 0) {
            console.warn('No circles found to position');
            return;
        }

        const centerX = window.innerWidth * 0.7;
        const centerY = window.innerHeight * 0.8;
        const radius = Math.min(window.innerWidth, window.innerHeight) * 0.6;

        allCircles.forEach((circle, index) => {
            const angle = allCircles.length > 1 ? 
                (Math.PI / (allCircles.length - 1)) * index : 
                Math.PI / 2; // Center single circle
            
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY - Math.sin(angle) * radius;

            // Use base size of 700 for consistency, with slight variations
            const baseSize = Math.min(window.innerWidth, window.innerHeight) * 0.5;
            console.log(`Base size: ${baseSize}`);
            const sizeVariation = 50;
            const size = baseSize + ((index % 3) - 1) * sizeVariation;

            Object.assign(circle.style, {
                position: 'absolute',
                width: `${size}px`,
                height: `${size}px`,
                left: `${x - size / 2}px`,
                top: `${y - size / 2}px`,
                borderRadius: '50%',
                background: colors[index % colors.length],
                mixBlendMode: 'lighten',
                opacity: 0.6 + (index * 0.08),
                pointerEvents: 'none',
                transformOrigin: 'center',
                filter: 'blur(1px)',
                transition: 'filter 0.3s ease'
            });

            
        });
    }

    // Initial layout
    positionCirclesOnSemiCircle();
    createColorOverlay();

    window.addEventListener('resize', positionCirclesOnSemiCircle);

    // GSAP entrance
    gsap.from(allCircles, {
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power3.out"
    });

    // Subtle infinite rotation per circle
    allCircles.forEach((circle, i) => {
        gsap.to(circle, {
            rotation: 360,
            duration: 60 + i * 10,
            ease: 'none',
            repeat: -1
        });
    });
    
    // Mousemove parallax
    document.addEventListener('mousemove', e => {
        const mx = (e.clientX / window.innerWidth  - 0.5) * 40;
        const my = (e.clientY / window.innerHeight - 0.5) * 40;
        allCircles.forEach((c, i) => {
            const depth = i / allCircles.length;
            gsap.to(c, {
                x: mx * depth,
                y: my * depth,
                duration: 1.2,
                ease: 'expo.out'
            });
        });
    });

    // Hero text entrance
    const heroElements = document.querySelectorAll(".hero-title, .hero-subtitle, .hero-intro, .hero-status, .hero-nav-hint");
    
    gsap.set(heroElements, { y: 50, opacity: 0, rotationX: 15 });
    
    gsap.to(heroElements, {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 1.2,
        stagger: {
            amount: 0.8,
            ease: "power2.out"
        },
        ease: "back.out(1.7)",
        delay: 1
    });
});
