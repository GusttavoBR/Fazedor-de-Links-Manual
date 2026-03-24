document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const titleInput = document.getElementById('title');
    const priceInput = document.getElementById('price');
    const couponInput = document.getElementById('coupon');
    const affiliateLinkInput = document.getElementById('affiliate-link');
    const resultTextArea = document.getElementById('result');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const copyFeedback = document.getElementById('copy-feedback');
    const imageUpload = document.getElementById('image-upload');
    const uploadWrapper = document.getElementById('upload-wrapper');
    const uploadContent = document.getElementById('upload-content');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const shareBtn = document.getElementById('share-btn');
    
    let selectedImageFile = null;

    // Handle Image Upload
    if(imageUpload) {
        imageUpload.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                selectedImageFile = e.target.files[0];
                const reader = new FileReader();
                
                reader.onload = function(evt) {
                    if (uploadContent) {
                        uploadContent.innerHTML = `<span class="icon">✅</span><span class="text" style="color:var(--success)">Imagem Selecionada</span>`;
                    }
                    if (uploadWrapper) {
                        uploadWrapper.style.borderColor = 'var(--success)';
                    }
                    if (imagePreview) imagePreview.src = evt.target.result;
                    if (imagePreviewContainer) imagePreviewContainer.style.display = 'flex';
                }
                reader.readAsDataURL(selectedImageFile);
            }
        });
    }

    // Generate output
    const generatePost = () => {
        const title = titleInput.value.trim();
        const price = priceInput.value.trim();
        const coupon = couponInput.value.trim();
        const affiliateLink = affiliateLinkInput.value.trim();
        if (!title || !price || !affiliateLink) {
            // Optional: Provide visual feedback for missing required fields
            const btnOriginalText = generateBtn.innerHTML;
            generateBtn.innerHTML = `<span>Preencha os campos obrigatórios</span>`;
            generateBtn.style.background = '#f59e0b';
            setTimeout(() => {
                generateBtn.innerHTML = btnOriginalText;
                generateBtn.style.background = ''; // reset to default gradient
            }, 2000);
            return;
        }

        // Format price (replace dot with comma if needed, or just keep user input)
        // Ensure standard Brazilian real format just in case it's a raw number
        let formattedPrice = price;
        if (!formattedPrice.includes(',') && formattedPrice.includes('.')) {
            // Basic formatting if someone types 13.68
            const parts = price.split('.');
            if(parts[1] && parts[1].length === 2) {
                formattedPrice = parts.join(',');
            }
        }

        let output = `🚨 𝗢𝗙𝗘𝗥𝗧𝗔 𝗜𝗠𝗣𝗘𝗥𝗗𝗜́𝗩𝗘𝗟 🚨\n\n`;
        output += `📦 ${title}\n\n`;
        output += `🔥 𝗣𝗼𝗿 𝗮𝗽𝗲𝗻𝗮𝘀: 𝗥$ ${formattedPrice}\n\n`;

        if (coupon) {
            output += `🎟️ 𝗨𝘀𝗲 𝗼 𝗰𝘂𝗽𝗼𝗺:\n👉 ${coupon}\n\n`;
        }

        output += `🛒 𝗖𝗼𝗺𝗽𝗿𝗲 𝗮𝗾𝘂𝗶: ${affiliateLink}\n\n`;
        output += `🎯 𝗠𝗮𝗶𝘀 𝗼𝗳𝗲𝗿𝘁𝗮𝘀 𝗻𝗼 𝗻𝗼𝘀𝘀𝗼 𝗴𝗿𝘂𝗽𝗼:\n👉 https://t.me/qgofertas`;

        resultTextArea.value = output;
        
        // Enable copy button and trigger soft animation
        copyBtn.disabled = false;

        // Show share button if Web Share API is available
        if (navigator.share && shareBtn) {
            shareBtn.style.display = 'flex';
        }

        resultTextArea.style.borderColor = 'var(--primary)';
        resultTextArea.style.boxShadow = '0 0 15px rgba(245, 61, 45, 0.2)';
        
        setTimeout(() => {
            resultTextArea.style.borderColor = 'var(--panel-border)';
            resultTextArea.style.boxShadow = 'none';
        }, 800);
    };

    // Copy to clipboard function
    const copyToClipboard = async () => {
        const textToCopy = resultTextArea.value;
        if (!textToCopy) return;

        try {
            await navigator.clipboard.writeText(textToCopy);
            
            // Show feedback
            copyFeedback.classList.add('show');
            
            // Change button icon temporarily
            const originalIcon = copyBtn.innerHTML;
            copyBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            
            setTimeout(() => {
                copyFeedback.classList.remove('show');
                copyBtn.innerHTML = originalIcon;
            }, 2000);
        } catch (err) {
            console.error('Falha ao copiar ao clipboard: ', err);
            alert('Não foi possível copiar o texto. Por favor, selecione e copie manualmente.');
        }
    };

    // Share to App function
    const shareToApp = async () => {
        const textToShare = resultTextArea.value;
        if (!textToShare) return;

        const shareData = {
            title: titleInput.value.trim(),
            text: textToShare,
        };

        if (selectedImageFile) {
            // Re-create the file to ensure the type is correctly set for Web Share API
            const newFile = new File([selectedImageFile], selectedImageFile.name, { type: selectedImageFile.type });
            if (navigator.canShare && navigator.canShare({ files: [newFile] })) {
                shareData.files = [newFile];
            }
        }

        try {
            await navigator.share(shareData);
            // Show feedback
            copyFeedback.innerText = "Pronto para enviar!";
            copyFeedback.classList.add('show');
            setTimeout(() => {
                copyFeedback.classList.remove('show');
                copyFeedback.innerText = "Copiado para a área de transferência!";
            }, 2000);
        } catch (err) {
            console.log("Compartilhamento cancelado ou não suportado: ", err);
        }
    };

    // Events
    generateBtn.addEventListener('click', generatePost);
    if(shareBtn) shareBtn.addEventListener('click', shareToApp);
    copyBtn.addEventListener('click', copyToClipboard);

    // Enter key generates if focused on inputs
    const inputs = [titleInput, priceInput, couponInput, affiliateLinkInput];
    inputs.forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                generatePost();
            }
        });
    });
});
