'use client'

import { useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useResumeStore } from '@/store'
import { cn } from '@/utils'

export function SkillsSection() {
  const skills = useResumeStore((s) => s.skills)
  const addSkill = useResumeStore((s) => s.addSkill)
  const removeSkill = useResumeStore((s) => s.removeSkill)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function commitSkill(raw: string) {
    const val = raw.trim().replace(/,$/, '')
    if (val) addSkill(val)
    setInputValue('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const val = inputValue.trim()
    if ((e.key === 'Enter' || e.key === ',') && val) {
      e.preventDefault()
      commitSkill(val)
    } else if (e.key === 'Backspace' && !inputValue && skills.length > 0) {
      removeSkill(skills.length - 1)
    }
  }

  return (
    <div>
      <label className="text-[0.7rem] font-medium text-[var(--text2)] uppercase tracking-[0.03em] block mb-1.5">
        Add Skills <span className="text-[var(--text3)] normal-case">(Enter or comma to add)</span>
      </label>
      <div
        className={cn(
          'flex flex-wrap gap-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)]',
          'px-2 py-1.5 cursor-text min-h-[42px]',
          'transition-[border-color,box-shadow] duration-200',
          'focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_3px_rgba(45,90,61,0.1)]',
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {skills.map((skill, i) => (
          <span
            key={`${skill}-${i}`}
            className="inline-flex items-center gap-1 bg-[var(--accent-bg)] text-[var(--accent)] rounded-[4px] px-2 py-0.5 text-[0.78rem] font-medium"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(i)}
              className="text-[var(--accent)] opacity-70 hover:opacity-100 transition-opacity flex items-center"
            >
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (inputValue.trim()) commitSkill(inputValue) }}
          placeholder={skills.length === 0 ? 'e.g. JavaScript' : ''}
          className="border-none bg-transparent p-0.5 text-[0.85rem] font-sans min-w-[100px] flex-1 outline-none text-[var(--text)]"
        />
      </div>
    </div>
  )
}
