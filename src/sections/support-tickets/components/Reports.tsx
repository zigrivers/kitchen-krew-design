import { useState } from 'react'
import type {
  ReportsProps,
  DashboardMetrics,
  TicketPriority,
  TicketCategory,
  AgentPerformanceMetric,
  TrendDataPoint,
} from '@/../product/sections/support-tickets/types'

// =============================================================================
// Sub-components
// =============================================================================

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onChange: (start: string, end: string) => void
}

function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
  const presets = [
    { label: '7 days', days: 7 },
    { label: '14 days', days: 14 },
    { label: '30 days', days: 30 },
    { label: '90 days', days: 90 },
  ]

  const handlePreset = (days: number) => {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - days)
    onChange(start.toISOString().split('T')[0], end.toISOString().split('T')[0])
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => onChange(e.target.value, endDate)}
          className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
        />
        <span className="text-slate-400">to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onChange(startDate, e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
        />
      </div>
      <div className="flex gap-1">
        {presets.map(preset => (
          <button
            key={preset.days}
            onClick={() => handlePreset(preset.days)}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  )
}

interface ExportButtonProps {
  onExport: (format: 'csv' | 'pdf') => void
}

function ExportButton({ onExport }: ExportButtonProps) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {showMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-20 overflow-hidden">
            <button
              onClick={() => {
                onExport('csv')
                setShowMenu(false)
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Export as CSV
            </button>
            <button
              onClick={() => {
                onExport('pdf')
                setShowMenu(false)
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Export as PDF
            </button>
          </div>
        </>
      )}
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  suffix?: string
  change?: number
  changeLabel?: string
}

function StatCard({ label, value, suffix, change, changeLabel }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-slate-900 dark:text-white">{value}</span>
        {suffix && <span className="text-lg text-slate-400">{suffix}</span>}
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1 mt-2">
          <span className={`text-sm font-medium ${change >= 0 ? 'text-lime-600 dark:text-lime-400' : 'text-red-500'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          </span>
          {changeLabel && (
            <span className="text-xs text-slate-400">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  )
}

interface TrendChartProps {
  title: string
  data: TrendDataPoint[]
  dataKey: 'count' | 'score'
  color: string
  height?: number
}

function TrendChart({ title, data, dataKey, color, height = 160 }: TrendChartProps) {
  const values = data.map(d => dataKey === 'count' ? (d.count ?? 0) : (d.score ?? 0))
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1

  const colorMap: Record<string, { line: string; fill: string; dot: string }> = {
    lime: { line: 'stroke-lime-500', fill: 'fill-lime-500/10', dot: 'bg-lime-500' },
    sky: { line: 'stroke-sky-500', fill: 'fill-sky-500/10', dot: 'bg-sky-500' },
    amber: { line: 'stroke-amber-500', fill: 'fill-amber-500/10', dot: 'bg-amber-500' },
    violet: { line: 'stroke-violet-500', fill: 'fill-violet-500/10', dot: 'bg-violet-500' },
  }

  const colors = colorMap[color] || colorMap.lime

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * 100
    const y = height - 20 - ((v - min) / range) * (height - 40)
    return { x, y, value: v }
  })

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ')
  const areaD = `${pathD} L 100,${height - 20} L 0,${height - 20} Z`

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${colors.dot}`} />
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Avg: {(values.reduce((a, b) => a + b, 0) / values.length).toFixed(dataKey === 'score' ? 1 : 0)}
          </span>
        </div>
      </div>
      <div style={{ height }}>
        <svg viewBox={`0 0 100 ${height}`} className="w-full h-full" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(pct => (
            <line
              key={pct}
              x1="0"
              y1={20 + pct * (height - 40)}
              x2="100"
              y2={20 + pct * (height - 40)}
              className="stroke-slate-100 dark:stroke-slate-700"
              strokeWidth="0.5"
            />
          ))}
          {/* Area fill */}
          <path d={areaD} className={colors.fill} />
          {/* Line */}
          <path d={pathD} fill="none" className={colors.line} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Dots */}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3" className={`${colors.dot.replace('bg-', 'fill-')}`} />
          ))}
        </svg>
      </div>
      <div className="flex justify-between text-xs text-slate-400 mt-2">
        {data.filter((_, i) => i % 2 === 0 || i === data.length - 1).map((d, i) => (
          <span key={i}>{new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        ))}
      </div>
    </div>
  )
}

interface SlaComplianceTableProps {
  slaPerformance: DashboardMetrics['slaPerformance']
}

