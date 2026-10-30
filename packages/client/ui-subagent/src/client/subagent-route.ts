/** UI Subagent-owned route label for the child sessions that report one. */

import type { SessionProjectionMap } from '@deepseek-ai/dsh-api-session-controller/client'
import type {} from '@deepseek-ai/dsh-api-session-controller/types'

/**
 * Compact `provider/model` route for one child session. Reads the route the
 * child actually requested with, so a child that inherited the parent route and
 * a child that overrode it are both reported exactly. Absent until the child's
 * first request records a header, which is also the window in which no route has
 * been chosen yet.
 * @param selection - the session's durable model-selection projection.
 * @returns `provider/model`, or undefined when no request has recorded one.
 */
export function routeLabel(
  selection: SessionProjectionMap['modelSelection'] | undefined,
): string | undefined {
  const used = selection?.lastUsed
  return used == null ? undefined : `${used.provider}/${used.model}`
}

/** A reroute a child's latest reply reported: the model that answered and the one it replaced. */
export interface SubagentServingRoute {
  /** The model that produced the latest reply. */
  model: string
  /** The requested model a provider declined before rerouting. */
  from: string
}

/**
 * The server-side fallback a child's latest reply reported, so a reader of a
 * read-only child conversation sees which model actually answered when it
 * differs from the fixed route. Absent until a reply reports a reroute, and
 * cleared once a reply returns on the requested model.
 * @param selection - the session's durable model-selection projection.
 * @returns the serving and declined models, or undefined when no reroute stands.
 */
export function servingRoute(
  selection: SessionProjectionMap['modelSelection'] | undefined,
): SubagentServingRoute | undefined {
  const served = selection?.lastServed
  return served == null || served.from === undefined ? undefined : { model: served.model, from: served.from }
}
