import { memo } from 'react'
import { useResumeStore } from '@/store'
import { Avatar, EntryDesc, CustomSectionsRenderer } from './TemplateHelpers'

export const ClassicTemplate = memo(function ClassicTemplate() {
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
        <div>
          <div className="r-name">{name}</div>
          <div className="r-title">{p.title}</div>
          <div className="r-contact-row">
            {contacts.map((c) => (
              <span key={c} className="r-contact-item">{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="r-body">
        {/* Sidebar */}
        <div className="r-sidebar">
          {s.about && (
            <div className="r-section">
              <div className="r-section-title">Summary</div>
              <div className="r-about">{s.about}</div>
            </div>
          )}
          {s.skills.length > 0 && (
            <div className="r-section">
              <div className="r-section-title">Skills</div>
              {s.skills.map((skill) => (
                <div key={skill} className="r-sidebar-skill">{skill}</div>
              ))}
            </div>
          )}
          {(p.github || p.twitter) && (
            <div className="r-section">
              <div className="r-section-title">Links</div>
              {p.github && <div className="r-sidebar-skill">{p.github}</div>}
              {p.twitter && <div className="r-sidebar-skill">{p.twitter}</div>}
            </div>
          )}
        </div>

        {/* Main */}
        <div className="r-main">
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
                  {edu.desc && <div className="r-entry-desc">{edu.desc}</div>}
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
            itemCls="r-entry-desc"
          />
        </div>
      </div>
    </>
  )
})
