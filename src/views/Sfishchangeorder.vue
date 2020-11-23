<template>
<!-- 渔币兑换订单 -->
<div class="search">
    <Row>
        <Col>
            <Card>
                <br>
                <Row class="operation">
                    <span style="margin:0 5px 0 0px">订单状态:</span>
                    <Select style="width:12%" v-model="searchForm.orderType">
                        <!-- <Option value="1">待付款</Option> -->
                        <Option value="2">待发货</Option>
                        <Option value="3">待收货</Option>
                        <Option value="4">待评价</Option>
                        <Option value="5">已完成</Option>
                    </Select>
                    <span style="margin:0 5px 0 20px">收货人:</span>
                    <Input placeholder="请输入收货人" v-model="searchForm.receiver" style="width:12%"/>
                    <span style="margin:0 5px 0 20px">收货人电话:</span>
                    <Input placeholder="请输入收货人电话"  v-model="searchForm.consigneePhone" style="width:12%"/>
                    <!-- <span style="margin:0 5px 0 20px">下单人昵称:</span>
                    <Input placeholder="请输入昵称" v-model="searchForm.userNickName" style="width:12%"/> -->
                    <span style="margin-left: 15px;">时间查询：</span>
                    <Date-picker 
                    type="daterange" 
                    @on-change="handleChange"
                    placement="bottom-end" 
                    placeholder="选择日期" 
                    style="width: 200px">
                    </Date-picker>
                    <span style="margin-left: 15px;">订单号：</span>
                    <Input placeholder="请输入订单号"  v-model="searchForm.orderId"  style="width:15%;margin-right: 20px"/>
                    <Button @click="searcher" type="primary" icon="ios-search" style="margin-left: 10px">搜索</Button>
                </Row>
                <Row class="operation">
                    <Button @click="replacement" icon="md-refresh">刷新</Button>
                </Row>
                <Row>
                    <Table :loading="loading" border :columns="columns" :data="data" ref="table" sortable="custom" @on-selection-change="changeSelect"></Table>
                </Row>
                <Row type="flex" justify="end" class="page">
                    <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
                </Row>
                <Modal  title="删除" v-model="popshen" :mask-closable='false' :width="600">
                    <Form  :label-width="100" >
                        <FormItem label="删除原因:">
                            <!-- <Input v-model="reasonAuditFailure" style="width:80%;margin-right: 20px;"/> -->
                            <el-input  style="width:80%" type="textarea" :rows="2" placeholder="请输入删除原因" v-model="reasonAuditFailure"></el-input>
                        </FormItem>
                    </Form>
                    <div slot="footer">
                        <Button type="primary" @click="popshenbtn" >删除</Button>
                    </div>
                </Modal>
                <Modal  title="商品详情" v-model="spdetails" :mask-closable='false' :width="500">
                    <Form  :label-width="100" >       
                        <FormItem label="支付方式:">
                            <div v-if="detailsform.paymentMethod==3">渔币支付</div>
                        </FormItem>
                        <FormItem label="实付价格:">
                            <div>{{detailsform.paidPrice}}</div>
                        </FormItem>
                        <FormItem label="收货人:">
                            <div>{{detailsform.receiver}}</div>
                        </FormItem>
                        <FormItem label="运费:">
                            <div>{{detailsform.freight}}</div>
                        </FormItem>
                        <FormItem label="发货时间:">
                            <div>{{detailsform.deliveryTime}}</div>
                        </FormItem>
                        <FormItem label="收货人电话:">
                            <div>{{detailsform.consigneePhone}}</div>
                        </FormItem>
                        <FormItem label="收货人地址:">
                            <div>{{detailsform.recipientAddress}}</div>
                        </FormItem>
                        <FormItem label="商品规格详情:" v-for="item in exchangeOrderGoodsList" :key="item.index">
                             <FormItem label="商品名称:">
                                <div>{{item.goodsName}}</div>
                            </FormItem>
                            <FormItem label="商品id:">
                                <div>{{item.goodsId}}</div>
                            </FormItem>
                            <FormItem label="订单id:">
                                <div>{{item.orderId}}</div>
                            </FormItem>
                            <FormItem label="商品价格:">
                                <div>{{item.goodsPrice}}</div>
                            </FormItem>
                            <FormItem label="商品规格:">
                                <div>{{item.specificationName}}</div>
                            </FormItem>
                            <FormItem label="购买数量:">
                                <div>{{item.goodsQuantity}}</div>
                            </FormItem>
                            <FormItem label="商品图片:">
                                <img :src="item.mainPhoto" alt="" style="width:100px;height:100px">
                            </FormItem>
                        </FormItem>
                    </Form>
                    <div slot="footer">
                        <Button @click="spdetails=false" type="primary" >确定</Button>
                    </div>
                </Modal>
                <Modal  title="商品详情" v-model="modalawait"  :width="610">
                   <Form  :label-width="100" >       
                        <FormItem label="商品规格详情:" v-for="item in exchangeOrderGoodsList" :key="item.index">
                             <FormItem label="商品名称:">
                                <div>{{item.goodsName}}</div>
                            </FormItem>
                            <FormItem label="商品价格:">
                                <div>{{item.goodsPrice}}</div>
                            </FormItem>
                            <FormItem label="商品规格:">
                                <div>{{item.specificationName}}</div>
                            </FormItem>
                            <FormItem label="购买数量:">
                                <div>{{item.goodsQuantity}}</div>
                            </FormItem>
                            <FormItem label="商品图片:">
                                <img :src="item.mainPhoto" alt="" style="width:100px;height:100px">
                            </FormItem>
                        </FormItem>
                    </Form>
                    <div slot="footer">
                        <Button @click="spdensure" type="primary" >确定</Button>
                    </div>
                </Modal>
                <Modal  title="发货" v-model="modaldelivery" :mask-closable='false' :width="450">
                    <Form  :label-width="100" >       
                        <FormItem label="物流公司:" style="width: 85%;">
                            <Input v-model="physical.logisticsCompany"/>
                        </FormItem>
                        <FormItem  label="物流单号:" style="width: 85%;">
                            <Input v-model="physical.shipmentNumber"/>
                        </FormItem>
                    </Form> 
                    <div slot="footer">
                        <Button type="primary" @click="physicalbtn">确定</Button>
                    </div>
                </Modal>
            </Card>
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
        popshen:false,
        spdetails:false,
        modalawait:false,
        modaldelivery:false,
        detailsid:'',//每条数据的id
        selectDate:[],
        chartType:'',
        commodityTypeId:'',
        exchangeOrderdata:[],
        exchangeOrderGoodsList:[],
        physical:{
            logisticsCompany:'',
            shipmentNumber:'',
            orderType:'3',
            id:'',
        },
         searchForm: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
            orderClassification:'2',
            orderType:'',
            receiver:'',
            startDate:'',
            endDate:'',
            consigneePhone:'',
            userNickName:'',
            orderId:''
        },
        detailsform:{

        },
        approvalStatus:2,
        reasonAuditFailure:'',
        chenkid:'',

        type:'',
        prohibit:'',
        selectList: [], // 多选数据
        selectCount: 0, // 多选计数
        columns: [
            // 表头
            {
            type: "selection",
            width: 50,
            align: "center"
            },
            {
            type: "index",
            width: 50,
            align: "center"
            },
            {
                title:'支付方式',
                key: 'paymentMethod',
                minWidth:90,
                sortable:false,
                render:(h, params) =>{
                    if(params.row.paymentMethod == '3'){
                        return h("span","渔币支付")
                    }
                }
            },
            {
                title: "订单号",
                key: "id",
                minWidth: 130,
                sortable: false,
            },
            {
                title: "总价格",
                key: "totalCost",
                minWidth: 120,
                sortable: false,
            },
            {
                title: "实付价格",
                key: "paidPrice",
                minWidth: 120,
                sortable: false,
            },
            {
                title: "付款时间",
                key: "payTime",
                minWidth: 120,
                sortable: false,
            },
            {
                title: "收货人姓名",
                key: "receiver",
                minWidth: 120,
                sortable: false,
            },
            {
                title: "收货人联系电话",
                key: "consigneePhone",
                minWidth: 120,
                sortable: false,
            },
            {
                title: "收货人地址",
                key: "recipientAddress",
                minWidth: 120,
                sortable: false,
            },
            {
                title: "订单状态",
                key: "orderType",
                minWidth: 120,
                sortable: false,
                render:(h, params) =>{
                    if(params.row.orderType == '1'){
                        return h("span","待付款")
                    }else if(params.row.orderType == '2'){
                        return h("span", '待发货')
                    }else if(params.row.orderType == '3'){
                        return h("span", '待收货')
                    }else if(params.row.orderType == '4'){
                        return h("span", '待评价')
                    }else if(params.row.orderType == '5'){
                        return h("span", '已完成')
                    }
                }
            },
            {
                title: "操作",
                key: "action",
                align: "center",
                width: 200,
                render: (h, params) => {
                    let actionList=[
                        h(
                        "Button",
                        {
                            props: {
                            type: "primary",
                            size: "small",
                            icon: 'ios-create-outline'
                            },
                            style: {
                            marginRight: "5px"
                            },
                            on: {
                            click: () => {
                                this.details(params.row);
                            }
                            }
                        },
                        "详情"
                        )]
                    
                    if(params.row.orderType == 2){
                        actionList.push(h(
                        "Button",
                        {
                            props: {
                            type: "success",
                            size: "small",
                            },
                            style: {
                            marginRight: "5px"
                            },
                            on: {
                            click: () => {
                                this.awaitgood(params.row);
                            }
                            }
                        },
                        "待发货"
                        ), )
                    return h("div", actionList);
                    }else if(params.row.orderType == 1){
                        actionList.push(h(
                        "Button",
                        {
                            props: {
                            type: "success",
                            size: "small",
                            disabled: (params.row.orderType === 1)
                            },
                            style: {
                            marginRight: "5px"
                            },
                            on: {
                            click: () => {
                                this.awaitpayment(params.row);
                            }
                            }
                        },
                        "待付款"
                        ))
                        return h("div", actionList);
                    }else if(params.row.orderType == 3){
                        actionList.push(h(
                        "Button",
                        {
                            props: {
                            type: "success",
                            size: "small",
                            disabled: (params.row.orderType === 3 && (params.row.isProductRefund == 2 ||  params.row.isProductRefund == null))
                            },
                            style: {
                            marginRight: "5px"
                            },
                            on: {
                            click: () => {
                                this.awaitdelivery(params.row);
                            }
                            }
                        },
                        "待收货"
                        ))
                        return h("div", actionList);
                    }else if(params.row.orderType == 4){
                        actionList.push(h(
                        "Button",
                        {
                            props: {
                            type: "success",
                            size: "small",
                            disabled: (params.row.orderType === 4)
                            },
                            style: {
                            marginRight: "5px"
                            },
                            on: {
                            click: () => {
                                this.complete(params.row);
                            }
                            }
                        },
                        "已完成"
                        ))
                        return h("div", actionList);
                    }else{
                        return h("div",[
                            h(
                                "Button",{
                                props:{
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'ios-create-outline'
                                },
                                style:{
                                    marginRight: '5px'
                                },
                                on:{
                                    click:() =>{
                                    this.details(params.row)
                                    }
                                }
                                },
                                '详情'
                            ),
                        ])
                    }
                },
            }
        ],
        data: [], // 表单数据
        total: 0 // 表单数据总数
    };
},
methods: {
    init() {
    this.getDataList();
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
        this.searchForm.pageNumber=1
        if(this.searchForm.orderType==undefined){
            this.searchForm.orderType=""
        }
        if(this.searchForm.receiver==undefined){
            this.searchForm.receiver=""
        }
        if(this.searchForm.consigneePhone==undefined){
            this.searchForm.consigneePhone=""
        }
        if(this.searchForm.userNickName==undefined){
            this.searchForm.userNickName=""
        }
        if(this.searchForm.orderId==undefined){
            this.searchForm.orderId=""
        }
        this.getDataList()
    },
    replacement(){
        this.searchForm.orderType=""
        this.searchForm.receiver=""
        this.searchForm.consigneePhone=""
        this.searchForm.userNickName=""
        this.searchForm.orderId=''
        this.postRequest("/exchangeOrder/getPcByPage",{pageNumber:1,pageSize:10,orderClassification:'2'}).then(res => {
            this.loading = false;
            if (res.success) {
                this.total = res.result.total;
                var dataList = res.result.records
                this.data=dataList
            }
            console.log(res)
        });
    },
    handleChange(v){
        console.log(v)
        this.searchForm.startDate=v[0]
        this.searchForm.endDate=v[1]
    },
    getDataList () {
        this.loading = true;
        this.postRequest("/exchangeOrder/getPcByPage",this.searchForm).then(res => {
            this.loading = false;
            if (res.success) {
                this.total = res.result.total;
                var dataList = res.result.records
                this.data=dataList
            }
            console.log(res)
        });
    },
    physicalbtn(){
        this.postRequest("/exchangeOrder/updateExchangeOrder",this.physical).then(res => {
            if (res.success) {
                this.modaldelivery=false
                this.modalawait=false
                this.getDataList()
                this.$Message.success("发货成功");
            }
            console.log(res)
        });
    },
    spdensure(){
        this.modaldelivery=true
        this.physical.logisticsCompany=''
        this.physical.shipmentNumber=''
    },
    //待发货
    awaitgood(v){
        this.modalawait=true
        this.detailsid=v.id
        this.physical.id=v.id
        this.detailsdata()
    },

    //详情
    details(v){
        this.spdetails=true
        this.detailsid=v.id
        this.detailsdata()
    },
    detailsdata(){
         this.postRequest("/exchangeOrder/getExchangeOrder",{id:this.detailsid}).then(res => {
            if (res.success) {
                console.log(res)
                this.detailsform=res.result
                this.exchangeOrderGoodsList=res.result.exchangeOrderGoodsList
            }
        });
    },
    checkd(v){
        this.popshen=true
        this.chenkid=v.id
        this.reasonAuditFailure=""
        console.log(v,'sss')
    },
    popshenbtn(v){
        if(this.reasonAuditFailure==''){
            this.$Message.warning("请填写原因");
        }else{
            this.postRequest("/shortVideo/approvalShortVideo",{approvalStatus:this.approvalStatus,reasonAuditFailure:this.reasonAuditFailure,id:this.chenkid}).then(res => {
            if (res.success) {
                this.getDataList()
                this.$Message.success("操作成功");
                this.popshen=false
            }
            console.log(res)
        });
        }
    },
    remove(v){//删除按钮
        console.log(v)
         this.$Modal.confirm({
            title: "确认删除",
            content: "您确认要删除?",
            loading: true,
            onOk: () => {
            // 删除
            this.postRequest("/forumInfo/delByIds?ids=" + v.id).then(res => {
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
    stateDateRange(v){
        this.addfome.startTime=v
    },
    endDateRange(v){
        this.addfome.endTime=v
    }
},
mounted() {
        this.init();
        console.log(this.selectDate)
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