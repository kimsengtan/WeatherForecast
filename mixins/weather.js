export default {
  data() {
    return {
      unit: 'metric',
    }
  },
  methods: {
    async getWeatherByCoordinate({ lat, lon }) {
      try {
        const {
          data: { weather, name, main, wind },
        } = await this.$axios.get('/weather', {
          params: { lat, lon, units: this.unit },
        })

        if (weather && weather.length > 0) {
          return {
            ...weather[0],
            name,
            coordinate: lat + ', ' + lon,
            feel: main.feels_like,
            windSpeed: wind.speed,
            humidity: main.humidity,
          }
        }
        return {}
      } catch (e) {
        return {}
      }
    },
  },
}
