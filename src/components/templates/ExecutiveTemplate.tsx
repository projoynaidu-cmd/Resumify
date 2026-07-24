import { memo } from 'react'
import { useResumeStore } from '@/store'
import { Avatar, EntryDesc, CustomSectionsRenderer } from './TemplateHelpers'

export const ExecutiveTemplate = memo(function ExecutiveTemplate() {
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
      {/* Header */}
      <div className="r-header">
        <div className="r-header-left">
          <Avatar photoDataUrl={photoDataUrl} className="r-avatar" />
          <div>
            <div className="r-name">{name}</div>
            <div className="r-title">{p.title}</div>
          </div>
        </div>
        <div className="r-contact-col">
          {p.email && <div>{p.email}</div>}
          {p.phone && <div>{p.phone}</div>}
          {p.location && <div>{p.location}</div>}
          {p.website && <div>{p.website}</div>}
        </div>
      </div>

      {/* Body */}
      <div className="r-body">
        {/* Main */}
        <div className="r-main">
          {s.about && (
            <div className="r-section">
              <div className="r-section-title">Executive Summary</div>
              <div className="r-about">{s.about}</div>
            </div>
          )}

          {s.experience.length > 0 && (
            <div className="r-section">
              <div className="r-section-title">Professional Experience</div>
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

          {s.projects.length > 0 && (
            <div className="r-section">
              <div className="r-section-title">Key Projects</div>
              {s.projects.map((proj) => (
                <div key={proj.id} className="r-entry">
                  <div className="r-entry-header">
                    <span className="r-entry-title">{proj.name}</span>
                    <span className="r-entry-date">{proj.date}</span>
                  </div>
                  {proj.tech && <div className="r-entry-sub">{proj.tech}</div>}
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

        {/* Sidebar */}
        <div className="r-sidebar">
          {s.education.length > 0 && (
            <>
              <div className="r-sidebar-label">Education</div>
              {s.education.map((edu) => (
                <div key={edu.id} className="r-chip">
                  {edu.degree}
                  <br />
                  <small style={{ opacity: 0.7 }}>{edu.school}</small>
                </div>
              ))}
            </>
          )}

          {s.skills.length > 0 && (
            <>
              <div className="r-sidebar-label">Core Skills</div>
              {s.skills.map((skill) => (
                <span key={skill} className="r-chip">{skill}</span>
              ))}
            </>
          )}

          {(p.github || p.twitter) && (
            <>
              <div className="r-sidebar-label">Links</div>
              {p.github && <div className="r-chip">{p.github}</div>}
              {p.twitter && <div className="r-chip">{p.twitter}</div>}
            </>
          )}
        </div>
      </div>
    </>
  )
})
