<template>
  <v-list class="transparent-blue">
    <div class="text-h4 primary--text pb-2">5 days Forecast</div>
    <v-list-item
      v-for="(item, index) in forecastList"
      :key="item.day"
      :class="index % 2 == 0 && 'blue-grey lighten-5'"
    >
      <v-list-item-title class="flex-grow-0 flex-shrink-1 font-weight-medium">{{
        $dayjs.unix(item.dt).format('ddd, MMM DD')
      }}</v-list-item-title>

      <v-list-item-icon class="flex-grow-1 flex-shrink-0 align-center">
        <v-img :src="imgUrl + '/' + item.icon + '.png'"></v-img>
        <div class="blue-grey--text text--lighten-1">
          {{ item.temp_min }} / {{ item.temp_max }} &#x2103;
        </div>
      </v-list-item-icon>

      <v-list-item-subtitle class="pl-3 text-right">
        <span class="secondary--text font-weight-medium text--lighten-2">
          {{ item.main }}
        </span>
        <br />
        {{ item.description }}
      </v-list-item-subtitle>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  props: {
    forecastList: {
      type: Array,
      default: () => [],
    },
    imgUrl: {
      type: String,
      default: '',
    },
  },
}
</script>
