'use client'

import { useResumeStore } from '@/store'
import { FormField, FormRow, TextInput } from '@/components/shared/FormField'
import { PhotoUpload } from '@/components/editor/PhotoUpload'
import { FilenameInput } from '@/components/editor/FilenameInput'
import { Divider } from '@/components/ui/Divider'

export function PersonalSection() {
  const personal = useResumeStore((s) => s.personal)
  const updatePersonal = useResumeStore((s) => s.updatePersonal)

  return (
    <div className="space-y-3">
      {/* Photo upload */}
      <PhotoUpload />

      <Divider />

      {/* Name */}
      <FormRow>
        <FormField label="First Name">
          <TextInput
            value={personal.fname}
            onChange={(e) => updatePersonal({ fname: e.target.value })}
            placeholder="Jane"
            autoComplete="given-name"
          />
        </FormField>
        <FormField label="Last Name">
          <TextInput
            value={personal.lname}
            onChange={(e) => updatePersonal({ lname: e.target.value })}
            placeholder="Doe"
            autoComplete="family-name"
          />
        </FormField>
      </FormRow>

      <FormRow cols={1}>
        <FormField label="Job Title">
          <TextInput
            value={personal.title}
            onChange={(e) => updatePersonal({ title: e.target.value })}
            placeholder="Senior Software Engineer"
            autoComplete="organization-title"
          />
        </FormField>
      </FormRow>

      <Divider label="Contact" />

      <FormRow>
        <FormField label="Email">
          <TextInput
            type="email"
            value={personal.email}
            onChange={(e) => updatePersonal({ email: e.target.value })}
            placeholder="jane@example.com"
            autoComplete="email"
          />
        </FormField>
        <FormField label="Phone">
          <TextInput
            type="tel"
            value={personal.phone}
            onChange={(e) => updatePersonal({ phone: e.target.value })}
            placeholder="+1 555 000 0000"
            autoComplete="tel"
          />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label="Location">
          <TextInput
            value={personal.location}
            onChange={(e) => updatePersonal({ location: e.target.value })}
            placeholder="New York, NY"
            autoComplete="address-level2"
          />
        </FormField>
        <FormField label="Website / LinkedIn">
          <TextInput
            value={personal.website}
            onChange={(e) => updatePersonal({ website: e.target.value })}
            placeholder="linkedin.com/in/jane"
            autoComplete="url"
          />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label="GitHub">
          <TextInput
            value={personal.github}
            onChange={(e) => updatePersonal({ github: e.target.value })}
            placeholder="github.com/jane"
          />
        </FormField>
        <FormField label="Twitter / X">
          <TextInput
            value={personal.twitter}
            onChange={(e) => updatePersonal({ twitter: e.target.value })}
            placeholder="@jane"
          />
        </FormField>
      </FormRow>

      <Divider />

      {/* Filename */}
      <FilenameInput />
    </div>
  )
}
