# Agent Note: Subagent route visibility

Status: implemented

English | [中文](2026-09-12-subagent-route-visibility.zh.md)

## Problem

A reader could not identify the provider and model used by a delegated child from its catalog row, composer, or parent delegation card. Backend defaults and per-call overrides can differ from the parent route.

## Decision

Child catalog rows and read-only composers report `modelSelection.lastUsed`, derived from recorded request headers. A child model control reads the same projection and uses shared catalog names when available, otherwise raw IDs. Catalog loading is available to children; selection and the model command remain refused.

The delegation tool returns a managed child ID immediately. Its optional canonical `route` uses explicit child options, backend route defaults, and parent values only when the backend inherits them. External backends without a complete known route omit it. Presentation metadata carries this route to the parent card without changing rendered model-visible result text. The optional output field enters PTC tool schemas.

## Alternatives considered

Adding a persisted subagent descriptor duplicates recorded request headers and describes a requested route rather than later requests. Deriving every settled parent card from the child projection ties historical presentation to the continued existence of that projection. Canonical tool metadata preserves the route known when activation starts.

## Consequences

Unknown routes remain absent. Forked histories can initially contain inherited parent request headers; child displays update when the child records its own request. Tests cover backend defaults, overrides, unknown external backends, unavailable catalogs, child selection refusal, malformed metadata, and current native/PTC session replay. Historical Session generations remain unchanged.

The [delegation package](../../../../packages/subagent/tool-subagent/README.md) owns route selection; this decision owns its presentation.
