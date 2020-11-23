<template>
<div class="search">
    <Row>
        <Col>
            <Card>
                <br>
                <Form  :label-width="100" >
                    <Button @click="addBank" type="primary" icon="ios-search" style="margin-left: 10px">添加银行卡</Button>   
                    <br>
                    <br>
                    <span>名称：</span>
                    <Input  v-model="searchForm.title"  style="width:15%;margin-right: 20px"/>
                    <Button @click="sousuo" type="primary" icon="ios-search" style="margin-left: 10px">搜索</Button>    
                </Form>
                <!-- <Button @click="addprodct" type="primary" style=";margin-bottom: 15px;">添加运营活动</Button>  -->
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
                <Modal title="编辑" v-model="eldtisible" :mask-closable='false' :width="500">
                    <Form  :label-width="100" >       
                        <FormItem label="活动名称:">
                            <Input v-model="editform.title" />
                        </FormItem>
                        <FormItem label="是否开启:">
                            <el-radio v-model="editform.status" :label="1">开启</el-radio>
                            <el-radio v-model="editform.status" :label="2">关闭</el-radio>
                        </FormItem>
                        
                    </Form>
                    <div slot="footer">
                        <Button type="primary"  @click="eldtSubmit">确定</Button>
                    </div>
                </Modal>
                <Modal title="添加银行卡" v-model="addBankModal" :mask-closable='false' :width="500">
                    <Form  :label-width="100" >
                        <FormItem label="银行卡名称:">
                            <Input v-model="addbankform.title" />
                        </FormItem>
                    </Form>
                    <div slot="footer">
                        <Button type="primary"  @click="addBankbtn">确定</Button>
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
        selectDate:[],
        eldtisible:false,
        addBankModal:false,
        chartType:'',
        commodityTypeId:'',
        advertising:{
            adverType:'',
            image:'hah',
            sortNum:'',
        },
        huoform:{
            title:'',
            restricts:'',
            reward:'',
            fundType:'',
        },
        editform:{
            title:'',
            status:'1'
        },
        addbankform:{
            title:'',
            configurationInfoType:'3'
        },
        searchForm: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
            fundType:'',
            configurationInfoType:'3'
        },
        searchfan: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
            configurationInfoType:'3'
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
                title:'银行卡名称',
                key: 'title',
                minWidth:90,
                sortable:false,
            },
            {
                title:'状态',
                key: 'status',
                minWidth:90,
                sortable:false,
                 render:(h, params) =>{
                    if(params.row.status == '1'){
                        return h("span","开启")
                    }else if(params.row.status == '2'){
                        return h("span", '关闭')
                    }
                }
            },
            {
                title: "操作",
                key: "action",
                align: "center",
                width: 250,
                render: (h, params) => {
                    return h("div", [
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
                                    this.getOrderInfo(params.row);
                                }
                                }
                            },
                            "编辑"
                        ), 
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
    sousuo(){
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
    eldtSubmit(){
        this.postRequest("/configurationInfo/updateConfigurationInfo",this.editform).then(res => {
            if (res.success) {
                console.log(res)
                this.eldtisible=false
                this.$Message.success("修改成功");
                this.getDataList()
            }
        });
    },
    addBankbtn(){
        this.postRequest("/configurationInfo/saveConfigurationInfo",this.addbankform).then(res => {
            if (res.success) {
                console.log(res)
                this.addBankModal=false
                this.$Message.success("添加成功");
                this.getDataList()
            }
        });
    },
    addBank(){
        this.addbankform.title=''
        this.addBankModal=true
    },
    getOrderInfo(v){
        this.editform.title=v.title
        this.editform.id=v.id
        this.editform.status=v.status
        this.eldtisible=true
    },

    searcher(){
        this.searchForm.title=''
        this.loading = true;
        this.postRequest("/configurationInfo/getByPage",this.searchfan).then(res => {
            this.loading = false;
            if (res.success) {
                this.total = res.result.total;
                var dataList = res.result.records
                this.data=dataList
            }
        });
    },
    getDataList () {
        this.loading = true;
        this.postRequest("/configurationInfo/getByPage",this.searchForm).then(res => {
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