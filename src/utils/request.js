import axios from 'axios'
import { getToken, removeAll } from '@/utils/auth'

import { Notification } from 'element-ui'

// 创建 axios 实例
const request = axios.create({
  // 请求超时时间
  timeout: 20000,
})

/**
 * 异常拦截处理器
 *
 * @param {*} error
 */
const errorHandler = error => {
  // 判断是否是响应错误信息
  if (error.response) {
    if (error.response.status == 401) {
      removeAll()
      location.reload()
    } else if (error.response.status == 403) {
      Notification({
        title: '警告',
        type: 'warning',
        message: '无权限操作 ...',
        position: 'top-right',
      })
    } else {
      Notification({
        message: '网络异常,请稍后再试...',
        position: 'top-right',
      })
    }
  }

  return Promise.reject(error)
}

// 请求拦截器
request.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  return config
}, errorHandler)

// 响应拦截器
request.interceptors.response.use(response => {
  return response.data
}, errorHandler)

/**
 * GET 请求
 *
 * @param {String} url
 * @param {Object} data
 * @param {Object} options
 * @returns {Promise<any>}
 */
export const get = (url, data = {}, options = {}) => {
  return request({
    url,
    params: data,
    method: 'get',
    ...options,
  })
}

/**
 * POST 请求
 *
 * @param {String} url
 * @param {Object} data
 * @param {Object} options
 * @returns {Promise<any>}
 */
export const post = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'post',
    data: data,
    ...options,
  })
}

/**
 * 上传文件 POST 请求
 *
 * @param {String} url
 * @param {Object} data
 * @param {Object} options
 * @returns {Promise<any>}
 */
export const upload = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'post',
    data: data,
    ...options,
  })
}
