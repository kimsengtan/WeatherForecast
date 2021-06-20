<template>
  <v-card class="mx-auto" width="800px">
    <div class="text-h4 px-4 py-3 primary--text align-center flex-wrap d-flex">
      Cities Carousel
      <v-spacer></v-spacer>
      <v-btn class="mr-2 my-2" color="red" outlined @click="clear()"
        >Clear To Default</v-btn
      >
      <v-btn color="primary darken-2 my-2" outlined @click="dialog = true"
        >add your favourite city</v-btn
      >
    </div>
    <swiper ref="mySwiper" class="swiper" :options="swiperOption">
      <swiper-slide v-for="item in carouselItems" :key="item.name">
        <CurrentWeather
          class="my-6 mx-13"
          :weather-data="item"
          :img-url="imgUrl"
        ></CurrentWeather>
      </swiper-slide>
      <div slot="pagination" class="swiper-pagination"></div>
      <div slot="button-prev" class="swiper-button-prev"></div>
      <div slot="button-next" class="swiper-button-next"></div>
    </swiper>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title> Add City To Carousel </v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="citySelected"
            :items="citiesFiltered"
            color="blue-grey lighten-2"
            label="Choose Your Location"
            item-text="name"
            item-value="id"
            outlined
            return-object
            hide-details
          ></v-autocomplete>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn depressed @click="closeDialog()">cancel</v-btn>
          <v-btn depressed color="primary" @click="addToFav()">add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import CurrentWeather from './weather/CurrentWeather.vue'
import 'swiper/css/swiper.css'
import { cities } from '~/utilities/constant'
import weather from '~/mixins/weather'

const initialData = {
  savedLocations: [cities[0], cities[1], cities[2]],
}

export default {
  components: {
    Swiper,
    SwiperSlide,
    CurrentWeather,
  },
  mixins: [weather],
  data() {
    return {
      ...initialData,
      cities,
      swiperOption: {
        spaceBetween: 30,
        loop: false,
        loopFillGroupWithBlank: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          // dynamicBullets: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
      imgUrl: process.env.weatherIconUrl,
      carouselItems: [],
      unit: 'metric',
      citySelected: null,
      dialog: false,
    }
  },
  computed: {
    // filter added cities
    citiesFiltered() {
      return cities.filter(
        (item) =>
          !this.savedLocations.some((savedloc) => savedloc.name === item.name)
      )
    },
  },
  mounted() {
    if (typeof Storage !== 'undefined') {
      let savedLocStorage = localStorage.getItem('savedLocation')
      try {
        savedLocStorage = JSON.parse(savedLocStorage)
      } catch {
        savedLocStorage = []
      }
      if (savedLocStorage && savedLocStorage.length > 0)
        this.savedLocations = savedLocStorage
    }
    this.getCarouselWeather(this.savedLocations)
  },
  methods: {
    async getCarouselWeather(savedLocations) {
      const promises = []
      savedLocations.forEach((item) => {
        const coord = item.coord
        promises.push(
          this.getWeatherByCoordinate({ lat: coord.lat, lon: coord.lon })
        )
      })
      await Promise.all(promises).then((values) => {
        this.carouselItems = values
      })
    },
    // toSlide(dir) {
    //   const realIndex = this.$refs.mySwiper.$swiper.realIndex
    //   if (dir === 'next') this.$refs.mySwiper.$swiper.slideTo(realIndex, 500)
    //   else if (dir === 'prev')
    //     this.$refs.mySwiper.$swiper.slideTo(realIndex, 500)
    // },
    closeDialog() {
      this.dialog = false
      this.citySelected = null
    },
    async addToFav() {
      // store saved location
      // avoid use .push, prevent default initial data get overwritten
      this.savedLocations = [...this.savedLocations, this.citySelected]
      if (typeof Storage !== 'undefined')
        localStorage.setItem(
          'savedLocation',
          JSON.stringify(this.savedLocations)
        )

      // get weather from user selected data and push into carousel
      const coord = this.citySelected.coord
      const weatherData = await this.getWeatherByCoordinate({
        lat: coord.lat,
        lon: coord.lon,
      })
      this.carouselItems.push(weatherData)
      this.closeDialog()
    },
    resetSaved() {
      if (typeof Storage !== 'undefined')
        localStorage.removeItem('savedLocation')

      Object.assign(this.$data, initialData)
      this.getCarouselWeather(this.savedLocations)
    },
    clear() {
      const payload = {
        title: 'Clear to default state',
        text: 'Are you sure reset it to default view?',
        actions: [
          {
            label: 'Cancel',
          },
          {
            label: 'Confirm',
            color: 'primary',
            callback: () => this.resetSaved(),
          },
        ],
      }
      this.$store.commit('dialog/addConfirmDialog', payload)
    },
  },
}
</script>

<style scoped>
.swiper {
  border-top: 1px solid black;
}
</style>
