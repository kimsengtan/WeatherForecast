<template>
  <div class="wrapper">
    <div class="text-h4 primary--text text--darken-2">Today</div>
    <div v-if="Object.keys(weatherData).length > 0" class="d-flex flex-wrap">
      <v-img
        class="flex-grow-0 flex-shrink-1"
        width="100px"
        :src="imgUrl + '/' + weatherData.icon + '.png'"
      ></v-img>
      <div class="px-2">
        <div class="text-h4">
          {{ weatherData.name }}
        </div>
        <div class="text-h6 primary--text text--lighten-1">
          Feels like {{ weatherData.feel }} &#x2103;
        </div>
        <div class="font-weight-medium secondary--text text--lighten-2">
          {{ weatherData.description }}
        </div>
      </div>
      <div class="px-2 flex-grow-1 flex-shrink-1 pt-2">
        <div
          v-for="info in infoList"
          :key="info.label"
          class="text-subtitle-1 d-flex flex-wrap"
        >
          <span class="align-center d-flex mr-2 font-weight-medium">
            <v-icon class="mr-1">{{ info.icon }}</v-icon> {{ info.label }}:
          </span>
          <span class="grey--text text--darken-1"> {{ info.value }} </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imgUrl: {
      type: String,
      default: '',
    },
    weatherData: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    infoList() {
      return [
        {
          label: 'Coordinate',
          icon: 'mdi-google-maps',
          value: this.weatherData.coordinate,
        },
        {
          label: 'Humidity',
          icon: 'mdi-water-percent',
          value: this.weatherData.humidity + '%',
        },
        {
          label: 'Wind',
          icon: 'mdi-windsock ',
          value: this.weatherData.windSpeed + ' meter/sec',
        },
      ]
    },
  },
}
</script>

<style scoped>
.wrapper {
  position: relative;
  z-index: 1;
}
</style>
