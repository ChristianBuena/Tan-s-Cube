// Cube rotation and interaction logic
document.addEventListener('DOMContentLoaded', () => {
    const cube = document.getElementById('cube');
    let currentRotationX = -10;
    let currentRotationY = 15;
    let velocityX = 0;
    let velocityY = 0;
    let isAnimating = false;
    let isDefaultPosition = true;

    // Track if the random animation is active
    let randomAnimationActive = true;

    const rotations = {
        front: { x: -10, y: 15 },
        back: { x: -10, y: 195 },
        right: { x: -10, y: 105 },
        left: { x: -10, y: -75 },
        top: { x: -100, y: 15 },
        bottom: { x: 80, y: 15 }
    };

    // Apply smooth transition to the cube
    cube.style.transition = 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';

    // Correct mapping for cube faces to modal content
    const faceToModalMap = {
        'front': 'modal-about',
        'back': 'modal-projects',
        'right': 'modal-contact',      // Corrected from certifications
        'left': 'modal-certifications', // Corrected from contact
        'top': 'modal-skills',
        'bottom': 'modal-experience'
    };

    // Enhanced modal handling
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');

    // Function to close modal
    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            
            // Remove active state from all buttons
            const buttons = document.querySelectorAll('.control-btn');
            buttons.forEach(btn => {
                btn.classList.remove('active');
            });
        }
    }

    // Update modal handling in the DOMContentLoaded event
    document.addEventListener('DOMContentLoaded', () => {
        // Open the corresponding modal after a delay to allow for cube rotation
        setTimeout(() => {
            openModal(faceToModalMap[face]);
        }, 800); // Match this with the cube rotation duration
        
        // Function to open modal with specific content
        function openModal(contentId) {
            const modalOverlay = document.getElementById('modal-overlay');
            const modalContents = document.querySelectorAll('.modal-content');
            
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
            
            // Don't prevent body scrolling - we want to keep the cube visible
            // document.body.style.overflow = 'hidden';
        }
        
        // Close modal when clicking the close button
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                modalOverlay.classList.remove('active');
            });
        }
        
        // Close modal when clicking outside the modal content (only on the transparent part)
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    modalOverlay.classList.remove('active');
                }
            });
        }
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
                modalOverlay.classList.remove('active');
            }
        });
    });

    // Updated rotateCube function to separate cube rotation from modal opening
    window.rotateCube = function(face) {
        const rotation = rotations[face];
        currentRotationX = rotation.x;
        currentRotationY = rotation.y;
        velocityX = 0;
        velocityY = 0;
        
        // Add the transition before changing transform
        cube.style.transition = 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
        cube.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;
        
        // Stop the animation completely
        cube.style.animation = 'none';
        isDefaultPosition = false;
        
        // Update active button state
        const buttons = document.querySelectorAll('.control-btn');
        buttons.forEach(btn => {
            btn.classList.remove('active');
            // Get the face from the onclick attribute
            const btnFace = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
            if (btnFace === face) {
                btn.classList.add('active');
            }
        });
        
        // Open the corresponding modal after a delay to allow for cube rotation
        setTimeout(() => {
            openModal(faceToModalMap[face]);
        }, 800); // Match this with the cube rotation duration
        
        // Function to open modal with specific content
        function openModal(contentId) {
            const modalOverlay = document.getElementById('modal-overlay');
            const modalContents = document.querySelectorAll('.modal-content');
            
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
            
            // Don't prevent body scrolling - we want to keep the cube visible
            // document.body.style.overflow = 'hidden';
        }
        
        // Close modal when clicking the close button
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                modalOverlay.classList.remove('active');
            });
        }
        
        // Close modal when clicking outside the modal content (only on the transparent part)
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    modalOverlay.classList.remove('active');
                }
            });
        }
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
                modalOverlay.classList.remove('active');
            }
        });
    };

    // Mouse interaction with inertia
    let isMouseDown = false;
    let mouseX = 0;
    let mouseY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let moveTimestamp = 0;
    let isCubeInteraction = false;

    // Check if click was inside the cube area
    function isClickInCubeArea(clientX, clientY) {
        const cubeRect = cube.getBoundingClientRect();
        return (
            clientX >= cubeRect.left - 100 &&
            clientX <= cubeRect.right + 100 &&
            clientY >= cubeRect.top - 100 &&
            clientY <= cubeRect.bottom + 100
        );
    }

    document.addEventListener('mousedown', (e) => {
        isCubeInteraction = isClickInCubeArea(e.clientX, e.clientY);

        if (isCubeInteraction) {
            // Stop the random animation when manually interacting
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

            // Remove transition during manual rotation
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

        // Calculate rotation deltas
        const deltaX = e.clientX - mouseX;
        const deltaY = e.clientY - mouseY;

        // Update rotation with smoothing factor
        currentRotationY += deltaX * 0.5;
        currentRotationX -= deltaY * 0.5;

        // Calculate velocity for inertia
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

        // Add inertia animation
        cube.style.transition = 'none';
        applyInertia();
    });

    // Touch support with inertia
    document.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];

        isCubeInteraction = isClickInCubeArea(touch.clientX, touch.clientY);

        if (isCubeInteraction) {
            // Stop the random animation when manually interacting
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

        // Add inertia animation
        cube.style.transition = 'none';
        applyInertia();
    });

    // Inertia function for smooth deceleration
    function applyInertia() {
        if (Math.abs(velocityX) < 0.1 && Math.abs(velocityY) < 0.1) {
            setTimeout(() => {
                // Just add smooth transition but don't reset the animation
                cube.style.transition = 'transform 2s cubic-bezier(0.2, 0.8, 0.2, 1)';
                // Keep the current transform, don't reset to any animation
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

    // Apply the initial transform
    cube.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;

    // Theme toggle functionality
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const htmlElement = document.documentElement;

    // Check for saved theme preference or prefer-color-scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Apply the right theme based on saved preference or system preference
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
        htmlElement.classList.add('dark-mode');
        htmlElement.classList.remove('light-mode');
    } else {
        htmlElement.classList.add('light-mode');
        htmlElement.classList.remove('dark-mode');
    }

    // Toggle theme when button is clicked
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
});

// Add modal functionality
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalContents = document.querySelectorAll('.modal-content');

// Map faces to their corresponding modal content IDs
const faceToModalMap = {
    'front': 'modal-about',
    'back': 'modal-projects',
    'left': 'modal-certifications',
    'right': 'modal-contact',
    'top': 'modal-skills',
    'bottom': 'modal-experience'
};

// Extend existing rotateCube function to also open the modal
const originalRotateCube = window.rotateCube;
window.rotateCube = function(face) {
    // Call the original function first to rotate the cube
    originalRotateCube(face);
    
    // Open the corresponding modal after a delay to allow for cube rotation
    setTimeout(() => {
        openModal(faceToModalMap[face]);
    }, 800); // Match this with the cube rotation duration
};

// Function to open modal with specific content
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
    
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
}

