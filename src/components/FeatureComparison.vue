<template>
  <v-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th scope="col" class="text-left">{{ $t('feature-comparison.subject') }}</th>
          <th scope="col" class="text-left" v-if="home">{{ $t('feature-comparison.included') }}</th>
          <th scope="col" class="text-left" v-if="!home">PKU Tools</th>
          <th scope="col" class="text-left" v-if="!home">PKU Manager</th>
          <th scope="col" class="text-left" v-if="!home">Phe Rechner</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in features" :key="item.name" class="tr-read-only">
          <td class="feature-name">
            <v-icon start>{{ item.icon }}</v-icon>
            <span v-if="$i18n.locale !== 'de'">{{ item.en }}</span>
            <span v-if="$i18n.locale === 'de'">{{ item.de }}</span>
          </td>
          <td>
            <v-icon v-if="item.pkutools === 1" color="success">{{ mdiCheckBold }}</v-icon>
            <v-icon v-if="item.pkutools === 2">{{ mdiCircleHalfFull }}</v-icon>
            <v-icon v-if="item.pkutools === 3">{{ mdiCloseCircleOutline }}</v-icon>
          </td>
          <td v-if="!home">
            <v-icon v-if="item.pkumanager === 1" color="success">{{ mdiCheckBold }}</v-icon>
            <v-icon v-if="item.pkumanager === 2">{{ mdiCircleHalfFull }}</v-icon>
            <v-icon v-if="item.pkumanager === 3">{{ mdiCloseCircleOutline }}</v-icon>
          </td>
          <td v-if="!home">
            <v-icon v-if="item.pherechner === 1" color="success">{{ mdiCheckBold }}</v-icon>
            <v-icon v-if="item.pherechner === 2">{{ mdiCircleHalfFull }}</v-icon>
            <v-icon v-if="item.pherechner === 3">{{ mdiCloseCircleOutline }}</v-icon>
          </td>
        </tr>
      </tbody>
    </template>
  </v-table>
</template>

<script>
import {
  mdiMagnify,
  mdiCalculator,
  mdiFoodApple,
  mdiBook,
  mdiWeb,
  mdiCloudOffOutline,
  mdiSync,
  mdiExport,
  mdiTranslate,
  mdiBrightness4,
  mdiFoodAppleOutline,
  mdiCheckBold,
  mdiCircleHalfFull,
  mdiCloseCircleOutline,
  mdiBarcodeScan
} from '@mdi/js'

export default {
  name: 'FeatureComparison',
  props: {
    home: Boolean
  },
  data: () => ({
    mdiCheckBold,
    mdiCircleHalfFull,
    mdiCloseCircleOutline,
    features: [
      {
        icon: mdiMagnify,
        en: 'Food Search',
        de: 'Lebensmittelsuche',
        pkutools: 1,
        pkumanager: 1,
        pherechner: 1
      },
      {
        icon: mdiCalculator,
        en: 'Phe/Protein Calculator',
        de: 'Phe/Eiweiß Rechner',
        pkutools: 1,
        pkumanager: 1,
        pherechner: 1
      },
      {
        icon: mdiBarcodeScan,
        en: 'Barcode Scanner',
        de: 'Barcode Scanner',
        pkutools: 1,
        pkumanager: 3,
        pherechner: 3
      },
      {
        icon: mdiFoodApple,
        en: 'Own Food',
        de: 'Eigene Lebensmittel',
        pkutools: 1,
        pkumanager: 2,
        pherechner: 1
      },
      {
        icon: mdiBook,
        en: 'Phe Diary',
        de: 'Phe Tagebuch',
        pkutools: 1,
        pkumanager: 1,
        pherechner: 1
      },
      {
        icon: mdiWeb,
        en: 'Multiplatform',
        de: 'Multiplattform',
        pkutools: 1,
        pkumanager: 2,
        pherechner: 2
      },
      {
        icon: mdiSync,
        en: 'Realtime synchronization',
        de: 'Synchronisierung in Echtzeit',
        pkutools: 1,
        pkumanager: 2,
        pherechner: 3
      },
      {
        icon: mdiExport,
        en: 'Data Export',
        de: 'Datenexport',
        pkutools: 1,
        pkumanager: 3,
        pherechner: 3
      },
      {
        icon: mdiTranslate,
        en: 'Multilingual',
        de: 'Mehrsprachig',
        pkutools: 1,
        pkumanager: 2,
        pherechner: 3
      },
      {
        icon: mdiBrightness4,
        en: 'Light/Dark Design',
        de: 'Helles/Dunkles Design',
        pkutools: 1,
        pkumanager: 3,
        pherechner: 3
      },
      {
        icon: mdiFoodAppleOutline,
        en: 'Food Icons',
        de: 'Lebensmittel Icons',
        pkutools: 1,
        pkumanager: 3,
        pherechner: 3
      }
    ]
  })
}
</script>

<style lang="scss" scoped>
.v-theme--light.v-table {
  background-color: #fafafa;
}

.feature-name {
  white-space: nowrap;
}

.tr-read-only:hover {
  background-color: inherit !important;
}
</style>
