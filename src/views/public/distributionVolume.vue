<template>
    <div class="search">
        <Row>
            <Col>
                <Card>
                    <Row @keydown.enter.native="handleSearch">
                        <Form inline :label-width="70" class="search-form">
                            <Form-item label="状态">
                                <Select v-model="searchForm.type" placeholder="类型" clearable style="width: 150px">
                                    <Option  value="3">全部</Option>
                                    <Option  value="0">未审批</Option>
                                    <Option  value="1">已同意</Option>
                                    <Option  value="0">已拒绝</Option>
                                </Select>
                            </Form-item>
                            <Form-item style="margin-left:-35px;" class="br">
                                <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                                <Button @click="handleReset">重置</Button>
                            </Form-item>
                        </Form>
                    </Row>
                    <Row class="operation">
                    <!-- <Button @click="add" type="primary" icon="md-add">添加</Button> -->
                    <Button @click="getDataList" icon="md-refresh">刷新</Button>
                    </Row>
                    <Row>
                    <Alert show-icon>
                        已选择 <span class="select-count">{{selectCount}}</span> 项
                        <a class="select-clear" @click="clearSelectAll">清空</a>
                    </Alert>
                    </Row>
                    <Row>
                    <Table :loading="loading" border :columns="columns" :data="data" ref="table" sortable="custom" @on-sort-change="changeSort" @on-selection-change="changeSelect"></Table>
                    </Row>
                    <Row type="flex" justify="end" class="page">
                    <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize"
                        :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal title="订单详情" v-model="orderVisible" :mask-closable='false' :width="500">
            <Form  :label-width="100" > 
                <FormItem label="地址" v-if="form.addressInfo != '' && form.addressInfo != undefined">
                <div>{{form.addressInfo.province+' '+form.addressInfo.city+' '+form.addressInfo.area+' '+form.addressInfo.addresseeName}}</div>
                </FormItem>
                <FormItem label="联系电话" v-if="form.addressInfo != '' && form.addressInfo != undefined">
                    <div>{{form.addressInfo.phone}}</div>
                </FormItem>      
                <FormItem label="下单时间">
                    <div>{{form.createTime}}</div>
                </FormItem>
                <FormItem label="商品">
                    <div  v-for="item in form.goodList" :key="item.id" style="margin-bottom: 12px">
                        <img :src="item.picture" style="float:left;width:38px;height:38px" />
                        <lable style="margin-left:12px">{{item.goodsName}}</lable>
                        <lable style="margin-left:12px">X{{item.buyNum}}</lable>
                        <div style="clear:both"></div>
                    </div> 
                </FormItem>
                <FormItem label="价格">
                    <div>{{form.discountPrice}}</div>
                </FormItem>
                <FormItem label="是否配送">
                <div>{{form.isDelivery == 0 ? '不配送' : '配送'}}</div>
                </FormItem>
                <FormItem label="状态">
                    <div>{{form.status == -1 ? '取消订单' : (form.status == -2 ? '退货' :(form.status == 1 ? '待支付' : (form.status == 4 ? '待评价' : (form.status == 5 ? '已完成' : '进行中')))) }}</div>
                </FormItem>
                <FormItem label="站点名称" v-if="form.storeTable != '' && form.storeTable != undefined">
                    <div>{{form.storeTable.storeName}}</div>
                </FormItem>
            </Form>
        </Modal>

    </div>
</template>

