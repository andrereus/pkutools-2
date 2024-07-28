<template>
  <div>
    <header>
      <PageHeader :title="$t('about.title')" />
    </header>

    <p>
      André Reus
      <br />
      Obere Gasse 38
      <br />
      71120 Grafenau
    </p>

    <!-- prettier-ignore -->
    <p>{{ $t("about.email") }}: {{ part1 }}@<span class="hidden">null</span>{{ part2 }}.{{ part3 }}</p>
    <br />
    <p>{{ $t('about.sources') }}</p>
  </div>
</template>

<script>
import PageHeader from '../components/PageHeader.vue'

export default {
  components: {
    PageHeader
  },
  data: () => ({
    part1: 'mail',
    part2: 'pkutools',
    part3: 'com'
  })
}
</script>

<style lang="scss" scoped>
.hidden {
  display: none;
}
</style>
