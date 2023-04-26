<template>
    <div>
        <el-button :type="primary" @click="dowmTemplat">模板下载</el-button>
        <el-upload class="upload-demo" action="string" :on-preview="handlePreview" :on-remove="handleRemove"
            :before-remove="beforeRemove" multiple :limit="10" :on-exceed="handleExceed" :http-request="uploadFile"
            :format="['xls', 'xlsx']" accept=".xls, .xlsx" :file-list="fileList" :show-file-list="false">
            <el-button size="big" type="primary">点击上传</el-button>
            <div class="el-upload__tip">只能上传xls, xlsx文件，且不超过50m</div>
        </el-upload>
    </div>
</template>

<script>


import api from "../service/index";
import axios from "axios";

export default {
    data() {
        return {
            fileList: []
        };
    },
    name: 'AccountCheck',
    props: {
        msg: String
    },
    methods: {
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        uploadFile(file) {
            const param = new FormData();
            param.append('file', file.file);
            console.log(param);
            //测试请求方法
            api.checkData(param).then(res => {
                console.log(res)
                // alert("请求成功");
                axios.get("/api/accounting/getFile?fileName=" + res.data, { 'responseType': 'blob' }).then(res => {
                    console.log(res.data); // 获取服务端提供的数据
                    let blob = new Blob([res.data], { type: "application/vnd.ms-excel;charset=utf-8" })
                    let contentDisposition = res.headers['content-disposition']
                    let pattern = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
                    let result = pattern.exec(contentDisposition)
                    // 使用decodeURI对名字进行解码
                    let fileName = decodeURI(result[1])
                    let downloadElement = document.createElement('a')
                    // 创建下载的链接
                    let href = window.URL.createObjectURL(blob)
                    downloadElement.style.display = 'none'
                    downloadElement.href = href
                    // 下载后文件名
                    downloadElement.download = fileName
                    document.body.appendChild(downloadElement)
                    // 点击下载
                    downloadElement.click()
                    // 下载完成移除元素
                    document.body.removeChild(downloadElement)
                    // 释放掉blob对象
                    window.URL.revokeObjectURL(href)
                })
            });

        },
        dowmTemplat() {
            axios.get("/api/accounting/getTemplate", { 'responseType': 'blob' }).then(res => {
                console.log(res.data); // 获取服务端提供的数据
                    let blob = new Blob([res.data], { type: "application/vnd.ms-excel;charset=utf-8" })
                    let contentDisposition = res.headers['content-disposition']
                    let pattern = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
                    let result = pattern.exec(contentDisposition)
                    // 使用decodeURI对名字进行解码
                    let fileName = decodeURI(result[1])
                    let downloadElement = document.createElement('a')
                    // 创建下载的链接
                    let href = window.URL.createObjectURL(blob)
                    downloadElement.style.display = 'none'
                    downloadElement.href = href
                    // 下载后文件名
                    downloadElement.download = fileName
                    document.body.appendChild(downloadElement)
                    // 点击下载
                    downloadElement.click()
                    // 下载完成移除元素
                    document.body.removeChild(downloadElement)
                    // 释放掉blob对象
                    window.URL.revokeObjectURL(href)
            })
        }
    }
}
</script>