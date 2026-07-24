import { memo } from 'react'
import { useResumeStore } from '@/store'
import { Avatar, EntryDesc, CustomSectionsRenderer } from './TemplateHelpers'

export const MinimalTemplate = memo(function MinimalTemplate() {
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
      {/* Name + avatar row */}
      <div className="r-header-row">
        <Avatar photoDataUrl={photoDataUrl} className="r-avatar" />
        <div>
          <div className="r-name">{name}</div>
        </div>
      </div>

      <div className="r-title">{p.title}</div>

      {/* Contact */}
      <div className="r-contact-row">
        {contacts.map((c) => (
          <span key={c} className="r-contact-item">{c}</span>
        ))}
      </div>

      <div className="r-divider" />

      {/* About */}
      {s.about && (
        <>
          <div className="r-section">
            <div className="r-section-title">Summary</div>
            <div className="r-about">{s.about}</div>
          </div>
          <div className="r-divider" />
        </>
      )}

      {/* Skills */}
      {s.skills.length > 0 && (
        <>
          <div className="r-section">
            <div className="r-section-title">Skills</div>
            <div className="r-skills-grid">
              {s.skills.map((skill) => (
                <span key={skill} className="r-skill-chip">{skill}</span>
              ))}
            </div>
          </div>
          <div className="r-divider" />
        </>
      )}

      {/* Experience */}
      {s.experience.length > 0 && (
        <>
          <div className="r-section">
            <div className="r-section-title">Experience</div>
            {s.experience.map((exp) => (
              <div key={exp.id} className="r-entry">
                <div className="r-entry-date">{exp.date}</div>
                <div>
                  <div className="r-entry-title">{exp.title}</div>
                  <div className="r-entry-sub">{exp.company}</div>
                  <EntryDesc desc={exp.desc} />
                </div>
              </div>
            ))}
          </div>
          <div className="r-divider" />
        </>
      )}

      {/* Education */}
      {s.education.length > 0 && (
        <>
          <div className="r-section">
            <div className="r-section-title">Education</div>
            {s.education.map((edu) => (
              <div key={edu.id} className="r-entry">
                <div className="r-entry-date">{edu.date}</div>
                <div>
                  <div className="r-entry-title">{edu.degree}</div>
                  <div className="r-entry-sub">{edu.school}</div>
                  {edu.desc && <div className="r-entry-desc">{edu.desc}</div>}
                </div>
              </div>
            ))}
          </div>
          <div className="r-divider" />
        </>
      )}

      {/* Projects */}
      {s.projects.length > 0 && (
        <div className="r-section">
          <div className="r-section-title">Projects</div>
          {s.projects.map((proj) => (
            <div key={proj.id} className="r-entry">
              <div className="r-entry-date">{proj.date}</div>
              <div>
                <div className="r-entry-title">{proj.name}</div>
                {proj.tech && <div className="r-entry-sub">{proj.tech}</div>}
                <EntryDesc desc={proj.desc} />
              </div>
            </div>
          ))}
        </div>
      )}

      <CustomSectionsRenderer
        sections={s.customSections}
        sectionCls="r-section"
        titleCls="r-section-title"
      />
    </>
  )
})
