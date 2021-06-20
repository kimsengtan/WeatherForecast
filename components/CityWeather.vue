<template>
  <v-card outlined class="mx-auto pa-4" max-width="800px">
    <div class="text-h4 pb-4">Weather in Malaysia</div>
    <v-autocomplete
      v-model="citySelected"
      :items="cities"
      color="blue-grey lighten-2"
      label="Choose Your Location"
      item-text="name"
      outlined
      return-object
      hide-details
    ></v-autocomplete>

    <v-btn
      color="secondary"
      class="mt-2"
      :loading="gettingLocation"
      @click="getWeatherByCurrentLocation()"
    >
      <v-icon class="mr-1"> mdi-crosshairs-gps </v-icon> use current location
    </v-btn>
    <div v-if="errorStr" class="error--text">{{ errorStr }}</div>

    <CurrentWeather
      class="my-6"
      :weather-data="weatherData"
      :img-url="imgUrl"
    ></CurrentWeather>
    <WeatherForecastList
      class="my-6"
      :forecast-list="forecastList"
      :img-url="imgUrl"
    ></WeatherForecastList>
  </v-card>
</template>

<script>
import CurrentWeather from './weather/CurrentWeather'
import WeatherForecastList from './weather/WeatherForecastList'
import { cities } from '~/utilities/constant'
import weather from '~/mixins/weather'
export default {
  components: {
    CurrentWeather,
    WeatherForecastList,
  },
  mixins: [weather],
  data() {
    return {
      cities,
      citySelected: cities[0],
      weatherData: {},
      imgUrl: process.env.weatherIconUrl,
      coords: {},
      gettingLocation: false,
      errorStr: null,
      forecastList: [],
    }
  },
  watch: {
    // listen on city selected from dropdown, and get the data accordingly
    citySelected: {
      handler(val) {
        if (process.client && val) {
          this.getTodayWeather(val.coord)
          this.getForecastListByCoord(val.coord)
        }
      },
      immediate: true,
    },
  },
  methods: {
    async getTodayWeather({ lat, lon }) {
      // get today weather from api
      // method getWeatherByCoordinate is located at weather mixin
      this.weatherData = await this.getWeatherByCoordinate({ lat, lon })
    },
    async getForecastListByCoord({ lat, lon }) {
      try {
        // 5 days with data every 3 hours
        const { data } = await this.$axios.get('/forecast', {
          params: { lat, lon, units: this.unit },
        })
        const weatherList = data.list

        let currentTimestamp = this.$dayjs().unix()
        // filter the forecast list return from api
        this.forecastList = weatherList.reduce((listInDay, current) => {
          // to ensure the interval data filtered is updated with current time
          if (current.dt > currentTimestamp) {
            listInDay.push({
              dt: current.dt,
              ...current.weather[0],
              ...current.main,
            })
            // get the next day data by adding 1 day
            currentTimestamp += 60 * 60 * 24
          }
          return listInDay
        }, [])
      } catch (e) {}
    },
    getWeatherByCurrentLocation() {
      this.citySelected = null
      if (navigator.geolocation) {
        this.gettingLocation = true
        // get geolocation from user location
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.gettingLocation = false
            if (position.coords) {
              // get weather by coordinate
              const params = {
                lat: position.coords.latitude.toFixed(5),
                lon: position.coords.longitude.toFixed(5),
              }
              this.errorStr = ''
              this.getTodayWeather(params)
              this.getForecastListByCoord(params)
            }
          },
          (err) => {
            // show error message if user location not accessible
            this.gettingLocation = false
            this.errorStr = err.message
          }
        )
      } else {
        this.errorStr = 'Geolocation is not available.'
      }
    },
  },
}
</script>
