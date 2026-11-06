---
description: "记录持久化类型更改及其兼容性确认。"
kind: persistence-change
---

# 2026-11-06-assistant-served-by

[English](2026-11-06-assistant-served-by.md) | 中文

## 概述

为助手流记录中存储的 finish 分块新增可选字段 servedBy，用于在提供商改路由时标明实际作答的模型。

## 目录

- [声明](#declaration)
- [兼容性](#compatibility)
- [验证](#verification)
- [开发备注](#dev-note)

<a id="declaration"></a>
## 声明

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
## 兼容性

已有记录仍然有效：字段缺失表示回复来自所请求的模型。只有适配器报告改路由时才会写入该字段。所请求的模型仍是消息的提供商和模型标识，该字段也不会再发送给模型，因此不使用它的读取方会重建出相同的模型请求。

<a id="verification"></a>
## 验证

pnpm run test:snapshot：257 个测试通过，2 个跳过，通过已发布的配置回放已录制的 Session。对 packages/llm/llm、packages/client/ui-model-selection 和 packages/client/ui-subagent 运行 pnpm exec vitest run 均通过。

<a id="dev-note"></a>
## 开发备注

无。
