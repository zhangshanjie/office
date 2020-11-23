<template>
<div class="search">
    <Row>
        <Col>
            <Card>
                <div>
                    <Button @click="addprodct" type="primary" icon="ios-search" style="margin-left: 10px">添加优惠劵</Button> 
                </div>
                 <br>
                <div>
                    <Form  :label-width="100" >
                        <span>优惠券名称：</span>
                        <Input  v-model="searchForm.couponName"  style="width:15%;margin-right: 20px"/>

                        <!-- <span>优惠券类型：</span> -->
                        <!-- <Select v-model="searchForm.couponType"  style="width:15%;margin-right: 20px">
                            <Option value="1">全场通用</Option>
                            <Option value="2">新人专享</Option>
                        </Select> -->
                        <span>时间：</span>
                        <DatePicker 
                            type="datetimerange"
                            format="yyyy-MM-dd HH:mm:ss"
                            clearable
                            @on-change="selectDateRange"
                            placeholder="请选择时间可不选"
                            style="width:300px"></DatePicker>
                        <Button @click="seekwe" type="primary" icon="ios-search" style="margin-left: 10px">搜索</Button>    
                    </Form>
                </div>
                <br>
                <Row class="operation">
                    <Button @click=" searcher" icon="md-refresh">刷新</Button>
                </Row>
                <Row>
                    <Table :loading="loading" border :columns="columns" :data="data" ref="table" sortable="custom" @on-selection-change="changeSelect"></Table>
                </Row>
                <Row type="flex" justify="end" class="page">
                    <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
                </Row>
                <!-- 添加优惠劵 -->
                 <Modal title="添加优惠券" v-model="adddata" :mask-closable='false' :width="500">
                    <Form  :label-width="100" >       
                        <FormItem label="优惠券名称:">
                            <Input  v-model="addfome.couponName"/>
                        </FormItem>
                        <!-- <FormItem label="优惠券类型:">
                            <Select v-model="addfome.couponType" >
                                <Option value="1">全场通用</Option>
                                <Option value="2">新人专享</Option>
                            </Select>
                        </FormItem> -->
                        <FormItem label="满:">
                            <Input  v-model="addfome.fullMoney"/>
                        </FormItem>
                        <FormItem label="减:">
                            <Input  v-model="addfome.lessMoney"/>
                        </FormItem>
                        <FormItem label="开始时间:">
                            <Date-picker type="date" format="yyyy-MM-dd HH:mm:ss" @on-change="stateDateRange"  placeholder="选择日期" style="width: 200px"></Date-picker>
                        </FormItem>
                        <FormItem label="结束时间:">
                            <Date-picker type="date" format="yyyy-MM-dd HH:mm:ss" @on-change="endDateRange" placeholder="选择日期" style="width: 200px"></Date-picker>
                        </FormItem>
                        <FormItem label="优惠券状态:">
                            <Select v-model="addfome.couponStatus" >
                                <Option value="1">未开始</Option>
                                <Option value="2">已开始</Option>
                                <Option value="2">已失效</Option>
                            </Select>
                        </FormItem>
                    </Form>
                    <div slot="footer">
                        <Button type="primary"  @click="addDatapd">确定</Button>
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
        adddata:false,
        selectDate:[],
        chartType:'',
        searcherkey:'',
        commodityTypeId:'',
        searchForm: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
            startDate:'',
            endDate:'',
            couponName:'',
            couponType:1,
        },
        searchfan: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
            startDate:'',
            endDate:'',
            couponName:'',
            couponType:1,
        },
        addfome:{
            couponName:'',
            couponType:1,
            fullMoney:'',
            lessMoney:'',
            startTime:'',
            endTime:'',
            couponStatus:'',
        },
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
                title:'优惠劵名称',
                key: 'couponName',
                minWidth:90,
                sortable:false,
            },
            {
                title: "满",
                key: "fullMoney",
                minWidth: 120,
                sortable: false,
            },
            {
                title: "减",
                key: "lessMoney",
                minWidth: 120,
                sortable: false,
            },
            {
                title: "开始时间",
                key: "startTime",
                minWidth: 120,
                sortable: false,
            },
            {
                title: "结束时间",
                key: "endTime",
                minWidth: 120,
                sortable: false,
            },
            {
                title: "优惠劵状态",
                key: "couponStatus",
                minWidth: 120,
                sortable: false,
                 render:(h, params) =>{
                    if(params.row.couponStatus == '1'){
                        return h("span","未开始")
                    }else if(params.row.couponStatus == '2'){
                        return h("span", '进行中')
                    }else if(params.row.couponStatus == '3'){
                        return h("span", '已失效')
                    }
                }
            },
        ],
        data: [], // 表单数据
        total: 0 // 表单数据总数
    };
},
methods: {
    init() {
    this.getDataList();
    },
    seekwe(){
        this.searchForm.pageNumber=1
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
    searcher(){//搜索
        this.searchForm.fishSpecies='',
        this.loading = true;
        this.postRequest("/couponInfo/getByPage",this.searchfan).then(res => {
            this.loading = false;
            if (res.success) {
                this.total = res.result.total;
                var dataList = res.result.records
                this.data=dataList
            }
             console.log(res)
        });
    },
    addprodct(){
        this.adddata=true
        console.log('sfsdff')
    },
     selectDateRange(value){//选择时间
        this.searchForm.startDate = value[0]
        this.searchForm.endDate = value[1]
    },
    addDatapd(){
        this.postRequest("/couponInfo/saveCouponInfo",this.addfome).then(res => {
            if(res.success){
                this.$Message.success("操作成功");
                this.getDataList()
                this.adddata=false
            }
            console.log(res)
        })
    },
    getDataList () {
        this.loading = true;
        this.postRequest("/couponInfo/getByPage",this.searchForm).then(res => {
            this.loading = false;
            if (res.success) {
                this.total = res.result.total;
                var dataList = res.result.records
                this.data=dataList
            }
             console.log(res)
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