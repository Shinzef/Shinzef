// ===== SUMMARY PAGE JAVASCRIPT - BROWSER STYLE =====

// ===== TAB FUNCTIONALITY =====
let tabCounter = 1; // Counter for new tabs

function setAddressLabel(label) {
    const urlEl = document.querySelector('.url');
    if (!urlEl) return;
    const base = 'rhye.dev/';
    urlEl.textContent = base + label.toLowerCase();
}

function initTabSystem() {
    const tabBar = document.querySelector('.tab-bar');
    const tabContents = document.querySelectorAll('.tab-content');
    const addButton = document.querySelector('.tab-add');
    const messageHint = document.querySelector('.message-hint');
    
    // Initialize existing tabs
    setupTabEventListeners();
    
    // Add button functionality
    if (addButton) {
        addButton.addEventListener('click', () => {
            createNewTab();
        });
    }
    
    // Message hint click to create new tab
    if (messageHint) {
        messageHint.addEventListener('click', () => {
            createNewTab();
        });
    }
}function setupTabEventListeners() {
    const tabs = document.querySelectorAll('.tab[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        // Remove any existing listeners to prevent duplicates
        tab.replaceWith(tab.cloneNode(true));
    });

    // Re-get tabs after cloning
    const freshTabs = document.querySelectorAll('.tab[data-tab]');

    freshTabs.forEach(tab => {
        // Tab click handler
        tab.addEventListener('click', (e) => {
            // Don't trigger tab switch if clicking close button
            if (e.target.classList.contains('tab-close')) {
                return;
            }

            const targetTab = tab.getAttribute('data-tab');
            switchToTab(targetTab);
        });

        // Add close button if it doesn't exist
        if (!tab.querySelector('.tab-close') && !tab.classList.contains('permanent')) {
            addCloseButtonToTab(tab);
        }
    });
}

function switchToTab(targetTab) {
    const tabs = document.querySelectorAll('.tab[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');

    // Remove active class from all tabs and contents
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to clicked tab and corresponding content
    const activeTab = document.querySelector(`[data-tab="${targetTab}"]`);
    const targetContent = document.getElementById(`${targetTab}-content`);

    if (activeTab) {
        activeTab.classList.add('active');
    }

    if (targetContent) {
        targetContent.classList.add('active');
        // GSAP animation for tab content
        gsap.fromTo(targetContent,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
        );
    }

    // Update address label
    const labelMap = {
        about: 'about',
        likes: 'likes',
        journal: 'journal',
    links: 'links',
    albums: 'reccomended-albums'
    };
    setAddressLabel(labelMap[targetTab] || targetTab);
}

function addCloseButtonToTab(tab) {
    const closeBtn = document.createElement('button');
    closeBtn.className = 'tab-close';
    closeBtn.innerHTML = '×';
    closeBtn.title = 'Close tab';
    closeBtn.setAttribute('aria-label', 'Close tab');

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeTab(tab);
    });

    tab.appendChild(closeBtn);
}

