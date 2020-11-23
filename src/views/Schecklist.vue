<template>
<div class="search">
    <Row>
        <Col>
            <Card>
                <br>
                <div>
                    <span>战队名称：</span>
                     <Input v-model="searchForm.teamName" style="width:15%" />
                     <span style="margin-left:20px;">申请人姓名：</span>
                     <Input v-model="searchForm.applicantName" style="width:15%" />
                    <Button @click="seekwe" icon="ios-search" type="primary" style="margin-left: 10px">搜索</Button>
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

                <Modal title="审核" v-model="modalVisible" :mask-closable='false' :width="500">
                    <Form  :label-width="100" >       
                        <FormItem  label="审核状态:">
                            <Select v-model="advertising.reviewStatus" name="">
                                <Option :value="2">审核通过</Option>
                                <Option :value="3">审核失败</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="失败原因:" v-if="advertising.reviewStatus==3">
                            <Input v-model="advertising.causeOfFailure"/>
                        </FormItem>
                    </Form>
                    <div slot="footer">
                        <Button type="primary"  @click="handleSubmit">确定</Button>
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
        chartType:'',
        zhuang:'',
        modalVisible:false,
        commodityTypeId:'',
        ivibe:'',
        advertising:{
            reviewStatus:'',
            causeOfFailure:'',
            id:""
        },
        searchForm: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
            teamName:'',
            applicantName:'',
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
                title:'战队名称',
                key: 'teamName',
                minWidth:90,
                sortable:false,
            },
            {
                title: "战队图",
                key: "teamAvatar",
                minWidth: 120,
                sortable: false,
                 render: (h, params) => {
                    if (params.row.teamAvatar != null && params.row.teamAvatar != '' && params.row.teamAvatar != undefined) {
                    return h(
                        "div",
                        [
                        h("img", {
                            props: {
                            type: "primary",
                            size: "small",
                            display: params.row.teamAvatar == "" ? "none" : "inline-block"
                            },
                            attrs: {
                            src: params.row.teamAvatar,
                            style: "width: 100px;height: 100px;"
                            },
                            style: {},
                            on: {
                            click: () => {
                                this.viewImage = true;
                                this.currentValue = params.row.teamAvatar;
                            }
                            }
                        })
                        ]
                    );
                    }
                }
            },
            {
                title:'战队公告',
                key: 'teamAnnouncement',
                minWidth:90,
                sortable:false,
            },
            {
                title:'申请人姓名',
                key: 'applicantName',
                minWidth:90,
                sortable:false,
            },
            {
                title:'申请人头像',
                key: 'applicantAvatar',
                minWidth:90,
                sortable:false,
                 render: (h, params) => {
                    if (params.row.applicantAvatar != null && params.row.applicantAvatar != '' && params.row.applicantAvatar != undefined) {
                    return h(
                        "div",
                        [
                        h("img", {
                            props: {
                            type: "primary",
                            size: "small",
                            display: params.row.applicantAvatar == "" ? "none" : "inline-block"
                            },
                            attrs: {
                            src: params.row.applicantAvatar,
                            style: "width: 100px;height: 100px;"
                            },
                            style: {},
                            on: {
                            click: () => {
                                this.viewImage = true;
                                this.currentValue = params.row.applicantAvatar;
                            }
                            }
                        })
                        ]
                    );
                    }
                }
            },
            {
                title:'审核状态',
                key: 'reviewStatus',
                minWidth:90,
                sortable:false,
                render:(h, params) =>{
                    if(params.row.reviewStatus == 1){
                        return h("span","审核中")
                    }else if(params.row.reviewStatus == 2){
                        return h("span", '审核通过')
                    }else if(params.row.reviewStatus == 3){
                        return h("span", '审核失败')
                    }
                }
            },
            {
                title:'审核人姓名',
                key: 'reviewName',
                minWidth:90,
                sortable:false,
            },
            {
                title:'审核人头像',
                key: 'reviewAvatar',
                minWidth:90,
                sortable:false,
                 render: (h, params) => {
                    if (params.row.reviewAvatar != null && params.row.reviewAvatar != '' && params.row.reviewAvatar != undefined) {
                    return h(
                        "div",
                        [
                        h("img", {
                            props: {
                            type: "primary",
                            size: "small",
                            display: params.row.reviewAvatar == "" ? "none" : "inline-block"
                            },
                            attrs: {
                            src: params.row.reviewAvatar,
                            style: "width: 100px;height: 100px;"
                            },
                            style: {},
                            on: {
                            click: () => {
                                this.viewImage = true;
                                this.currentValue = params.row.reviewAvatar;
                            }
                            }
                        })
                        ]
                    );
                    }
                }
            },
            {
                title:'创建时间',
                key: 'createTime',
                minWidth:120,
                sortable:false,
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
                                icon: "ios-create-outline",
                                disabled:(params.row.reviewStatus != 1)
                            },
                            style: {
                                marginRight: "5px"
                            },
                            on: {
                                click: () => {
                                this.approve(params.row);
                                }
                            }
                        },
                        "审核"
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
    seekwe(){
        this.searchForm.pageNumber=1
        this.getDataList();
    },
     uploadFile (file) {
         console.log(file)
        this.postRequest('/alioss/upload?file='+file).then(res=>{
            this.advertising.image=res
            console.log(res)
        })
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
        this.searchForm.teamName=''
        this.searchForm.applicantName=''
        this.loading = true;
        this.postRequest("/reviewClubInfo/getByPage",this.searchfan).then(res => {
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
        this.postRequest("/reviewClubInfo/getByPage",this.searchForm).then(res => {
            this.loading = false;
            if (res.success) {
                this.total = res.result.total;
                var dataList = res.result.records
                this.data=dataList
            }
            console.log(res)
        });
    },
    approve(v){//控制编辑弹出按钮
        this.zhuang=v.reviewStatus
        this.advertising.id=v.id
        this.modalVisible=true,
        console.log(v)
    },
    handleSubmit(){
        this.modalVisible=false
        this.postRequest('/reviewClubInfo/updateReviewClubInfo',this.advertising).then(res=>{
            if(res.success){
                this.$Message.success("审核成功");
                this.getDataList()
            }
        })
    },
    remove(v){//删除按钮
        console.log(v)
         this.$Modal.confirm({
            title: "确认删除",
            content: "您确认要删除?",
            loading: true,
            onOk: () => {
            // 删除
            this.postRequest("/adverInfo/delByIds?ids=" + v.id).then(res => {
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