<template>
<div class="search">
    <Row>
        <Col>
            <Card>
                <br>
                <div>
                    <span>资金类型：</span>
                     <Select v-model="searchForm.fundType" style="width:15%">
                        <Option value="1">支付宝 </Option>
                        <Option value="2">微信</Option>
                        <Option value="3">鱼票</Option>
                        <Option value="4">鱼币 </Option>
                        <Option value="5">鱼泡</Option>
                    </Select>
                    <span style="margin-left: 15px;">方式：</span>
                     <Select v-model="searchForm.direction" style="width:15%">
                        <Option value="1">支出</Option>
                        <Option value="2">支入</Option>
                    </Select>
                    <span style="margin-left: 15px;">时间查询：</span>
                    <Date-picker 
                    type="daterange" 
                    @on-change="handleChange"
                    placement="bottom-end" 
                    placeholder="选择日期" 
                    style="width: 200px">
                    </Date-picker>
                    <Button @click="getDataList" icon="ios-search" type="primary" style="margin-left: 10px">搜索</Button>
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
        selectDate:[],
        chartType:'',
        commodityTypeId:'',
        advertising:{
            adverType:'',
            image:'hah',
            sortNum:'',
        },
        searchForm: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
            outType:3,
            fundType:'',
            direction:'',
            startDate:'',
            endDate:'',
        },
        searchfan: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
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
            width: 60,
            align: "center"
            },
            {
                title:'资金类型',
                key: 'fundType',
                minWidth:90,
                sortable:false,
                 render:(h, params) =>{
                    if(params.row.fundType == '1'){
                        return h("span","支付宝")
                    }else if(params.row.fundType == '2'){
                        return h("span", '微信')
                    }else if(params.row.fundType == '3'){
                        return h("span", '渔票')
                    }else if(params.row.fundType == '4'){
                        return h("span", '渔币')
                    }else if(params.row.fundType == '5'){
                        return h("span", '渔泡')
                    }
                }
            },
            {
                title:'金额',
                key: 'amount',
                minWidth:90,
                sortable:false,
            },
            {
                title:'方式',
                key: 'direction',
                minWidth:90,
                sortable:false,
                 render:(h, params) =>{
                    if(params.row.direction == '1'){
                        return h("span","支出")
                    }else if(params.row.direction == '2'){
                        return h("span", '支入')
                    }
                }
            },
            {
                title:'输出类型',
                key: 'outType',
                minWidth:90,
                sortable:false,
                 render:(h, params) =>{
                    if(params.row.outType == '1'){
                        return h("span","支付")
                    }else if(params.row.outType == '2'){
                        return h("span", '充值')
                    }else if(params.row.outType == '3'){
                        return h("span", '转账')
                    }else if(params.row.outType == '4'){
                        return h("span", '赛事报名')
                    }
                }
            },
            {
                title:'用户昵称',
                key: 'userNickName',
                minWidth:90,
                sortable:false,
            },
            {
                title:'时间',
                key: 'createTime',
                minWidth:200,
                sortable:false,
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
        this.loading = true;
        this.searchForm={}
        this.postRequest("/fundingDetails/getPcByPage",this.searchfan).then(res => {
            this.loading = false;
            if (res.success) {
                this.total = res.result.total;
                var dataList = res.result.records
                this.data=dataList
            }
        });
    },
    handleChange(v){
        console.log(v)
        this.searchForm.startDate=v[0]
        this.searchForm.endDate=v[1]
    },
    getDataList () {
        if(this.searchForm.fundType==undefined){
            this.searchForm.fundType=''
        }
        if(this.searchForm.direction==undefined){
            this.searchForm.direction=''
        }
        this.loading = true;
        this.postRequest("/fundingDetails/getPcByPage",this.searchForm).then(res => {
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
        font-size: 13px;
        
    }
    .photo{
        width: 100px;
        height: 100px;
        border-radius: 100px;
    }
}
</style>