function createNewTab() {
    tabCounter++;
    const tabId = `custom-${tabCounter}`;
    const tabBar = document.querySelector('.tab-bar');
    const addButton = document.querySelector('.tab-add');
    const tabContentArea = document.querySelector('.tab-content-area');

    // Create new tab element
    const newTab = document.createElement('div');
    newTab.className = 'tab editable';
    newTab.setAttribute('data-tab', tabId);

    // Create editable input for tab name
    const tabInput = document.createElement('input');
    tabInput.className = 'tab-input';
    tabInput.type = 'text';
    tabInput.value = `Random ${tabCounter}`;
    tabInput.placeholder = 'Tab name...';

    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'tab-close';
    closeBtn.innerHTML = '×';
    closeBtn.title = 'Close tab';
    closeBtn.setAttribute('aria-label', 'Close tab');

    // Add elements to tab
    newTab.appendChild(tabInput);
    newTab.appendChild(closeBtn);

    // Insert before add button
    tabBar.insertBefore(newTab, addButton);

    // Create corresponding content area
    const newContent = document.createElement('div');
    newContent.className = 'tab-content';
    newContent.id = `${tabId}-content`;
    newContent.innerHTML = `
        <div class="content-header">
            <span class="file-path">Random Notes</span>
            <div class="file-actions">
                <span class="line-numbers">draft • autosaved</span>
            </div>
        </div>
        <div class="content-body">
            <div class="markdown-block">
                <div class="message-card" role="form" aria-labelledby="message-title-${tabId}">
                    <div class="code-header">
                        <span class="file-type" id="message-title-${tabId}">message</span>
                        <div class="code-actions message-actions">
                            <input type="text" id="userName-${tabId}" class="user-name-input compact" placeholder="your name" maxlength="50" aria-required="true" aria-describedby="name-error-${tabId}" />
                            <button class="action-btn send-to-sheets primary" data-tab-id="${tabId}" title="Send message to Rhye">
                                <i class='bx bx-send'></i>
                                Send
                            </button>
                            <button class="action-btn save-local" data-tab-id="${tabId}" title="Save draft locally">
                                <i class='bx bx-save'></i>
                                Save
                            </button>
                            <button class="action-btn clear-notes" data-tab-id="${tabId}" title="Clear all content">
                                <i class='bx bx-refresh'></i>
                                Clear
                            </button>
                        </div>
                    </div>
                    <div class="code-content">
                        <div class="notes-writing-area">
                            <div class="message-section">
                                <div class="textarea-box">
                                    <textarea id="message-${tabId}" class="random-textarea" placeholder="Write anything — thoughts, feedback, or just say hi." aria-required="true" aria-describedby="message-error-${tabId}" aria-labelledby="message-title-${tabId}"></textarea>
                                </div>
                                <div class="field-error" id="message-error-${tabId}" role="alert" aria-live="polite">Please write a message.</div>
                            </div>
                            <div class="notes-footer">
                                <div class="notes-meta">
                                    <span class="char-counter">0 characters</span>
                                    <span class="word-counter">0 words</span>
                                </div>
                            </div>
                        </div>
                        <div class="field-error" id="name-error-${tabId}" role="alert" aria-live="polite">Please enter your name.</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    tabContentArea.appendChild(newContent);

    // Add event listeners
    setupTabEventListeners();
    setupRandomContentHandlers(tabId);

    // Switch to new tab and focus input
    switchToTab(tabId);
    tabInput.select();

    // Handle input changes
    tabInput.addEventListener('blur', () => {
        if (tabInput.value.trim() === '') {
            tabInput.value = `Random ${tabCounter}`;
        }
        newTab.classList.remove('editable');
    });

    tabInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            tabInput.blur();
        }
        e.stopPropagation();
    });

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeTab(newTab);
    });
}

function closeTab(tab) {
    const tabId = tab.getAttribute('data-tab');
    const content = document.getElementById(`${tabId}-content`);
    const isActive = tab.classList.contains('active');

    // Remove tab and content
    tab.remove();
    if (content) {
        content.remove();
    }

    // If closed tab was active, switch to first available tab
    if (isActive) {
        const firstTab = document.querySelector('.tab[data-tab]');
        if (firstTab) {
            const firstTabId = firstTab.getAttribute('data-tab');
            switchToTab(firstTabId);
        }
    }

    // Re-setup event listeners
    setupTabEventListeners();
}

function setupRandomContentHandlers(tabId) {
    const saveBtn = document.querySelector(`.save-local[data-tab-id="${tabId}"]`);
    const sendBtn = document.querySelector(`.send-to-sheets[data-tab-id="${tabId}"]`);
    const clearBtn = document.querySelector(`.clear-notes[data-tab-id="${tabId}"]`);
    const textarea = document.querySelector(`#message-${tabId}`);
    const charCounter = document.querySelector(`#${tabId}-content .char-counter`);
    const wordCounter = document.querySelector(`#${tabId}-content .word-counter`);
    
    // Character and word counter
    if (textarea && (charCounter || wordCounter)) {
        const updateCounts = () => {
            const text = textarea.value;
            const charCount = text.length;
            const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
            
            if (charCounter) {
                charCounter.textContent = `${charCount} character${charCount !== 1 ? 's' : ''}`;
                
                // Change color based on length
                if (charCount === 0) {
                    charCounter.style.color = 'var(--text-muted)';
                } else if (charCount > 500) {
                    charCounter.style.color = 'var(--accent-warm)';
                } else {
                    charCounter.style.color = 'var(--text-secondary)';
                }
            }
            
            if (wordCounter) {
                wordCounter.textContent = `${wordCount} word${wordCount !== 1 ? 's' : ''}`;
            }
        };
        
        textarea.addEventListener('input', updateCounts);
        updateCounts(); // Initial count
    }    // Save local button
    if (saveBtn && textarea) {
        saveBtn.addEventListener('click', () => {
            const userNameInput = document.querySelector(`#userName-${tabId}`);
            const userName = userNameInput ? userNameInput.value.trim() : '';
            const content = textarea.value.trim();

            if (!content) {
                showErrorNotification('Nothing to save!');
                return;
            }

            localStorage.setItem(`random-notes-${tabId}`, content);
            if (userName) {
                localStorage.setItem(`random-notes-${tabId}-user`, userName);
            }
            localStorage.setItem(`random-notes-${tabId}-timestamp`, Date.now());
            showSaveNotification('Notes saved locally!');
        });
    }

    // Send to Google Sheets button
    if (sendBtn && textarea) {
        sendBtn.addEventListener('click', async () => {
            const userNameInput = document.querySelector(`#userName-${tabId}`);
            const userName = userNameInput ? userNameInput.value.trim() : '';
            const content = textarea.value.trim();

            // Validation
            const nameError = document.getElementById(`name-error-${tabId}`);
            const msgError = document.getElementById(`message-error-${tabId}`);
            let invalid = false;

            if (!userName) {
                showErrorNotification('Please enter your name');
                if (userNameInput) {
                    userNameInput.classList.add('invalid');
                    nameError && nameError.classList.add('show');
                    userNameInput.focus();
                }
                invalid = true;
            } else {
                if (userNameInput) userNameInput.classList.remove('invalid');
                nameError && nameError.classList.remove('show');
            }

            if (!content) {
                showErrorNotification('Please write something first!');
                textarea.classList.add('invalid');
                msgError && msgError.classList.add('show');
                textarea.focus();
                invalid = true;
            } else {
                textarea.classList.remove('invalid');
                msgError && msgError.classList.remove('show');
            }

            if (invalid) {
                // subtle shake
                gsap.fromTo(`#${tabId}-content .message-card`, { x: -4 }, { x: 0, duration: 0.25, ease: 'elastic.out(1, 0.5)', repeat: 1, yoyo: true });
                return;
            }

            // Show loading state
            sendBtn.classList.add('loading');
            sendBtn.disabled = true;

            try {
                const result = await sendToGoogleSheets(userName, content);

                if (result.status === 'success') {
                    showSaveNotification('✨ Message sent successfully! Thank you for sharing.');

                    // Optionally clear the form after successful send
                    // textarea.value = '';
                    // if (userNameInput) userNameInput.value = '';
                    // if (charCounter) charCounter.textContent = '0 characters';
                    // if (wordCounter) wordCounter.textContent = '0 words';
                } else {
                    showErrorNotification('Error: ' + (result.data || 'Something went wrong'));
                }

            } catch (error) {
                console.error('Error sending to Google Sheets:', error);
                showErrorNotification('Network error: Please check your connection and try again');
            } finally {
                // Remove loading state
                sendBtn.classList.remove('loading');
                sendBtn.disabled = false;
            }
        });
    }

    // Clear button
    if (clearBtn && textarea) {
        clearBtn.addEventListener('click', () => {
            const userNameInput = document.querySelector(`#userName-${tabId}`);
            const hasContent = textarea.value.trim() !== '' || (userNameInput && userNameInput.value.trim() !== '');

            if (!hasContent) return;

            // Show confirmation for non-empty content
            if (confirm('Are you sure you want to clear all notes and user info?')) {
                textarea.value = '';
                if (userNameInput) userNameInput.value = '';
                localStorage.removeItem(`random-notes-${tabId}`);
                localStorage.removeItem(`random-notes-${tabId}-user`);
                localStorage.removeItem(`random-notes-${tabId}-timestamp`);
                if (charCounter) charCounter.textContent = '0 characters';
                if (wordCounter) wordCounter.textContent = '0 words';
                textarea.focus();
            }
        });
    }

    // Load saved content
    if (textarea) {
        const savedContent = localStorage.getItem(`random-notes-${tabId}`);
        const savedUser = localStorage.getItem(`random-notes-${tabId}-user`);
        const userNameInput = document.querySelector(`#userName-${tabId}`);

        if (savedContent) {
            textarea.value = savedContent;
            // Update counters
            if (charCounter || wordCounter) {
                const charCount = savedContent.length;
                const wordCount = savedContent.trim() === '' ? 0 : savedContent.trim().split(/\s+/).length;

                if (charCounter) charCounter.textContent = `${charCount} character${charCount !== 1 ? 's' : ''}`;
                if (wordCounter) wordCounter.textContent = `${wordCount} word${wordCount !== 1 ? 's' : ''}`;
            }
        }

        if (savedUser && userNameInput) {
            userNameInput.value = savedUser;
        }

        // Live error clearing
        if (userNameInput) {
            const nameError = document.getElementById(`name-error-${tabId}`);
            userNameInput.addEventListener('input', () => {
                if (userNameInput.value.trim()) {
                    userNameInput.classList.remove('invalid');
                    nameError && nameError.classList.remove('show');
                }
            });
        }
        const msgError = document.getElementById(`message-error-${tabId}`);
        textarea.addEventListener('input', () => {
            if (textarea.value.trim()) {
                textarea.classList.remove('invalid');
                msgError && msgError.classList.remove('show');
            }
        });
    }
}

