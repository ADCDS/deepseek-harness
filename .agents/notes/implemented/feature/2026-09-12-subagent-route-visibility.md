# Agent Note: Subagent route visibility

Status: implemented

English | [中文](2026-09-12-subagent-route-visibility.zh.md)

## Problem

A reader of a session could not tell which provider and model served a subagent. Three surfaces each withheld it: the header catalog row reported mode, activity, tokens, and duration; the delegation tool card reported only the call description; and opening a child conversation rendered no model seat at all, because `ModelSelect` returns nothing for a session whose selection is unavailable. Deployments that enable per-call model selection, providers carrying `agentRouteDefaults`, and the out-of-process backends can each give a child a different route from its parent, so "same as the parent" was never a safe assumption.

## Decision

The route already exists durably: `request/header` records the exact `provider`/`model` of every request, and the `modelSelection` projection folds it per Session, children included. Reporting it is a presentation change over that projection plus one tool-owned result fact; no new Session event and no descriptor version.

The [subagent catalog](../../../../packages/client/ui-subagent/README.md) reads `modelSelection.lastUsed` from the child's own summary projection, beside the `tokenUsage` and `subagentTiming` values the row already consumes, and gives `provider/model` a line of its own between the label and the title, mode, and activity line. Sharing one truncated line put the route behind an LLM-written title, which is the value the route exists to disambiguate between sibling children.

The [model seat](../../../../packages/client/ui-model-selection/README.md) reports a child's fixed route as a disabled trigger instead of rendering nothing. Reading the advisory catalog is now permitted for every Session because it is Host-generation-wide display data naming no Session; `select` keeps Session authority and stays refused. The seat names the provider beside the model, which the selectable seat does not: the platform is exactly the fact a child's reader lacks.

The [read-only composer](../../../../packages/client/ui-subagent/README.md) reports the same route. That takeover replaces the resident composer and, with it, the `conversation.input.model` seat, so a one-shot child or a child whose parent is offline would otherwise show no route anywhere on its own page, where the title is model-authored text that may name anything. It reads the route through the session-scoped `useProjection` hook rather than the seat's service, because the two surfaces reach the projection by the channels their own slot scope provides.

The [delegation tool](../../../../packages/subagent/tool-subagent/README.md) carries the effective child route in its canonical output and projects it through `presentationMeta`, so the [tool row](../../../../packages/client/ui-tool/README.md) appends `provider/model` to a settled delegation's summary. `render` ignores the field, so no rendered result text changes; `presentationMeta` is pure over arguments and value, and arguments carry a route only when the model selected one explicitly, so an inherited route can reach presentation only through the canonical value. In PTC mode that value's schema is part of the `ToolOutputMap` prefix, which grows by one optional `route` object per result arm and invalidates cached prefixes once.

## Alternatives considered

**Extending the durable subagent descriptor** to record `agentProvider`/`agentModel` for one-shot children as continuable children already do would version a persisted record to obtain a fact `request/header` already carries for every child. The descriptor also reports the route *requested*, which diverges from the route *used* after a mid-conversation switch.

**Deriving the tool card's route from the child Session summary** would avoid the tool-owned output field, but ties a settled parent-transcript row to the continued existence of the child's projection, and leaves a background delegation's row blank until the child's first request lands.

**Rendering the child seat from the projection alone**, skipping the catalog, would avoid relaxing `load`. It also loses the provider and model display names for every route, printing raw ids where the parent's seat prints catalog names.

## Consequences

A route appears only once a child's first request records a header; before that the catalog row omits the line and the two child-session surfaces render nothing, matching the seat's existing blank window. A route the catalog does not advertise is named by its raw ids, so an unadvertised or withdrawn model stays readable. Catalog rows and the read-only frame always print raw ids because neither has access to the model catalog, while the child seat prints display names; closing that gap needs a service or slot, not a cross-plugin import.

`delegationRoute` validates the persisted `meta` because that value is durable tool-owned JSON that another build may have written. Result metadata is absent on delegations recorded before this change, and those rows keep their previous summary.

Focused tests cover both catalog arms, the route's own line, the seat's fixed, blank, and unadvertised-route renders, the read-only frame with and without a route, the relaxed catalog load against the still-refused selection, route metadata for an override and for pure inheritance, its absence when no layer supplies a complete route, and the row's rejection of malformed metadata.

[Model-selected subagent routes](2026-08-18-model-selected-subagent-routes.md) owns which route a child may run and remains authoritative; this note owns only reporting the resolved one. Per-call selection stays opt-in and off by default (`subagent-model-selection`), so a default deployment shows every child on the parent's route. Whether that default should change is a separate question and is not decided here.