function SlaComplianceTable({ slaPerformance }: SlaComplianceTableProps) {
  const priorities: TicketPriority[] = ['urgent', 'high', 'normal', 'low']

  const priorityLabels: Record<TicketPriority, string> = {
    urgent: 'Urgent',
    high: 'High',
    normal: 'Normal',
    low: 'Low',
  }

  const getComplianceColor = (rate: number) => {
    if (rate >= 95) return 'text-lime-600 dark:text-lime-400 bg-lime-100 dark:bg-lime-900/30'
    if (rate >= 90) return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30'
    return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
  }

  const getBarColor = (rate: number) => {
    if (rate >= 95) return 'bg-lime-500'
    if (rate >= 90) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-white">SLA Compliance by Priority</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Priority</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Target</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Actual</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Compliance</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-48">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {priorities.map(priority => {
              const data = slaPerformance[priority]
              return (
                <tr key={priority} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-medium text-slate-900 dark:text-white">{priorityLabels[priority]}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {data.target}h
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {data.actual}h
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-sm font-semibold ${getComplianceColor(data.compliance)}`}>
                      {data.compliance}%
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getBarColor(data.compliance)} transition-all duration-700`}
                        style={{ width: `${data.compliance}%` }}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface CategoryBreakdownProps {
  categories: DashboardMetrics['ticketsByCategory']
}

function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  const total = Object.values(categories).reduce((sum, count) => sum + count, 0)

  const categoryConfig: Record<TicketCategory, { label: string; color: string; bgColor: string }> = {
    account: { label: 'Account', color: 'bg-sky-500', bgColor: 'bg-sky-100 dark:bg-sky-900/30' },
    billing: { label: 'Billing', color: 'bg-lime-500', bgColor: 'bg-lime-100 dark:bg-lime-900/30' },
    technical: { label: 'Technical', color: 'bg-violet-500', bgColor: 'bg-violet-100 dark:bg-violet-900/30' },
    event: { label: 'Event', color: 'bg-amber-500', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
    abuse: { label: 'Abuse', color: 'bg-red-500', bgColor: 'bg-red-100 dark:bg-red-900/30' },
    feature_request: { label: 'Feature Request', color: 'bg-indigo-500', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30' },
  }

  const sortedCategories = (Object.entries(categories) as [TicketCategory, number][])
    .sort((a, b) => b[1] - a[1])

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-5">Tickets by Category</h3>

      {/* Donut Chart Visualization */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative w-32 h-32 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            {(() => {
              let offset = 0
              return sortedCategories.map(([cat, count]) => {
                const pct = (count / total) * 100
                const dashArray = `${pct} ${100 - pct}`
                const element = (
                  <circle
                    key={cat}
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    className={categoryConfig[cat].color.replace('bg-', 'stroke-')}
                    strokeWidth="4"
                    strokeDasharray={dashArray}
                    strokeDashoffset={-offset}
                  />
                )
                offset += pct
                return element
              })
            })()}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{total}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">total</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {sortedCategories.map(([cat, count]) => (
            <div key={cat} className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full shrink-0 ${categoryConfig[cat].color}`} />
              <span className="flex-1 text-sm text-slate-600 dark:text-slate-300">{categoryConfig[cat].label}</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">{count}</span>
              <span className="text-xs text-slate-400 w-10 text-right">{((count / total) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface AgentPerformanceTableProps {
  agents: AgentPerformanceMetric[]
  onViewAgent?: (agentId: string) => void
}

function AgentPerformanceTable({ agents, onViewAgent }: AgentPerformanceTableProps) {
  const sortedAgents = [...agents].sort((a, b) => b.ticketsResolved - a.ticketsResolved)

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-lime-600 dark:text-lime-400'
    if (score >= 4.0) return 'text-amber-600 dark:text-amber-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getComplianceColor = (rate: number) => {
    if (rate >= 95) return 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400'
    if (rate >= 90) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-white">Agent Performance</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Agent</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Resolved</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Avg Response</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Satisfaction</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">SLA Compliance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {sortedAgents.map((agent, index) => (
              <tr
                key={agent.agentId}
                onClick={() => onViewAgent?.(agent.agentId)}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      index === 1 ? 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300' :
                      index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                      'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
                      {agent.name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="text-lg font-semibold text-slate-900 dark:text-white">{agent.ticketsResolved}</span>
                </td>
                <td className="px-5 py-4 text-right text-sm text-slate-600 dark:text-slate-300">
                  {agent.averageResponseTime} min
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className={`font-semibold ${getScoreColor(agent.satisfactionScore)}`}>
                      {agent.satisfactionScore.toFixed(1)}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-sm font-semibold ${getComplianceColor(agent.slaCompliance)}`}>
                    {agent.slaCompliance}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function Reports({
  metrics,
  dateRange,
  onDateRangeChange,
  onExport,
  onViewAgent,
}: ReportsProps) {
  const { overview, ticketsByCategory, slaPerformance, trends, agentPerformance } = metrics

  // Calculate some derived metrics
  const totalResolved = agentPerformance.reduce((sum, a) => sum + a.ticketsResolved, 0)
  const avgSatisfaction = agentPerformance.reduce((sum, a) => sum + a.satisfactionScore, 0) / agentPerformance.length
  const avgSlaCompliance = agentPerformance.reduce((sum, a) => sum + a.slaCompliance, 0) / agentPerformance.length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Support Reports
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Analyze performance metrics and identify trends
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <DateRangePicker
              startDate={dateRange.start}
              endDate={dateRange.end}
              onChange={(start, end) => onDateRangeChange?.(start, end)}
            />
            <ExportButton onExport={(format) => onExport?.(format)} />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Tickets Resolved"
            value={totalResolved}
            change={12}
            changeLabel="vs last period"
          />
          <StatCard
            label="Avg First Response"
            value={overview.averageFirstResponse}
            suffix="min"
            change={-8}
            changeLabel="faster"
          />
          <StatCard
            label="Avg Resolution Time"
            value={overview.averageResolutionTime}
            suffix="hrs"
            change={-15}
            changeLabel="faster"
          />
          <StatCard
            label="Overall SLA Compliance"
            value={avgSlaCompliance.toFixed(1)}
            suffix="%"
            change={2}
            changeLabel="improvement"
          />
        </div>

        {/* Trend Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <TrendChart
            title="Tickets Created vs Resolved"
            data={trends.ticketsCreated}
            dataKey="count"
            color="lime"
          />
          <TrendChart
            title="Customer Satisfaction Trend"
            data={trends.satisfaction}
            dataKey="score"
            color="amber"
          />
        </div>

        {/* SLA & Categories */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <SlaComplianceTable slaPerformance={slaPerformance} />
          <CategoryBreakdown categories={ticketsByCategory} />
        </div>

        {/* Agent Performance */}
        <AgentPerformanceTable
          agents={agentPerformance}
          onViewAgent={onViewAgent}
        />
      </div>
    </div>
  )
}
