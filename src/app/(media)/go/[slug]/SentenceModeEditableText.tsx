'use client';

import { useState } from 'react';

interface EditableTextProps {
  initialText: string;
  className?: string;
  onTextChange?: (text: string) => void;
}

export default function EditableText({ 
  initialText, 
  className = '', 
  onTextChange 
}: EditableTextProps) {
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);

  const handleTextChange = (newText: string) => {
    setText(newText);
    onTextChange?.(newText);
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={text}
        onChange={(e) => handleTextChange(e.target.value)}
        onBlur={() => setIsEditing(false)}
        onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
        className={`p-2 border rounded ${className}`}
        autoFocus
      />
    );
  }

  return (
    <h1 
      className={`cursor-pointer hover:bg-gray-100 p-2 rounded ${className}`}
      onClick={() => setIsEditing(true)}
    >
      {text}
    </h1>
  );
}