// ===================================
// ORDER PAGE JAVASCRIPT
// Form handling and image upload
// ===================================

document.addEventListener('DOMContentLoaded', function () {

    // === FILE UPLOAD FUNCTIONALITY ===
    const fileUpload = document.getElementById('fileUpload');
    const imageInput = document.getElementById('imageInput');
    const filePreview = document.getElementById('filePreview');

    // Drag and drop handlers
    fileUpload.addEventListener('dragover', function (e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });

    fileUpload.addEventListener('dragleave', function (e) {
        e.preventDefault();
        this.classList.remove('drag-over');
    });

    fileUpload.addEventListener('drop', function (e) {
        e.preventDefault();
        this.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });

    // File input change handler
    imageInput.addEventListener('change', function (e) {
        if (this.files.length > 0) {
            handleFileSelect(this.files[0]);
        }
    });

    // Handle file selection
    function handleFileSelect(file) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            showError('Please upload a valid image file (JPG, JPEG, or PNG)');
            return;
        }

        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            showError('File size must be less than 10MB');
            return;
        }

        // Display preview
        const reader = new FileReader();
        reader.onload = function (e) {
            filePreview.innerHTML = `
                <div style="position: relative; display: inline-block;">
                    <img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 400px; border-radius: var(--radius-lg); box-shadow: var(--shadow-xl);">
                    <button type="button" class="btn btn-secondary btn-sm" onclick="clearFileUpload()" style="margin-top: var(--spacing-md);">
                        Change Image
                    </button>
                </div>
                <p style="color: var(--color-white); margin-top: var(--spacing-md); font-weight: 600;">
                    ✓ ${file.name} (${formatFileSize(file.size)})
                </p>
            `;

            // Hide upload area
            fileUpload.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }

    // Clear file upload
    window.clearFileUpload = function () {
        imageInput.value = '';
        filePreview.innerHTML = '';
        fileUpload.style.display = 'flex';
    };

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    // Show error message
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(239, 68, 68, 0.9);
            color: white;
            padding: var(--spacing-md) var(--spacing-lg);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-xl);
            z-index: 3000;
            animation: fadeIn 0.3s ease-out;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => errorDiv.remove(), 300);
        }, 3000);
    }

    // === FORM VALIDATION AND SUBMISSION ===
    const orderForm = document.getElementById('orderForm');
    const submitBtn = document.getElementById('submitBtn');
    const successModal = document.getElementById('successModal');

    orderForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '⏳ Processing...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Get form data
            const formData = new FormData(orderForm);
            const orderData = {
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                city: formData.get('city'),
                state: formData.get('state'),
                zipCode: formData.get('zipCode'),
                country: formData.get('country'),
                frameSize: formData.get('frameSize'),
                additionalRequests: formData.get('additionalRequests'),
                image: imageInput.files[0] ? imageInput.files[0].name : null
            };

            // Log order data (in production, send to backend)
            console.log('Order submitted:', orderData);

            // Show success modal
            successModal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Reset form
            orderForm.reset();
            clearFileUpload();

            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });

    // Form validation
    function validateForm() {
        // Check if image is uploaded
        if (!imageInput.files || imageInput.files.length === 0) {
            showError('Please upload an image');
            imageInput.focus();
            return false;
        }

        // Validate email
        const email = document.getElementById('email').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Please enter a valid email address');
            document.getElementById('email').focus();
            return false;
        }

        // Validate phone (basic validation)
        const phone = document.getElementById('phone').value;
        if (phone.length < 10) {
            showError('Please enter a valid phone number');
            document.getElementById('phone').focus();
            return false;
        }

        // Validate frame size selection
        const frameSize = document.getElementById('frameSize').value;
        if (!frameSize) {
            showError('Please select a frame size');
            document.getElementById('frameSize').focus();
            return false;
        }

        return true;
    }

    // === REAL-TIME INPUT VALIDATION ===
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function () {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value && !emailRegex.test(this.value)) {
            this.style.borderColor = 'var(--color-secondary)';
        } else {
            this.style.borderColor = 'var(--glass-border)';
        }
    });

    // === AUTO-FORMAT PHONE NUMBER ===
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) {
                value = `(${value}`;
            } else if (value.length <= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
        }
        e.target.value = value;
    });

    // Close success modal
    successModal.addEventListener('click', function (e) {
        if (e.target === successModal) {
            successModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

});
