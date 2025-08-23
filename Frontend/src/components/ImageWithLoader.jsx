import React, { useState } from 'react';

const ImageWithLoader = ({ src, alt }) => {
    const [loaded, setLoaded] = useState(false);
    return (
        <div className="relative w-full h-full">
            <img 
                src={src} 
                alt={alt} 
                className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setLoaded(true)} 
            />
            {!loaded && (
                <div className="absolute inset-0 bg-orange-100 animate-pulse"></div>
            )}
        </div>
    );
};

export default ImageWithLoader;
