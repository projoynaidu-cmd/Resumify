'use client'

import { useState, useRef } from 'react'
import { Upload } from 'lucide-react'
import DOMPurify from 'dompurify'
import { useUIStore } from '@/store'
import { cn } from '@/utils'

export function HtmlUploadDropZone() {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const addToast = useUIStore((s) => s.addToast)

  function handleFile(file: File) {
    if (!file.name.match(/\.html?$/i)) {
      addToast('error', 'Upload an HTML file')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const content = document.getElementById('resume-content')
      if (content) {
        const clean = DOMPurify.sanitize(ev.target?.result as string, {
          ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p', 'ul', 'ol', 'li',
                         'h1', 'h2', 'h3', 'h4', 'span', 'div', 'a', 'table',
                         'tr', 'td', 'th', 'thead', 'tbody', 'img'],
          ALLOWED_ATTR: ['href', 'class', 'style', 'src', 'alt'],
          FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'svg', 'math'],
        })
        content.innerHTML = clean
        addToast('success', 'HTML resume loaded!')
      }
    }
    reader.readAsText(file)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(true)
  }

  function handleDragLeave() {
    setIsDragOver(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  return (
    <div
      id="drop-zone"
      className={cn(
        'mx-3 my-3.5 border-2 border-dashed border-[var(--border)] rounded-[var(--radius)]',
        'p-4 text-center cursor-pointer bg-[var(--surface2)]',
        'transition-all duration-200',
        isDragOver && 'border-[var(--accent)] bg-[var(--accent-bg)]',
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <Upload
        size={24}
        className={cn(
          'mx-auto mb-1.5',
          isDragOver ? 'text-[var(--accent)]' : 'text-[var(--text3)]',
        )}
      />
      <p className="text-[0.8rem] text-[var(--text2)] leading-relaxed">
        Drop an <span className="text-[var(--accent)] font-medium">HTML resume</span> here to load it,
        or{' '}
        <span className="text-[var(--accent)] font-medium">browse</span>
      </p>
      <input
        ref={inputRef}
        id="file-input"
        type="file"
        accept=".html,.htm"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  )
}
