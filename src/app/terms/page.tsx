import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Terms of Service — Resumify' }

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="prose prose-neutral max-w-none">
        <h1>Terms of Service</h1>
        <p className="text-sm text-gray-500">
          Effective Date: August 30, 2026
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using Resumify (&quot;the Service&quot;, &quot;we&quot;, &quot;us&quot;, or
          &quot;our&quot;), you (&quot;you&quot;) agree to be bound by these Terms of Service.
          If you do not agree to these terms, you may not use the Service.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          Resumify is an online resume-builder application that provides tools for
          creating, editing, storing, and exporting professional resumes. We reserve the
          right to modify, suspend, or discontinue the Service at any time without
          liability to you.
        </p>

        <h2>3. User Account</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account
          credentials and for all activities that occur under your account. You agree
          to notify us immediately of any unauthorized use of your account.
        </p>

        <h2>4. Subscriptions and Billing</h2>
        <p>
          The Service offers a free tier and a paid &quot;Pro&quot; subscription tier
          billed monthly via Stripe. All payments are processed by Stripe. You may
          cancel your subscription at any time through your account settings.
          Cancellations take effect at the end of the current billing period. We do
          not provide refunds for partial billing periods, except as required by law.
        </p>

        <h2>5. License</h2>
        <p>
          The resume content you create remains your property. You grant us a
          non-exclusive license to store and display your content solely for
          providing the Service. The Service software itself is licensed under the
          MIT License.
        </p>

        <h2>6. Prohibited Conduct</h2>
        <p>
          You agree not to use the Service to upload viruses, scrape data, spam,
          harass, or violate any law. You may not reverse engineer, decompile, or
          attempt to extract source code from the Service.
        </p>

        <h2>7. AI Feature Disclaimer</h2>
        <p>
          Some features use third-party AI models (Anthropic Claude). AI-generated
          content may be factually incorrect or biased. You should verify all
          AI-generated content before using it in your resume. We are not responsible
          for the accuracy of AI-generated content.
        </p>

        <h2>8. Disclaimers</h2>
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS
          OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR
          ERROR-FREE.
        </p>

        <h2>9. Limitation of Liability</h2>
        <p>
          IN NO EVENT SHALL Resumify BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
          SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF YOUR USE OF
          THE SERVICE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY THEREOF.
        </p>

        <h2>10. Governing Law</h2>
        <p>
          These Terms are governed by the laws of the jurisdiction in which you
          reside, without regard to conflict of law principles.
        </p>

        <h2>11. Changes to Terms</h2>
        <p>
          We may revise these Terms from time to time. Continued use of the Service
          after any revision constitutes acceptance of the revised terms. Material
          changes will be communicated via email or notice on the Service.
        </p>

        <h2>12. Contact</h2>
        <p>
          For questions about these Terms, please contact: legal@Resumify.app
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

