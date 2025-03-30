import React, { useState, useEffect } from 'react';
import { ConfigData, ImageConfig } from '../config';

interface ProcessedImage extends ImageConfig {
  src: string;
  width: number;
  height: number;
  aspectRatio: number;
  loadError?: boolean;
}

interface ProjectsProps {
  config: ConfigData;
}

const Projects = ({config}: ProjectsProps): React.ReactElement => {
  // State for storing image data loaded from config
  const [images, setImages] = useState<ProcessedImage[]>([]);
  // Track loading state
  const [loading, setLoading] = useState<boolean>(true);
  // Track any error state
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to load image configuration
    const loadImageConfig = async (): Promise<void> => {
      try {
        // Start loading all the images to get their dimensions
        const imagePromises = config.images.map((imageConfig: ImageConfig) => {
          return new Promise<ProcessedImage>((resolve) => {
            const img = new Image();
            
            img.onload = () => {
              resolve({
                ...imageConfig,
                // Set the full path to the image
                src: `/images/${imageConfig.filename}`,
                // Record the natural dimensions
                width: img.width,
                height: img.height,
                aspectRatio: img.width / img.height
              });
            };
            
            // Handle loading errors
            img.onerror = () => {
              console.error(`Failed to load image: ${imageConfig.filename}`);
              resolve({
                ...imageConfig,
                src: `/images/${imageConfig.filename}`,
                width: 300,
                height: 200,
                aspectRatio: 1.5,
                loadError: true
              });
            };
            
            // Start loading the image
            img.src = `/images/${imageConfig.filename}`;
          });
        });

        const processedImages = await Promise.all(imagePromises);
        
        // Sort images to optimize layout (optional)
        const sortedImages = [...processedImages].sort((a, b) => {
          // Sort by area (width × height) in descending order
          return (b.width * b.height) - (a.width * a.height);
        });
        
        setImages(sortedImages);
        setLoading(false);
      } catch (err) {
        console.error('Error loading gallery configuration:', err);
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      }
    };

    loadImageConfig();
  });

  // If we have an error loading the config
  if (error) {
    return (
      <div className="projects">
        <h2>Projects</h2>
        <div className="error-message">
          <p>Failed to load gallery: {error}</p>
          <p>Please make sure the configuration file is accessible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="projects">
      <h2>Projects</h2>
      
      {loading ? (
        <div className="loading">Loading gallery...</div>
      ) : (
        <div className="dynamic-image-grid">
          {images.map((image) => {
            // Calculate grid span based on aspect ratio and dimensions with scaling
            const rowSpan = Math.max(1, Math.ceil(image.height / (50 * config.scaleFactor)));
            const colSpan = Math.max(1, Math.ceil(image.width / (100 * config.scaleFactor)));
            
            return (
              <div 
                key={image.id} 
                className="image-item"
                style={{
                  gridRow: `span ${rowSpan}`,
                  gridColumn: `span ${colSpan}`
                }}
              >
                <div className="image-content">
                  <img 
                    src={image.src} 
                    alt={image.title || 'Artwork'}
                    loading="lazy"
                    className={image.loadError ? 'image-error' : ''}
                  />
                  {image.title && (
                    <div className="image-caption">
                      <h3>{image.title}</h3>
                      {image.description && <p>{image.description}</p>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Projects;
