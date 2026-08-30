import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Privacy Policy — Resumify' }

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="prose prose-neutral max-w-none">
        <h1>Privacy Policy</h1>
        <p className="text-sm text-gray-500">
          Effective Date: August 30, 2026
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          <strong>Account Information:</strong> When you register, we collect your
          name, email address, and a bcrypt-hashed password. OAuth sign-in (Google,
          GitHub) provides your name, email, and profile image.
        </p>
        <p>
          <strong>Resume Data:</strong> All resume content you create (personal
          info, work experience, skills, education, etc.) is stored in our database
          when you are authenticated. Unauthenticated users have resume data stored
          in browser localStorage only.
        </p>
        <p>
          <strong>Usage Data:</strong> We collect analytics on AI feature usage, ATS
          score checks, resume views, and page interactions.
        </p>
        <p>
          <strong>Payment Data:</strong> Payment information is processed by Stripe.
          We do not store credit card numbers — only a Stripe customer ID on your
          user record.
        </p>

        <h2>2. How We Use Information</h2>
        <ul>
          <li>To create and maintain your account</li>
          <li>To store and sync your resume data across sessions</li>
          <li>To generate AI-assisted content (summary, bullets, cover letter) on
              your behalf via the Claude API</li>
          <li>To process payments and manage subscriptions</li>
          <li>To provide analytics and improve the Service</li>
          <li>To send service-related notifications (receipts, password resets)</li>
        </ul>

        <h2>3. Data Sharing and Third Parties</h2>
        <p>
          <strong>We do not sell your personal data.</strong> We share information
          with the following service providers:
        </p>
        <ul>
          <li>
            <strong>Stripe:</strong> For payment processing. Stripe may collect
            payment and identity information for fraud prevention.
          </li>
          <li>
            <strong>Anthropic (Claude API):</strong> When you use AI features,
            your resume content is sent to Anthropic to generate responses. This
            may include personal information (name, email, work history). Anthropic
            does not train on customer data sent via API.
          </li>
          <li>
            <strong>PostHog:</strong> For product analytics. We identify you by a
            user ID with traits (email, name, plan). This is optional — if
            <code>NEXT_PUBLIC_POSTHOG_KEY</code> is not set, analytics is disabled.
          </li>
          <li>
            <strong>Resend:</strong> For transactional email delivery (welcome,
            receipts, cancellation notices).
          </li>
        </ul>

        <h2>4. Public Resume Sharing</h2>
        <p>
          You may choose to make your resume publicly viewable via a shareable
          link. Public resumes are accessible to anyone with the link. We track
          view counts for analytics but do not make public resumes discoverable
          via search engines.
        </p>

        <h2>5. Your Rights</h2>
        <p>
          You may access, export, or delete your data at any time through your
          account settings or by contacting us at privacy@Resumify.app. Upon
          account deletion, all personal data and resume content will be
          permanently removed from our database within 30 days, except as required
          by law.
        </p>

        <h2>6. Data Retention</h2>
        <p>
          <strong>Local data:</strong> Unauthenticated resume data is stored in
          browser localStorage and is deleted when you clear your browser cache.
        </p>
        <p>
          <strong>Database data:</strong> Authenticated data is retained until
          you delete your account. Analytics records are retained for 90 days.
        </p>

        <h2>7. International Transfers</h2>
        <p>
          Your data may be transferred to and processed in the United States and
          other countries where our service providers operate. We use standard
          contractual clauses where required.
        </p>

        <h2>8. Security</h2>
        <p>
          We use HTTPS for all traffic, bcrypt for password hashing, and Stripe
          webhook signature verification. While we strive to protect your data,
          no method of transmission over the internet is 100% secure.
        </p>

        <h2>9. Children's Privacy</h2>
        <p>
          The Service is not intended for children under 13. We do not knowingly
          collect data from children under 13.
        </p>

        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy. Significant changes will be notified
          via email or a notice on the Service.
        </p>

        <h2>11. Contact</h2>
        <p>
          For privacy questions or data requests, contact: privacy@Resumify.app
        </p>

        <hr className="my-8" />

        <p>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Resumify
          </Link>
        </p>
      </div>
    </div>
  )
}

