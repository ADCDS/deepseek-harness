---
description: "Records a persistence type transition and its compatibility acknowledgement."
kind: persistence-change
---

# 2026-11-06-assistant-served-by

English | [中文](2026-11-06-assistant-served-by.zh.md)

## Summary

Adds optional servedBy to the finish chunk stored in assistant stream records, naming the model that answered when a provider rerouted the request.

## Table of Contents

- [Declaration](#declaration)
- [Compatibility](#compatibility)
- [Verification](#verification)
- [Dev Note](#dev-note)

<a id="declaration"></a>
## Declaration

```yaml persistence-change
schemaVersion: 1
id: 2026-11-06-assistant-served-by
baseline: false
changes:
  - root: "event:assistant/attempt"
    previous: "2026-09-16-session-format-v4"
    after: "187fa694e8f031560f2ba6743c152641730de34da8764ecba490c6305ef53f38"
    decision: same-version
  - root: "event:assistant/message"
    previous: "2026-09-16-session-format-v4"
    after: "6ab1d0d584460ca16d31a11fd47b443c324ae78c8cfdd48261d7baddc427b0cb"
    decision: same-version
```

<a id="compatibility"></a>
## Compatibility

Existing records remain valid: an absent field means the reply came from the requested model. Writers set it only when an adapter reports a reroute. The requested model stays the message's provider and model identity, and the field is not sent back to a model, so a reader that does not use it reconstructs the same model request.

<a id="verification"></a>
## Verification

pnpm run test:snapshot: 257 tests passed, 2 skipped, replaying recorded Sessions through shipped profiles. pnpm exec vitest run on packages/llm/llm, packages/client/ui-model-selection and packages/client/ui-subagent passed.

<a id="dev-note"></a>
## Dev Note

None.
