import { memo } from 'react'
import { useResumeStore } from '@/store'
import { Avatar, EntryDesc, CustomSectionsRenderer } from './TemplateHelpers'

export const TimelineTemplate = memo(function TimelineTemplate() {
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

  // Combine experience + education into one chronological timeline
  const timelineItems = [
    ...s.experience.map((e) => ({ ...e, kind: 'experience' as const, title: e.title, sub: e.company })),
    ...s.education.map((e) => ({ ...e, kind: 'education' as const, title: e.degree, sub: e.school })),
  ]

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

      <div className="r-body">
        {s.about && (
          <div className="r-section r-about-section">
            <div className="r-section-title">Summary</div>
            <div className="r-about">{s.about}</div>
          </div>
        )}

        {s.skills.length > 0 && (
          <div className="r-section r-skills-section">
            <div className="r-section-title">Skills</div>
            <div className="r-tags">
              {s.skills.map((skill) => (
                <span key={skill} className="r-tag">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {timelineItems.length > 0 && (
          <div className="r-section">
            <div className="r-section-title">Journey</div>
            <div className="r-timeline">
              {timelineItems.map((item) => (
                <div key={item.id} className="r-timeline-item">
                  <div className="r-timeline-dot" />
                  <div className="r-timeline-content">
                    <div className="r-entry-header">
                      <span className="r-entry-title">{item.title}</span>
                      <span className="r-entry-date">{item.date}</span>
                    </div>
                    <div className="r-entry-sub">{item.sub}</div>
                    {item.kind === 'experience' && <EntryDesc desc={(item as typeof s.experience[number]).desc} />}
                    {item.kind === 'education' && (item as typeof s.education[number]).desc && (
                      <div className="r-entry-desc">{(item as typeof s.education[number]).desc}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
    </>
  )
})
