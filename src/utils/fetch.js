import axios from 'axios'
import Qs from 'qs'
import { BASEURL } from '@/api/config';
// const BASE_URL = isTest ? 'http://192.168.1.86:9527/' : ''
// 添加请求拦截器
const instance = axios.create({
        baseURL: BASEURL,
        timeout: 1000 * 60,
        // withCredentials: true,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        // data: {
        //     token: sessionStorage.getItem('token')
        // },
        transformRequest: [function(data) { //在请求之前对data传参进行格式转换
            data = Qs.stringify(data, { arrayFormat: 'brackets' })
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
//     response => {
//         if (response.headers.Authorization) {
//             sessionStorage.setItem('token', response.headers.Authorization)
//         }
//         return response
//     },
//     error => {
//         if (error) {
//             Notification.error({
//                 title: '网络错误信息',
//                 message: error.message,
//                 showClose: false
//             })
//         }
//         return Promise.reject(error) // 返回接口返回的错误信息
//     }
// )

// 请求处理
export default instance