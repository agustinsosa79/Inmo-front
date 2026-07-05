import React, { useState } from 'react'

const useChangeImages = () => {

    const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [resetKey, setResetKey] = useState(0);

    const handleImageChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const files = e.target.files;

  if (!files) return;

  const fileArray = Array.from(files);

  const newImages = fileArray.map((file) =>
    URL.createObjectURL(file)
  );

  setImages(prev => [...prev, ...fileArray]);

  setPreviewImages((prev) => [
    ...prev,
    ...newImages,
  ]);
};

const clearImage = (index: number) => {
  setImages((prev) =>
    prev.filter((_, i) => i !== index)
  );
  setPreviewImages((prev) =>
    prev.filter((_, i) => i !== index)
  );

  setResetKey(prev => prev + 1);
};


const clearAllImages = () => {
    setImages([]);
    setPreviewImages([]);
    setResetKey(prev => prev + 1);
}

const moveImageUp = (index: number) => {
  if (index === 0) return; // Ya es la primera, no se puede mover más

  // Clonamos los estados actuales
  const newImages = [...images];
  const newPreviews = [...previewImages];

  // Intercambiamos de lugar en el array de Files
  [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
  // Intercambiamos de lugar en el array de las vistas previas
  [newPreviews[index], newPreviews[index - 1]] = [newPreviews[index - 1], newPreviews[index]];

  // Guardamos en los estados de tu hook
  setImages(newImages);
  setPreviewImages(newPreviews);
};

// Mueve una imagen hacia adelante (derecha / abajo)
const moveImageDown = (index: number) => {
  if (index === previewImages.length - 1) return; // Ya es la última

  const newImages = [...images];
  const newPreviews = [...previewImages];

  // Intercambiamos con la siguiente posición
  [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
  [newPreviews[index], newPreviews[index + 1]] = [newPreviews[index + 1], newPreviews[index]];

  setImages(newImages);
  setPreviewImages(newPreviews);
};

  return {
    images,
    previewImages,
    resetKey,
    handleImageChange,
    clearImage,
    clearAllImages,
    moveImageUp,
    moveImageDown,
    setImages,
    setPreviewImages
  }
}

export default useChangeImages