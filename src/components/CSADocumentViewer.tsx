import { Document, Page, pdfjs } from 'react-pdf';
import { useState } from 'react';
import { Button, Group } from '@mantine/core';
// Add these CSS imports for proper text layer styling
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface CSADocumentViewerProps {
  documentUrl: string;
  allPagesRead: () => void;
}

export function CSADocumentViewer({ documentUrl, allPagesRead }: CSADocumentViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function goToNextPage() {
    if (numPages !== null && pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
      if (pageNumber + 1 === numPages) {
        allPagesRead();
      }
    }
  }

  return (
    <div className="pdf-viewer">
      <Document
        file={documentUrl}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <div className="controls" style={{ marginLeft: '20px', marginBottom: '20px' }}>
        <p>
          Page {pageNumber} of {numPages}
        </p>
        <Group gap="md">
          <Button
            variant="outline"
            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
            disabled={pageNumber <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={goToNextPage}
            disabled={numPages === null || pageNumber >= numPages}
          >
            Next
          </Button>
        </Group>
      </div>
    </div>
  );
}