<template>
  <div class="privacy-background">
    <a
      href="https://www.iubenda.com/privacy-policy/19763599"
      class="iubenda-nostyle no-brand iubenda-noiframe iubenda-embed iubenda-noiframe iub-body-embed"
      :title="$t('privacy-policy.title')"
      target="_blank"
    >
      {{ $t('privacy-policy.title') }} <v-icon size="x-small">{{ mdiOpenInNew }}</v-icon>
    </a>
  </div>
</template>

<script>
import { mdiOpenInNew } from '@mdi/js'

export default {
  data: () => ({
    mdiOpenInNew
  }),
  mounted() {
    let s = document.createElement('script'),
      tag = document.getElementsByTagName('script')[0]
    s.src = 'https://cdn.iubenda.com/iubenda.js'
    tag.parentNode.insertBefore(s, tag)
  }
}
</script>

<style lang="scss" scoped>
.privacy-background {
  background-color: #fff;
  color: #000;
}
</style>
