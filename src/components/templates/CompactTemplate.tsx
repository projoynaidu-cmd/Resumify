import { memo } from 'react'
import { useResumeStore } from '@/store'
import { Avatar, EntryDesc, CustomSectionsRenderer } from './TemplateHelpers'

export const CompactTemplate = memo(function CompactTemplate() {
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
  const contacts = [p.email, p.phone, p.location, p.website].filter(Boolean)

  return (
    <>
      {/* Header */}
      <div className="r-header">
        <Avatar photoDataUrl={photoDataUrl} className="r-avatar" />
        <div className="r-name">{name}</div>
        <div className="r-title">{p.title}</div>
        <div className="r-contact-row">
          {contacts.map((c) => (
            <span key={c} className="r-contact-item">{c}</span>
          ))}
        </div>
      </div>

      {/* Skills row */}
      {s.skills.length > 0 && (
        <div className="r-section" style={{ padding: '12px 40px 0' }}>
          <div className="r-section-title">Skills</div>
          <div className="r-skills-flow">
            {s.skills.map((skill) => (
              <span key={skill} className="r-skill-pill">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* About */}
      {s.about && (
        <div className="r-section" style={{ padding: '12px 40px 0' }}>
          <div className="r-section-title">Summary</div>
          <div className="r-about">{s.about}</div>
        </div>
      )}

      {/* Two-column grid */}
      <div className="r-two-col" style={{ padding: '12px 40px 28px' }}>
        {/* Left */}
        <div>
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

          <CustomSectionsRenderer
            sections={s.customSections}
            sectionCls="r-section"
            titleCls="r-section-title"
          />
        </div>

        {/* Right */}
        <div>
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
})
