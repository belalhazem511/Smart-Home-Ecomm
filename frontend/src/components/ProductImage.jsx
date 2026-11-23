import { useState } from 'react';

export default function ProductImage({ src, alt, className = '', imageClassName = '' }) {
  const [imageAvailable, setImageAvailable] = useState(true);

  return <div className={`product-image ${className}`}>
    {imageAvailable ? <img src={src} alt={alt} className={imageClassName} onError={() => setImageAvailable(false)}/> : <div className="product-image-fallback" role="img" aria-label={`${alt} image unavailable`}/>}
  </div>;
}
