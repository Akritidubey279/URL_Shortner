document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('shorten-form');
    const urlInput = document.getElementById('original-url');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');
    
    const errorMsg = document.getElementById('error-message');
    const resultArea = document.getElementById('result-area');
    const shortLinkEl = document.getElementById('short-link');
    const copyBtn = document.getElementById('copy-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const originalUrl = urlInput.value.trim();
        if (!originalUrl) return;

        // Reset UI state
        errorMsg.classList.add('hidden');
        resultArea.classList.add('hidden');
        errorMsg.textContent = '';
        
        // Show loading state
        btnText.classList.add('hidden');
        spinner.classList.remove('hidden');
        submitBtn.disabled = true;

        try {
            // Note: Use full URL in production or dynamic absolute path. 
            // We use /api/shorten as it's hosted on the same server.
            const response = await fetch('/api/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ original_url: originalUrl })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to shorten URL');
            }

            // Construct full short URL
            const fullShortUrl = `${window.location.origin}/${data.short_code}`;
            
            // Update UI with result
            shortLinkEl.href = fullShortUrl;
            shortLinkEl.textContent = fullShortUrl;
            
            // Show result area
            resultArea.classList.remove('hidden');
            
            // Focus on input for next entry if needed
            urlInput.value = '';
            urlInput.blur();

        } catch (error) {
            console.error('Error:', error);
            errorMsg.textContent = error.message;
            errorMsg.classList.remove('hidden');
        } finally {
            // Restore button state
            btnText.classList.remove('hidden');
            spinner.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });

    copyBtn.addEventListener('click', async () => {
        const textToCopy = shortLinkEl.textContent;
        if (!textToCopy) return;

        try {
            await navigator.clipboard.writeText(textToCopy);
            
            // Show feedback
            copyBtn.classList.add('copied');
            
            // Reset after 2 seconds
            setTimeout(() => {
                copyBtn.classList.remove('copied');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            // Fallback for older browsers could go here
            alert('Failed to copy. Please select and copy manually.');
        }
    });
});
