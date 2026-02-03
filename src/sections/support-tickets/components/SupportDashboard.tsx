import type {
  SupportDashboardProps,
  Ticket,
  SupportAgent,
  TicketCategory,
  TicketPriority,
  TrendDataPoint,
} from '@/../product/sections/support-tickets/types'

// =============================================================================
// Sub-components
// =============================================================================

interface MetricCardProps {
  label: string
  value: string | number
  subtext?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  variant?: 'default' | 'warning' | 'success'
}

function MetricCard({ label, value, subtext, trend, trendValue, variant = 'default' }: MetricCardProps) {
  const variantStyles = {
    default: 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    warning: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
    success: 'bg-lime-50 dark:bg-lime-950/30 border-lime-200 dark:border-lime-800',
  }

  return (
    <div className={`rounded-xl border p-5 ${variantStyles[variant]}`}>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <div className="flex items-end gap-2">
        <p className="text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">{value}</p>
        {trend && trendValue && (
          <span className={`text-sm font-medium mb-1 ${
            trend === 'up' ? 'text-lime-600 dark:text-lime-400' :
            trend === 'down' ? 'text-red-500' : 'text-slate-400'
          }`}>
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {trendValue}
          </span>
        )}
      </div>
      {subtext && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtext}</p>
      )}
    </div>
  )
}

interface MiniSparklineProps {
  data: TrendDataPoint[]
  height?: number
  color?: string
}

function MiniSparkline({ data, height = 40, color = 'lime' }: MiniSparklineProps) {
  const values = data.map(d => d.count ?? d.score ?? 0)
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * 100
    const y = height - ((v - min) / range) * (height - 8) - 4
    return `${x},${y}`
  }).join(' ')

  const colorMap: Record<string, { stroke: string; fill: string }> = {
    lime: { stroke: 'stroke-lime-500', fill: 'fill-lime-500/20' },
    sky: { stroke: 'stroke-sky-500', fill: 'fill-sky-500/20' },
    amber: { stroke: 'stroke-amber-500', fill: 'fill-amber-500/20' },
  }

  const { stroke, fill } = colorMap[color] || colorMap.lime

  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        className={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon
        points={`0,${height} ${points} 100,${height}`}
        className={fill}
      />
    </svg>
  )
}

interface CategoryBarProps {
  categories: Record<TicketCategory, number>
}