<script>
    import circleLoading from "@/views/my-components/circle-loading.vue";
    export default {
        name: "distributionVolume",
        components: {
            circleLoading,
        },
        data() {
            return {
                orderVisible:false,
                visible: false,
                loading: true, // 表单加载状态
                modalType: 0, // 添加或编辑标识
                modalVisible: false, // 添加或编辑显示
                modalTitle: "", // 添加或编辑标题
                searchForm: { // 搜索框初始化对象
                    pageNumber: 1, // 当前页数
                    pageSize: 10, // 页面大小
                    type: 3
                },
                selectData: [],
                form: { // 添加或编辑表单对象初始化数据
                    goodsList:[],
                    id:'',
                    userName:'',
                    userTel:'',
                    userAddress:'',
                    price:'',
                    orderStatus:'',
                    createTime:'',
                    status:'',
                    refuseReason:''
                },
                reject:{
                content:'',
                orderBasicInfoId:''
                },
                // 表单验证规则
                submitLoading: false, // 添加或编辑提交状态
                selectList: [], // 多选数据
                selectCount: 0, // 多选计数
                columns: [
                // 表头
                {
                    type: "selection",
                    width: 60,
                    align: "center"
                },
                {
                    type: "index",
                    width: 60,
                    align: "center"
                },
                {
                    title: "用户名",
                    key: "userName",
                    minWidth: 120,
                    sortable: false,
                },
                {
                    title: "申请内容",
                    key: "content",
                    minWidth: 120,
                    sortable: false,
                },
                {
                    title: "申请图片",
                    key: "picture",
                    minWidth: 120,
                    sortable: false,
                    render: (h, params) => {
                        if (params.row.picture != null && params.row.picture != '' && params.row.picture != undefined) {
                            return h("div",{
                                attrs: {
                                    style: "width: 46px;height: 46px;",
                                    display: params.row.picture == "" ? "none" : "inline-block"
                                },
                                on: {
                                    click: () => {}
                                }
                            },
                            [
                                h("img", {
                                    props: {
                                        type: "primary",
                                        size: "small",
                                        display: params.row.picture == "" ? "none" : "inline-block"
                                    },
                                    attrs: {
                                        src: params.row.picture,
                                        style: "width: 42px;height: 42px;"
                                    },
                                    style: {},
                                    on: {
                                        click: () => {
                                            this.viewImage = true;
                                            this.currentValue = params.row.picture;
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                },
                {
                    title: "状态",
                    key: "flag",
                    minWidth: 120,
                    sortable: false,
                    render: (h, params) => {
                        if(params.row.flag==1){
                            return h("span","已通过")
                        }else if(params.row.flag == 2){
                            return h("span","已拒绝")
                        }else if(params.row.flag == 0){
                            return h('span','待审核')
                        }
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    align: "center",
                    width: 300,
                    render: (h, params) => {
                        if(params.row.flag == 0){
                            return h("div",[
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "primary",
                                            size: "small",
                                            icon: "ios-create-outline"
                                        },
                                        style: {
                                            marginRight: "5px"
                                        },
                                        on: {
                                            click: () => {
                                                this.pass(params.row);
                                            }
                                        }
                                    },
                                    "通过"
                                ),
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "error",
                                            size: "small",
                                            icon: "md-trash"
                                        },
                                        style: {
                                            marginRight: "5px"
                                        },
                                        on: {
                                            click: () => {
                                                this.rejectApply(params.row);
                                            }
                                        }
                                    },
                                    "拒绝"
                                )
                            ]);
                        }
                        
                    
                    }
                }
                ],
                data: [], // 表单数据
                total: 0 // 表单数据总数
            };
        },
        methods: {
            selectDateRange(value){
                this.searchForm.startDate = value[0]
                this.searchForm.endDate = value[1]
            },

            init() {
                this.getDataList();
                this.getStoreList()
            },

            getStoreList(){
                this.postRequest('/storeTable/getAll').then(res =>{
                    if(res.success){
                        this.selectData = res.result
                    }
                })
            },
            changePage(v) {
                this.searchForm.pageNumber = v;
                this.getDataList();
                this.clearSelectAll();
            },
            changePageSize(v) {
                this.searchForm.pageSize = v;
                this.getDataList();
            },
            handleSearch() {
                this.searchForm.pageNumber = 1;
                this.searchForm.pageSize = 10;
                console.log(this.form)
                this.getDataList();
            },
            handleReset() {
                this.$refs.searchForm.resetFields();
                this.searchForm.pageNumber = 1;
                this.searchForm.pageSize = 10;
                // 重新加载数据
                this.getDataList();
            },
            changeSort(e) {
                this.searchForm.sort = e.key;
                this.searchForm.order = e.order;
                if (e.order === "normal") {
                this.searchForm.order = "";
                }
                this.getDataList();
            },
            clearSelectAll() {
                this.$refs.table.selectAll(false);
            },
            changeSelect(e) {
                this.selectList = e;
                this.selectCount = e.length;
            },
            getDataList() {
                this.loading = true;
                this.getRequest("/distributionVolume/getByPage",this.searchForm).then(res => {
                    this.loading = false;
                    if (res.success) {
                        this.total = res.result.total;              
                        this.data = res.result.records
                    }
                });   
            
            },
            
            pass(v){
                this.loading = true
                this.postRequest('/shopTicket/insertVolume',{userId: v.userId, flag: 1, id: v.id}).then(res =>{
                    this.loading = false
                    if(res.success){
                        this.getDataList()
                    }
                }).catch(error =>{

                })
            },

            rejectApply(v){
                this.loading = true
                this.postRequest('/shopTicket/insertVolume',{userId: v.userId, flag: 2, id: v.id}).then(res =>{
                    this.loading = false
                    if(res.success){
                        this.getDataList()
                    }
                }).catch(error =>{

                })
            },

            remove(v) {
                this.reject.orderBasicInfoId = v.id
                this.visible = true
            },

            submitReject(){
                this.$refs.reject.validate(valid => {
                if (valid) {
                    this.loading = true
                    this.getRequest("/order/store/storeRefuseOrder", this.reject).then(res => {
                    this.$Modal.remove();
                    if (res.success) {
                        this.visible = false
                        this.$Message.success("操作成功");
                        this.loading = false
                        this.getDataList();
                    }
                    });
                }
                
                })
            },

            sendOrder(item){
                this.loading = true
                this.getRequest('/order/store/storeDistributeOrder',{orderBasicInfoId: item.id}).then(res =>{
                if(res.success){
                    this.$Message.success("操作成功");
                    this.loading = false
                    this.getDataList();
                }
                })
            },

            getOrderInfo(v){
                this.getRequest('/order/get/'+v.id).then(res =>{
                    if(res.success){
                        this.form = res.result
                        console.log(this.form)
                        this.orderVisible = true
                    }    
                }).catch(error =>{
                    console.log(error)
                })
            }
        },
        mounted() {
            this.init();
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
    }
</style>