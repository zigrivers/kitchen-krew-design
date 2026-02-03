import { useState } from 'react'
import type { RolesPermissionsPanelProps, Role, Permission } from '@/../product/sections/system-settings/types'

// =============================================================================
// Sub-Components
// =============================================================================

interface RoleCardProps {
  role: Role
  isSelected: boolean
  onSelect: () => void
  onClone?: () => void
  onViewDetails?: () => void
}

function RoleCard({ role, isSelected, onSelect, onClone, onViewDetails }: RoleCardProps) {
  const hierarchyColors = [
    'bg-red-500',
    'bg-amber-500',
    'bg-lime-500',
    'bg-sky-500',
    'bg-purple-500',
    'bg-slate-500',
  ]

  return (
    <button
      onClick={onSelect}
      className={`relative w-full text-left p-4 rounded-xl border-2 transition-all ${
        isSelected
          ? 'border-lime-500 bg-lime-500/5 shadow-lg shadow-lime-500/10'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
      }`}
    >
      {/* Hierarchy indicator */}
      <div
        className={`absolute top-4 right-4 w-2 h-2 rounded-full ${hierarchyColors[role.hierarchy - 1] || 'bg-slate-400'}`}
        title={`Hierarchy level ${role.hierarchy}`}
      />

      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${
          role.isSystem
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            : 'bg-lime-500/10 text-lime-600 dark:text-lime-400'
        }`}>
          {role.isSystem ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{role.name}</h3>
            {role.isSystem && (
              <span className="px-1.5 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded">
                System
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{role.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {role.userCount.toLocaleString()} user{role.userCount !== 1 ? 's' : ''}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {role.permissions.length === 1 && role.permissions[0] === '*'
                ? 'All permissions'
                : `${role.permissions.length} permission${role.permissions.length !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {isSelected && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-lime-500/20">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails?.()
            }}
            className="px-2 py-1 text-xs font-medium text-lime-600 dark:text-lime-400 hover:bg-lime-500/10 rounded transition-colors"
          >
            View Details
          </button>
          {!role.isSystem && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClone?.()
              }}
              className="px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
            >
              Clone
            </button>
          )}
        </div>
      )}
    </button>
  )
}

interface PermissionCategoryProps {
  category: string
  permissions: Permission[]
  grantedPermissions: string[]
  isAllGranted: boolean
  onChange?: (permissionKey: string, granted: boolean) => void
}

