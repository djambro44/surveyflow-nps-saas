/**
 * SurveyFlow NPS Widget
 * Embeddable NPS survey component for websites and mobile apps
 * Version: 1.0.0
 */

(function(window, document) {
    'use strict';
    
    // Prevent multiple initialization
    if (window.NPSWidget) {
        console.warn('NPS Widget already initialized');
        return;
    }
    
    // Default configuration
    const DEFAULT_CONFIG = {
        containerId: 'nps-survey',
        apiEndpoint: 'https://api.surveyflow.com/v1/responses',
        apiKey: null,
        colors: {
            primary: '#667eea',
            secondary: '#764ba2',
            text: '#333333',
            textLight: '#666666',
            background: '#ffffff',
            border: '#e1e5e9',
            success: '#38ef7d',
            error: '#e74c3c'
        },
        text: {
            question: 'How likely are you to recommend us to a friend or colleague?',
            followUpPrompt: 'What\'s the main reason for your score?',
            thankYou: 'Thank you for your feedback!',
            submitButton: 'Submit Feedback',
            notLikely: 'Not at all likely',
            veryLikely: 'Extremely likely',
            placeholder: 'Please tell us more about your experience...'
        },
        animation: true,
        showLabels: true,
        required: false,
        autoClose: true,
        closeDelay: 3000,
        position: 'bottom-right' // for modal mode
    };
    
    // CSS styles for the widget
    const CSS_STYLES = `
        .nps-widget {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            max-width: 100%;
            margin: 0 auto;
            background: var(--nps-bg, #ffffff);
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            position: relative;
            color: var(--nps-text, #333333);
            line-height: 1.6;
        }
        
        .nps-widget * {
            box-sizing: border-box;
        }
        
        .nps-widget-container {
            padding: 30px;
        }
        
        .nps-question {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 25px;
            text-align: center;
            color: var(--nps-text, #333333);
        }
        
        .nps-scale-container {
            margin-bottom: 30px;
        }
        
        .nps-scale {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }
        
        .nps-scale-number {
            width: 40px;
            height: 40px;
            border: 2px solid var(--nps-border, #e1e5e9);
            background: var(--nps-bg, #ffffff);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            user-select: none;
            font-size: 16px;
            color: var(--nps-text, #333333);
        }
        
        .nps-scale-number:hover {
            border-color: var(--nps-primary, #667eea);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }
        
        .nps-scale-number.selected {
            background: var(--nps-primary, #667eea);
            border-color: var(--nps-primary, #667eea);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .nps-scale-labels {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: var(--nps-text-light, #666666);
            margin-top: 10px;
        }
        
        .nps-scale-label {
            flex: 1;
            text-align: center;
        }
        
        .nps-scale-label:first-child {
            text-align: left;
        }
        
        .nps-scale-label:last-child {
            text-align: right;
        }
        
        .nps-followup {
            opacity: 0;
            max-height: 0;
            overflow: hidden;
            transition: all 0.4s ease;
            margin-top: 0;
        }
        
        .nps-followup.show {
            opacity: 1;
            max-height: 300px;
            margin-top: 20px;
        }
        
        .nps-followup-label {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 15px;
            color: var(--nps-text, #333333);
        }
        
        .nps-textarea {
            width: 100%;
            min-height: 100px;
            padding: 15px;
            border: 2px solid var(--nps-border, #e1e5e9);
            border-radius: 8px;
            font-size: 14px;
            font-family: inherit;
            resize: vertical;
            transition: border-color 0.3s ease;
            color: var(--nps-text, #333333);
            background: var(--nps-bg, #ffffff);
        }
        
        .nps-textarea:focus {
            outline: none;
            border-color: var(--nps-primary, #667eea);
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .nps-textarea::placeholder {
            color: var(--nps-text-light, #666666);
        }
        
        .nps-submit-container {
            margin-top: 25px;
            text-align: center;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
        }
        
        .nps-submit-container.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .nps-submit-btn {
            background: linear-gradient(135deg, var(--nps-primary, #667eea), var(--nps-secondary, #764ba2));
            color: white;
            border: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
        }
        
        .nps-submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
        }
        
        .nps-submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .nps-thank-you {
            text-align: center;
            padding: 40px 20px;
            display: none;
        }
        
        .nps-thank-you.show {
            display: block;
            animation: fadeInScale 0.5s ease;
        }
        
        .nps-thank-you-icon {
            width: 60px;
            height: 60px;
            background: var(--nps-success, #38ef7d);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 24px;
            color: white;
        }
        
        .nps-thank-you-message {
            font-size: 18px;
            font-weight: 600;
            color: var(--nps-text, #333333);
            margin-bottom: 10px;
        }
        
        .nps-thank-you-submessage {
            color: var(--nps-text-light, #666666);
            font-size: 14px;
        }
        
        .nps-error {
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #b91c1c;
            padding: 10px 15px;
            border-radius: 6px;
            font-size: 14px;
            margin-top: 10px;
            display: none;
        }
        
        .nps-error.show {
            display: block;
        }
        
        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .nps-loading {
            animation: pulse 1.5s infinite;
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
            .nps-widget-container {
                padding: 20px;
            }
            
            .nps-question {
                font-size: 16px;
                margin-bottom: 20px;
            }
            
            .nps-scale {
                gap: 6px;
            }
            
            .nps-scale-number {
                width: 35px;
                height: 35px;
                font-size: 14px;
            }
            
            .nps-scale-labels {
                font-size: 11px;
                margin-top: 8px;
            }
            
            .nps-textarea {
                min-height: 80px;
                padding: 12px;
                font-size: 14px;
            }
            
            .nps-submit-btn {
                padding: 12px 24px;
                font-size: 14px;
                width: 100%;
            }
        }
        
        /* Very small screens */
        @media (max-width: 480px) {
            .nps-scale {
                gap: 4px;
            }
            
            .nps-scale-number {
                width: 30px;
                height: 30px;
                font-size: 13px;
            }
        }
    `;
    
    // Widget class
    class NPSWidget {
        constructor(config = {}) {
            this.config = { ...DEFAULT_CONFIG, ...config };
            this.selectedScore = null;
            this.feedback = '';
            this.container = null;
            this.isSubmitted = false;
            
            this.init();
        }
        
        init() {
            this.injectStyles();
            this.createWidget();
            this.bindEvents();
            
            // Apply custom colors
            this.applyCustomColors();
        }
        
        injectStyles() {
            if (document.getElementById('nps-widget-styles')) {
                return; // Styles already injected
            }
            
            const style = document.createElement('style');
            style.id = 'nps-widget-styles';
            style.textContent = CSS_STYLES;
            document.head.appendChild(style);
        }
        
        applyCustomColors() {
            const root = document.documentElement;
            const colors = this.config.colors;
            
            root.style.setProperty('--nps-primary', colors.primary);
            root.style.setProperty('--nps-secondary', colors.secondary);
            root.style.setProperty('--nps-text', colors.text);
            root.style.setProperty('--nps-text-light', colors.textLight);
            root.style.setProperty('--nps-bg', colors.background);
            root.style.setProperty('--nps-border', colors.border);
            root.style.setProperty('--nps-success', colors.success);
            root.style.setProperty('--nps-error', colors.error);
        }
        
        createWidget() {
            const container = document.getElementById(this.config.containerId);
            if (!container) {
                console.error(`NPS Widget: Container with ID '${this.config.containerId}' not found`);
                return;
            }
            
            this.container = container;
            
            const widget = document.createElement('div');
            widget.className = 'nps-widget';
            widget.innerHTML = this.generateHTML();
            
            container.appendChild(widget);
        }
        
        generateHTML() {
            const { text, showLabels } = this.config;
            
            return `
                <div class="nps-widget-container">
                    <div class="nps-survey-content">
                        <div class="nps-question">${text.question}</div>
                        
                        <div class="nps-scale-container">
                            <div class="nps-scale">
                                ${Array.from({ length: 10 }, (_, i) => 
                                    `<div class="nps-scale-number" data-value="${i + 1}">${i + 1}</div>`
                                ).join('')}
                            </div>
                            
                            ${showLabels ? `
                                <div class="nps-scale-labels">
                                    <div class="nps-scale-label">${text.notLikely}</div>
                                    <div class="nps-scale-label"></div>
                                    <div class="nps-scale-label">${text.veryLikely}</div>
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="nps-followup">
                            <div class="nps-followup-label">${text.followUpPrompt}</div>
                            <textarea 
                                class="nps-textarea" 
                                placeholder="${text.placeholder}"
                                maxlength="1000"
                            ></textarea>
                            
                            <div class="nps-submit-container">
                                <button class="nps-submit-btn" type="button">
                                    ${text.submitButton}
                                </button>
                            </div>
                            
                            <div class="nps-error"></div>
                        </div>
                    </div>
                    
                    <div class="nps-thank-you">
                        <div class="nps-thank-you-icon">✓</div>
                        <div class="nps-thank-you-message">${text.thankYou}</div>
                        <div class="nps-thank-you-submessage">Your feedback helps us improve.</div>
                    </div>
                </div>
            `;
        }
        
        bindEvents() {
            const widget = this.container.querySelector('.nps-widget');
            
            // Score selection
            const scaleNumbers = widget.querySelectorAll('.nps-scale-number');
            scaleNumbers.forEach(number => {
                number.addEventListener('click', (e) => {
                    this.selectScore(parseInt(e.target.dataset.value));
                });
            });
            
            // Textarea input
            const textarea = widget.querySelector('.nps-textarea');
            textarea.addEventListener('input', (e) => {
                this.feedback = e.target.value;
            });
            
            // Submit button
            const submitBtn = widget.querySelector('.nps-submit-btn');
            submitBtn.addEventListener('click', () => {
                this.submitResponse();
            });
            
            // Enter key in textarea
            textarea.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    this.submitResponse();
                }
            });
        }
        
        selectScore(score) {
            if (this.isSubmitted) return;
            
            this.selectedScore = score;
            
            // Update UI
            const widget = this.container.querySelector('.nps-widget');
            const scaleNumbers = widget.querySelectorAll('.nps-scale-number');
            
            scaleNumbers.forEach(number => {
                number.classList.remove('selected');
            });
            
            const selectedNumber = widget.querySelector(`[data-value="${score}"]`);
            selectedNumber.classList.add('selected');
            
            // Show follow-up with animation
            if (this.config.animation) {
                setTimeout(() => {
                    this.showFollowUp();
                }, 300);
            } else {
                this.showFollowUp();
            }
        }
        
        showFollowUp() {
            const widget = this.container.querySelector('.nps-widget');
            const followUp = widget.querySelector('.nps-followup');
            const submitContainer = widget.querySelector('.nps-submit-container');
            
            followUp.classList.add('show');
            
            // Focus on textarea for better UX
            setTimeout(() => {
                const textarea = widget.querySelector('.nps-textarea');
                textarea.focus();
                
                // Show submit button
                submitContainer.classList.add('show');
            }, 200);
        }
        
        async submitResponse() {
            if (this.isSubmitted) return;
            
            const widget = this.container.querySelector('.nps-widget');
            const submitBtn = widget.querySelector('.nps-submit-btn');
            const errorDiv = widget.querySelector('.nps-error');
            
            // Validation
            if (this.selectedScore === null) {
                this.showError('Please select a score before submitting.');
                return;
            }
            
            if (this.config.required && !this.feedback.trim()) {
                this.showError('Please provide feedback before submitting.');
                return;
            }
            
            // Show loading state
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            submitBtn.classList.add('nps-loading');
            
            // Hide any previous errors
            errorDiv.classList.remove('show');
            
            try {
                const response = await this.sendResponse();
                
                if (response.success) {
                    this.showThankYou();
                } else {
                    throw new Error(response.message || 'Submission failed');
                }
            } catch (error) {
                console.error('NPS Widget submission error:', error);
                this.showError('Failed to submit. Please try again.');
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('nps-loading');
            }
        }
        
        async sendResponse() {
            const payload = {
                score: this.selectedScore,
                feedback: this.feedback.trim(),
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href,
                referrer: document.referrer
            };
            
            // If no API key provided, simulate success (for demo)
            if (!this.config.apiKey) {
                console.log('NPS Response (Demo Mode):', payload);
                return new Promise(resolve => {
                    setTimeout(() => resolve({ success: true }), 1000);
                });
            }
            
            // Real API call
            const response = await fetch(this.config.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey}`
                },
                body: JSON.stringify(payload)
            });
            
            return await response.json();
        }
        
        showError(message) {
            const widget = this.container.querySelector('.nps-widget');
            const errorDiv = widget.querySelector('.nps-error');
            
            errorDiv.textContent = message;
            errorDiv.classList.add('show');
            
            // Auto-hide error after 5 seconds
            setTimeout(() => {
                errorDiv.classList.remove('show');
            }, 5000);
        }
        
        showThankYou() {
            this.isSubmitted = true;
            const widget = this.container.querySelector('.nps-widget');
            const surveyContent = widget.querySelector('.nps-survey-content');
            const thankYou = widget.querySelector('.nps-thank-you');
            
            surveyContent.style.display = 'none';
            thankYou.classList.add('show');
            
            // Auto-close if configured
            if (this.config.autoClose) {
                setTimeout(() => {
                    if (this.config.onComplete) {
                        this.config.onComplete(this.selectedScore, this.feedback);
                    }
                }, this.config.closeDelay);
            }
        }
        
        // Public methods
        reset() {
            this.selectedScore = null;
            this.feedback = '';
            this.isSubmitted = false;
            
            const widget = this.container.querySelector('.nps-widget');
            widget.innerHTML = this.generateHTML();
            this.bindEvents();
        }
        
        destroy() {
            if (this.container) {
                this.container.innerHTML = '';
            }
        }
        
        getResponse() {
            return {
                score: this.selectedScore,
                feedback: this.feedback,
                isSubmitted: this.isSubmitted
            };
        }
    }
    
    // Global API
    window.NPSWidget = {
        init: function(config) {
            return new NPSWidget(config);
        },
        
        // Utility method for multiple widgets
        createMultiple: function(configs) {
            return configs.map(config => new NPSWidget(config));
        }
    };
    
    // Auto-initialize if data attributes are found
    document.addEventListener('DOMContentLoaded', function() {
        const autoElements = document.querySelectorAll('[data-nps-widget]');
        autoElements.forEach(element => {
            const config = {
                containerId: element.id || 'nps-survey-' + Math.random().toString(36).substr(2, 9)
            };
            
            // Parse data attributes
            if (element.dataset.apiKey) config.apiKey = element.dataset.apiKey;
            if (element.dataset.question) config.text = { ...DEFAULT_CONFIG.text, question: element.dataset.question };
            if (element.dataset.primaryColor) config.colors = { ...DEFAULT_CONFIG.colors, primary: element.dataset.primaryColor };
            
            if (!element.id) element.id = config.containerId;
            
            new NPSWidget(config);
        });
    });
    
})(window, document);
