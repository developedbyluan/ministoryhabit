"use client"

interface HoverableTextProps {
  text: string
  isPhrase?: boolean
  index: number
  isSelected?: boolean
  isFirstSelected?: boolean
  onWordClick: (index: number) => void
}

export function HoverableText({ text, isPhrase, index, isSelected, isFirstSelected, onWordClick }: HoverableTextProps) {
  const handleClick = () => {
    onWordClick(index)
  }

  return (
    <span
      className={`cursor-pointer transition-colors
        ${isPhrase ? "bg-blue-50 dark:bg-blue-900/20" : ""}
        ${isSelected ? "bg-yellow-100 dark:bg-yellow-900/30" : ""}
        ${!isSelected && isFirstSelected ? "bg-green-100 dark:bg-green-900/30" : ""}
        ${!isSelected && !isFirstSelected ? "hover:bg-gray-100 dark:hover:bg-gray-800" : ""}
      `}
      onClick={handleClick}
    >
      {text}
    </span>
  )
}