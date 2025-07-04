// Portfolio Cube - Interactive 3D portfolio experience
// Handles cube rotation, modal interactions, and theme switching

document.addEventListener('DOMContentLoaded', () => {
    // ===== Core Elements =====
    const cube = document.getElementById('cube');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const modalContents = document.querySelectorAll('.modal-content');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const htmlElement = document.documentElement;

    // ===== State Variables =====
    let currentRotationX = -10;
    let currentRotationY = 15;
    let velocityX = 0;
    let velocityY = 0;
    let isAnimating = false;
    let isDefaultPosition = true;
    let randomAnimationActive = true;
    let isMouseDown = false;
    let isCubeInteraction = false;
    let mouseX = 0;
    let mouseY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let moveTimestamp = 0;

    // ===== Cube Configuration =====
    // Define rotation values for each face
    const rotations = {
        front: { x: -10, y: 15 },
        back: { x: -10, y: 195 },
        right: { x: -10, y: 105 },
        left: { x: -10, y: -75 },
        top: { x: -100, y: 15 },
        bottom: { x: 80, y: 15 }
    };

    // Map faces to their corresponding modal content IDs
    const faceToModalMap = {
        'front': 'modal-about',
        'back': 'modal-projects',
        'left': 'modal-contact',
        'right': 'modal-certifications',
        'top': 'modal-skills',
        'bottom': 'modal-experience'
    };

    // Apply initial transform to the cube
    cube.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;
    cube.style.transition = 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';

    // ===== Cube Rotation Function =====
    // Global function to rotate cube and show corresponding modal
    window.rotateCube = function(face) {
        const rotation = rotations[face];
        currentRotationX = rotation.x;
        currentRotationY = rotation.y;
        velocityX = 0;
        velocityY = 0;
        
        // Add smooth transition
        cube.style.transition = 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
        cube.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;
        
        // Stop any animations
        cube.style.animation = 'none';
        isDefaultPosition = false;
        randomAnimationActive = false;
        
        // Update active button state
        const buttons = document.querySelectorAll('.control-btn');
        buttons.forEach(btn => {
            btn.classList.remove('active');
            const btnFace = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
            if (btnFace === face) {
                btn.classList.add('active');
            }
        });
        
    };

    // ===== Modal Functions =====
    // Open modal with specific content
    function openModal(contentId) {
        // Hide all modal contents first
        modalContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Show the requested content
        const contentToShow = document.getElementById(contentId);
        if (contentToShow) {
            contentToShow.classList.add('active');
        }
        
        // Show the modal overlay
        modalOverlay.classList.add('active');
    }

    // Close modal function
    function closeModal() {
        modalOverlay.classList.remove('active');
        
        // Remove active state from buttons
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Don't resume cube animation after closing the modal
        // Keep the cube in its current position
    }

    // ===== Interactive Controls =====
    // Check if mouse/touch is within cube interaction area
    function isClickInCubeArea(clientX, clientY) {
        const cubeRect = cube.getBoundingClientRect();
        return (
            clientX >= cubeRect.left - 100 &&
            clientX <= cubeRect.right + 100 &&
            clientY >= cubeRect.top - 100 &&
            clientY <= cubeRect.bottom + 100
        );
    }

    // Apply inertia for smooth deceleration after interaction
    function applyInertia() {
        if (Math.abs(velocityX) < 0.1 && Math.abs(velocityY) < 0.1) {
            setTimeout(() => {
                cube.style.transition = 'transform 2s cubic-bezier(0.2, 0.8, 0.2, 1)';
            }, 100);
            isAnimating = false;
            return;
        }

        // Apply velocity with decay
        velocityX *= 0.95;
        velocityY *= 0.95;

        currentRotationY += velocityX * 0.1;
        currentRotationX -= velocityY * 0.1;

        cube.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;
        isAnimating = requestAnimationFrame(applyInertia);
    }

    // ===== Event Listeners =====
    // Mouse interaction
    document.addEventListener('mousedown', (e) => {
        isCubeInteraction = isClickInCubeArea(e.clientX, e.clientY);

        if (isCubeInteraction) {
            if (randomAnimationActive) {
                cube.style.animation = 'none';
                randomAnimationActive = false;
            }
            
            isMouseDown = true;
            mouseX = lastMouseX = e.clientX;
            mouseY = lastMouseY = e.clientY;
            moveTimestamp = Date.now();
            velocityX = 0;
            velocityY = 0;

            cube.style.transition = 'none';
            isDefaultPosition = false;

            if (isAnimating) {
                cancelAnimationFrame(isAnimating);
                isAnimating = false;
            }
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isMouseDown || !isCubeInteraction) return;

        const now = Date.now();
        const dt = now - moveTimestamp;
        moveTimestamp = now;

        const deltaX = e.clientX - mouseX;
        const deltaY = e.clientY - mouseY;

        currentRotationY += deltaX * 0.5;
        currentRotationX -= deltaY * 0.5;

        if (dt > 0) {
            velocityX = 0.8 * velocityX + 0.2 * (e.clientX - lastMouseX) / dt * 50;
            velocityY = 0.8 * velocityY + 0.2 * (e.clientY - lastMouseY) / dt * 50;
        }

        lastMouseX = mouseX;
        lastMouseY = mouseY;
        mouseX = e.clientX;
        mouseY = e.clientY;

        cube.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;
    });

    document.addEventListener('mouseup', () => {
        if (!isMouseDown || !isCubeInteraction) return;
        isMouseDown = false;

        cube.style.transition = 'none';
        applyInertia();
    });

    // Touch interaction
    document.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        isCubeInteraction = isClickInCubeArea(touch.clientX, touch.clientY);

        if (isCubeInteraction) {
            if (randomAnimationActive) {
                cube.style.animation = 'none';
                randomAnimationActive = false;
            }
            
            mouseX = lastMouseX = touch.clientX;
            mouseY = lastMouseY = touch.clientY;
            moveTimestamp = Date.now();
            velocityX = 0;
            velocityY = 0;

            cube.style.transition = 'none';
            isDefaultPosition = false;

            if (isAnimating) {
                cancelAnimationFrame(isAnimating);
                isAnimating = false;
            }
        }
    });

    document.addEventListener('touchmove', (e) => {
        if (!isCubeInteraction) return;
        e.preventDefault();

        const touch = e.touches[0];
        const now = Date.now();
        const dt = now - moveTimestamp;
        moveTimestamp = now;

        const deltaX = touch.clientX - mouseX;
        const deltaY = touch.clientY - mouseY;

        currentRotationY += deltaX * 0.3;
        currentRotationX -= deltaY * 0.3;

        if (dt > 0) {
            velocityX = 0.8 * velocityX + 0.2 * (touch.clientX - lastMouseX) / dt * 30;
            velocityY = 0.8 * velocityY + 0.2 * (touch.clientY - lastMouseY) / dt * 30;
        }

        lastMouseX = mouseX;
        lastMouseY = mouseY;
        mouseX = touch.clientX;
        mouseY = touch.clientY;

        cube.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;
    });

    document.addEventListener('touchend', () => {
        if (!isCubeInteraction) return;
        isCubeInteraction = false;

        cube.style.transition = 'none';
        applyInertia();
    });

    // Modal event listeners
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // Prevent form submission in contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Validate form inputs
            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Show sending indicator
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;
            
            try {
                // Create email subject and body
                const subject = `Portfolio Contact: ${name}`;
                const body = `Name: ${name}%0D%0A%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
                
                // Create mailto link
                const mailtoLink = `mailto:cmkbuena@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
                
                // Open email client
                window.location.href = mailtoLink;
                
                // Show success message and reset form after a short delay
                setTimeout(() => {
                    alert('Your email client has been opened with your message. Please send the email to complete your message!');
                    contactForm.reset();
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                }, 1000);
            } catch (error) {
                console.error('Error opening email client:', error);
                alert('Unable to open your email client. Please email me directly at cmkbuena@gmail.com');
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Simple email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ===== Theme Toggle =====
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Apply theme based on preference
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
        htmlElement.classList.add('dark-mode');
        htmlElement.classList.remove('light-mode');
    } else {
        htmlElement.classList.add('light-mode');
        htmlElement.classList.remove('dark-mode');
    }

    // Toggle theme when button is clicked
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (htmlElement.classList.contains('dark-mode')) {
                // Switch to light mode
                htmlElement.classList.remove('dark-mode');
                htmlElement.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
            } else {
                // Switch to dark mode
                htmlElement.classList.remove('light-mode');
                htmlElement.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // Don't start cube with animation by default
    if (cube) {
        // cube.classList.add('rotating');
        randomAnimationActive = false;
    }

    // ===== Enhanced Cube Interactions =====
    function enhanceCubeInteractions() {
        const cube = document.getElementById('cube');
        const portfolioContainer = document.querySelector('.portfolio-container');
        let initialCubeSize = 300; // Starting size in px
        let currentCubeSize = initialCubeSize;
        let isResizing = false;
        let startDistance = 0;
        let isMobile = false;
        
        // Add click event listeners to cube faces
        const faces = document.querySelectorAll('.face');
        faces.forEach(face => {
            face.addEventListener('click', (e) => {
                // Only trigger if it was a simple click, not a drag
                if (!isMouseDown && !isResizing && Math.abs(velocityX) < 0.2 && Math.abs(velocityY) < 0.2) {
                    // Determine which face was clicked
                    const faceClass = Array.from(face.classList).find(cls => 
                        ['front', 'back', 'left', 'right', 'top', 'bottom'].includes(cls)
                    );
                    
                    if (faceClass) {
                        // Open the corresponding modal
                        openModal(faceToModalMap[faceClass]);
                        
                        // Highlight the corresponding navigation button
                        const buttons = document.querySelectorAll('.control-btn');
                        buttons.forEach(btn => {
                            btn.classList.remove('active');
                            const btnFace = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
                            if (btnFace === faceClass) {
                                btn.classList.add('active');
                            }
                        });
                    }
                }
            });
        });
        
        // Check if device is mobile
        const checkMobile = () => {
            isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            return isMobile;
        };
        
        checkMobile();
        
        // Update cube size and related elements
        const updateCubeSize = (newSize) => {
            // Limit size between 150px and 500px
            newSize = Math.max(150, Math.min(500, newSize));
            
            if (newSize === currentCubeSize) return;
            
            currentCubeSize = newSize;
            
            // Update cube container size
            portfolioContainer.style.width = `${newSize}px`;
            portfolioContainer.style.height = `${newSize}px`;
            
            // Update cube and faces
            cube.style.width = `${newSize}px`;
            cube.style.height = `${newSize}px`;
            
            // Update all faces
            const faces = document.querySelectorAll('.face');
            faces.forEach(face => {
                face.style.width = `${newSize}px`;
                face.style.height = `${newSize}px`;
                
                // Adjust translateZ based on half of the new size
                const halfSize = newSize / 2;
                
                if (face.classList.contains('front')) {
                    face.style.transform = `rotateY(0deg) translateZ(${halfSize}px)`;
                } else if (face.classList.contains('back')) {
                    face.style.transform = `rotateY(180deg) translateZ(${halfSize}px)`;
                } else if (face.classList.contains('right')) {
                    face.style.transform = `rotateY(90deg) translateZ(${halfSize}px)`;
                } else if (face.classList.contains('left')) {
                    face.style.transform = `rotateY(-90deg) translateZ(${halfSize}px)`;
                } else if (face.classList.contains('top')) {
                    face.style.transform = `rotateX(90deg) translateZ(${halfSize}px)`;
                } else if (face.classList.contains('bottom')) {
                    face.style.transform = `rotateX(-90deg) translateZ(${halfSize}px)`;
                }
            });
        };
        
        // Add visual cursor state indicators
        const updateCursorState = (state) => {
            if (!cube) return;
            
            switch(state) {
                case 'hover':
                    cube.style.cursor = 'pointer';
                    break;
                case 'grabbing':
                    cube.style.cursor = 'grabbing';
                    break;
                case 'resizing':
                    cube.style.cursor = 'nesw-resize';
                    break;
                default:
                    cube.style.cursor = 'default';
            }
        };
        
        // Add hover effect
        cube.addEventListener('mouseenter', () => {
            if (!isMouseDown && !isResizing) {
                updateCursorState('hover');
                cube.classList.add('cube-hover');
            }
        });
        
        cube.addEventListener('mouseleave', () => {
            if (!isMouseDown && !isResizing) {
                updateCursorState('default');
                cube.classList.remove('cube-hover');
            }
        });
        
        // Update mouse down event to include grabbing cursor
        const originalMouseDown = document.onmousedown;
        document.addEventListener('mousedown', (e) => {
            if (isCubeInteraction) {
                updateCursorState('grabbing');
            }
        });
        
        // Update mouse up event
        document.addEventListener('mouseup', () => {
            if (isCubeInteraction) {
                updateCursorState('hover');
            }
            
            // Reset resizing state
            if (isResizing) {
                isResizing = false;
                updateCursorState('default');
            }
        });
        
        // Pinch to resize on mobile
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2 && isCubeInteraction) {
                isResizing = true;
                
                // Calculate initial distance between two fingers
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                startDistance = Math.sqrt(dx * dx + dy * dy);
                
                // Stop cube animation and rotation during resize
                if (randomAnimationActive) {
                    cube.style.animation = 'none';
                    randomAnimationActive = false;
                }
                
                e.preventDefault(); // Prevent default touch actions
            }
        }, { passive: false });
        
        document.addEventListener('touchmove', (e) => {
            if (isResizing && e.touches.length === 2) {
                // Calculate new distance
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const newDistance = Math.sqrt(dx * dx + dy * dy);
                
                // Calculate size change based on finger distance change
                const scale = newDistance / startDistance;
                const newSize = initialCubeSize * scale;
                
                updateCubeSize(newSize);
                e.preventDefault();
            }
        }, { passive: false });
        
        document.addEventListener('touchend', (e) => {
            if (isResizing && e.touches.length < 2) {
                isResizing = false;
                initialCubeSize = currentCubeSize; // Update base size for next resize
            }
        });
        
        // Mouse wheel to resize
        cube.addEventListener('wheel', (e) => {
            if (isCubeInteraction) {
                // Prevent default scroll
                e.preventDefault();
                
                // Determine resize amount (smaller for smoother resizing)
                const delta = -Math.sign(e.deltaY) * 10; // 10px change per wheel tick
                const newSize = currentCubeSize + delta;
                
                updateCubeSize(newSize);
                initialCubeSize = currentCubeSize;
                
                // Stop animation during manual interaction
                if (randomAnimationActive) {
                    cube.style.animation = 'none';
                    randomAnimationActive = false;
                }
            }
        }, { passive: false });
        
        // Add corner indicators for resize on desktop
        if (!isMobile) {
            const resizeHandles = document.createElement('div');
            resizeHandles.className = 'resize-handles';
            
            // Add the resize indicators to the corner
            const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
            positions.forEach(position => {
                const handle = document.createElement('div');
                handle.className = `resize-handle ${position}`;
                
                handle.addEventListener('mousedown', (e) => {
                    isResizing = true;
                    e.stopPropagation(); // Prevent cube rotation
                    updateCursorState('resizing');
                    
                    // Capture starting point and size
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const startSize = currentCubeSize;
                    
                    // Stop cube animation
                    if (randomAnimationActive) {
                        cube.style.animation = 'none';
                        randomAnimationActive = false;
                    }
                    
                    const onMouseMove = (moveEvent) => {
                        // Calculate distance moved (diagonal)
                        const dx = moveEvent.clientX - startX;
                        const dy = moveEvent.clientY - startY;
                        
                        // Calculate resize amount based on direction
                        let sizeDelta;
                        switch (position) {
                            case 'top-left':
                            case 'bottom-right':
                                sizeDelta = (dx + dy) / 2; // Average of horizontal and vertical movement
                                break;
                            case 'top-right':
                            case 'bottom-left':
                                sizeDelta = (dx - dy) / 2; // Inverse relationship for these corners
                                break;
                        }
                        
                        updateCubeSize(startSize + sizeDelta);
                    };
                    
                    const onMouseUp = () => {
                        document.removeEventListener('mousemove', onMouseMove);
                        document.removeEventListener('mouseup', onMouseUp);
                        isResizing = false;
                        initialCubeSize = currentCubeSize;
                        updateCursorState('hover');
                    };
                    
                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);
                });
                
                resizeHandles.appendChild(handle);
            });
            
            portfolioContainer.appendChild(resizeHandles);
        }
    }

    // Initialize the enhanced cube interactions
    enhanceCubeInteractions();
});