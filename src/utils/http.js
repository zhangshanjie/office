import axios from 'axios'

import { BASEURL } from '@/api/config';
// 添加请求拦截器
const instance = axios.create({
        baseURL: BASEURL,
        timeout: 1000 * 60,
        // withCredentials: true,
        headers: {
            'Content-Type': 'text/plain',
            Accept: 'application/json',
        },
        transformRequest: [function(data) {
            data = JSON.stringify(data)
            console.log(data,'5555555555')
            return data
        }],
    })
    // instance.interceptors.request.use(
    //     config => {
    //         // ADD 添加从Url获取token
    //         let token = sessionStorage.getItem('token')
    //         if (config.method == 'options' || config.method == 'post') {
    //             if (token) {
    //                 config.headers.common['token'] = token
    //                 console.log(token, 11111)
    //             }
    //         }


//         return config
//     },
//     err => {
//         Notification.error({
//             title: '错误信息',
//             message: err.message,
//             showClose: false
//         })
//         return Promise.reject(err)
//     }
// )

// instance.interceptors.response.use(
//         response => {
//             if (response.headers.Authorization) {
//                 sessionStorage.setItem('token', response.headers.Authorization)
//             }
//             return response
//         },
//         error => {
//             if (error) {
//                 Notification.error({
//                     title: '网络错误信息',
//                     message: error.message,
//                     showClose: false
//                 })
//             }
//             return Promise.reject(error) // 返回接口返回的错误信息
//         }
//     )
// 请求处理
export default instance