import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { HiX, HiExternalLink, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfViewer = ({ url, onClose, title = 'Resume' }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [loadError, setLoadError] = useState(false);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPageNumber(1);
        setLoadError(false);
    };

    const onDocumentLoadError = () => {
        setLoadError(true);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div style={{
                width: '90vw',
                maxWidth: '900px',
                height: '90vh',
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            }} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid var(--border-color)',
                    flexShrink: 0,
                }}>
                    <span style={{ fontWeight: 600, fontSize: 'var(--font-size-base)' }}>📄 {title}</span>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                            <HiExternalLink /> Download
                        </a>
                        <button className="modal-close" onClick={onClose}><HiX /></button>
                    </div>
                </div>

                {/* PDF Content */}
                <div style={{
                    flex: 1,
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '1rem',
                    background: '#1a1a2e',
                }}>
                    {loadError ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            gap: '1rem',
                            color: 'var(--text-muted)',
                        }}>
                            <span style={{ fontSize: '3rem' }}>📄</span>
                            <p>Unable to preview this PDF.</p>
                            <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                Download Resume
                            </a>
                        </div>
                    ) : (
                        <Document
                            file={url}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={onDocumentLoadError}
                            loading={<div className="spinner" style={{ marginTop: '30vh' }}></div>}
                        >
                            <Page
                                pageNumber={pageNumber}
                                width={Math.min(window.innerWidth * 0.85, 850)}
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                            />
                        </Document>
                    )}
                </div>

                {/* Page navigation */}
                {numPages && numPages > 1 && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.5rem 1rem',
                        borderTop: '1px solid var(--border-color)',
                        flexShrink: 0,
                    }}>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                            disabled={pageNumber <= 1}
                        >
                            <HiChevronLeft /> Prev
                        </button>
                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                            Page {pageNumber} of {numPages}
                        </span>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
                            disabled={pageNumber >= numPages}
                        >
                            Next <HiChevronRight />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PdfViewer;
