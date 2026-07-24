import { memo } from 'react'
import { useResumeStore } from '@/store'
import { SKILL_LEVEL_PERCENTAGES } from '@/lib/constants'
import { Avatar, EntryDesc, CustomSectionsRenderer } from './TemplateHelpers'

export const CreativeTemplate = memo(function CreativeTemplate() {
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
  const contacts = [
    p.email && { label: p.email, icon: '✉' },
    p.phone && { label: p.phone, icon: '☎' },
    p.location && { label: p.location, icon: '📍' },
    p.website && { label: p.website, icon: '🔗' },
    p.github && { label: p.github, icon: '' },
  ].filter(Boolean) as { label: string; icon: string }[]

  return (
    <>
      {/* Sidebar */}
      <div className="r-sidebar">
        <Avatar photoDataUrl={photoDataUrl} className="r-avatar" />
        <div className="r-name">{name}</div>
        <div className="r-job-title">{p.title}</div>

        {contacts.length > 0 && (
          <div className="r-sidebar-section">
            <div className="r-sidebar-title">Contact</div>
            {contacts.map((c) => (
              <div key={c.label} className="r-sidebar-item">
                {c.icon && <span style={{ width: '14px', fontSize: '0.7rem' }}>{c.icon}</span>}
                <span>{c.label}</span>
              </div>
            ))}
          </div>
        )}

        {s.skills.length > 0 && (
          <div className="r-sidebar-section">
            <div className="r-sidebar-title">Skills</div>
            {s.skills.map((skill, i) => (
              <div key={skill} className="r-skill-bar-wrap">
                <div className="r-skill-name-row">
                  <span>{skill}</span>
                </div>
                <div className="r-skill-bar">
                  <div
                    className="r-skill-fill"
                    style={{ width: `${SKILL_LEVEL_PERCENTAGES[i % 8]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main */}
      <div className="r-main">
        {s.about && (
          <div className="r-section">
            <div className="r-section-title">About Me</div>
            <div className="r-about">{s.about}</div>
          </div>
        )}

        {s.experience.length > 0 && (
          <div className="r-section">
            <div className="r-section-title">Experience</div>
            {s.experience.map((exp) => (
              <div key={exp.id} className="r-entry">
                <div className="r-entry-title">{exp.title}</div>
                <div className="r-entry-sub">{exp.company}</div>
                <div className="r-entry-date">{exp.date}</div>
                <EntryDesc desc={exp.desc} />
              </div>
            ))}
          </div>
        )}

        {s.education.length > 0 && (
          <div className="r-section">
            <div className="r-section-title">Education</div>
            {s.education.map((edu) => (
              <div key={edu.id} className="r-entry">
                <div className="r-entry-title">{edu.degree}</div>
                <div className="r-entry-sub">{edu.school}</div>
                <div className="r-entry-date">{edu.date}</div>
              </div>
            ))}
          </div>
        )}

        {s.projects.length > 0 && (
          <div className="r-section">
            <div className="r-section-title">Projects</div>
            {s.projects.map((proj) => (
              <div key={proj.id} className="r-entry">
                <div className="r-entry-title">{proj.name}</div>
                <div className="r-entry-date">{proj.date}</div>
                <EntryDesc desc={proj.desc} />
                {proj.tech && (
                  <div className="r-tags">
                    {proj.tech.split(',').map((t) => t.trim()).filter(Boolean).map((t) => (
                      <span key={t} className="r-tag">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <CustomSectionsRenderer
          sections={s.customSections}
          sectionCls="r-section"
          titleCls="r-section-title"
        />
      </div>
    </>
  )
})
