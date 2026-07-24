import { memo } from 'react'
import { useResumeStore } from '@/store'
import { Avatar, EntryDesc } from './TemplateHelpers'

export const TechnicalTemplate = memo(function TechnicalTemplate() {
  const s = useResumeStore((st) => ({
    personal: st.personal,
    about: st.about,
    skills: st.skills,
    experience: st.experience,
    education: st.education,
    projects: st.projects,
    customSections: st.customSections,
    photoDataUrl: st.photoDataUrl,
  }))

  const { personal: p, photoDataUrl } = s
  const name = [p.fname, p.lname].filter(Boolean).join(' ')

  return (
    <>
      {/* Terminal-style header */}
      <div className="r-header">
        <div className="r-terminal-bar">
          <span className="r-dot r-dot-red" />
          <span className="r-dot r-dot-yellow" />
          <span className="r-dot r-dot-green" />
          <span className="r-terminal-path">~/resume/{(p.lname || 'candidate').toLowerCase()}.json</span>
        </div>
        <div className="r-header-content">
          <Avatar photoDataUrl={photoDataUrl} className="r-avatar" />
          <div>
            <div className="r-name">
              <span className="r-prompt">$</span> {name}
            </div>
            <div className="r-title">// {p.title}</div>
            <div className="r-contact-row">
              {p.email && <span className="r-contact-item">{p.email}</span>}
              {p.phone && <span className="r-contact-item">{p.phone}</span>}
              {p.location && <span className="r-contact-item">{p.location}</span>}
              {p.github && <span className="r-contact-item">{p.github}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="r-body">
        {s.about && (
          <div className="r-section">
            <div className="r-section-title">/* about */</div>
            <div className="r-about">{s.about}</div>
          </div>
        )}

        {s.skills.length > 0 && (
          <div className="r-section">
            <div className="r-section-title">/* stack */</div>
            <div className="r-tags">
              {s.skills.map((skill) => (
                <span key={skill} className="r-tag">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {s.experience.length > 0 && (
          <div className="r-section">
            <div className="r-section-title">/* experience */</div>
            {s.experience.map((exp) => (
              <div key={exp.id} className="r-entry">
                <div className="r-entry-header">
                  <span className="r-entry-title">{exp.title}</span>
                  <span className="r-entry-date">{exp.date}</span>
                </div>
                <div className="r-entry-sub">@ {exp.company}</div>
                <EntryDesc desc={exp.desc} />
              </div>
            ))}
          </div>
        )}

        {s.projects.length > 0 && (
          <div className="r-section">
            <div className="r-section-title">/* projects */</div>
            {s.projects.map((proj) => (
              <div key={proj.id} className="r-entry">
                <div className="r-entry-header">
                  <span className="r-entry-title">{proj.name}</span>
                  <span className="r-entry-date">{proj.date}</span>
                </div>
                {proj.tech && <div className="r-entry-sub r-mono">{proj.tech}</div>}
                <EntryDesc desc={proj.desc} />
              </div>
            ))}
          </div>
        )}

        {s.education.length > 0 && (
          <div className="r-section">
            <div className="r-section-title">/* education */</div>
            {s.education.map((edu) => (
              <div key={edu.id} className="r-entry">
                <div className="r-entry-header">
                  <span className="r-entry-title">{edu.degree}</span>
                  <span className="r-entry-date">{edu.date}</span>
                </div>
                <div className="r-entry-sub">{edu.school}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
})
