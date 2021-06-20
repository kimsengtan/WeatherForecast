<template>
  <div>
    <CityWeather class="mt-2 mb-8"></CityWeather>
    <CitiesWeatherCarousel class="mb-2"></CitiesWeatherCarousel>
  </div>
</template>

<script>
import CityWeather from '@/components/CityWeather.vue'
import CitiesWeatherCarousel from '~/components/CitiesWeatherCarousel.vue'

export default {
  components: {
    CityWeather,
    CitiesWeatherCarousel,
  },
}
</script>
