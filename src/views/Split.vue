<template>
    <div>
        <div style="margin: 10px 0">
            <el-upload action="string" :on-preview="handlePreview" :on-remove="handleRemove"
                       :before-remove="beforeRemove" multiple :limit="10" :on-exceed="handleExceed"
                       :http-request="uploadFile"
                       :format="['xls', 'xlsx']" accept=".xls, .xlsx" :file-list="fileList" :show-file-list="false"
                       style="margin-left: 10px;display: inline-block">
                <el-button type="primary">上传截取<i class="el-icon-top"></i></el-button>
            </el-upload>
            <el-button type="primary" style="margin-left: 10px" @click="downloadResult">截取结果下载<i
                    class="el-icon-bottom"></i></el-button>
            <el-button type="primary" style="margin-left: 10px" @click="downloadTemplate">模板下载<i
                    class="el-icon-bottom"></i></el-button>
           <el-button type="primary" style="margin-left: 10px" @click="clearData">清空数据</el-button>
        </div>
        <el-table :data="tableData" border stripe :header-cell-class-name="headerBg"
                  @selection-change="" :row-class-name="differRowStyle" v-loading="loading">
            <el-table-column prop="originData" label="原始数据"></el-table-column>
            <el-table-column prop="beginDate" label="开始日期"></el-table-column>
            <el-table-column prop="endDate" label="结束日期"></el-table-column>
            <el-table-column prop="dateDuration" label="日期区间"></el-table-column>
        </el-table>
    </div>
</template>

<script>


    export default {
        data() {
            return {
                fileList: [],
                serverIp: "",
                tableData: [],
                total: 0,
                pageNum: 1,
                pageSize: 10,
                date: "",
                remark: "",
                form: {},
                multipleSelection: [],
                dialogFormVisible: false,
                headerBg: 'headerBg',
                markFlags: [],
                fileUrl: '',
                storeData: [],
                loading: false
            };
        },
        name: 'Split',
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
                this.loading = true;
                const param = new FormData();
                param.append('file', file.file);
                console.log(param);
                //测试请求方法
                this.request.post("/accounting/dealMsg", param).then(res => {
                    console.log(res.data.fileUrl)
                    console.log(res.data.splitDetailList)
                    this.fileUrl = res.data.fileUrl
                    this.storeData = res.data.splitDetailList
                    this.tableData = res.data.splitDetailList
                    this.loading = false;
                    window.open(res.data.fileUrl);
                });
            },
            downloadResult() {
                if (this.fileUrl === '') {
                    this.$message.error("请先上传文件！")
                } else {
                    window.open(this.fileUrl)
                }
            },
            downloadTemplate() {
                this.request.get("/file/getTemplate", {'responseType': 'blob'}).then(res => {
                    console.log(res.data); // 获取服务端提供的数据
                    let blob = new Blob([res.data], {type: "application/vnd.ms-excel;charset=utf-8"})
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
            },
            load() {
                /*this.request.get("/accounting/queryCheckList", {
                    params: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        date: this.date,
                        markFlag: this.markFlag
                    }
                }).then(res => {
                    this.tableData = res.data.records
                    this.total = res.data.total
                })*/
            },
            clearData() {
                this.storeData = []
                this.tableData = []
                this.fileUrl = ''
            },
            differRowStyle({row, rowIndex}) {
                debugger
                if (row.diffBalance !== 0 && row.diffBalance !== '0') {
                    console.log(row.diffBalance);
                    return 'warning-row';
                } else {
                    return '';
                }
            },
        }
    }
</script>

<style>
    /*.el-table .warning-row {*/
    /*    background: darkorange !important;*/
    /*}*/

    /*.el-table .success-row {*/
    /*    background: #f0f9eb;*/
    /*}*/
</style>