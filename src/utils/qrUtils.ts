import jsQR from 'jsqr';

export interface DecodedQRResult {
  text: string;
  success: boolean;
  error?: string;
}

/**
 * Extract QR code data from an HTML Canvas or Image file
 */
export async function decodeQRCodeFromImage(fileOrBlob: Blob): Promise<DecodedQRResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ text: '', success: false, error: 'Could not create canvas 2D context.' });
          return;
        }

        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth'
          });

          if (code && code.data) {
            resolve({ text: code.data, success: true });
          } else {
            // Check for metadata or fallback heuristics if standard detector missed
            resolve({
              text: '',
              success: false,
              error: 'No QR code detected in the uploaded image. Please ensure the QR code is clear, well-lit, and uncropped.'
            });
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Error decoding image data';
          resolve({ text: '', success: false, error: message });
        }
      };

      img.onerror = () => {
        resolve({ text: '', success: false, error: 'Failed to load the image file.' });
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      resolve({ text: '', success: false, error: 'Failed to read the file.' });
    };

    reader.readAsDataURL(fileOrBlob);
  });
}

/**
 * Generate a visual QR-like preview on a canvas for demo presets
 */
export function drawDemoQrToCanvas(canvas: HTMLCanvasElement, payload: string, theme: 'danger' | 'warning' | 'safe' = 'danger') {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const size = canvas.width;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, size, size);

  // Background grid
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  const step = size / 21;
  for (let i = 0; i <= size; i += step) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();
  }

  // Draw 3 corner positioning anchors
  const drawFinder = (x: number, y: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, step * 7, step * 7);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + step, y + step, step * 5, step * 5);
    ctx.fillStyle = color;
    ctx.fillRect(x + step * 2, y + step * 2, step * 3, step * 3);
  };

  const accentColor = theme === 'danger' ? '#ef4444' : theme === 'warning' ? '#f59e0b' : '#10b981';

  drawFinder(step * 1, step * 1, accentColor);
  drawFinder(size - step * 8, step * 1, accentColor);
  drawFinder(step * 1, size - step * 8, accentColor);

  // Pseudo-random deterministic data pattern based on payload characters
  ctx.fillStyle = '#94a3b8';
  let seed = 0;
  for (let i = 0; i < payload.length; i++) seed += payload.charCodeAt(i);

  for (let row = 1; row < 20; row++) {
    for (let col = 1; col < 20; col++) {
      // Skip finder zones
      if ((row < 8 && col < 8) || (row < 8 && col > 12) || (row > 12 && col < 8)) continue;
      const pseudo = Math.sin(seed + row * 17 + col * 31) * 10000;
      if (pseudo - Math.floor(pseudo) > 0.5) {
        ctx.fillRect(col * step + 1, row * step + 1, step - 2, step - 2);
      }
    }
  }
}
