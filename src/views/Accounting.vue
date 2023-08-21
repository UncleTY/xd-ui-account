<template>
    <div>
        <div style="margin: 10px 0">
            <el-upload action="string" :on-preview="handlePreview" :on-remove="handleRemove"
                       :before-remove="beforeRemove" multiple :limit="10" :on-exceed="handleExceed"
                       :http-request="uploadFile"
                       :format="['xls', 'xlsx']" accept=".xls, .xlsx" :file-list="fileList" :show-file-list="false"
                       style="margin-left: 10px;display: inline-block">
                <el-button type="primary">上传对比<i class="el-icon-top"></i></el-button>
            </el-upload>
            <el-button type="primary" style="margin-left: 10px" @click="downloadResult">比对结果下载<i
                    class="el-icon-bottom"></i></el-button>
            <el-button type="primary" style="margin-left: 10px" @click="downloadTemplate">模板下载<i
                    class="el-icon-bottom"></i></el-button>
            <el-button type="primary" style="margin-left: 10px" @click="showDiff" v-show="showDiffFlag">显示差异</el-button>
            <el-button type="primary" style="margin-left: 10px" @click="showAll" v-show="!showDiffFlag">显示全部</el-button>
            <el-button type="primary" style="margin-left: 10px" @click="clearData">清空数据</el-button>
        </div>
        <el-table :data="tableData" border stripe :header-cell-class-name="headerBg"
                  @selection-change="" :row-class-name="differRowStyle" v-loading="loading">
            <el-table-column prop="subjectNo" label="科目编号"></el-table-column>
            <el-table-column prop="subjectBalance" label="科目金额"></el-table-column>
            <el-table-column prop="detailBalance" label="明细金额"></el-table-column>
            <el-table-column prop="diffBalance" label="差额"></el-table-column>
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
                showDiffFlag: true,
                loading: false
            };
        },
        name: 'Accounting',
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
                this.request.post("/file/check", param).then(res => {
                    console.log(res.data.fileUrl)
                    console.log(res.data.checkResults)
                    this.fileUrl = res.data.fileUrl
                    this.storeData = res.data.checkResults
                    this.tableData = res.data.checkResults
                    // window.open(res.fileUrl)
                    this.loading = false;
                });
            },
            downloadResult() {
                if (this.fileUrl === '') {
                    this.$message.error("请先上传文件进行对比！")
                } else {
                    window.open(serverIp + "/file/getFile?fileName=" + this.fileUrl)
                }
            },
            downloadTemplate() {
                window.open(serverIp + "/file/getFile?fileName=比较模板.xlsx");
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
            showDiff() {
                this.tableData = this.storeData.filter(item => {
                    return item.diffBalance !== 0;
                })
                this.showDiffFlag = !this.showDiffFlag
            },
            showAll() {
                this.tableData = this.storeData
                this.showDiffFlag = !this.showDiffFlag
            },
            clearData() {
                this.storeData = []
                this.tableData = []
                this.fileUrl = ''
                this.showDiffFlag = true
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