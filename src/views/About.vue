<template>
  <div>
    <header>
      <h2 class="t-text-2xl t-text-gray-900 dark:t-text-gray-300 t-mb-6">
        {{ $t('about.title') }}
      </h2>
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
export default {
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
