import html2canvas from 'html2canvas';

export async function exportScreenshot(element: HTMLElement, filename = 'ad-preview.png') {
  // Find the scaled inner div and temporarily render at 1:1 for capture
  const scaledDiv = element.querySelector('[data-capture-content]') as HTMLElement | null;
  const scrollContainer = element.querySelector('[data-capture-scroll]') as HTMLElement | null;

  let origTransform = '';
  let origWidth = '';
  let origHeight = '';
  let origOverflow = '';

  if (scaledDiv) {
    origTransform = scaledDiv.style.transform;
    scaledDiv.style.transform = 'none';
  }
  if (scrollContainer) {
    origWidth = scrollContainer.style.width;
    origHeight = scrollContainer.style.height;
    origOverflow = scrollContainer.style.overflow;
    // Expand to full content size
    scrollContainer.style.width = scaledDiv ? `${scaledDiv.scrollWidth}px` : 'auto';
    scrollContainer.style.height = scaledDiv ? `${scaledDiv.scrollHeight}px` : 'auto';
    scrollContainer.style.overflow = 'visible';
  }

  try {
    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: true,
      scale: 2,
      backgroundColor: '#f3f4f6',
      logging: false,
      scrollX: 0,
      scrollY: 0,
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } finally {
    // Restore original styles
    if (scaledDiv) {
      scaledDiv.style.transform = origTransform;
    }
    if (scrollContainer) {
      scrollContainer.style.width = origWidth;
      scrollContainer.style.height = origHeight;
      scrollContainer.style.overflow = origOverflow;
    }
  }
}
