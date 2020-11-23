<template>
<div class="search">
    <Row>
        <Col>
            <Card>
                <div style="display: flex;margin:20px 0 30px 0px;">
                    <div style="width:25%;background: #f0f0f0;padding: 10px;margin: 0 auto;text-align:center;">
                        <p style="text-align: left;font-size:15px;font-weight: 700;">
                            平台账号
                        </p>
                        <div style="display: inline-block;">
                            <p style="text-align: left;">
                                渔 泡 : {{moneydata[0].fishBubble}}
                            </p>
                            <p style="text-align:left;">
                                渔 票 : {{moneydata[0].fishTicket}}
                            </p>
                            <p style="text-align:left;">
                                渔 币 : {{moneydata[0].fishCoin}}
                            </p>  
                        </div>
                    </div>
                    <div style="width:25%;background: #f0f0f0;margin:0 10px;padding: 10px;text-align:center">
                        <p style="text-align: left;font-size:15px;font-weight: 700;">用户</p>
                        <div style="display: inline-block;">
                            <p style="text-align: left;">
                                渔 泡 : {{moneydata[1].fishBubble}}
                            </p>
                            <p style="text-align:left;">
                                渔 票 : {{moneydata[1].fishTicket}}
                            </p>
                            <p style="text-align:left;">
                                渔 币 : {{moneydata[1].fishCoin}}
                            </p>  
                        </div>
                    </div>
                    <div style="width:25%;background: #f0f0f0;padding: 10px;text-align:center">
                        <p style="text-align: left;font-size:15px;font-weight: 700;">商家</p>
                        <div style="display: inline-block;">
                            <p style="text-align: left;">
                                渔 泡 : {{moneydata[2].fishBubble}}
                            </p>
                            <p style="text-align:left;">
                                渔 票 : {{moneydata[2].fishTicket}}
                            </p>
                            <p style="text-align:left;">
                                渔 币 : {{moneydata[2].fishCoin}}
                            </p>  
                        </div>
                    </div>
                     <div style="width:24%;background: #f0f0f0;padding: 10px;text-align:center;margin-left:10px">
                        <p style="text-align: left;font-size:15px;font-weight: 700;">赛事账号</p>
                        <div style="display: inline-block;">
                            <p style="text-align: left;">
                                渔 泡 : {{moneydata[3].fishBubble}}
                            </p>
                            <p style="text-align:left;">
                                渔 票 : {{moneydata[3].fishTicket}}
                            </p>
                            <p style="text-align:left;">
                                渔 币 : {{moneydata[3].fishCoin}}
                            </p>  
                        </div>
                    </div>
                </div>
                <Button @click="add" type="primary" icon="md-add">添加管理员</Button>
                <br>
                <br>
                <Row class="operation">
                    <Button @click="replacement" icon="md-refresh">刷新</Button>
                </Row>
                <Row>
                    <Table :loading="loading" border :columns="columns" :data="data" ref="table" sortable="custom" @on-selection-change="changeSelect"></Table>
                </Row>
                <Row type="flex" justify="end" class="page">
                    <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
                </Row>
            </Card>
            <Modal
            title="添加管理员"
            v-model="userModalVisible"
            :mask-closable="false"
            :width="500"
            :styles="{top: '30px'}"
            >
            <Form ref="userForm" :model="userForm" :label-width="70">
                <FormItem label="用户名" prop="username">
                <Input v-model="userForm.username" autocomplete="off"/>
                </FormItem>
                <FormItem label="密码" prop="password">
                <Input type="password" v-model="userForm.password" autocomplete="off"/>
                </FormItem>
                <FormItem label="邮箱" prop="email">
                <Input v-model="userForm.email"/>
                </FormItem>
                <FormItem label="手机号" prop="mobile">
                <Input v-model="userForm.mobile"/>
                </FormItem>
                <FormItem label="性别" prop="sex">
                <RadioGroup v-model="userForm.sex">
                    <Radio v-for="(item, i) in dictSex" :key="i" :label="item.value">{{item.title}}</Radio>
                </RadioGroup>
                </FormItem>
                <Form-item label="头像" prop="avatar">
                <upload-pic-input v-model="userForm.avatar"></upload-pic-input>
                </Form-item>
                <FormItem label="用户类型" prop="type">
                <Select v-model="userForm.type" placeholder="请选择">
                    <Option :value="0">普通用户</Option>
                    <Option :value="1">管理员</Option>
                </Select>
                </FormItem>
                <FormItem label="角色分配" prop="roles">
                <Select v-model="userForm.roles" multiple>
                    <Option v-for="item in roleList" :value="item.id" :key="item.id" :label="item.name">
                    <span style="margin-right:10px;">{{ item.name }}</span>
                    <span style="color:#ccc;">{{ item.description }}</span>
                    </Option>
                </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="userModalVisible=false">取消</Button>
                <Button type="primary" @click="submitUser">提交</Button>
            </div>
            </Modal>
        </Col>
    </Row>

