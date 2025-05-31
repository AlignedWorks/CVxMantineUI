import { Document, Page, pdfjs } from 'react-pdf';
import { useState } from 'react';
import { Button } from '@mantine/core';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

console.log(pdfjs.GlobalWorkerOptions.workerSrc);

interface CSADocumentViewerProps {
  documentUrl: string;
  onAgreementComplete: () => void;
}

export function CSADocumentViewer({ documentUrl, onAgreementComplete }: CSADocumentViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [hasReadAll, setHasReadAll] = useState<boolean>(false);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function goToNextPage() {
    if (numPages !== null && pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
      if (pageNumber + 1 === numPages) {
        setHasReadAll(true);
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
      <div className="controls">
        <p>
          Page {pageNumber} of {numPages}
        </p>
        <Button 
          onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
          disabled={pageNumber <= 1}
        >
          Previous
        </Button>
        <Button 
          onClick={goToNextPage}
          disabled={numPages === null || pageNumber >= numPages}
        >
          Next
        </Button>
      </div>
      <Button
        disabled={!hasReadAll}
        onClick={onAgreementComplete}
        mt="lg"
        fullWidth
      >
        I have read and agree to the terms
      </Button>
    </div>
  );
}