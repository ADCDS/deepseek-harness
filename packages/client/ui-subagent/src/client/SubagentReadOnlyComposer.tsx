import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { NS } from './locales.ts'
import { routeLabel, servingRoute } from './subagent-route.ts'
import css from './SubagentReadOnlyComposer.module.css'

/** Why a catalog-addressed conversation cannot accept human input. */
export interface SubagentReadOnlyMatch {
  reason: 'one-shot' | 'parent-unavailable' | 'unknown'
}

/** Full chain props after the read-only subagent selector accepts the owner currency. */
export type SubagentReadOnlyComposerProps =
  PropsRuntime<'conversation.composer'> & { matched: SubagentReadOnlyMatch } & PropsLocale<typeof NS>

/**
 * Explain why the normal composer is unavailable for an addressed child.
 * @param props - selector-owned read-only reason plus standard slot props.
 * @returns A read-only composer replacement.
 */
export function SubagentReadOnlyComposer({
  matched, useProjection, t,
}: Pick<SubagentReadOnlyComposerProps, 'matched' | 'useProjection' | 't'>) {
  const oneShot = matched.reason === 'one-shot'
  const selection = useProjection('modelSelection')
  const route = routeLabel(selection)
  const serving = servingRoute(selection)
  return (
    <div className={css.frame} role="status">
      <strong>{t(oneShot ? 'readonly.oneShot.title' : 'readonly.title')}</strong>
      <span>
        {t(matched.reason === 'unknown' ? 'readonly.unknown.body' : oneShot ? 'readonly.oneShot.body' : 'readonly.body')}
      </span>
      {route !== undefined && <span className={css.route}>{t('readonly.route', { model: route })}</span>}
      {serving !== undefined && (
        <span className={css.servedBy}>{t('readonly.servedBy', { model: serving.model, from: serving.from })}</span>
      )}
    </div>
  )
}
