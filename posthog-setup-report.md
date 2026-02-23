<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **DevEvent** Next.js App Router application. Here is a summary of all changes made:

## Summary of changes

- **`instrumentation-client.ts`** *(new)* — Initializes PostHog client-side using the Next.js 15.3+ `instrumentation-client.ts` pattern. Configured with a reverse proxy host (`/ingest`), automatic exception/error tracking (`capture_exceptions: true`), and debug mode in development.
- **`next.config.ts`** *(updated)* — Added PostHog reverse proxy rewrites (`/ingest/static/*` and `/ingest/*`) and `skipTrailingSlashRedirect: true` to ensure analytics events route through the app and avoid ad-blocker interference.
- **`.env.local`** *(created)* — Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables (covered by `.gitignore`).
- **`components/ExploreBtn/ExploreBtn.tsx`** *(updated)* — Added `posthog.capture('explore_events_clicked')` in the existing button click handler. This tracks the top of the event discovery funnel.
- **`components/EventCard/EventCard.tsx`** *(updated)* — Converted to a client component and added `posthog.capture('event_card_clicked')` on the link's `onClick` with rich properties (title, slug, location, date).
- **`components/Navbar/Navbar.tsx`** *(updated)* — Converted to a client component and added `posthog.capture('nav_link_clicked')` on each navigation link with a `label` property.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicked the "Explore Events" button to scroll to the featured events section | `components/ExploreBtn/ExploreBtn.tsx` |
| `event_card_clicked` | User clicked on a featured event card (includes title, slug, location, date) | `components/EventCard/EventCard.tsx` |
| `nav_link_clicked` | User clicked a navigation link (Home, Events, Create Event) in the navbar | `components/Navbar/Navbar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- 📊 **Dashboard — Analytics basics**: https://us.posthog.com/project/321489/dashboard/1301476
- 📈 **Event Engagement Trend** (daily trend of explore + card clicks): https://us.posthog.com/project/321489/insights/FQ3MS4Bh
- 🔽 **Browse-to-Click Conversion Funnel** (explore → card click): https://us.posthog.com/project/321489/insights/fAVAqXiC
- 🏆 **Most Clicked Events** (which events attract the most interest): https://us.posthog.com/project/321489/insights/T1OMEdwm
- 🧭 **Navigation Link Clicks** (which nav links users click most): https://us.posthog.com/project/321489/insights/A7zagxvM
- 👥 **Unique Active Users (DAU)** (daily unique users engaging with events): https://us.posthog.com/project/321489/insights/kw8Z81hB

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