// Google Sheets integration

async function sendSecureMessage(user, message) {
    const payload = {
        user: user,
        message: message
    };

    // Call your Netlify Function's endpoint
    const response = await fetch("/.netlify/functions/send-message", { 
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
}

function showSaveNotification(message = 'Notes saved!') {
    const notification = document.createElement('div');
    notification.className = 'save-notification';
    notification.innerHTML = `
        <i class='bx bx-check-circle'></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);

    // Animate in
    gsap.fromTo(notification,
        { opacity: 0, x: 100, scale: 0.8 },
        { opacity: 1, x: 0, scale: 1, duration: 0.4, ease: "back.out(1.7)" }
    );

    // Remove after 3 seconds
    setTimeout(() => {
        gsap.to(notification, {
            opacity: 0,
            x: 100,
            scale: 0.8,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }
        });
    }, 3000);
}

function showErrorNotification(message = 'Something went wrong!') {
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
        <i class='bx bx-error-circle'></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);

    // Animate in
    gsap.fromTo(notification,
        { opacity: 0, x: 100, scale: 0.8 },
        { opacity: 1, x: 0, scale: 1, duration: 0.4, ease: "back.out(1.7)" }
    );

    // Remove after 4 seconds (longer for errors)
    setTimeout(() => {
        gsap.to(notification, {
            opacity: 0,
            x: 100,
            scale: 0.8,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }
        });
    }, 4000);
}

// ===== THEME TOGGLE =====
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-toggle i');
    if (theme === 'dark') {
        themeIcon.className = 'bx bxs-sun';
    } else {
        themeIcon.className = 'bx bxs-moon';
    }
}

// ===== DISCORD POPUP =====
function showDiscordPopup() {
    const popup = document.getElementById('discord-popup');
    popup.classList.add('active');

    // Prevent body scroll when popup is open
    document.body.style.overflow = 'hidden';

    // Close on ESC key
    document.addEventListener('keydown', handleEscapeKey);

    // Close on backdrop click
    popup.addEventListener('click', handleBackdropClick);
}

function hideDiscordPopup() {
    const popup = document.getElementById('discord-popup');
    popup.classList.remove('active');

    // Restore body scroll
    document.body.style.overflow = '';

    // Remove event listeners
    document.removeEventListener('keydown', handleEscapeKey);
    popup.removeEventListener('click', handleBackdropClick);
}

function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        hideDiscordPopup();
    }
}

function handleBackdropClick(e) {
    if (e.target.classList.contains('popup-overlay')) {
        hideDiscordPopup();
    }
}

function copyDiscordUsername() {
    const username = document.getElementById('discord-username').textContent;

    // Modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(username).then(() => {
            showCopyFeedback();
        }).catch(() => {
            fallbackCopyText(username);
        });
    } else {
        fallbackCopyText(username);
    }
}

function fallbackCopyText(text) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        showCopyFeedback();
    } catch (err) {
        console.error('Copy failed:', err);
        showCopyError();
    }

    document.body.removeChild(textArea);
}

function showCopyFeedback() {
    const copyBtn = document.querySelector('.copy-btn');
    const originalIcon = copyBtn.innerHTML;

    copyBtn.innerHTML = '<i class="bx bx-check"></i>';
    copyBtn.style.background = '#10b981';

    setTimeout(() => {
        copyBtn.innerHTML = originalIcon;
        copyBtn.style.background = '';
    }, 1500);
}

function showCopyError() {
    const copyBtn = document.querySelector('.copy-btn');
    const originalIcon = copyBtn.innerHTML;

    copyBtn.innerHTML = '<i class="bx bx-x"></i>';
    copyBtn.style.background = '#ef4444';

    setTimeout(() => {
        copyBtn.innerHTML = originalIcon;
        copyBtn.style.background = '';
    }, 1500);
}

// ===== GSAP INTRO ANIMATIONS - BROWSER STYLE =====
function initGSAPAnimations() {
    // Set initial states for browser elements
    gsap.set(".browser-window", { opacity: 0, scale: 0.95, y: 30 });
    gsap.set(".browser-header", { opacity: 0, y: -20 });
    gsap.set(".tab-bar", { opacity: 0, y: -10 });
    gsap.set(".sidebar-profile", { opacity: 0, x: -30 });
    gsap.set(".tab-content-area", { opacity: 0, x: 30 });
    gsap.set(".status-bar", { opacity: 0, y: 20 });
    gsap.set(".avatar", { opacity: 0, scale: 0.8, rotation: -10 });

    // Create the intro timeline
    const introTl = gsap.timeline({ delay: 0.2 });

    // Browser window entrance
    introTl.to(".browser-window", {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
    })

        // Browser header animation
        .to(".browser-header", {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.6")

        // Tab bar animation
        .to(".tab-bar", {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.3")

        // Sidebar profile animation
        .to(".sidebar-profile", {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.4")

        // Avatar with bounce
        .to(".avatar", {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: "back.out(1.7)"
        }, "-=0.4")

        // Tab content area
        .to(".tab-content-area", {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.5")

        // Status bar
        .to(".status-bar", {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.3");

    return introTl;
}

// ===== GSAP HOVER ANIMATIONS - BROWSER STYLE =====
function initGSAPHoverEffects() {
    // Enhanced avatar hover
    const avatar = document.querySelector('.avatar');
    if (avatar) {
        avatar.addEventListener('mouseenter', () => {
            gsap.to(avatar, {
                scale: 1.1,
                rotation: 8,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        avatar.addEventListener('mouseleave', () => {
            gsap.to(avatar, {
                scale: 1,
                rotation: 0,
                duration: 0.4,
                ease: "elastic.out(1, 0.5)"
            });
        });
    }

    // Tab hover effects
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('mouseenter', () => {
            if (!tab.classList.contains('active')) {
                gsap.to(tab, {
                    y: -2,
                    duration: 0.2,
                    ease: "power2.out"
                });
            }
        });

        tab.addEventListener('mouseleave', () => {
            if (!tab.classList.contains('active')) {
                gsap.to(tab, {
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    });

    // Social links animations  
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, {
                y: -3,
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
            });

            gsap.to(link.querySelector('.link-icon'), {
                rotation: 5,
                scale: 1.1,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        link.addEventListener('mouseleave', () => {
            gsap.to(link, {
                y: 0,
                scale: 1,
                duration: 0.4,
                ease: "elastic.out(1, 0.5)"
            });

            gsap.to(link.querySelector('.link-icon'), {
                rotation: 0,
                scale: 1,
                duration: 0.4,
                ease: "elastic.out(1, 0.5)"
            });
        });
    });

    // Window control dots hover
    const controlDots = document.querySelectorAll('.control-dot');
    controlDots.forEach(dot => {
        dot.addEventListener('mouseenter', () => {
            gsap.to(dot, {
                scale: 1.2,
                duration: 0.2,
                ease: "power2.out"
            });
        });

        dot.addEventListener('mouseleave', () => {
            gsap.to(dot, {
                scale: 1,
                duration: 0.3,
                ease: "elastic.out(1, 0.5)"
            });
        });
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.theme-toggle, .nav-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.1,
                duration: 0.2,
                ease: "power2.out"
            });
        });

        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    // Add smooth scrolling for any internal links
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
}

// ===== GLOBAL FUNCTIONS (for onclick handlers) =====
window.showDiscordPopup = showDiscordPopup;
window.hideDiscordPopup = hideDiscordPopup;
window.copyDiscordUsername = copyDiscordUsername;
function initCardAnimations() {
    // This function is now handled by GSAP animations above
    // Keeping for compatibility but using GSAP instead
    return initGSAPAnimations();
}

// ===== INTERACTIVE ELEMENTS =====
function initInteractiveElements() {
    // Add hover effects to interest tags
    const interestTags = document.querySelectorAll('.interest-tag');
    interestTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = 'translateY(-2px) scale(1.05)';
        });

        tag.addEventListener('mouseleave', () => {
            tag.style.transform = '';
        });
    });

    // Add hover effects to connect links
    const connectLinks = document.querySelectorAll('.connect-link');
    connectLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-2px) scale(1.02)';
        });

        link.addEventListener('mouseleave', () => {
            link.style.transform = '';
        });
    });

    // Add click ripple effect to buttons
    const buttons = document.querySelectorAll('button, .connect-link, .explore-btn');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });

    // Initialize code button functionality
    initCodeButtons();
}

function createRipple(e) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;

    if (!button.style.position || button.style.position === 'static') {
        button.style.position = 'relative';
    }

    if (!button.style.overflow) {
        button.style.overflow = 'hidden';
    }

    button.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== CODE BUTTON FUNCTIONALITY =====
function initCodeButtons() {
    // Copy functionality
    document.querySelectorAll('.code-btn[title*="Copy"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const codeBlock = btn.closest('.code-block, .json-block, .markdown-block');
            const codeContent = codeBlock.querySelector('.code-content');

            if (codeContent) {
                const textContent = codeContent.textContent || codeContent.innerText;
                copyToClipboard(textContent, btn);
            }
        });
    });

    // Play/Run code animation
    document.querySelectorAll('.code-btn[title*="Run"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            runCodeAnimation(btn);
        });
    });

    // Format JSON
    document.querySelectorAll('.code-btn[title*="Format"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            formatJsonAnimation(btn);
        });
    });

    // Refresh log
    document.querySelectorAll('.code-btn[title*="Refresh"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            refreshLogAnimation(btn);
        });
    });
}

function copyToClipboard(text, button) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showCopySuccess(button);
        }).catch(() => {
            fallbackCopyText(text, button);
        });
    } else {
        fallbackCopyText(text, button);
    }
}

function fallbackCopyText(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        showCopySuccess(button);
    } catch (err) {
        console.error('Copy failed:', err);
        showCopyError(button);
    }

    document.body.removeChild(textArea);
}

function showCopySuccess(button) {
    const originalIcon = button.innerHTML;
    button.innerHTML = '<i class="bx bx-check"></i>';
    button.style.color = '#10b981';

    gsap.to(button, { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 });

    setTimeout(() => {
        button.innerHTML = originalIcon;
        button.style.color = '';
    }, 1500);
}

function showCopyError(button) {
    const originalIcon = button.innerHTML;
    button.innerHTML = '<i class="bx bx-x"></i>';
    button.style.color = '#ef4444';

    gsap.to(button, { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 });

    setTimeout(() => {
        button.innerHTML = originalIcon;
        button.style.color = '';
    }, 1500);
}

function runCodeAnimation(button) {
    const codeBlock = button.closest('.code-block');
    const codeContent = codeBlock.querySelector('.code-content');

    // Animate the code execution
    gsap.to(button, { rotation: 360, duration: 1, ease: "power2.out" });

    // Add a subtle glow effect to the code content
    gsap.fromTo(codeContent,
        { boxShadow: '0 0 0 rgba(26, 115, 232, 0)' },
        { boxShadow: '0 0 20px rgba(26, 115, 232, 0.3)', duration: 0.5, yoyo: true, repeat: 1 }
    );

    // Show "executed" feedback
    const originalIcon = button.innerHTML;
    setTimeout(() => {
        button.innerHTML = '<i class="bx bx-check"></i>';
        button.style.color = '#10b981';
        setTimeout(() => {
            button.innerHTML = originalIcon;
            button.style.color = '';
        }, 1000);
    }, 500);
}

function formatJsonAnimation(button) {
    const jsonBlock = button.closest('.json-block');
    const codeContent = jsonBlock.querySelector('.code-content');

    // Animate formatting
    gsap.to(button, { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1 });
    gsap.fromTo(codeContent,
        { scale: 0.98, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" }
    );

    // Show "formatted" feedback
    const originalIcon = button.innerHTML;
    button.innerHTML = '<i class="bx bx-check"></i>';
    button.style.color = '#10b981';
    setTimeout(() => {
        button.innerHTML = originalIcon;
        button.style.color = '';
    }, 1000);
}

function refreshLogAnimation(button) {
    const logBlock = button.closest('.log-block');
    const logEntries = logBlock.querySelectorAll('.log-entry');

    // Spin the refresh button
    gsap.to(button.querySelector('i'), { rotation: 360, duration: 1, ease: "power2.out" });

    // Animate log entries refresh
    gsap.fromTo(logEntries,
        { x: -10, opacity: 0.5 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );

    // Update the first timestamp to show "just now"
    setTimeout(() => {
        const firstTimestamp = logEntries[0]?.querySelector('.timestamp');
        if (firstTimestamp) {
            const originalText = firstTimestamp.textContent;
            firstTimestamp.textContent = '[just now]';
            firstTimestamp.style.color = '#10b981';
            setTimeout(() => {
                firstTimestamp.textContent = originalText;
                firstTimestamp.style.color = '';
            }, 2000);
        }
    }, 500);
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    // Add smooth scrolling for any internal links
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
}

// ===== STATUS UPDATES =====
function initStatusUpdates() {
    const statusItems = document.querySelectorAll('.status-item');

    // Add some dynamic behavior to status items
    statusItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(5px)';
            item.style.background = 'var(--bg-tertiary)';
            item.style.borderRadius = 'var(--border-radius)';
            item.style.padding = 'var(--space-sm)';
            item.style.margin = 'calc(var(--space-sm) * -1)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
            item.style.background = '';
            item.style.borderRadius = '';
            item.style.padding = '';
            item.style.margin = '';
        });
    });
}

// ===== EASTER EGGS - BROWSER STYLE =====
function initEasterEggs() {
    let clickCount = 0;
    const avatar = document.querySelector('.avatar');

    if (avatar) {
        avatar.addEventListener('click', () => {
            clickCount++;

            if (clickCount === 1) {
                // GSAP rotation animation
                gsap.to(avatar, {
                    rotation: 360,
                    duration: 0.6,
                    ease: "power2.inOut",
                    onComplete: () => {
                        gsap.set(avatar, { rotation: 0 });
                    }
                });
            } else if (clickCount === 3) {
                // Rainbow gradient effect
                gsap.set(avatar, {
                    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #f093fb, #f6ad55)',
                    backgroundSize: '400% 400%'
                });

                // Animate the gradient
                gsap.to(avatar, {
                    backgroundPosition: '100% 50%',
                    duration: 2,
                    ease: "sine.inOut",
                    repeat: 3,
                    yoyo: true,
                    onComplete: () => {
                        gsap.set(avatar, {
                            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-warm))',
                            backgroundSize: '',
                            backgroundPosition: ''
                        });
                        clickCount = 0;
                    }
                });

                // Scale animation
                gsap.to(avatar, {
                    scale: 1.15,
                    duration: 0.3,
                    ease: "power2.out",
                    yoyo: true,
                    repeat: 1
                });
            } else if (clickCount === 5) {
                // Browser glitch effect
                const browserWindow = document.querySelector('.browser-window');
                gsap.to(browserWindow, {
                    x: 5,
                    duration: 0.1,
                    ease: "power2.inOut",
                    yoyo: true,
                    repeat: 5,
                    onComplete: () => {
                        gsap.set(browserWindow, { x: 0 });
                        clickCount = 0;
                    }
                });
            }
        });
    }

    // Control dots easter egg
    const controlDots = document.querySelectorAll('.control-dot');
    controlDots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();

            if (index === 0) { // Close button
                // Fake window close animation
                const browserWindow = document.querySelector('.browser-window');
                gsap.to(browserWindow, {
                    scale: 0.95,
                    opacity: 0.5,
                    duration: 0.3,
                    ease: "power2.out",
                    onComplete: () => {
                        gsap.to(browserWindow, {
                            scale: 1,
                            opacity: 1,
                            duration: 0.4,
                            ease: "bounce.out"
                        });
                    }
                });
            }
        });
    });
}

// ===== PERFORMANCE OPTIMIZATION =====
function initPerformanceOptimizations() {
    // Lazy load background circles
    const circles = document.querySelectorAll('.bg-circle');
    circles.forEach((circle, index) => {
        setTimeout(() => {
            circle.style.opacity = '0.03';
        }, index * 200);
    });

    // Debounce resize events
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Handle any resize-specific logic here
            console.log('Resize handled');
        }, 150);
    });
}

// ===== INITIALIZATION - BROWSER STYLE =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core systems
    initTabSystem();
    initThemeToggle();

    // Initialize GSAP animations
    initGSAPAnimations();
    initGSAPHoverEffects();

    // Initialize other features
    initInteractiveElements();
    initEasterEggs();
    initSmoothScrolling();

    // Add loaded class for any CSS transitions
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ===== ZOOM FUNCTIONALITY =====
let currentZoom = 100;

function adjustZoom(delta) {
    const browserWindow = document.querySelector('.browser-window');
    const zoomLevel = document.getElementById('zoom-level');

    currentZoom += delta;
    currentZoom = Math.max(50, Math.min(200, currentZoom)); // Limit between 50% and 200%

    const scale = currentZoom / 100;

    // Apply zoom with smooth animation
    gsap.to(browserWindow, {
        scale: scale,
        duration: 0.3,
        ease: "power2.out",
        transformOrigin: "center center"
    });

    // Update zoom level display
    if (zoomLevel) {
        zoomLevel.textContent = `${currentZoom}%`;
    }

    // Add visual feedback
    if (delta > 0) {
        // Zoom in feedback
        gsap.fromTo(zoomLevel,
            { scale: 1.2, color: "var(--accent-success)" },
            { scale: 1, color: "var(--text-primary)", duration: 0.3 }
        );
    } else {
        // Zoom out feedback
        gsap.fromTo(zoomLevel,
            { scale: 0.8, color: "var(--accent-warm)" },
            { scale: 1, color: "var(--text-primary)", duration: 0.3 }
        );
    }
}

// --- About: music card interactions ---
function initMusicCard() {
    const card = document.querySelector('#about-content .music-card');
    if (!card) return;

    const playBtn = card.querySelector('.play i');
    const barFill = card.querySelector('.bar');
    const dot = card.querySelector('.bar .dot');

    // Create a GSAP tween for progress (paused initially)
    const tl = gsap.timeline({ paused: true });
    tl.to(barFill, { '--w': 100, duration: 190, ease: 'none', onUpdate: () => { } });
    // Fallback since CSS var isn't animated directly; animate width via pseudo shim
    // We instead animate a separate element width by selecting ::before via CSS proxy
    // Not directly accessible; simulate by updating gradient width on the element style
    const update = (val) => {
        barFill.style.setProperty('--progress', `${val}%`);
        // emulate width for ::before using inline style where we mirror via attribute
        barFill.setAttribute('data-progress', `${val}`);
    };
    // Replace timeline with manual tick
    let raf, start, total = 192000; // 3:12 demo
    function tick(ts) {
        if (!start) start = ts; const elapsed = ts - start; const pct = Math.min(100, (elapsed / total) * 100);
        update(pct);
        if (pct < 100) raf = requestAnimationFrame(tick); else card.dataset.playing = 'false';
    }

    function play() {
        card.dataset.playing = 'true';
        playBtn.className = 'bx bx-pause';
        cancelAnimationFrame(raf); start = undefined; raf = requestAnimationFrame(tick);
    }
    function pause() {
        card.dataset.playing = 'false';
        playBtn.className = 'bx bx-play';
        cancelAnimationFrame(raf);
    }

    card.querySelector('.play').addEventListener('click', () => {
        if (card.dataset.playing === 'true') pause(); else play();
    });
}

// Hook it up on init
(function () {
    const old = document.addEventListener;
    document.addEventListener('DOMContentLoaded', (e) => {
        initMusicCard();
    });
})();