function PermissionCategory({ category, permissions, grantedPermissions, isAllGranted, onChange }: PermissionCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const grantedCount = permissions.filter(p => grantedPermissions.includes(p.key)).length

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-sm font-semibold text-slate-900 dark:text-white">{category}</span>
        </div>
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
          isAllGranted
            ? 'bg-lime-500/10 text-lime-600 dark:text-lime-400'
            : grantedCount > 0
            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
        }`}>
          {isAllGranted ? 'All' : `${grantedCount}/${permissions.length}`}
        </span>
      </button>

      {isExpanded && (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {permissions.map((permission) => {
            const isGranted = grantedPermissions.includes(permission.key) || isAllGranted

            return (
              <div
                key={permission.key}
                className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{permission.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{permission.description}</div>
                </div>
                <button
                  onClick={() => onChange?.(permission.key, !isGranted)}
                  disabled={isAllGranted}
                  className={`relative w-10 h-6 rounded-full transition-all ${
                    isAllGranted ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                  } ${
                    isGranted
                      ? 'bg-lime-500 shadow-sm shadow-lime-500/30'
                      : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                      isGranted ? 'left-5' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

interface HierarchyVisualizationProps {
  roles: Role[]
  selectedRoleId: string | null
  onSelectRole: (roleId: string) => void
}

function HierarchyVisualization({ roles, selectedRoleId, onSelectRole }: HierarchyVisualizationProps) {
  const sortedRoles = [...roles].sort((a, b) => a.hierarchy - b.hierarchy)

  const hierarchyColors = [
    'border-red-500 bg-red-500/10',
    'border-amber-500 bg-amber-500/10',
    'border-lime-500 bg-lime-500/10',
    'border-sky-500 bg-sky-500/10',
    'border-purple-500 bg-purple-500/10',
    'border-slate-500 bg-slate-500/10',
  ]

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Role Hierarchy</h3>
      <div className="space-y-2">
        {sortedRoles.map((role, index) => (
          <button
            key={role.id}
            onClick={() => onSelectRole(role.id)}
            className={`w-full flex items-center gap-3 p-2 rounded-lg border-2 transition-all ${
              selectedRoleId === role.id
                ? hierarchyColors[role.hierarchy - 1] || 'border-slate-400 bg-slate-400/10'
                : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            style={{ marginLeft: `${(role.hierarchy - 1) * 12}px` }}
          >
            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
              role.hierarchy === 1
                ? 'bg-red-500 text-white'
                : role.hierarchy === 2
                ? 'bg-amber-500 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}>
              {role.hierarchy}
            </span>
            <span className={`text-sm font-medium ${
              selectedRoleId === role.id
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}>
              {role.name}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">
              {role.userCount}
            </span>
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
        Higher hierarchy (lower number) = more authority
      </p>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function RolesPermissionsPanel({
  roles,
  permissions,
  onUpdateRolePermissions,
  onCreateRole,
  onCloneRole,
  onViewRoleDetails,
  onViewPermissionAudit,
}: RolesPermissionsPanelProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(roles[0]?.id || null)
  const [viewMode, setViewMode] = useState<'list' | 'matrix'>('list')

  const selectedRole = roles.find(r => r.id === selectedRoleId)

  // Group permissions by category
  const permissionsByCategory = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = []
    }
    acc[permission.category].push(permission)
    return acc
  }, {} as Record<string, Permission[]>)

  const categories = Object.keys(permissionsByCategory).sort()

  const handlePermissionChange = (permissionKey: string, granted: boolean) => {
    if (!selectedRole) return

    const newPermissions = granted
      ? [...selectedRole.permissions, permissionKey]
      : selectedRole.permissions.filter(p => p !== permissionKey)

    onUpdateRolePermissions?.(selectedRole.id, newPermissions)
  }

  const isAllPermissionsGranted = selectedRole?.permissions.includes('*')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Roles & Permissions</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Manage access control and permission matrices
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onViewPermissionAudit}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Audit Log
              </button>
              <button
                onClick={() => onCreateRole?.({
                  key: 'new_role',
                  name: 'New Role',
                  description: 'Custom role description',
                  isSystem: false,
                  hierarchy: 4,
                  userCount: 0,
                  permissions: [],
                })}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-lime-500 hover:bg-lime-600 rounded-lg shadow-lg shadow-lime-500/25 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 4v16m8-8H4" />
                </svg>
                Create Role
              </button>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            {(['list', 'matrix'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  viewMode === mode
                    ? 'bg-lime-500 text-white shadow-lg shadow-lime-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {mode === 'list' ? 'List View' : 'Matrix View'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Roles List */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                Roles ({roles.length})
              </h2>
              <div className="space-y-3">
                {roles.map((role) => (
                  <RoleCard
                    key={role.id}
                    role={role}
                    isSelected={selectedRoleId === role.id}
                    onSelect={() => setSelectedRoleId(role.id)}
                    onClone={() => onCloneRole?.(role.id)}
                    onViewDetails={() => onViewRoleDetails?.(role.id)}
                  />
                ))}
              </div>

              {/* Hierarchy Visualization */}
              <HierarchyVisualization
                roles={roles}
                selectedRoleId={selectedRoleId}
                onSelectRole={setSelectedRoleId}
              />
            </div>

            {/* Permissions Editor */}
            <div className="lg:col-span-2">
              {selectedRole ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">{selectedRole.name}</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{selectedRole.description}</p>
                    </div>
                    {isAllPermissionsGranted && (
                      <span className="px-3 py-1 text-sm font-semibold bg-lime-500/10 text-lime-600 dark:text-lime-400 rounded-full">
                        Full Access
                      </span>
                    )}
                  </div>

                  {isAllPermissionsGranted ? (
                    <div className="p-6 bg-lime-500/5 border border-lime-500/20 rounded-xl text-center">
                      <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-lime-500/10 text-lime-600 dark:text-lime-400 mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Full Access Granted</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        This role has unrestricted access to all platform features and data.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {categories.map((category) => (
                        <PermissionCategory
                          key={category}
                          category={category}
                          permissions={permissionsByCategory[category]}
                          grantedPermissions={selectedRole.permissions}
                          isAllGranted={isAllPermissionsGranted || false}
                          onChange={handlePermissionChange}
                        />
                      ))}
                    </div>
                  )}

                  {/* Role Stats */}
                  <div className="flex items-center gap-6 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg text-sm">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Users:</span>
                      <span className="font-semibold text-slate-900 dark:text-white ml-2">{selectedRole.userCount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Hierarchy:</span>
                      <span className="font-semibold text-slate-900 dark:text-white ml-2">Level {selectedRole.hierarchy}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Type:</span>
                      <span className="font-semibold text-slate-900 dark:text-white ml-2">{selectedRole.isSystem ? 'System' : 'Custom'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Modified:</span>
                      <span className="font-semibold text-slate-900 dark:text-white ml-2">
                        {new Date(selectedRole.modifiedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Select a role to view permissions</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Matrix View */
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <th className="sticky left-0 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider border-r border-slate-200 dark:border-slate-700">
                      Permission
                    </th>
                    {roles.map((role) => (
                      <th key={role.id} className="px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider min-w-[120px]">
                        {role.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {categories.map((category) => (
                    <>
                      <tr key={`cat-${category}`} className="bg-slate-50/50 dark:bg-slate-800/30">
                        <td colSpan={roles.length + 1} className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          {category}
                        </td>
                      </tr>
                      {permissionsByCategory[category].map((permission) => (
                        <tr key={permission.key} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="sticky left-0 bg-white dark:bg-slate-900 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800">
                            {permission.name}
                          </td>
                          {roles.map((role) => {
                            const hasPermission = role.permissions.includes('*') || role.permissions.includes(permission.key)
                            return (
                              <td key={role.id} className="px-4 py-2 text-center">
                                {hasPermission ? (
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-lime-500/10">
                                    <svg className="w-4 h-4 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path d="M5 13l4 4L19 7" />
                                    </svg>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </span>
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
