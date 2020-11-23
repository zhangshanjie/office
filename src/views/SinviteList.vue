<template>
<div class="search">
    <Row>
        <Col>
            <Card>
                <br>
                <Row class="operation">
                    <Button @click="handleDownload" icon="ios-search" type="primary" style="margin-left: 10px">导出</Button>
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
        educedata:[],
        chartType:'',
        commodityTypeId:'',
        searchForm: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
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
                title: "塘主昵称",
                key: "fishPondsUserNickName",
                minWidth: 120,
                sortable: false,
            },
            {
                title:'用户昵称',
                key: 'userNickName',
                minWidth:90,
                sortable:false,
            },
            {
                title:'塘主id',
                key: 'fishPondsUserId',
                minWidth:90,
                sortable:false,
            },
            {
                title: "用户id",
                key: "userId",
                minWidth: 120,
                sortable: false,
            },
            {
                title:'用户积分',
                key: 'userIntegral',
                minWidth:90,
                sortable:false,
            },
        ],
        data: [], // 表单数据
        total: 0 // 表单数据总数
    };
},
methods: {
    handleDownload() {
        this.educelist()//调用接口获取数据
        this.downloadLoading = true
        setTimeout(() => {
            import('./vendor/Export2Excel').then(excel => {
            const tHeader = ['塘主昵称','用户昵称','塘主id','用户id','用户积分']
            const filterVal = ['fishPondsUserNickName','userNickName','fishPondsUserId','userId','userIntegral']
            const list = this.educedata
            const data = this.formatJson(filterVal,list)
            console.log(excel)
            excel.export_json_to_excel({
                header:tHeader,
                data,
                filename:'导出列表名称',
                autoWidth:this.autoWidth,  
                bookType:this.bookType,  
                autoWidth:true,
                bookType:'xlsx',
            })
        })
        }, 2000);
    },
    // 导出
    formatJson(filterVal,jsonData) {
      return jsonData.map(v => filterVal.map(j => {
          return v[j]
      }))
    },

    educelist(){
        this.postRequest("/gameMembers/getExportByList",this.searchForm).then(res => {
            this.loading = false;
            if (res.success) {
                this.educedata = res.result
                console.log(res,'daochu')
            }
        });
    },
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
        this.getDataList()
    },
    replacement(){
        this.loading = true;
        this.postRequest("/gameMembers/getPcByPage",{pageNumber:1,pageSize:10}).then(res => {
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
        this.postRequest("/gameMembers/getPcByPage",this.searchForm).then(res => {
            this.loading = false;
            if (res.success) {
                this.total = res.result.total;
                var dataList = res.result.records
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