</div>
</template>

<script>
import uploadPicInput from "@/views/my-components/xboot/upload-pic-input";
export default {
    components: {
        uploadPicInput
    },
data() {
    return {
        loading: true, // 表单加载状态
        selectDate:[],
        educedata:[],
        chartType:'',
        moneydata:[],
        userModalVisible:false,
        commodityTypeId:'',
        searchForm: { // 搜索框初始化对象
            username: "",
            departmentId: "",
            mobile: "",
            email: "",
            sex: "",
            type: "1",
            status: "",
            pageNumber: 1,
            pageSize: 10,
            sort: "createTime",
            order: "desc",
            startDate: "",
            endDate: ""
        },
        roleList: [],
        approvalStatus:2,
        reasonAuditFailure:'',
        chenkid:'',
        userForm: {
            username: "",
            mobile: "",
            email: "",
            sex: "",
            type: 0,
            roles: [],
            departmentId: "",
            departmentTitle: ""
        },
        type:'',
        prohibit:'',
        selectList: [], // 多选数据
        selectCount: 0, // 多选计数
        columns: [
            {
                type: "selection",
                width: 60,
                align: "center",
                fixed: "left"
            },
            {
                type: "index",
                width: 60,
                align: "center",
                fixed: "left"
            },
            {
                title: "用户名",
                key: "username",
                width: 145,
                fixed: "left"
            },
            {
                title: "头像",
                key: "avatar",
                width: 80,
                align: "center",
                render: (h, params) => {
                    return h("Avatar", {
                        props: {
                            src: params.row.avatar
                        }
                    });
                }
            },
            {
                title: "昵称",
                key: "nickName",
                minWidth: 145
            },
            {
                title: "手机",
                key: "mobile",
                minWidth: 145,
                sortable: true,
                render: (h, params) => {
                    if (this.getStore("roles").includes("ROLE_ADMIN")) {
                    return h("span", params.row.mobile);
                    } else {
                    return h("span", "您无权查看该数据");
                    }
                }
            },
            {
                title: "性别",
                key: "sex",
                minWidth: 100,
                align: "center"
            },
            {
                title: "用户类型",
                key: "type",
                align: "center",
                minWidth: 145,
                render: (h, params) => {
                    let re = "";
                    if (params.row.type == 1) {
                    re = "管理员";
                    } else if (params.row.type == 0) {
                    re = "普通用户";
                    }
                    return h("div", re);
                }
            },
            {
                title: "状态",
                key: "status",
                align: "center",
                minWidth: 145,
                render: (h, params) => {
                    if (params.row.status == 0) {
                    return h("div", [
                        h("Badge", {
                        props: {
                            status: "success",
                            text: "正常启用"
                        }
                        })
                    ]);
                    } else if (params.row.status == -1) {
                    return h("div", [
                        h("Badge", {
                        props: {
                            status: "error",
                            text: "禁用"
                        }
                        })
                    ]);
                    }
                },
                filters: [
                    {
                    label: "正常启用",
                    value: 0
                    },
                    {
                    label: "禁用",
                    value: -1
                    }
                ],
                filterMultiple: false,
                filterMethod(value, row) {
                    if (value == 0) {
                    return row.status == 0;
                    } else if (value == -1) {
                    return row.status == -1;
                    }
                }
            },
            {
                title: "创建时间",
                key: "createTime",
                sortable: true,
                sortType: "desc",
                minWidth: 150
            },
            // {
            // title: "操作",
            // key: "action",
            // align: "center",
            // width: 320,
            // render: (h, params) => {
            //     return h("div", [
            //         h(
            //             "Button",
            //             {
            //             props: {
            //                 type: "error",
            //                 size: "small"
            //             },
            //             on: {
            //                 click: () => {
            //                 this.remove(params.row);
            //                 }
            //             }
            //             },
            //             "删除"
            //         )
            //     ]);
            // }
            // }
        ],
        data: [], // 表单数据
        total: 0, // 表单数据总数
        dictSex: this.$store.state.dict.sex
    };
},
methods: {
    init() {
        this.getDataList();
        this.getRoleList()
    },
    changePage(v) {//点击吧页号赋值给pageNumber
      console.log(v)
        this.searchForm.pageNumber = v;
        this.getDataList();
        this.clearSelectAll();
    },
    changePageSize(v) {
        console.log(v)
        this.searchForm.pageSize = v;
        this.getDataList();
    },
    clearSelectAll() {
        this.$refs.table.selectAll(false);
    },
    changeSelect(e) {
        this.selectList = e;
        this.selectCount = e.length;
    },
    searcher(){
        this.getDataList()
    },
    replacement(){
        this.statistical()
        this.searchForm={}
        this.loading = true;
        this.getRequest("/user/getByCondition",{pageNumber:1,pageSize:10,type:1}).then(res => {
            this.loading = false;
            if (res.success) {
                this.total = res.result.numberOfElements;
                var dataList = res.result.content
                this.data=dataList
            }
            console.log(res)
        });
    },
    
    statistical(){
        this.postRequest('/userAccount/accountStatisticsList').then(res => {
            if (res.success) {
                console.log(res,'tongji')
                this.moneydata=res.result
            }
        });
    },
    getRoleList() {
       this.getRequest('/role/getAllList').then(res => {
            if (res.success) {
            this.roleList = res.result;
            }
        });
    },
    add(){//添加管理员
        this.userForm={}
        this.userModalVisible=true
    },
    submitUser(){
        console.log('sssd')
        if (
            this.userForm.password == "" || this.userForm.password == undefined || this.userForm.username == "" || this.userForm.mobile == ""
        ) {
            this.$Message.warning("密码，手机号，用户名，不能为空");
            return;
        }
        if (this.userForm.password.length < 6) {
            this.$Message.warning("密码不能小于6位数");
            return;
        }
        this.submitLoading = true;
        this.postRequest("/user/admin/add",this.userForm).then(res => {
            this.submitLoading = false;
            if (res.success) {
                this.$Message.success("操作成功");
                this.replacement();
                this.userModalVisible = false;
            }
        });
    },
    remove(v){
        console.log(v)
        this.$Modal.confirm({
            title:'确认要删除账户',
            content:'您确认要删除？',
            loading: true,
            onOk: () => {
                this.postRequest("/user/resetPass",{ids:v.id}).then(res => {
                    this.$Modal.remove();
                    if (res.success) {
                        this.$Message.success("删除成功");
                        this.getDataList();
                    }
                    console.log(res)
                });
            }
        });
    },
    getDataList () {
        this.loading = true;
        this.getRequest("/user/getByCondition",{pageNumber:1,pageSize:10,type:1}).then(res => {
            this.loading = false;
            if (res.success) {
                this.total = res.result.numberOfElements;
                var dataList = res.result.content
                this.data=dataList
            }
            console.log(res)
        });
    },
    checkd(v){
        this.chenkid=v.id
        this.reasonAuditFailure=""
        console.log(v,'sss')
    },
    stateDateRange(v){
        this.addfome.startTime=v
    },
    endDateRange(v){
        this.addfome.endTime=v
    }
},
mounted() {
        this.init();
        this.statistical()
    }
};
</script>
<style lang="less">
.search {
    .operation {
        margin-bottom: 2vh;
    }
    .select-count {
        font-size: 13px;
        font-weight: 600;
        color: #40a9ff;
    }
    .select-clear {
        margin-left: 10px;
    }
    .page {
        margin-top: 2vh;
    }
    .drop-down {
        font-size: 13px;
        margin-left: 5px;
    }
    .createuser{
        width: 220px;
        height: 33px;
        border-radius: 3px;
        border: 1px solid #dcdee2;
        margin-right: 43px;
    }
    .fonts{
        font-size: 13px
    }
    .photo{
        width: 100px;
        height: 100px;
        border-radius: 100px;
        
    }
}
</style>