function CategoryBar({ categories }: CategoryBarProps) {
  const total = Object.values(categories).reduce((sum, count) => sum + count, 0)

  const categoryConfig: Record<TicketCategory, { label: string; color: string }> = {
    account: { label: 'Account', color: 'bg-sky-500' },
    billing: { label: 'Billing', color: 'bg-lime-500' },
    technical: { label: 'Technical', color: 'bg-violet-500' },
    event: { label: 'Event', color: 'bg-amber-500' },
    abuse: { label: 'Abuse', color: 'bg-red-500' },
    feature_request: { label: 'Feature', color: 'bg-slate-400' },
  }

  return (
    <div className="space-y-3">
      <div className="flex h-3 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700">
        {(Object.entries(categories) as [TicketCategory, number][]).map(([cat, count]) => (
          <div
            key={cat}
            className={`${categoryConfig[cat].color} transition-all duration-500`}
            style={{ width: `${(count / total) * 100}%` }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {(Object.entries(categories) as [TicketCategory, number][]).map(([cat, count]) => (
          <div key={cat} className="flex items-center gap-1.5 text-xs">
            <span className={`w-2 h-2 rounded-full ${categoryConfig[cat].color}`} />
            <span className="text-slate-600 dark:text-slate-300">{categoryConfig[cat].label}</span>
            <span className="text-slate-400 dark:text-slate-500">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface SlaGaugeProps {
  priority: TicketPriority
  target: number
  actual: number
  compliance: number
}

function SlaGauge({ priority, target, actual, compliance }: SlaGaugeProps) {
  const priorityLabels: Record<TicketPriority, string> = {
    urgent: 'Urgent',
    high: 'High',
    normal: 'Normal',
    low: 'Low',
  }

  const getComplianceColor = (rate: number) => {
    if (rate >= 95) return 'text-lime-600 dark:text-lime-400'
    if (rate >= 90) return 'text-amber-500'
    return 'text-red-500'
  }

  const getBarColor = (rate: number) => {
    if (rate >= 95) return 'bg-lime-500'
    if (rate >= 90) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <div className="flex items-center gap-4">
      <div className="w-16 text-sm font-medium text-slate-700 dark:text-slate-300">
        {priorityLabels[priority]}
      </div>
      <div className="flex-1">
        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${getBarColor(compliance)} transition-all duration-700 ease-out`}
            style={{ width: `${compliance}%` }}
          />
        </div>
      </div>
      <div className={`w-12 text-right text-sm font-semibold ${getComplianceColor(compliance)}`}>
        {compliance}%
      </div>
      <div className="w-20 text-xs text-slate-500 dark:text-slate-400 text-right">
        {actual}h / {target}h
      </div>
    </div>
  )
}

interface AgentWorkloadCardProps {
  agent: SupportAgent
  onClick?: () => void
}

function AgentWorkloadCard({ agent, onClick }: AgentWorkloadCardProps) {
  const utilizationPct = (agent.currentTickets / agent.maxTickets) * 100

  const getUtilizationColor = (pct: number) => {
    if (pct >= 100) return 'bg-red-500'
    if (pct >= 80) return 'bg-amber-500'
    return 'bg-lime-500'
  }

  const getStatusColor = (status: SupportAgent['status']) => {
    switch (status) {
      case 'online': return 'bg-lime-500'
      case 'away': return 'bg-amber-500'
      case 'offline': return 'bg-slate-300 dark:bg-slate-600'
    }
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-lime-300 dark:hover:border-lime-600 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          {agent.avatarUrl ? (
            <img
              src={agent.avatarUrl}
              alt={agent.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {agent.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${getStatusColor(agent.status)}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-slate-900 dark:text-white truncate group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
              {agent.name}
            </p>
            {agent.isOnVacation && (
              <span className="shrink-0 text-xs px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400">
                OOO
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{agent.role}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            {agent.currentTickets}
            <span className="text-sm font-normal text-slate-400">/{agent.maxTickets}</span>
          </p>
        </div>
      </div>
      <div className="mt-3">
        <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${getUtilizationColor(utilizationPct)} transition-all duration-500`}
            style={{ width: `${Math.min(utilizationPct, 100)}%` }}
          />
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{agent.ticketsResolvedToday} resolved today</span>
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {agent.satisfactionScore.toFixed(1)}
        </span>
      </div>
    </button>
  )
}

interface RecentTicketRowProps {
  ticket: Ticket
  onClick?: () => void
}

function RecentTicketRow({ ticket, onClick }: RecentTicketRowProps) {
  const priorityConfig: Record<TicketPriority, { label: string; className: string }> = {
    urgent: { label: 'Urgent', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    high: { label: 'High', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    normal: { label: 'Normal', className: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
    low: { label: 'Low', className: 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400' },
  }

  const slaConfig: Record<Ticket['slaStatus'], { icon: string; className: string }> = {
    on_track: { icon: '●', className: 'text-lime-500' },
    at_risk: { icon: '●', className: 'text-amber-500' },
    breached: { icon: '●', className: 'text-red-500' },
  }

  const categoryLabels: Record<TicketCategory, string> = {
    account: 'Account',
    billing: 'Billing',
    technical: 'Technical',
    event: 'Event',
    abuse: 'Abuse',
    feature_request: 'Feature',
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group border-b border-slate-100 dark:border-slate-800 last:border-0"
    >
      <div className="flex items-start gap-3">
        <span className={`mt-1 text-xs ${slaConfig[ticket.slaStatus].className}`}>
          {slaConfig[ticket.slaStatus].icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
              {ticket.ticketNumber}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${priorityConfig[ticket.priority].className}`}>
              {priorityConfig[ticket.priority].label}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {categoryLabels[ticket.category]}
            </span>
          </div>
          <p className="font-medium text-slate-900 dark:text-white truncate group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
            {ticket.subject}
          </p>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
            <span>{ticket.user.name}</span>
            <span>·</span>
            <span>{formatTime(ticket.updatedAt)}</span>
            {ticket.isStarred && (
              <>
                <span>·</span>
                <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </>
            )}
          </div>
        </div>
        <svg
          className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-lime-500 dark:group-hover:text-lime-400 transition-colors shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function SupportDashboard({
  metrics,
  recentTickets,
  agents,
  onViewTicket,
  onViewAgent,
  onRefresh,
}: SupportDashboardProps) {
  const { overview, ticketsByCategory, slaPerformance, trends } = metrics

  // Sort agents by current workload (descending)
  const sortedAgents = [...agents].sort((a, b) => {
    if (a.isOnVacation && !b.isOnVacation) return 1
    if (!a.isOnVacation && b.isOnVacation) return -1
    return (b.currentTickets / b.maxTickets) - (a.currentTickets / a.maxTickets)
  })

  // Get urgent tickets that need attention
  const urgentTickets = recentTickets.filter(t =>
    t.slaStatus === 'breached' || t.priority === 'urgent'
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Support Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Monitor tickets, SLA compliance, and team performance
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-lime-300 dark:hover:border-lime-600 transition-all text-sm font-medium shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="Open Tickets"
            value={overview.openTickets}
            subtext={`${overview.awaitingResponse} awaiting response`}
          />
          <MetricCard
            label="Urgent Unresolved"
            value={overview.unresolvedUrgent}
            variant={overview.unresolvedUrgent > 0 ? 'warning' : 'default'}
          />
          <MetricCard
            label="SLA Compliance"
            value={`${overview.slaComplianceRate}%`}
            trend={overview.slaComplianceRate >= 95 ? 'up' : 'down'}
            trendValue={overview.slaComplianceRate >= 95 ? 'On target' : 'Below target'}
            variant={overview.slaComplianceRate >= 95 ? 'success' : 'warning'}
          />
          <MetricCard
            label="Satisfaction"
            value={overview.satisfactionScore.toFixed(1)}
            subtext="out of 5.0"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Ticket Trends */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Ticket Volume
              </h2>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-lime-500 rounded" />
                  <span className="text-slate-500 dark:text-slate-400">Created</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-sky-500 rounded" />
                  <span className="text-slate-500 dark:text-slate-400">Resolved</span>
                </span>
              </div>
            </div>
            <div className="h-32">
              <MiniSparkline data={trends.ticketsCreated} height={120} color="lime" />
            </div>
            <div className="h-32 -mt-24 opacity-60">
              <MiniSparkline data={trends.ticketsResolved} height={120} color="sky" />
            </div>
            <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-2 px-1">
              {trends.ticketsCreated.slice(0, 7).map((d, i) => (
                <span key={i}>{new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
              ))}
            </div>
          </div>

          {/* Satisfaction Trend */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Satisfaction Trend
            </h2>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">
                {overview.satisfactionScore.toFixed(1)}
              </span>
              <span className="text-slate-400">/5</span>
              <div className="flex ml-auto">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${star <= Math.round(overview.satisfactionScore) ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <div className="h-16">
              <MiniSparkline
                data={trends.satisfaction.map(d => ({ ...d, count: (d.score ?? 0) * 20 }))}
                height={60}
                color="amber"
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* SLA Performance */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
              SLA Performance
            </h2>
            <div className="space-y-4">
              {(Object.entries(slaPerformance) as [TicketPriority, typeof slaPerformance.urgent][]).map(([priority, data]) => (
                <SlaGauge
                  key={priority}
                  priority={priority}
                  target={data.target}
                  actual={data.actual}
                  compliance={data.compliance}
                />
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
              Tickets by Category
            </h2>
            <CategoryBar categories={ticketsByCategory} />

            {/* Avg Response & Resolution Times */}
            <div className="grid grid-cols-2 gap-6 mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Avg First Response</p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {overview.averageFirstResponse}
                  <span className="text-sm font-normal text-slate-400 ml-1">minutes</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Avg Resolution Time</p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {overview.averageResolutionTime}
                  <span className="text-sm font-normal text-slate-400 ml-1">hours</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Tickets */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Recent Tickets
              </h2>
              {urgentTickets.length > 0 && (
                <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                  {urgentTickets.length} need attention
                </span>
              )}
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {recentTickets.slice(0, 6).map(ticket => (
                <RecentTicketRow
                  key={ticket.id}
                  ticket={ticket}
                  onClick={() => onViewTicket?.(ticket.id)}
                />
              ))}
            </div>
          </div>

          {/* Team Workload */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Team Workload
              </h2>
            </div>
            <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
              {sortedAgents.map(agent => (
                <AgentWorkloadCard
                  key={agent.id}
                  agent={agent}
                  onClick={() => onViewAgent?.(agent.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
