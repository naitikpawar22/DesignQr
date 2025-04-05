document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const urlInput = document.getElementById('url-input');
    const qrSize = document.getElementById('qr-size');
    const qrColor = document.getElementById('qr-color');
    const bgColor = document.getElementById('bg-color');
    const generateBtn = document.getElementById('generate-btn');
    const downloadBtn = document.getElementById('download-btn');
    const qrCanvas = document.getElementById('qr-canvas');
    const placeholder = document.querySelector('.placeholder');
    const designOptions = document.querySelectorAll('.design-option');
    
    let currentDesign = 'default';
    let qrCode = null;
    
    // Initialize with first design selected
    designOptions[0].classList.add('active');
    
    // Event Listeners
    generateBtn.addEventListener('click', generateQRCode);
    downloadBtn.addEventListener('click', downloadQRCode);
    
    designOptions.forEach(option => {
        option.addEventListener('click', function() {
            designOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            currentDesign = this.dataset.style;
            if (qrCode) generateQRCode();
        });
    });
    
    function generateQRCode() {
        const url = urlInput.value.trim();
        const size = parseInt(qrSize.value);
        const color = qrColor.value.substring(1); // Remove #
        const bgColorValue = bgColor.value.substring(1); // Remove #
        
        if (!url) {
            alert('Please enter a valid URL');
            return;
        }
        
        try {
            // Generate QR code
            const typeNumber = 0; // Auto detect type
            const errorCorrectionLevel = 'H'; // High error correction
            const qr = qrcode(typeNumber, errorCorrectionLevel);
            qr.addData(url);
            qr.make();
            
            // Create canvas
            const ctx = qrCanvas.getContext('2d');
            qrCanvas.width = size;
            qrCanvas.height = size;
            
            // Calculate module size
            const moduleCount = qr.getModuleCount();
            const moduleSize = size / moduleCount;
            
            // Draw QR code
            for (let row = 0; row < moduleCount; row++) {
                for (let col = 0; col < moduleCount; col++) {
                    const isDark = qr.isDark(row, col);
                    ctx.fillStyle = isDark ? `#${color}` : `#${bgColorValue}`;
                    
                    // Apply different styles
                    switch(currentDesign) {
                        case 'dots':
                            if (isDark) {
                                ctx.beginPath();
                                ctx.arc(/* Naitik Pawar Wevloper Copy right*/
                                    col * moduleSize + moduleSize/2,
                                    row * moduleSize + moduleSize/2,
                                    moduleSize/2 * 0.8,
                                    0,
                                    Math.PI * 2
                                );
                                ctx.fill();
                            } else {
                                ctx.fillRect(
                                    col * moduleSize,
                                    row * moduleSize,
                                    moduleSize,
                                    moduleSize/* Naitik Pawar Wevloper Copy right*/
                                );
                            }
                            break;
                            
                        case 'rounded':
                            if (isDark) {
                                ctx.beginPath();
                                ctx.roundRect(
                                    col * moduleSize + moduleSize * 0.1,
                                    row * moduleSize + moduleSize * 0.1,/* Naitik Pawar Wevloper Copy right*/
                                    moduleSize * 0.8,
                                    moduleSize * 0.8,
                                    [moduleSize * 0.2]
                                );
                                ctx.fill();
                            } else {
                                ctx.fillRect(
                                    col * moduleSize,
                                    row * moduleSize,
                                    moduleSize,
                                    moduleSize
                                );
                            }
                            break;/* Naitik Pawar Wevloper Copy right*/
                            
                        case 'gradient':
                            const gradient = ctx.createLinearGradient(0, 0, size, size);
                            gradient.addColorStop(0, `#${color}`);
                            gradient.addColorStop(1, getComplementaryColor(`#${color}`));
                            ctx.fillStyle = isDark ? gradient : `#${bgColorValue}`;
                            ctx.fillRect(
                                col * moduleSize,
                                row * moduleSize,
                                moduleSize,
                                moduleSize
                            );
                            break;/* Naitik Pawar Wevloper Copy right*/
                            
                        default: // Default style
                            ctx.fillRect(
                                col * moduleSize,
                                row * moduleSize,
                                moduleSize,
                                moduleSize
                            );
                    }
                }
            }
            
            // Show QR code
            qrCanvas.style.display = 'block';
            placeholder.style.display = 'none';
            downloadBtn.disabled = false;
            /* Naitik Pawar Wevloper Copy right*/
        } catch (error) {
            console.error("QR generation error:", error);
            alert('Error generating QR code. Please try again.');
            placeholder.style.display = 'block';
            qrCanvas.style.display = 'none';
        }
    }
    
    function getComplementaryColor(hex) {
        // Convert hex to RGB
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);/* Naitik Pawar Wevloper Copy right*/
        
        // Calculate complementary color
        return `#${(0x1000000 + (255 - r) * 0x10000 + (255 - g) * 0x100 + (255 - b))
            .toString(16).slice(1)}`;
    }
    
    function downloadQRCode() {
        if (qrCanvas.style.display === 'none') {
            alert('Please generate a QR code first');
            return;
        }
        
        const link = document.createElement('a');
        link.download = `qr-code-${Date.now()}.png`;
        link.href = qrCanvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();   ///* Naitik Pawar Wevloper Copy right*/
        document.body.removeChild(link);
    }
    
    // Validate URL input
    urlInput.addEventListener('input', function() {
        const url = this.value.trim();
        if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
            this.value = 'https://' + url;
        }
    });
});