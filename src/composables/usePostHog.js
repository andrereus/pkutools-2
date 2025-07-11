import posthog from 'posthog-js'

export function usePostHog() {
  posthog.init('phc_jkTYO4QwKkbZ7AxI5HnJ8Ma6sKr3WjT9TpDJCfTsbgd', {
    api_host: 'https://eu.i.posthog.com',
    defaults: '2025-05-24'
  })

  return { posthog }
}
