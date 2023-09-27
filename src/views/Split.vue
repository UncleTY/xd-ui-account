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
            <el-table-column prop="company" label="公司"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
            <el-table-column prop="feeType" label="费用类型"></el-table-column>
            <el-table-column prop="beginDate" label="开始日期"></el-table-column>
            <el-table-column prop="endDate" label="结束日期"></el-table-column>
            <el-table-column prop="dateDuration" label="日期区间"></el-table-column>
            <el-table-column prop="taxNo" label="发票号码"></el-table-column>
        </el-table>
    </div>
</template>

<script>

import {serverIp} from "../../public/config";

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
                    // window.open(res.data.fileUrl);
                });
            },
            downloadResult() {
                if (this.fileUrl === '') {
                    this.$message.error("请先上传文件！")
                } else {
                    window.open(serverIp + "/file/getFile?fileName=" + this.fileUrl)
                }
            },
            downloadTemplate() {
                window.open(serverIp + "/file/getFile?fileName=提取模板.xlsx");
            },
            clearData() {
                this.storeData = []
                this.tableData = []
                this.fileUrl = ''
            },
            differRowStyle({row, rowIndex}) {
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