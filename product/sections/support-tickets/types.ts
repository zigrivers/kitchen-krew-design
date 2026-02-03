// =============================================================================
// Support Tickets - Data Types
// =============================================================================

export type TicketCategory =
  | 'account'
  | 'billing'
  | 'technical'
  | 'event'
  | 'abuse'
  | 'feature_request'

export type TicketPriority = 'urgent' | 'high' | 'normal' | 'low'

export type TicketStatus =
  | 'open'
  | 'awaiting_response'
  | 'escalated'
  | 'resolved'
  | 'closed'

export type SlaStatus = 'on_track' | 'at_risk' | 'breached'

export type ResolutionType =
  | 'solved'
  | 'duplicate'
  | 'cannot_reproduce'
  | 'wont_fix'
  | 'feature_shipped'

export type MessageType = 'user' | 'agent' | 'internal'

export type AgentStatus = 'online' | 'away' | 'offline'

// =============================================================================
// Core Entities
// =============================================================================

export interface Attachment {
  id: string
  name: string
  type: string
  size: number
  url: string
}

export interface Message {
  id: string
  type: MessageType
  content: string
  createdAt: string
  authorId?: string
  authorName?: string
  attachments: Attachment[]
}

export interface TicketUser {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  accountStatus: 'active' | 'suspended' | 'deleted'
  memberSince: string
  totalTickets: number
  lastTicketAt: string | null
}

export interface Satisfaction {
  rating: 1 | 2 | 3 | 4 | 5
  comment: string
  submittedAt: string
}

export interface Ticket {
  id: string
  ticketNumber: string
  subject: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  createdAt: string
  updatedAt: string
  slaDeadline: string
  slaStatus: SlaStatus
  firstResponseAt: string | null
  resolvedAt: string | null
  resolutionType?: ResolutionType
  assignedTo: string | null
  isStarred: boolean
  user: TicketUser
  messages: Message[]
  relatedTickets: string[]
  satisfaction?: Satisfaction
}

export interface SupportAgent {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  role: string
  status: AgentStatus
  specializations: TicketCategory[]
  currentTickets: number
  maxTickets: number
  ticketsResolvedToday: number
  averageResponseTime: number
  satisfactionScore: number
  isOnVacation: boolean
  vacationUntil?: string
}

export interface CannedResponse {
  id: string
  title: string
  category: TicketCategory | 'general'
  content: string
  usageCount: number
  lastUsed: string
  createdBy: string
  tags: string[]
}

// =============================================================================
// Dashboard Metrics
// =============================================================================

export interface OverviewMetrics {
  openTickets: number
  unresolvedUrgent: number
  awaitingResponse: number
  averageFirstResponse: number
  averageResolutionTime: number
  slaComplianceRate: number
  satisfactionScore: number
}

export interface SlaPerformanceMetric {
  target: number
  actual: number
  compliance: number
}

export interface TrendDataPoint {
  date: string
  count?: number
  score?: number
}

export interface AgentPerformanceMetric {
  agentId: string
  name: string
  ticketsResolved: number
  averageResponseTime: number
  satisfactionScore: number
  slaCompliance: number
}

export interface DashboardMetrics {
  overview: OverviewMetrics
  ticketsByStatus: Record<TicketStatus, number>
  ticketsByCategory: Record<TicketCategory, number>
  ticketsByPriority: Record<TicketPriority, number>
  slaPerformance: Record<TicketPriority, SlaPerformanceMetric>
  trends: {
    ticketsCreated: TrendDataPoint[]
    ticketsResolved: TrendDataPoint[]
    satisfaction: TrendDataPoint[]
  }
  agentPerformance: AgentPerformanceMetric[]
}

// =============================================================================
// Component Props
// =============================================================================

export interface SupportDashboardProps {
  /** Dashboard metrics and statistics */
  metrics: DashboardMetrics
  /** Recent tickets to display */
  recentTickets: Ticket[]
  /** Support agents with workload info */
  agents: SupportAgent[]
  /** Called when user clicks on a ticket */
  onViewTicket?: (ticketId: string) => void
  /** Called when user clicks on an agent */
  onViewAgent?: (agentId: string) => void
  /** Called when user wants to refresh metrics */
  onRefresh?: () => void
}

export interface TicketQueueProps {
  /** List of tickets to display */
  tickets: Ticket[]
  /** Available support agents for assignment */
  agents: SupportAgent[]
  /** Called when user wants to view a ticket */
  onViewTicket?: (ticketId: string) => void
  /** Called when user assigns a ticket to an agent */
  onAssign?: (ticketId: string, agentId: string) => void
  /** Called when user changes ticket priority */
  onChangePriority?: (ticketId: string, priority: TicketPriority) => void
  /** Called when user stars/unstars a ticket */
  onToggleStar?: (ticketId: string) => void
  /** Called when user merges duplicate tickets */
  onMerge?: (ticketIds: string[]) => void
  /** Called when user applies bulk action */
  onBulkAction?: (ticketIds: string[], action: string) => void
}

export interface TicketDetailProps {
  /** The ticket to display */
  ticket: Ticket
  /** Available support agents for assignment */
  agents: SupportAgent[]
  /** Canned responses for quick replies */
  cannedResponses: CannedResponse[]
  /** Called when user sends a reply */
  onReply?: (ticketId: string, content: string, isInternal: boolean) => void
  /** Called when user assigns the ticket */
  onAssign?: (ticketId: string, agentId: string) => void
  /** Called when user escalates the ticket */
  onEscalate?: (ticketId: string, reason: string) => void
  /** Called when user changes priority */
  onChangePriority?: (ticketId: string, priority: TicketPriority) => void
  /** Called when user resolves the ticket */
  onResolve?: (ticketId: string, resolutionType: ResolutionType) => void
  /** Called when user closes the ticket */
  onClose?: (ticketId: string) => void
  /** Called when user merges with another ticket */
  onMerge?: (ticketId: string, targetTicketId: string) => void
  /** Called when user stars/unstars the ticket */
  onToggleStar?: (ticketId: string) => void
  /** Called when user views a related ticket */
  onViewRelated?: (ticketId: string) => void
  /** Called when user views user profile */
  onViewUser?: (userId: string) => void
}

export interface CannedResponsesProps {
  /** List of canned responses */
  responses: CannedResponse[]
  /** Called when user creates a new response */
  onCreate?: (response: Omit<CannedResponse, 'id' | 'usageCount' | 'lastUsed'>) => void
  /** Called when user edits a response */
  onEdit?: (responseId: string, updates: Partial<CannedResponse>) => void
  /** Called when user deletes a response */
  onDelete?: (responseId: string) => void
  /** Called when user duplicates a response */
  onDuplicate?: (responseId: string) => void
  /** Called when user selects a response (e.g., for insertion) */
  onSelect?: (responseId: string) => void
}

export interface ReportsProps {
  /** Dashboard metrics for reports */
  metrics: DashboardMetrics
  /** Date range for the report */
  dateRange: { start: string; end: string }
  /** Called when user changes date range */
  onDateRangeChange?: (start: string, end: string) => void
  /** Called when user exports report */
  onExport?: (format: 'csv' | 'pdf') => void
  /** Called when user views agent details */
  onViewAgent?: (agentId: string) => void
}
