/**
 * Extract average color from an image
 * Used for ambient color letterbox backgrounds
 */

/**
 * Extract the average color from an image element
 * @param img - HTMLImageElement to analyze
 * @returns RGB color string in format "rgb(r, g, b)"
 */
export function extractAverageColor(img: HTMLImageElement): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return 'rgb(128, 128, 128)'; // Fallback gray
    }

    // Use small canvas for performance - 50x50 is enough for average color
    const targetSize = 50;
    canvas.width = targetSize;
    canvas.height = targetSize;

    // Draw image scaled down
    ctx.drawImage(img, 0, 0, targetSize, targetSize);

    // Get pixel data
    const imageData = ctx.getImageData(0, 0, targetSize, targetSize);
    const data = imageData.data;

    let r = 0, g = 0, b = 0;
    const pixelCount = targetSize * targetSize;

    // Sum all RGB values
    for (let i = 0; i < data.length; i += 4) {
        r += data[i];     // Red
        g += data[i + 1]; // Green
        b += data[i + 2]; // Blue
        // Skip alpha (data[i + 3])
    }

    // Calculate average
    r = Math.floor(r / pixelCount);
    g = Math.floor(g / pixelCount);
    b = Math.floor(b / pixelCount);

    return `rgb(${r}, ${g}, ${b})`;
}
