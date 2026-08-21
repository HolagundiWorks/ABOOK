import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFExportOptions {
  fileName?: string;
  elementId: string;
  margin?: number;
  onProgress?: (status: string) => void;
}

/**
 * Exports a specified DOM element to a crisp, high-resolution PDF file.
 */
export async function exportElementToPDF({
  elementId,
  fileName = 'Document.pdf',
  onProgress
}: PDFExportOptions): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`PDF Export Error: Element #${elementId} not found.`);
    // Fallback to window.print()
    window.print();
    return false;
  }

  try {
    if (onProgress) onProgress('Preparing document layout...');

    // Clone or capture styles smoothly
    const canvas = await html2canvas(element, {
      scale: 2, // 2x resolution for crisp text & borders
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794 // Standard A4 width in 96 DPI
    });

    if (onProgress) onProgress('Generating PDF pages...');

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Additional pages if document is longer than 1 A4 page
    while (heightLeft > 5) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    if (onProgress) onProgress('Saving PDF...');
    const safeName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    pdf.save(safeName);

    if (onProgress) onProgress('Complete');
    return true;
  } catch (error) {
    console.error('HTML to PDF export failed, fallback to native print', error);
    window.print();
    return false;
  }
}
