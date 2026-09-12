import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { NS } from './locales.ts'
import { routeLabel } from './subagent-route.ts'
import css from './SubagentReadOnlyComposer.module.css'

/** Why a catalog-addressed conversation cannot accept human input. */
export interface SubagentReadOnlyMatch {
  reason: 'one-shot' | 'parent-unavailable'
}

/** Full chain props after the read-only subagent selector accepts the owner currency. */
export type SubagentReadOnlyComposerProps =
  PropsRuntime<'conversation.composer'> & { matched: SubagentReadOnlyMatch } & PropsLocale<typeof NS>

/**
 * Explain why the normal composer is unavailable for an addressed child.
 *
 * This takeover replaces the resident composer, and the composer's model seat
 * with it, so the frame also reports the route the delegation fixed: a child's
 * platform is otherwise invisible on its own page, where the title is
 * model-authored text rather than a route.
 * @param props - selector-owned read-only reason plus standard slot props.
 * @returns A read-only composer replacement.
 */
export function SubagentReadOnlyComposer({
  matched, useProjection, t,
}: Pick<SubagentReadOnlyComposerProps, 'matched' | 't' | 'useProjection'>) {
  const oneShot = matched.reason === 'one-shot'
  const route = routeLabel(useProjection('modelSelection'))
  return (
    <div className={css.frame} role="status">
      <span className={css.notice}>
        <strong>{t(oneShot ? 'readonly.oneShot.title' : 'readonly.title')}</strong>
        <span>
          {t(oneShot ? 'readonly.oneShot.body' : 'readonly.body')}
        </span>
      </span>
      {route !== undefined && <span className={css.route}>{t('readonly.route', { model: route })}</span>}
    </div>
  )
}
