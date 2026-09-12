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
