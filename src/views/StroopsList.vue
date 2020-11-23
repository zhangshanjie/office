<template>
<div class="search">
    <Row>
        <Col>
            <Card>
                <div>
                    <span>战队名称：</span>
                     <Input v-model="searchForm.teamName" style="width:15%" />
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

                <Modal title="编辑战队" v-model="modalVisible" :mask-closable='false' :width="500">
                    <Form  :label-width="100" >       
                        <FormItem label="战队名称:">
                            <Input v-model="advertising.teamName"/>
                        </FormItem>
                        <FormItem label="战队图片:">
                            <upload-pic-input v-model="advertising.teamAvatar" style="width:100%"></upload-pic-input>
                        </FormItem>
                        <FormItem label="战队公告:">
                            <Input v-model="advertising.teamAnnouncement"/>
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
        modalVisible:false,
        commodityTypeId:'',
        ivibe:'',
        advertising:{
            teamName:'',
            teamAvatar:'',
            teamAnnouncement:'',
            id:'',
        },
        searchForm: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
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
                title:'战队等级',
                key: 'teamLevel',
                minWidth:90,
                sortable:false,
            },
            {
                title:'战队贡献分',
                key: 'teamContributionPoints',
                minWidth:90,
                sortable:false,
            },
            {
                title:'战队成员人数',
                key: 'teamMembersNumber',
                minWidth:90,
                sortable:false,
            },
            {
                title:'战队排名',
                key: 'teamRanking',
                minWidth:90,
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
                            icon: "ios-create-outline"
                        },
                        style: {
                            marginRight: "5px"
                        },
                        on: {
                            click: () => {
                            this.compile(params.row);
                            }
                        }
                        },
                        "编辑战队"
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
        this.searchForm.pageNumber()
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
        this.loading = true;
        this.postRequest("/clubInfo/getByPage",this.searchfan).then(res => {
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
        this.postRequest("/clubInfo/getByPage",this.searchForm).then(res => {
            this.loading = false;
            if (res.success) {
                this.total = res.result.total;
                var dataList = res.result.records
                this.data=dataList
            }
            console.log(res)
        });
    },
    compile(v){//编辑按钮
        this.advertising.teamName=v.teamName
        this.advertising.teamAvatar=v.teamAvatar
        this.advertising.teamAnnouncement=v.teamAnnouncement
        this.advertising.id=v.id
        console.log(v)
        this.modalVisible=true
    },
    handleSubmit(){//编辑弹窗的确定按钮
        this.modalVisible=false
        this.postRequest('/clubInfo/updateClubInfo',this.advertising).then(res=>{
            if(res.success){
                this.$Message.success("编辑成功");
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