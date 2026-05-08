import { useRef, useState } from "react";

interface ImageDropBoxProps {
    onFileSelect: (file: File | undefined) => void;
    imageUrl?: string;
}

export const ImageDropBox = ({ onFileSelect, imageUrl }: ImageDropBoxProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | undefined>(imageUrl || undefined);

    const handleFile = (file: File) => {
        onFileSelect(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            handleFile(event.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    return (
        <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border border-dashed border-lab-turquoise rounded h-50 w-120 flex items-center justify-center cursor-pointer bg-black ${preview ? 'p-1' : ''}`}
        > 
        {preview ? (
            <span className="flex flex-row justify-center items-center gap-2">
                <img src={preview} alt="Preview" className="max-h-50 max-w-100 p-2" />
                {preview && preview !== imageUrl && (
                    <span className="text-lab-gray-light/50 border rounded px-1 text-center" onClick={(e) => {
                        e.stopPropagation();
                        setPreview(imageUrl || undefined);
                        onFileSelect(undefined);
                    }}>Remove image</span>
                )}
            </span>
            ) : (
                <span className="text-lab-turquoise">Click or drag and drop an image here</span>
            )}
            <input
                type="file"
                ref={inputRef}
                onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        handleFile(e.target.files[0]);
                    }
                }}
                accept="image/jpeg,image/png"
                style={{ display: 'none' }}
            />
        </div>
    );
};