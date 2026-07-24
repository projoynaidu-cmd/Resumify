'use client'

import { memo } from 'react'
import { useResumeStore } from '@/store'

export const CoverLetterPreview = memo(function CoverLetterPreview() {
  const personal = useResumeStore((s) => s.personal)
  const coverLetter = useResumeStore((s) => s.coverLetter)

  const fullName = [personal.fname, personal.lname].filter(Boolean).join(' ') || 'Your Name'
  const contactLine = [personal.email, personal.phone, personal.location]
    .filter(Boolean)
    .join(' · ')

  return (
    <div
      style={{
        width: '794px',
        background: '#fff',
        padding: '72px 80px',
        fontSize: '0.9375rem',
        lineHeight: 1.8,
        color: '#2c2a26',
        borderRadius: '4px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div
          id="cl-prev-name"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#1a1814',
            marginBottom: '4px',
          }}
        >
          {fullName}
        </div>
        <div id="cl-prev-contact" style={{ fontSize: '0.8rem', color: '#7a756e' }}>
          {contactLine}
        </div>
      </div>

      {/* Date */}
      {coverLetter.date && (
        <div id="cl-prev-date" style={{ marginBottom: '24px', color: '#7a756e', fontSize: '0.875rem' }}>
          {coverLetter.date}
        </div>
      )}

      {/* Recipient */}
      {(coverLetter.to || coverLetter.company) && (
        <div id="cl-prev-recipient" style={{ marginBottom: '28px' }}>
          {coverLetter.to && (
            <strong style={{ display: 'block', color: '#1a1814' }}>{coverLetter.to}</strong>
          )}
          {coverLetter.company && <span>{coverLetter.company}</span>}
        </div>
      )}

      {/* Body */}
      <div
        id="cl-prev-body"
        style={{ whiteSpace: 'pre-wrap' }}
      >
        {coverLetter.body}
      </div>

      {/* Sign-off */}
      <div style={{ marginTop: '36px' }}>
        <div style={{ marginBottom: '36px' }}>Sincerely,</div>
        <strong id="cl-prev-sign">{fullName}</strong>
      </div>
    </div>
  )
})
