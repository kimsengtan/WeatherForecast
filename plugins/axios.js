export default function ({ $axios, redirect }) {
  $axios.interceptors.request.use(
    function (config) {
      // Do something before request is sent
      config.params = {
        ...config.params,
        appid: 'a2e51e49e26d02cb2d01d732fe028fc1',
      }
      return config
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error)
    }
  )
}
