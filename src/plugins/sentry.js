import Vue from 'vue'
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    Vue,
    dsn: '',
    integrations: [new Integrations.BrowserTracing()],
    logErrors: true,

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  })
}
