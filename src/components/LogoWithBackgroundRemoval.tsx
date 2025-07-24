import { useState, useEffect } from 'react';
import { processLogoBackgroundRemoval } from '@/utils/backgroundRemoval';

interface LogoWithBackgroundRemovalProps {
  originalSrc: string;
  alt: string;
  className: string;
}

const LogoWithBackgroundRemoval = ({ originalSrc, alt, className }: LogoWithBackgroundRemovalProps) => {
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const processLogo = async () => {
      try {
        setIsProcessing(true);
        const processedUrl = await processLogoBackgroundRemoval(originalSrc);
        setProcessedSrc(processedUrl);
        setError(false);
      } catch (err) {
        console.error('Failed to process logo:', err);
        setError(true);
      } finally {
        setIsProcessing(false);
      }
    };

    processLogo();
  }, [originalSrc]);

  // Show original image if processing failed or is still processing
  if (error || isProcessing || !processedSrc) {
    return (
      <img 
        src={originalSrc} 
        alt={alt} 
        className={className}
      />
    );
  }

  return (
    <img 
      src={processedSrc} 
      alt={alt} 
      className={className}
    />
  );
};

export default LogoWithBackgroundRemoval;