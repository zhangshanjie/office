<template>
<div class="search">
    <Row>
        <Col>
            <Card>
                <br>
                <Row class="operation">
                    <span style="margin:0 5px 0 0px">发放状态:</span>
                    <Select style="width:20%" v-model="searchForm.status">
                        <Option value="2">已发放</Option>
                        <Option value="1">未发放</Option>
                    </Select>
                    <span style="margin:0 5px 0 20px">用户名:</span>
                    <Input v-model="searchForm.userNickName" style="width:20%"/>
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
        selectDate:[],
        chartType:'',
        commodityTypeId:'',
         searchForm: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
            startDate:'',
            endDate:'',
            status:'',
            userNickName:'',
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
                title:'用户名',
                key: 'userNickName',
                minWidth:90,
                sortable:false,
            },
            {
                title:'原等级',
                key: 'originalGrade',
                minWidth:90,
                sortable:false,
            },
            {
                title: "升级等级",
                key: "upgradeHistoryGrade",
                minWidth: 120,
                sortable: false,
            },
            {
                title:'升级时间',
                key: 'createTime',
                minWidth:120,
                sortable:false,
            },
            {
                title: "奖励",
                key: "reward",
                minWidth: 120,
                sortable: false,
            },
            {
                title: "发放时间",
                key: "issueTime",
                minWidth: 120,
                sortable: false,
            },
            {
                title: "发放状态",
                key: "status",
                minWidth: 120,
                sortable: false,
                render:(h, params) =>{
                    if(params.row.status==2|| params.row.upgradeHistoryGrade==1 || params.row.upgradeHistoryGrade==2){
                        return h("span","已发放")
                    }else if(params.row.status == '1'){
                        return h("span", '未发放')
                    }
                }
            },
            {
                title: "发放人",
                key: "issuerId",
                minWidth: 120,
                sortable: false,
            },
            {
            title: "操作",
            key: "action",
            align: "center",
            width: 230,
            render: (h, params) => {
                return h("div", [
                    h(
                        "Button",
                        {
                            props: {
                            type: "primary",
                            size: "small",
                            icon: 'ios-create-outline',
                            disabled:(params.row.status==2|| params.row.upgradeHistoryGrade==1 || params.row.upgradeHistoryGrade==2)
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
                        (params.row.status==2|| params.row.upgradeHistoryGrade==1 || params.row.upgradeHistoryGrade==2)?"已发放":"未发放"
                    )
                ]);
            }
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
        if(this.searchForm.status==undefined){
            this.searchForm.status=''
        }
        if(this.searchForm.userNickName==undefined){
            this.searchForm.userNickName=''
        }
        this.getDataList()
    },
    replacement(){
        this.searchForm.status=''
        this.searchForm.userNickName=''
        this.loading = true;
        this.postRequest("/upgradeHistory/getPcByPage",{pageNumber:1,pageSize:10}).then(res => {
            this.loading = false;
            if (res.success) {
                this.total = res.result.total;
                var dataList = res.result.records
                this.data=dataList
            }
            console.log(res)
        });
    },
    details(v){
        console.log(v)
        this.postRequest("/upgradeHistory/updateUpgradeHistory",{id:v.id,status:'2'}).then(res => {
            if (res.success) {
               this.$Message.success("奖励发放成功");
               this.getDataList()
            }
            console.log(res)
        });
    },
    getDataList () {
        this.loading = true;
        this.postRequest("/upgradeHistory/getPcByPage",this.searchForm).then(res => {
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