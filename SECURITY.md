# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly.
**Do not open a public GitHub issue.**

### Preferred method: GitHub Security Advisory
1. Go to the [Security Advisories](https://github.com/joinvnexus/Resumify/security/advisories) tab.
2. Click "Report a Vulnerability" and fill out the form.

### Alternative: Email
Send details to **`security@Resumify.app`** with:
- A description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Your PGP key (optional, for sensitive details)

You will receive an acknowledgment within **24 hours** and a preliminary
assessment within **72 hours**. We will work with you to validate, fix, and
disclose the issue in coordination.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | ✅ Security fixes and patches |
| < 2.0   | ❌ No support       |

## Security Best Practices for Contributors

- **Never commit `.env.local`** — all secrets must live in environment variables
- **Never commit production secrets** — rotate any key that is accidentally exposed
- **Sanitize all user input** — HTML uploads must use DOMPurify before `innerHTML`
- **Validate all API inputs** — use Zod schemas on every route handler
- **Verify Stripe webhooks** — always use `stripe.webhooks.constructEvent()`
- **Hash passwords** — always use `bcrypt.hash(password, 12)`
- **Check ownership** — every database mutation must verify `userId` matches the session

## Security Scanning

Dependabot is enabled on this repository. Security advisories from npm
(`npm audit`) should be reviewed and addressed promptly.

