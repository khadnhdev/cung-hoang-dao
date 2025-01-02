document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('fade-in');
    });

    // Form validation and enhancement
    const forms = document.querySelectorAll('form');
    const loadingOverlay = document.querySelector('.loading-overlay');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const inputs = form.querySelectorAll('input, select');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value) {
                    isValid = false;
                    input.style.borderColor = '#ff6b6b';
                    shake(input);
                } else {
                    input.style.borderColor = '';
                }
            });

            if (!isValid) {
                e.preventDefault();
                return;
            }

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.classList.add('loading');
            form.classList.add('loading');
            loadingOverlay.classList.add('show');

            // Add some minimal delay for better UX
            setTimeout(() => {
                form.submit();
            }, 500);
        });
    });

    // Add shake animation for invalid inputs
    function shake(element) {
        element.classList.add('shake');
        setTimeout(() => {
            element.classList.remove('shake');
        }, 500);
    }

    // Smooth focus effects
    const formInputs = document.querySelectorAll('input, select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
});

// Add hover effect to buttons
const buttons = document.querySelectorAll('.btn-gradient');
buttons.forEach(button => {
    button.addEventListener('mousemove', function(e) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        button.style.setProperty('--x', `${x}px`);
        button.style.setProperty('--y', `${y}px`);
    });
});

// Thêm functions cho modal
function showDetails(sign) {
    const modal = document.getElementById('horoscopeModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    if (!dailyPredictions || !dailyPredictions[sign]) {
        console.error('No prediction found for sign:', sign);
        return;
    }

    const prediction = dailyPredictions[sign];
    modalTitle.textContent = `${sign} - Dự Đoán Hôm Nay`;
    
    // Show loading state
    showLoading();
    
    // Simulate loading for smoother transition
    setTimeout(() => {
        const sections = prediction.split('\n\n');
        let html = '';
        
        sections.forEach(section => {
            const [title, ...content] = section.split(':');
            if (content.length > 0) {
                const cleanTitle = title.trim();
                const cleanContent = content.join(':').trim();
                html += `
                    <div class="reading-section ${cleanTitle.toLowerCase()}">
                        <h3><i class="fas fa-${getIconForSection(cleanTitle)}"></i> ${cleanTitle}</h3>
                        <div class="result-content">${cleanContent}</div>
                    </div>
                `;
            }
        });

        modalContent.innerHTML = html;
        modal.style.display = 'block';
        // Trigger reflow
        modal.offsetHeight;
        modal.classList.add('show');
    }, 300);
}

function getIconForSection(title) {
    const icons = {
        'may mắn': 'dice',
        'tổng quan': 'sun',
        'tình cảm': 'heart',
        'công việc': 'briefcase',
        'lời khuyên': 'comment-dots',
        'sức khỏe': 'heartbeat'
    };
    return icons[title.toLowerCase()] || 'info';
}

// Close modal with animation
function closeModal() {
    const modal = document.getElementById('horoscopeModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Update event listeners
document.querySelector('.close').onclick = closeModal;

window.onclick = function(event) {
    const modal = document.getElementById('horoscopeModal');
    if (event.target == modal) {
        closeModal();
    }
}

// Add keyboard support
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Thêm hiệu ứng loading khi mở modal
function showLoading() {
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Đang tải dự đoán...</p>
        </div>
    `;
}

// Add active class to nav links based on scroll position
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Hide loading overlay when back button is pressed
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        const loadingOverlay = document.querySelector('.loading-overlay');
        const forms = document.querySelectorAll('form');
        const submitBtns = document.querySelectorAll('button[type="submit"]');
        
        loadingOverlay.classList.remove('show');
        forms.forEach(form => form.classList.remove('loading'));
        submitBtns.forEach(btn => btn.classList.remove('loading'));
    }
}); 