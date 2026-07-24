'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'
import {
  Users, CreditCard, FileText, Bot,
  Eye, TrendingUp, Sparkles, AlertTriangle,
} from 'lucide-react'
import { cn } from '@/utils'
import type { AdminStats } from '@/lib/analytics'

interface Props {
  stats: AdminStats
  growth: { date: string; users: number }[]
}

export function AdminDashboard({ stats, growth }: Props) {
  // Format growth data for chart — show last 14 day labels
  const chartData = growth.map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    users: d.users,
  }))

  const totalNewUsers30 = growth.reduce((sum, d) => sum + d.users, 0)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-7">
        <h1 className="font-serif text-2xl font-bold text-[var(--text)]">
          Admin Dashboard
        </h1>
        <p className="text-sm text-[var(--text3)] mt-1">Platform overview</p>
      </div>

      {/* Key metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <AdminStatCard
          icon={<Users size={18} />}
          label="Total Users"
          value={stats.totalUsers.toLocaleString()}
          sub={`${stats.newUsersLast7Days} this week`}
        />
        <AdminStatCard
          icon={<CreditCard size={18} />}
          label="Pro Users"
          value={stats.proUsers.toLocaleString()}
          sub={`${stats.conversionRate}% conversion`}
          highlight
        />
        <AdminStatCard
          icon={<FileText size={18} />}
          label="Resumes"
          value={stats.totalResumes.toLocaleString()}
          sub={`${stats.publicResumes} public`}
        />
        <AdminStatCard
          icon={<Bot size={18} />}
          label="AI Calls"
          value={stats.totalAiCalls.toLocaleString()}
          sub="total generated"
        />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <AdminStatCard
          icon={<Eye size={18} />}
          label="Resume Views"
          value={stats.totalViews.toLocaleString()}
          sub="public resume views"
        />
        <AdminStatCard
          icon={<TrendingUp size={18} />}
          label="New (30 days)"
          value={totalNewUsers30.toLocaleString()}
          sub="new signups"
        />
        <AdminStatCard
          icon={<Sparkles size={18} />}
          label="Free Users"
          value={stats.freeUsers.toLocaleString()}
          sub="upgrade opportunities"
        />
      </div>

      {/* Conversion alert */}
      {stats.conversionRate < 5 && stats.totalUsers > 10 && (
        <div className="flex items-start gap-3 bg-[#fef3e2] border border-[#fddba8] rounded-[var(--radius)] px-4 py-3 mb-6">
          <AlertTriangle size={16} className="text-[#854d0e] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#854d0e]">
              Conversion rate below 5%
            </p>
            <p className="text-xs text-[#92400e] mt-0.5">
              Consider reviewing the Pro plan pricing, paywall triggers, or adding a trial period.
            </p>
          </div>
        </div>
      )}

      {/* User growth chart */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] p-5 mb-6">
        <h2 className="font-semibold text-[var(--text)] mb-4 text-[0.95rem]">
          New users — last 30 days
        </h2>
        {totalNewUsers30 === 0 ? (
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-sm text-[var(--text3)]">No signups in the last 30 days.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
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
              <Bar dataKey="users" fill="var(--accent)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Plan split */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] p-5">
        <h2 className="font-semibold text-[var(--text)] mb-4 text-[0.95rem]">
          Plan distribution
        </h2>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-5 rounded-full bg-[var(--border)] overflow-hidden">
            <div
              className="h-full bg-[var(--accent)] rounded-full transition-all duration-700"
              style={{ width: `${stats.conversionRate}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-[var(--text)] min-w-[36px] text-right">
            {stats.conversionRate}%
          </span>
        </div>
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--accent)]" />
            <span className="text-[var(--text2)]">Pro: {stats.proUsers}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--border)]" />
            <span className="text-[var(--text2)]">Free: {stats.freeUsers}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminStatCard({
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
