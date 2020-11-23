<template>
<div class="search">
    <Row>
        <Col>
            <Card>
                <br>
                <div>
                    <span>资金类型：</span>
                     <Select v-model="searchForm.paymentMethod" style="width:15%">
                        <Option value="1">支付宝 </Option>
                        <Option value="2">微信</Option>
                        <Option value="3">渔票支付</Option>
                    </Select>
                    <span style="margin-left: 15px;">订单类型：</span>
                     <Select v-model="searchForm.orderType" style="width:15%">
                        <Option value="2">待发货</Option>
                        <Option value="3">待收货</Option>
                        <Option value="4">待评价 </Option>
                        <Option value="5">退款中</Option>
                        <Option value="6">退款完成</Option>
                        <Option value="7">取消订单</Option>
                        <Option value="8">已完成</Option>
                    </Select>
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
                    <Button @click="seekwe" icon="ios-search" type="primary" style="margin-left: 10px">搜索</Button>
                </div>
                <br>
                <Row class="operation">
                    <Button @click="searcher" icon="md-refresh">刷新</Button>
                </Row>
                <Row>
                    <Table :loading="loading" border :columns="columns" :data="data" ref="table" sortable="custom" @on-selection-change="changeSelect"></Table>
                </Row>
                <Row type="flex" justify="end" class="page">
                    <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
                </Row>
                <!-- 商品详情弹窗 -->
                <Modal  title="商品详情" v-model="spdetails" :mask-closable='false' :width="500">
                    <Form  :label-width="100" >       
                        <FormItem label="支付方式:">
                            <div v-if="detailsform.paymentMethod==1">支付宝</div>
                            <div v-if="detailsform.paymentMethod==2">微信</div>
                            <div v-if="detailsform.paymentMethod==3">渔票支付</div>
                        </FormItem>
                        <FormItem label="实付价格:">
                            <div>{{detailsform.paidPrice}}</div>
                        </FormItem>
                        <FormItem label="收货人:">
                            <div>{{detailsform.receiver}}</div>
                        </FormItem>
                        <FormItem label="收货人电话:">
                            <div>{{detailsform.consigneePhone}}</div>
                        </FormItem>
                        <FormItem label="收货人地址:">
                            <div>{{detailsform.recipientAddress}}</div>
                        </FormItem>
                        <FormItem label="商品规格详情:" v-for="item in orderGoodsList" :key="item.index">
                             <FormItem label="商品名称:">
                                <div>{{item.goodsName}}</div>
                            </FormItem>
                            <FormItem label="商品规格:">
                                <div>{{item.specificationName}}</div>
                            </FormItem>
                            <FormItem label="商品价格:">
                                <div>{{item.goodsPrice}}</div>
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

                
                <!-- 退款按钮弹窗 -->
                <Modal  title="退款" v-model="modalVisible" :mask-closable='false' :width="500">
                    <Form  :label-width="100" >       
                        <div v-for="item in orderList" :key="item.index">
                            <FormItem label="商品名称:">
                                <div>{{item.goodsName}}</div>
                            </FormItem>
                            <FormItem label="商品规格:">
                                <div>{{item.specificationName}}</div>
                            </FormItem>
                            <FormItem label="商品价格:">
                                <div>{{item.goodsPrice}}</div>
                            </FormItem>
                            <FormItem label="商品图片:">
                                <img :src="item.mainPhoto" alt="" style="width:100px;height:100px">
                            </FormItem>
                            <FormItem label="退款原因:" style="width: 80%">
                                <Input disabled v-model="item.reasonReturn"/>
                            </FormItem>
                            <FormItem label="退款说明:" style="width: 80%">
                                <Input disabled v-model="item.refundInstructions"/>
                            </FormItem>
                            <FormItem label="退款图片:">
                                <img :src="item.refundPicture" alt="" style="width:100px;height:100px">
                            </FormItem>
                            <div style="text-align: right;margin-right:0px">
                                <Button disabled type="primary" @click="" v-if="item.refundStatus==1">未退款</Button>
                                <Button  type="primary" @click="reimburse(item)" v-if="item.refundStatus==2">退款审核</Button>
                                <Button disabled type="primary" @click="" v-if="item.refundStatus==3">退款失败</Button>
                                <Button disabled type="primary" @click="" v-if="item.refundStatus==4">退款成功</Button>
                            </div>
                        </div>
                    </Form>
                    <div slot="footer">
                        <Button type="primary" @click="modalVisible=false">取消</Button>
                    </div>
                </Modal>
                <!-- 待退货弹窗 -->
                <Modal  title="退款详情" v-model="modalawait" :mask-closable='false' :width="610">
                    <Form  :label-width="100" >       
                        <FormItem label="商品规格详情:" v-for="item in orderGoodsList" :key="item.index">
                            <FormItem label="商品名称:">
                                <div>{{item.goodsName}}</div>
                            </FormItem>
                            <FormItem label="商品规格:">
                                <div>{{item.specificationName}}</div>
                            </FormItem>
                            <FormItem label="商品价格:">
                                <div>{{item.goodsPrice}}</div>
                            </FormItem>
                            <FormItem label="商品图片:">
                                <img :src="item.mainPhoto" alt="" style="width:100px;height:100px">
                            </FormItem>
                            <div style="text-align: right;margin-right:80px">
                                <Button disabled type="primary" @click="" v-if="item.refundStatus==1">未退款</Button>
                                <Button  type="primary" @click="inside(item)" v-if="item.refundStatus==2">退款审核</Button>
                                <Button disabled type="primary" @click="" v-if="item.refundStatus==3">退款失败</Button>
                                <Button disabled type="primary" @click="" v-if="item.refundStatus==4">退款成功</Button>
                            </div>
                        </FormItem>
                    </Form>
                    <div slot="footer">
                        <Button :disabled="actionFlag" type="primary" @click="waitsure">确定发货</Button>
                    </div>
                </Modal>
                <Modal  title="退款详情" v-model="modalinside" :mask-closable='false' :width="400">
                    <Form  :label-width="100" >       
                        <FormItem label="退款状态:">
                            <Select v-model="innerturn.goodsRefundStatus" style="width: 80%;">
                                <Option :value="4">同意</Option>
                                <Option :value="3">不同意</Option>
                            </Select>
                        </FormItem>
                        <FormItem v-if="innerturn.goodsRefundStatus==3" label="拒绝原因:" style="width: 85%;">
                            <Input v-model="innerturn.describes"/>
                        </FormItem>
                    </Form> 
                    <div slot="footer">
                        <Button type="primary" @click="insideta">确定</Button>
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
        spdetails:false,
        loading: true, // 表单加载状态
        modalVisible:false,
        modaldelivery:false,
        orderGoodsList:[],
        modalawait:false,//控制代发货弹窗
        modalinside:false,//退款弹窗
        orderList:[],
        searchForm: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
            orderClassification:'2',
            paymentMethod:'',
            orderType:'',
            orderId:'',
            startDate:'',
            endDate:''
        },
        physical:{
            logisticsCompany:'',
            shipmentNumber:'',
            orderType:'3',
            id:'',
        },
        detailsform:{
            paymentMethod:'',   //支付方式(1.支付宝 2.微信 3.鱼票支付)
            paidPrice:'',   //实付价格
            payTime:'',   //付款时间
            receiver :'',  //收货人
            consigneePhone:'',  //收货人电话
            recipientAddress:'', //收货人地址
            fishPondName:'', //鱼塘名称
            fishPondImage:'',  //鱼塘图片

            goodsName:"" , //商品名称
            goodsPrice:"",//商品价格:
            specificationName:"" , //商品规格
            mainPhoto:"" ,//商品图片
        },
        reasonReturn:{
            id:"",
            orderType:'',
        },
        innerturn:{
            orderType:'6',
            id:"",//订单id
            goodsId:"",//商品id
            goodsRefundStatus:'',
            describes:''//退款原因
        },
        sendgoods:{
            id:"",
            orderType:'',
        },
        actionFlag: false,
        searchfan: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
            orderClassification:'2',
            paymentMethod:'',
        },
        type:'',
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
            width: 60,
            align: "center"
            },
            {
                title:'支付方式',
                key: 'paymentMethod',
                minWidth:90,
                sortable:false,
                render:(h, params) =>{
                    if(params.row.paymentMethod == '1'){
                        return h("span","支付宝")
                    }else if(params.row.paymentMethod == '2'){
                        return h("span", '微信')
                    }else if(params.row.paymentMethod == '3'){
                        return h("span", '渔票')
                    }
                }
            },
            {
                title:'订单号',
                key: 'id',
                minWidth:120,
                sortable:false,
            },
            {
                title:'总价格',
                key: 'totalCost',
                minWidth:80,
                sortable:false,
            },
            {
                title:'实付价格',
                key: 'paidPrice',
                minWidth:80,
                sortable:false,
            },
            {
                title:'付款时间',
                key: 'payTime',
                minWidth:110,
                sortable:false,
            },
             {
                title:'收货人',
                key: 'receiver',
                minWidth:90,
                sortable:false,
            },
            {
                title:'收货电话',
                key: 'consigneePhone',
                minWidth:90,
                sortable:false,
            },
            {
                title:'收货地址',
                key: 'recipientAddress',
                minWidth:90,
                sortable:false,
            },
            {
                title:'订单状态',
                key: 'orderType',
                minWidth:90,
                sortable:false,
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
                        return h("span", '退款中')
                    }else if(params.row.orderType == '6'){
                        return h("span", '退款完成')
                    }else if(params.row.orderType == '7'){
                        return h("span", '取消订单')
                    }else if(params.row.orderType == '8'){
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
                                this.prohibitRider(params.row);
                            }
                            }
                        },
                        params.row.isProductRefund==1? "退款审核" : "待发货"
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
                                this.prohibRider(params.row);
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
                                this.prohibitRider(params.row);
                            }
                            }
                        },
                        // "待收货"
                        params.row.isProductRefund==1? "退款审核" : "待收货"
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
                                this.evaluate(params.row);
                            }
                            }
                        },
                        "待评价"
                        ))
                        return h("div", actionList);
                    }
                    else if(params.row.orderType == 5){
                        actionList.push( h(
                        "Button",
                        {
                            props: {
                            type: "info",
                            size: "small",
                            },
                            style: {
                            marginRight: "5px"
                            },
                            on: {
                            click: () => {
                                this.refundz(params.row);
                            }
                            }
                        },
                        "退款审核"
                        ), )
                        return h("div",actionList);
                    }
                    else if(params.row.orderType == 6){
                            actionList.push( h(
                        "Button",
                        {
                            props: {
                            type: "success",
                            size: "small",
                            disabled: (params.row.orderType === 6)
                            },
                            style: {
                            marginRight: "5px"
                            },
                            on: {
                            click: () => {
                                this.prohibitRid(params.row);
                            }
                            }
                        },
                        "退款完成"
                        ), )
                        return h("div", actionList);
                    }else if(params.row.orderType == 7){
                        actionList.push(h(
                        "Button",
                        {
                            props: {
                            type: "success",
                            size: "small",
                            disabled: (params.row.orderType === 7)
                            },
                            style: {
                            marginRight: "5px"
                            },
                            on: {
                            click: () => {
                                this.delivery(params.row);
                            }
                            }
                        },
                        "已完成"
                        ))
                        return h("div", actionList);
                    }else if(params.row.orderType == 8){
                        actionList.push(h(
                        "Button",
                        {
                            props: {
                            type: "success",
                            size: "small",
                            disabled: (params.row.orderType === 8)
                            },
                            style: {
                            marginRight: "5px"
                            },
                            on: {
                            click: () => {
                                this.delivery(params.row);
                            }
                            }
                        },
                        "取消订单"
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
// computed:{
//     show(){
//         this.
//     }
// },
methods: {
    init() {
    this.getDataList();
    },
    seekwe(){
        this,searchForm.pageNumber=1
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
   waitsure(){
       this.modaldelivery=true
   },
   handleChange(v){
        console.log(v)
        this.searchForm.startDate=v[0]
        this.searchForm.endDate=v[1]
    },
    inside(v){
        this.innerturn.goodsRefundStatus=''
        this.innerturn.describes=''
        this.modalinside=true
        this.innerturn.goodsId=v.id
        // console.log(v)
    },
    insideta(){
        this.postRequest("/orderInfo/updateOrderInfo",this.innerturn).then(res => {
            if (res.success) {
                this.modalinside=false
                this.modalVisible=false
                this.modalawait=false
                this.getDataList()
                this.catalogueList()
                this.$Message.success("操作成功");
            }
        })
    },
    reimburse(v){
        this.innerturn.goodsRefundStatus="",
        this.innerturn.describes='',
        this.modalinside=true
        this.innerturn.goodsId=v.id
        this.getDataList()
    },
    physicalbtn(){//发货按钮
        this.postRequest("/orderInfo/updateOrderInfo",this.physical).then(res => {
            if (res.success) {
                this.modaldelivery=false
                this.modalawait=false
                this.getDataList()
                this.$Message.success("发货成功");
            }
        })
    },
    searcher(){//刷新按钮
        this.loading = true;
        this.searchForm={}
        this.postRequest("/orderInfo/getPcByPage",this.searchfan).then(res => {
            this.loading = false;
            if (res.success) {
                this.total = res.result.total;
                var dataList = res.result.records
                this.data=dataList
            }
        });
    },
    details(v){//详情按钮
        console.log(v)
        this.sendgoods.id=v.id
        this.spdetails=true
        this.catalogueList()
    },
    prohibitRider(v){//待发货按钮
        console.log(v)
        this.physical.id=v.id
        this.sendgoods.id=v.id
        this.modalawait=true
        this.catalogueList()
        this.physical.logisticsCompany="",
        this.physical.shipmentNumber=""
    },
    catalogueList(){
        this.postRequest('/orderInfo/getOrder',{id:this.sendgoods.id}).then(res=>{
            if(res.success){
                this.detailsform.paymentMethod=res.result.paymentMethod   //支付方式(1.支付宝 2.微信 3.鱼票支付)
                this.detailsform.paidPrice=res.result.paidPrice   //实付价格
                this.detailsform.payTime=res.result.payTime   //付款时间
                this.detailsform.receiver=res.result.receiver   //收货人
                this.detailsform.consigneePhone =res.result.consigneePhone  //收货人电话
                this.detailsform.recipientAddress =res.result.recipientAddress //收货人地址
                this.detailsform.fishPondName=res.result.fishPondName //鱼塘名称
                this.detailsform.fishPondImage =res.result.fishPondImage 
                this.orderGoodsList=res.result.orderGoodsList
                this.innerturn.id=res.result.id
                for(var i in this.orderGoodsList){
                    if(this.orderGoodsList[i].refundStatus == 2){
                        action = true
                    }
                }
            }
           console.log(res)
        })
    },
    getDataList () {
        if(this.searchForm.paymentMethod==undefined){
            this.searchForm.paymentMethod=''
        }
        if(this.searchForm.orderType==undefined){
            this.searchForm.orderType=''
        }
        this.loading = true;
        this.postRequest("/orderInfo/getPcByPage",this.searchForm).then(res => {
            this.loading = false;
            if (res.success) {
                this.total = res.result.total;
                var dataList = res.result.records
                this.data=dataList
            }
            console.log(res)
        });
    },
     tkclikbtn(){
        this.postRequest("/orderInfo/updateOrderInfo",this.reasonReturn).then(res => {
            if (res.success) {
                this.$Message.success("发货成功");
            }
        })
    },
    refundz(v){//退款审核
        this.modalVisible=true
        this.reasonReturn.id=v.id
        this.sendgoods.id=v.id
        console.log(v)
        this.reasonReturn.orderType=6
        this.orderList=v.orderGoodsList
        console.log(this.orderList,'tui kuang zhogn ')
        this.catalogueList()
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