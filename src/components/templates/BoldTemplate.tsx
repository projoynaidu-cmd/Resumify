import { memo } from 'react'
import { useResumeStore } from '@/store'
import { Avatar, EntryDesc, CustomSectionsRenderer } from './TemplateHelpers'

export const BoldTemplate = memo(function BoldTemplate() {
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
      {/* Bold block header */}
      <div className="r-header">
        <div className="r-header-inner">
          <div className="r-name">{name}</div>
          <div className="r-title">{p.title}</div>
        </div>
        {photoDataUrl && <Avatar photoDataUrl={photoDataUrl} className="r-avatar" />}
      </div>

      <div className="r-contact-bar">
        {contacts.map((c) => (
          <span key={c} className="r-contact-item">{c}</span>
        ))}
      </div>

      <div className="r-body">
        {s.about && (
          <div className="r-section">
            <div className="r-section-title">Summary</div>
            <div className="r-about">{s.about}</div>
          </div>
        )}

        {s.skills.length > 0 && (
          <div className="r-section">
            <div className="r-section-title">Skills</div>
            <div className="r-tags">
              {s.skills.map((skill) => (
                <span key={skill} className="r-tag">{skill}</span>
              ))}
            </div>
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
              </div>
            ))}
          </div>
        )}

        {s.projects.length > 0 && (
          <div className="r-section">
            <div className="r-section-title">Projects</div>
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
