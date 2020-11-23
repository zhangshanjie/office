<template>
<div class="search">
    <Row>
        <Col>
            <Card>
                <br>
                <div>
                    <span>时间：</span>
                    <DatePicker 
                        type="datetimerange"
                        format="yyyy-MM-dd HH:mm:ss"
                        clearable
                        @on-change="selectDateRange"
                        placeholder="请选择时间可不选"
                        style="width:300px">
                    </DatePicker>
                    <span style="margin-left: 15px">用户昵称：</span>
                    <Input v-model="searchForm.userNickName" placeholder="输入标题" style="width:15%;"/>
                    <Button @click="shousuo" icon="ios-search" type="primary" style="margin-left: 10px">搜索</Button>
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
export default {
data() {
    return {
        loading: true, // 表单加载状态
        selectDate:[],
        chartType:'',
        commodityTypeId:'',
        ivibe:'',
        searchForm: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
            startDate:'',
            endDate:'',
            userNickName:''
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
                title:'用户名',
                key: 'userNickName',
                minWidth:90,
                sortable:false,
            },
            {
                title:'修改时间',
                key: 'createTime',
                minWidth:90,
                sortable:false,
            },
            {
                title:'修改前渔币',
                key: 'originalFishCoin',
                minWidth:90,
                sortable:false,
            },
            {
                title:'修改后渔币',
                key: 'nowFishCoin',
                minWidth:90,
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
    shousuo(){
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
    selectDateRange(value){//选择时间
        this.searchForm.startDate = value[0]
        this.searchForm.endDate = value[1]
    },
    searcher(){
        this.userNickName='',
        this.loading = true;
        this.postRequest("/adjustmentRecord/getPcByPage",this.searchfan).then(res => {
            this.loading = false;
            if (res.success) {
                this.total = res.result.total;
                var dataList = res.result.records
                this.data=dataList
            }
            console.log(res)
        });
    },
    getDataList () {
        this.loading = true;
        this.postRequest("/adjustmentRecord/getPcByPage",this.searchForm).then(res => {
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
        font-size: 13px
    }
    .photo{
        width: 100px;
        height: 100px;
        border-radius: 100px;
    }
}
</style>