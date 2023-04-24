//引入封装好的 service
import service from "@/service/service";

//声明一个基础接口变量
let baseURL = '/api';

//配置开发环境
// if (process.env.NODE_ENV === 'development') {
//     baseURL = '127.0.0.1:8080/xd-account';
// }

// // 配置生产环境
// if (process.env.NODE_ENV === 'production') {
//     baseURL = '127.0.0.1:8080/xd-account';
// }

//设置请求头（如果请求头统一的话可以在axios文件设置，则无须从这里传过去）
// const header = {
//     Accept: 'application/json;charset=UTF-8',
// }
const file_header = {
    Accept: 'application/json;charset=UTF-8',
    'Content-Type': 'multipart/form-data',
    responseType: 'blob'
}




//根据自身需求
let api = {
    checkData(data) {
        const url = baseURL + '/accounting/check';
        console.log(url);
        return service.post(url, data, file_header);
    },
    getFile(data) {
        const url = baseURL + '/accounting/getFile';
        console.log(url);
        return service.post(url, data, file_header);
    }
}


//导出
export default api