// Form functionality for AIAnchor Demo Intake

// Initialize the form
document.addEventListener('DOMContentLoaded', function() {
    initializeIndustrySelector();
    checkURLParams();
    
    // Debug: Check if form exists
    const form = document.getElementById('intakeForm');
    console.log('Form found:', !!form);
});

function initializeIndustrySelector() {
    const grid = document.getElementById('industryGrid');
    grid.innerHTML = INDUSTRIES.map(industry => `
        <div class="industry-chip" data-industry="${industry.id}" onclick="selectIndustry('${industry.id}')">
            <i class="${industry.icon}"></i>
            <h3>${industry.name}</h3>
            <p>${industry.description}</p>
        </div>
    `).join('');
}

function selectIndustry(industryId) {
    currentIndustry = industryId;
    const industry = INDUSTRIES.find(i => i.id === industryId);
    const schema = FORM_SCHEMAS[industryId];
    
    // Update UI
    document.getElementById('industryName').textContent = industry.name;
    document.getElementById('formTitle').textContent = schema.title;
    
    // Load saved data if exists
    loadFormData(industryId);
    
    // Set default values for required fields if not already set
    schema.sections.forEach(section => {
        section.fields.forEach(field => {
            if (field.required && field.default && !formData[field.name]) {
                formData[field.name] = field.default;
            }
        });
    });
    
    // Render form
    renderForm(schema);
    
    // Show form, hide selector, welcome section, and pick industry section
    document.getElementById('industrySelector').style.display = 'none';
    document.getElementById('welcomeSection').style.display = 'none';
    document.getElementById('pickIndustrySection').style.display = 'none';
    document.getElementById('formSection').classList.add('active');
    
    // Re-attach form event listener after form is rendered
    // Use setTimeout to ensure form is fully rendered
    setTimeout(() => {
        const form = document.getElementById('intakeForm');
        if (form) {
            console.log('Re-attaching form event listener after render');
            // Remove existing listener first
            form.removeEventListener('submit', handleFormSubmit);
            form.addEventListener('submit', handleFormSubmit);
            
            // Also re-attach button click listener
            const submitBtn = form.querySelector('button[type="submit"]');
            console.log('Looking for submit button in form:', form);
            console.log('Submit button found after render:', !!submitBtn);
            console.log('All buttons in form:', form.querySelectorAll('button'));
            
            if (submitBtn) {
                console.log('Re-attaching submit button click listener');
                submitBtn.removeEventListener('click', handleFormSubmit);
                submitBtn.addEventListener('click', function(e) {
                    console.log('Submit button clicked - triggering form submission');
                    e.preventDefault();
                    handleFormSubmit(e);
                });
            } else {
                console.error('Submit button not found after form render!');
                // Try alternative selectors
                const altBtn = form.querySelector('.btn-primary');
                console.log('Alternative button found:', !!altBtn);
                if (altBtn) {
                    console.log('Using alternative button selector');
                    altBtn.addEventListener('click', function(e) {
                        console.log('Alternative button clicked - triggering form submission');
                        e.preventDefault();
                        handleFormSubmit(e);
                    });
                }
            }
        }
    }, 100); // Small delay to ensure form is rendered
    
    // Update progress and set initial button state
    updateProgress();
    
    // Ensure submit button starts disabled
    setTimeout(() => {
        const submitBtn = document.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.5';
            submitBtn.style.cursor = 'not-allowed';
            submitBtn.innerHTML = '<i class="fas fa-lock"></i> Complete Form to Submit (0%)';
        }
    }, 150);
}

function showIndustrySelector() {
    // Hide form first
    document.getElementById('formSection').classList.remove('active');
    
    // Show industry selector with fade-in effect
    document.getElementById('industrySelector').style.display = 'flex';
    document.getElementById('welcomeSection').style.display = 'block';
    document.getElementById('pickIndustrySection').style.display = 'block';
    
    // Add fade-in animation
    const industrySelector = document.getElementById('industrySelector');
    const welcomeSection = document.getElementById('welcomeSection');
    const pickIndustrySection = document.getElementById('pickIndustrySection');
    
    // Reset opacity and animate
    industrySelector.style.opacity = '0';
    welcomeSection.style.opacity = '0';
    pickIndustrySection.style.opacity = '0';
    
    // Fade in with slight delay for smooth effect
    setTimeout(() => {
        industrySelector.style.transition = 'opacity 0.5s ease-in-out';
        welcomeSection.style.transition = 'opacity 0.5s ease-in-out';
        pickIndustrySection.style.transition = 'opacity 0.5s ease-in-out';
        
        industrySelector.style.opacity = '1';
        welcomeSection.style.opacity = '1';
        pickIndustrySection.style.opacity = '1';
    }, 50);
}

