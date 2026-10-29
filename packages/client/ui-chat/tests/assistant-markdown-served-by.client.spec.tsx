// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { AssistantMarkdown } from '../src/client/chat/AssistantMarkdown.tsx'
import { useDetailedPresentation } from './presentation-fixture.client.ts'
import { unusedImageLoader } from './reasoning-component-fixture.tsx'
import { useDisclosure } from '../src/client/chat/use-disclosure.ts'
import { useSearchableHidden } from '../src/client/chat/searchable-hidden.ts'
import type { ChatViewSlotProps } from '../src/client/contract/slots.ts'
import type { AssistantMessageNode } from '../src/client/contract/snapshot.ts'

afterEach(() => { cleanup() })

/** Echo the key and its parameters, so a test reads which copy rendered and with what. */
const t = ((key: string, params?: Record<string, unknown>) =>
  `${key} ${JSON.stringify(params ?? {})}`) as ChatViewSlotProps['t']

function renderAnswer(servedBy: AssistantMessageNode['servedBy'], streaming = false): HTMLElement {
  const { container } = render(
    <AssistantMarkdown renderSlot={() => null} useDisclosure={useDisclosure} useGroupAction={useSearchableHidden}
      usePresentation={useDetailedPresentation}
      blocks={[{ kind: 'text', text: 'answer' }]}
      streaming={streaming}
      servedBy={servedBy}
      loadImage={unusedImageLoader}
      t={t}
    />,
  )
  return container
}

describe('AssistantMarkdown served-by note', () => {
  it('names the answering model and the one that declined, with the policy area as its tooltip', () => {
    const container = renderAnswer({ model: 'claude-opus-4-8', reason: 'refusal-fallback', from: 'claude-opus-5-5', category: 'cyber' })
    const note = [...container.querySelectorAll('span')].find(span => span.textContent?.startsWith('message.servedByFallback'))
    expect(note?.textContent).toBe('message.servedByFallback {"model":"claude-opus-4-8","from":"claude-opus-5-5"}')
    expect(note?.getAttribute('title')).toBe('cyber')
  })

  it('names only the answering model when the declining one is unknown', () => {
    const container = renderAnswer({ model: 'claude-opus-4-8' })
    expect(container.textContent).toContain('message.servedBy {"model":"claude-opus-4-8"}')
    expect(container.textContent).not.toContain('message.servedByFallback')
  })

  it('stays silent without a report and while the answer is still streaming', () => {
    expect(renderAnswer(undefined).textContent).not.toContain('message.servedBy')
    cleanup()
    expect(renderAnswer({ model: 'claude-opus-4-8', from: 'claude-opus-5-5' }, true).textContent).not.toContain('message.servedBy')
  })
})
