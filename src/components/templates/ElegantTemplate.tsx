import { memo } from 'react'
import { useResumeStore } from '@/store'
import { Avatar, EntryDesc, CustomSectionsRenderer } from './TemplateHelpers'

export const ElegantTemplate = memo(function ElegantTemplate() {
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
      {/* Centered elegant header */}
      <div className="r-header">
        {photoDataUrl && <Avatar photoDataUrl={photoDataUrl} className="r-avatar" />}
        <div className="r-name">{name}</div>
        <div className="r-title">{p.title}</div>
        <div className="r-ornament">✦</div>
        <div className="r-contact-row">
          {contacts.map((c, i) => (
            <span key={c} className="r-contact-item">
              {c}
              {i < contacts.length - 1 && <span className="r-contact-sep">·</span>}
            </span>
          ))}
        </div>
      </div>

      <div className="r-body">
        {s.about && (
          <div className="r-section">
            <div className="r-section-title">Profile</div>
            <div className="r-about">{s.about}</div>
          </div>
        )}

        {s.experience.length > 0 && (
          <div className="r-section">
            <div className="r-section-title">Experience</div>
            {s.experience.map((exp) => (
              <div key={exp.id} className="r-entry">
                <div className="r-entry-header">
                  <span className="r-entry-title">{exp.title}</span>
                  <span className="r-entry-date">{exp.date}</span>
                </div>
                <div className="r-entry-sub">{exp.company}</div>
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
                <div className="r-entry-header">
                  <span className="r-entry-title">{edu.degree}</span>
                  <span className="r-entry-date">{edu.date}</span>
                </div>
                <div className="r-entry-sub">{edu.school}</div>
                {edu.desc && <div className="r-entry-desc">{edu.desc}</div>}
              </div>
            ))}
          </div>
        )}

        {s.skills.length > 0 && (
          <div className="r-section">
            <div className="r-section-title">Skills</div>
            <div className="r-skills-elegant">{s.skills.join('  ·  ')}</div>
          </div>
        )}

        {s.projects.length > 0 && (
          <div className="r-section">
            <div className="r-section-title">Selected Projects</div>
            {s.projects.map((proj) => (
              <div key={proj.id} className="r-entry">
                <div className="r-entry-header">
                  <span className="r-entry-title">{proj.name}</span>
                  <span className="r-entry-date">{proj.date}</span>
                </div>
                <EntryDesc desc={proj.desc} />
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
