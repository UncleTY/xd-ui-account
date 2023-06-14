<template>
    <div>
        <!--<div style="margin: 10px 0">
            <el-input style="width: 260px" placeholder="请输入日期" suffix-icon="el-icon-search"
                      v-model="date"></el-input>
            <el-input class="ml-5" style="width: 260px" placeholder="请输入备注" suffix-icon="el-icon-message"
                      v-model="remark"></el-input>
            <el-input style="width: 260px" placeholder="请输入地址" suffix-icon="el-icon-position"
                      v-model="address"></el-input>
            <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
            <el-button style="margin-left: 5px" type="warning" @click="reset">重置</el-button>
        </div>-->
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
                  @selection-change="" :row-style="rowStyle">
            <el-table-column prop="subjectNo" label="科目编号"></el-table-column>
            <el-table-column prop="subjectBalance" label="科目金额"></el-table-column>
            <el-table-column prop="detailBalance" label="明细金额"></el-table-column>
            <el-table-column prop="diffBalance" label="差额"></el-table-column>
            <!--<el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button type="success" @click="handleEdit(scope.row)">编辑 <i class="el-icon-edit"></i></el-button>
                    <el-popconfirm
                            class="ml-5"
                            confirm-button-text='确定'
                            cancel-button-text='我再想想'
                            icon="el-icon-info"
                            icon-color="red"
                            title="您确定删除吗？"
                            @confirm="del(scope.row.id)">
                        <el-button type="danger" slot="reference">删除 <i class="el-icon-warning-outline"></i></el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>-->
        </el-table>
        <!--<div class="block" style="padding: 10px 0;text-align: center">
            <el-pagination
                    @size-change=""
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[5, 10, 20, 30]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>-->
        <!--<el-dialog title="校对信息" :visible.sync="dialogFormVisible" width="30%">
            <el-form label-width="80px" size="small">
                <el-form-item label="日期">
                    <el-input v-model="form.date" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否标记">
                    <el-select clearable v-model="form.markFlag" placeholder="请选择是否标记" style="width: 100%">
                        <el-option v-for="item in markFlags" :key="item.name" :label="item.name" :value="item.flag"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.remark" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>-->
    </div>
</template>

<script>

import {serverIp, port} from "../../public/config";

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
                showDiffFlag: true
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
                const param = new FormData();
                param.append('file', file.file);
                console.log(param);
                //测试请求方法
                this.request.post("/accounting/check", param).then(res => {
                    console.log(res.data.fileUrl)
                    console.log(res.data.checkResults)
                    this.fileUrl = res.data.fileUrl
                    this.storeData = res.data.checkResults
                    this.tableData = res.data.checkResults
                    // window.open(res.fileUrl)
                });
            },
            downloadResult() {
                if (this.fileUrl === '') {
                    this.$message.error("请先上传文件进行对比！")
                } else {
                    window.open(this.fileUrl)
                }
            },
            downloadTemplate() {
                window.open(`http://${serverIp}:${port}/file/downloadTemplate`);
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
            rowStyle(row, rowIndex) {
                if (row.row.diffBalance != 0) {
                    return "background-color:red";
                }
            },
        }
    }
</script>