function renderForm(schema) {
    const container = document.getElementById('formSections');
    container.innerHTML = schema.sections.map((section, index) => `
        <div class="form-section-content" data-section="${index}">
            <h3 onclick="toggleSection(${index})">
                <i class="fas fa-chevron-down"></i>
                ${section.title}
            </h3>
            <div class="section-fields">
                ${section.fields.map(field => renderField(field)).join('')}
            </div>
        </div>
    `).join('');
}

function renderField(field) {
    const value = formData[field.name] || field.default || '';
    const required = field.required ? '<span class="required">*</span>' : '';
    
    switch (field.type) {
        case 'textarea':
            return `
                <div class="field-group">
                    <label>${field.label} ${required}</label>
                    <textarea name="${field.name}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>${value}</textarea>
                    ${field.helper ? `<div class="field-helper">${field.helper}</div>` : ''}
                </div>
            `;
        
        case 'select':
            return `
                <div class="field-group">
                    <label>${field.label} ${required}</label>
                    <select name="${field.name}" ${field.required ? 'required' : ''}>
                        <option value="">Select...</option>
                        ${field.options.map(opt => `<option value="${opt}" ${value === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                    </select>
                    ${field.helper ? `<div class="field-helper">${field.helper}</div>` : ''}
                </div>
            `;
        
        case 'multiselect':
            const selectedValues = Array.isArray(value) ? value : (value ? value.split(',') : []);
            return `
                <div class="field-group">
                    <label>${field.label} ${required}</label>
                    <div class="chip-group">
                        ${field.options.map(opt => `
                            <div class="chip ${selectedValues.includes(opt) ? 'selected' : ''}" 
                                 data-value="${opt}" onclick="toggleChip(this, '${field.name}')">
                                ${opt}
                            </div>
                        `).join('')}
                    </div>
                    <input type="hidden" name="${field.name}" value="${selectedValues.join(',')}">
                    ${field.helper ? `<div class="field-helper">${field.helper}</div>` : ''}
                </div>
            `;
        
        default:
            return `
                <div class="field-group">
                    <label>${field.label} ${required}</label>
                    <input type="${field.type}" name="${field.name}" value="${value}" 
                           placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>
                    ${field.helper ? `<div class="field-helper">${field.helper}</div>` : ''}
                </div>
            `;
    }
}

function toggleSection(index) {
    const section = document.querySelector(`[data-section="${index}"]`);
    section.classList.toggle('collapsed');
}

function toggleChip(chip, fieldName) {
    chip.classList.toggle('selected');
    const selected = Array.from(chip.parentElement.querySelectorAll('.chip.selected'))
        .map(c => c.dataset.value);
    chip.parentElement.nextElementSibling.value = selected.join(',');
    formData[fieldName] = selected.join(',');
    updateProgress();
}

function updateProgress() {
    const schema = FORM_SCHEMAS[currentIndustry];
    if (!schema) {
        console.log('No schema found for industry:', currentIndustry);
        return;
    }
    
    let totalFields = 0;
    let completedFields = 0;
    
    console.log('Updating progress for industry:', currentIndustry);
    console.log('Current formData:', formData);
    
    schema.sections.forEach(section => {
        section.fields.forEach(field => {
            if (field.required) {
                totalFields++;
                const value = formData[field.name] || field.default || '';
                console.log(`Field ${field.name}: value="${value}", default="${field.default}", completed=${value && value.trim() !== ''}`);
                if (value && value.trim() !== '') {
                    completedFields++;
                }
            }
        });
    });
    
    const progress = totalFields > 0 ? (completedFields / totalFields) * 100 : 0;
    console.log(`Progress: ${completedFields}/${totalFields} = ${Math.round(progress)}%`);
    
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = `${Math.round(progress)}% Complete`;
    
    // Enable/disable submit button based on completion
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) {
        const isComplete = progress >= 100;
        submitBtn.disabled = !isComplete;
        
        if (isComplete) {
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Demo Request';
        } else {
            submitBtn.style.opacity = '0.5';
            submitBtn.style.cursor = 'not-allowed';
            submitBtn.innerHTML = `<i class="fas fa-lock"></i> Complete Form to Submit (${Math.round(progress)}%)`;
        }
    }
}

function saveProgress() {
    if (!currentIndustry) return;
    
    const form = document.getElementById('intakeForm');
    const formDataObj = new FormData(form);
    
    // Update global formData
    for (let [key, value] of formDataObj.entries()) {
        formData[key] = value;
    }
    
    // Save to localStorage
    localStorage.setItem(`aia_intake_state_${currentIndustry}`, JSON.stringify(formData));
    
    // Show feedback
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Saved!';
    btn.style.background = '#10b981';
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
    }, 2000);
}

function loadFormData(industryId) {
    const saved = localStorage.getItem(`aia_intake_state_${industryId}`);
    if (saved) {
        formData = JSON.parse(saved);
    } else {
        formData = {};
    }
}

function checkURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    if (type && FORM_SCHEMAS[type]) {
        selectIndustry(type);
    }
}

// Form submission is handled in selectIndustry function after form is rendered

async function handleFormSubmit(e) {
    console.log('handleFormSubmit called!');
    e.preventDefault();
    
    console.log('Form submission started');
    
    // Get the form element - e.target might be the button, so find the form
    const form = e.target.closest('form') || document.getElementById('intakeForm');
    console.log('Form element:', form);
    console.log('Is form element:', form instanceof HTMLFormElement);
    
    // Check if form is 100% complete before proceeding
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn.disabled) {
        console.log('Form submission blocked - form not 100% complete');
        return;
    }
    
    // First, update formData with current form values
    const formDataObj = new FormData(form);
    for (let [key, value] of formDataObj.entries()) {
        formData[key] = value;
    }
    
    // Create a new FormData object for submission
    const submitData = new FormData();
    
    // Add all form fields
    for (let [key, value] of formDataObj.entries()) {
        if (value && value.trim() !== '') {
            submitData.append(key, value);
        }
    }
    
    // Add hidden fields
    submitData.append('form_name', 'demo_intake');
    submitData.append('source', getUTMSource());
    submitData.append('campaign', getUTMCampaign());
    submitData.append('_gotcha', ''); // Honeypot
    submitData.append('industry', currentIndustry);
    
    // Debug: Log form data
    console.log('Form data being submitted:');
    for (let [key, value] of submitData.entries()) {
        console.log(key, value);
    }
    
    // Show loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    try {
        console.log('Sending request to Formspree...');
        const response = await fetch('https://formspree.io/f/xgvlrqkj', {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: submitData
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (response.ok) {
            // Clear saved data
            localStorage.removeItem(`aia_intake_state_${currentIndustry}`);
            
            // Show custom alert modal
            showCustomAlert();
            
            // Reset form
            form.reset();
            formData = {};
            updateProgress();
            
            // Show success state on the form instead of going back to selector
            document.getElementById('formTitle').textContent = 'Demo Request Submitted Successfully!';
            document.getElementById('progressText').textContent = '100% Complete - Thank you!';
            document.getElementById('progressFill').style.width = '100%';
        } else {
            const errorText = await response.text();
            console.error('Form submission failed:', response.status, errorText);
            throw new Error(`Form submission failed: ${response.status}`);
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showAlert('❌ Sorry, there was an error submitting your request. Please try again or contact us directly.', 'error');
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
}

function getUTMSource() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('utm_source') || document.referrer || 'direct';
}

function getUTMCampaign() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('utm_campaign') || 'demo_intake';
}

// ===== ALERT SYSTEM =====
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;

    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.setAttribute('role', type === 'success' ? 'status' : 'alert');
    alert.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add to container
    alertContainer.appendChild(alert);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.style.opacity = '0';
            alert.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.parentNode.removeChild(alert);
                }
            }, 300);
        }
    }, 5000);

    // Click to dismiss
    alert.addEventListener('click', function() {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    });
}

// Update form data on input change
document.addEventListener('input', function(e) {
    if (e.target.form && e.target.form.id === 'intakeForm') {
        formData[e.target.name] = e.target.value;
        updateProgress();
    }
});

document.addEventListener('change', function(e) {
    if (e.target.form && e.target.form.id === 'intakeForm') {
        formData[e.target.name] = e.target.value;
        updateProgress();
    }
});

// Custom Alert Functions
function showCustomAlert() {
    const alert = document.getElementById('customAlert');
    if (alert) {
        // Show alert immediately with smooth animation
        alert.classList.add('show');
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        
        // Smoothly scroll to top after alert is shown
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
    }
}

function closeCustomAlert() {
    const alert = document.getElementById('customAlert');
    if (alert) {
        alert.classList.remove('show');
        // Restore body scroll
        document.body.style.overflow = 'auto';
        // Refresh the page
        window.location.reload();
    }
}
