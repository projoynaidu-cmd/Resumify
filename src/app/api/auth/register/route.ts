export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { registerSchema } from '@/lib/schemas'
import { generateSlug } from '@/utils'
import { authRateLimiter, getClientIp } from '@/lib/rate-limit'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req)
    const limit = authRateLimiter.check(ip)

    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((limit.reset - Date.now()) / 1000).toString(),
          },
        },
      )
    }

    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const { name, email, password } = parsed.data

    // Check existing user
    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 },
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: { id: true, name: true, email: true },
    })

    // Create a default starter resume
    await db.resume.create({
      data: {
        userId: user.id,
        title: 'My First Resume',
        slug: generateSlug(),
        data: {},
      },
    })

    // Send welcome email (non-blocking — don't fail registration if email fails)
    sendWelcomeEmail(user.email, user.name ?? '').catch((err) =>
      console.error('[Register] Email send failed:', err),
    )

    return NextResponse.json(
      { message: 'Account created successfully', userId: user.id },
      { status: 201 },
    )
  } catch (err) {
    console.error('[Register] Error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
