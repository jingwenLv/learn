import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getStorage } from '@/utils/localStorage'
import {
  addPendingXHR,
  removePendingXHR,
  REQUEST_TYPE,
} from '@/utils/cancelToken'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_PREFIX, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    removePendingXHR(config)
    addPendingXHR(config)

    if (config.params) {
      let { params } = config
      Object.keys(params).forEach((item) => {
        if (params[item] === '') delete params[item]
      })
    }
    const token = getStorage('token')
    const currentType = getStorage('currentType')

    if (store.getters.token) {
      config.headers['talent_token'] = token
    }

    if (store.getters.currentType) {
      config.headers['current_type'] = currentType
    }
    return config
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
/**
 * If you want to get http information such as headers or status
 * Please return  response => response
 */

/**
 * Determine the request status by custom code
 * Here is just an example
 * You can also judge the status by HTTP Status Code
 */
service.interceptors.response.use(
  (response) => {
    removePendingXHR(response.config)

    const res = response.data
    // if the custom code is not 20000, it is judged as an error.

    if (res.code === 200) {
      return res.data
    } else {
      switch (res.code) {
        case 10001:
          // 尚未登录 打开登录
          window.openLogin()
          break
        case 10002:
          // token过期,跳首页并打开登录
          // store.dispatch('user/resetToken').then(() => {
          window.openLogin()
          // })
          break
        case 10003:
          Promise.reject(res)
          break
        default:
          Message({
            message: res.msg || 'Error',
            type: 'error',
            duration: 5 * 1000,
          })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    }
  },
  (error) => {
    // 如果是取消请求类型则忽略异常处理
    let isDuplicatedType
    try {
      const errorType = (JSON.parse(error.message) || {}).type
      isDuplicatedType = errorType === REQUEST_TYPE.DUPLICATED_REQUEST
      console.log('中断请求,errType:', errorType, ',errMsg:', error.message)
    } catch (error) {
      isDuplicatedType = false
    }
    if (!isDuplicatedType) {
      console.log('err' + error) // for debug
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000,
      })
      return Promise.reject(error)
    } else {
      return new Promise(() => {})
    }
  }
)

export default service
