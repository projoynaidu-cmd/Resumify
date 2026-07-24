'use client'

import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { Eye, TrendingUp, FileText, Star } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/utils'
import type { ResumeAnalyticsSummary } from '@/lib/analytics'

interface Props {
  data: ResumeAnalyticsSummary[]
}

export function AnalyticsDashboard({ data }: Props) {
  const totalViews = data.reduce((sum, r) => sum + r.totalViews, 0)
  const last30Views = data.reduce((sum, r) => sum + r.last30DayViews, 0)
  const publicResumes = data.filter((r) => r.isPublic).length
  const avgAts = (() => {
    const scores = data.map((r) => r.latestAtsScore).filter((s): s is number => s !== null)
    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
  })()

  // Aggregate views per day across all resumes
  const allDaysMap = new Map<string, number>()
  for (const resume of data) {
    for (const { date, views } of resume.viewsPerDay) {
      allDaysMap.set(date, (allDaysMap.get(date) ?? 0) + views)
    }
  }
  const aggregateViews = Array.from(allDaysMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, views]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views,
    }))

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-7">
        <h1 className="font-serif text-2xl font-bold text-[var(--text)]">Analytics</h1>
        <p className="text-sm text-[var(--text3)] mt-1">
          Resume performance over the last 30 days
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Eye size={18} />}
          label="Total Views"
          value={totalViews.toLocaleString()}
          sub="all time"
        />
        <StatCard
          icon={<TrendingUp size={18} />}
          label="Last 30 Days"
          value={last30Views.toLocaleString()}
          sub="views"
          highlight
        />
        <StatCard
          icon={<FileText size={18} />}
          label="Public Resumes"
          value={String(publicResumes)}
          sub={`of ${data.length} total`}
        />
        <StatCard
          icon={<Star size={18} />}
          label="Avg ATS Score"
          value={avgAts !== null ? `${avgAts}/100` : '—'}
          sub={avgAts !== null ? (avgAts >= 75 ? 'Strong' : avgAts >= 50 ? 'Average' : 'Needs work') : 'Run ATS check'}
        />
      </div>

      {/* Aggregate views chart */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] p-5 mb-6">
        <h2 className="font-semibold text-[var(--text)] mb-4 text-[0.95rem]">
          Views over time (all resumes)
        </h2>
        {last30Views === 0 ? (
          <EmptyChart message="No views yet. Share your public resume link to start tracking." />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={aggregateViews} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="viewGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: 'var(--text3)' }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--text3)' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="var(--accent)"
                strokeWidth={2}
                fill="url(#viewGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Per-resume breakdown */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h2 className="font-semibold text-[var(--text)] text-[0.95rem]">Resume breakdown</h2>
        </div>
        {data.length === 0 ? (
          <div className="p-8 text-center text-sm text-[var(--text3)]">
            No resumes yet. Create one to start tracking analytics.
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {data.map((resume) => (
              <ResumeRow key={resume.resumeId} resume={resume} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  highlight = false,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius)] border p-4',
        highlight
          ? 'border-[var(--accent)] bg-[var(--accent-bg)]'
          : 'border-[var(--border)] bg-[var(--surface)]',
      )}
    >
      <div
        className={cn(
          'w-9 h-9 rounded-[8px] grid place-items-center mb-3',
          highlight
            ? 'bg-[var(--accent)] text-white'
            : 'bg-[var(--surface2)] text-[var(--accent)]',
        )}
      >
        {icon}
      </div>
      <div className="text-2xl font-bold text-[var(--text)] mb-0.5">{value}</div>
      <div className="text-[0.72rem] font-medium text-[var(--text2)]">{label}</div>
      <div className="text-[0.7rem] text-[var(--text3)] mt-0.5">{sub}</div>
    </div>
  )
}

function ResumeRow({ resume }: { resume: ResumeAnalyticsSummary }) {
  const maxViews = Math.max(...resume.viewsPerDay.map((d) => d.views), 1)

  return (
    <div className="px-5 py-4 flex items-center gap-4 flex-wrap sm:flex-nowrap">
      {/* Title + badges */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-[0.88rem] text-[var(--text)] truncate">
            {resume.title}
          </span>
          {resume.isPublic && (
            <Badge variant="accent" className="flex-shrink-0">Public</Badge>
          )}
          {resume.latestAtsScore !== null && (
            <Badge
              variant={
                resume.latestAtsScore >= 75
                  ? 'success'
                  : resume.latestAtsScore >= 50
                  ? 'warning'
                  : 'danger'
              }
              className="flex-shrink-0"
            >
              ATS {resume.latestAtsScore}
            </Badge>
          )}
        </div>
        <div className="text-[0.72rem] text-[var(--text3)] mt-0.5">
          {resume.totalViews} total views · {resume.last30DayViews} in last 30 days
        </div>
      </div>

      {/* Mini sparkline */}
      <div className="flex-shrink-0 w-[100px] h-[32px] flex items-end gap-px">
        {resume.viewsPerDay.slice(-14).map(({ date, views }) => (
          <div
            key={date}
            title={`${date}: ${views} views`}
            className="flex-1 rounded-sm bg-[var(--accent)] opacity-80"
            style={{ height: `${Math.max(10, (views / maxViews) * 100)}%` }}
          />
        ))}
      </div>
    </div>
  )
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="h-[200px] flex items-center justify-center">
      <p className="text-sm text-[var(--text3)] text-center max-w-xs">{message}</p>
    </div>
  )
}
