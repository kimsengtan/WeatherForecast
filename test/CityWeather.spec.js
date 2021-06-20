import { mount } from '@vue/test-utils'
import CityWeather from '@/components/CityWeather.vue'

describe('Logo', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(CityWeather)
    expect(wrapper.vm).toBeTruthy()
  })
})