// Close modal when clicking the close button
modalClose.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    
    // Re-enable body scrolling
    document.body.style.overflow = '';
});

// Close modal when clicking outside the modal content
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Modal close functionality
document.querySelectorAll('.modal-close').forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.closest('.modal-content').id;
        closeModal(modalId);
    });
});

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.querySelector('.modal-overlay').classList.remove('active');
}

// Prevent form submission in the contact form
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Here you would normally handle the form submission
        // For demo purposes, just show a success message
        alert('Form submitted successfully! (Demo only)');
    });
}

// Cube rotation management
document.addEventListener('DOMContentLoaded', () => {
    const cube = document.querySelector('.cube');
    
    // Start rotation on load
    cube.classList.add('rotating');
    
    // Pause rotation on hover or touch
    cube.addEventListener('mouseenter', () => {
        cube.classList.remove('rotating');
    });
    
    // Resume rotation when mouse leaves
    cube.addEventListener('mouseleave', () => {
        setTimeout(() => {
            cube.classList.add('rotating');
        }, 1000); // Short delay before resuming
    });
    
    // Handle clicks on cube faces
    cube.addEventListener('click', (e) => {
        // Your existing click handler
        cube.classList.remove('rotating');
        
        // Resume rotation after a delay if no modal opened
        setTimeout(() => {
            if (!document.querySelector('.modal-overlay.active')) {
                cube.classList.add('rotating');
            }
        }, 3000);
    });
    
    // Resume rotation when modal closes
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', () => {
            setTimeout(() => {
                cube.classList.add('rotating');
            }, 500);
        });
    });
});

// Add this to your existing JavaScript for skill progress bars
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    // Animate each progress bar to its target width
    progressBars.forEach(bar => {
        const targetPercent = bar.getAttribute('data-percent');
        setTimeout(() => {
            bar.style.width = targetPercent + '%';
        }, 300);
    });
}

// Call when skills section is opened
document.querySelector('[data-target="skills"]').addEventListener('click', () => {
    setTimeout(animateProgressBars, 500);
});

// Also call when page loads if skills section is visible
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('skills').classList.contains('active')) {
        animateProgressBars();
    }
});