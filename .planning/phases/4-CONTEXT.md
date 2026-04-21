<decisions>
- **State Engine**: We will use `zustand` to manage the cart state globally. It naturally supports `localStorage` persistence with its `persist` middleware, avoiding complex React Context wrappers, and isolates re-renders to only components consuming the exact state slice.
- **Cart UI Representation**: The cart will sit inside a slide-out right-anchored Drawer overlay. This UX keeps users rooted in their shopping flow (they don't get ripped away to a dedicated `/cart` page just to check their subtotal).
- **WhatsApp Dispatch Validation**: We'll construct a rich, highly formatted text block detailing the items, subtotal, and any variant configurations. We will rely on straightforward client-side generation which redirects to the `wa.me/` protocol. Since this workflow uses manual settlement over WhatsApp, strict pre-flight server validation (like reserving stock in real-time) is deferred. The merchant will inherently validate the final transaction during the chat.
</decisions>

<canonical_refs>
- .planning/ROADMAP.md
- .planning/PROJECT.md
</canonical_refs>
