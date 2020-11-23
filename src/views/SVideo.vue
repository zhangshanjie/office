<template>
<div class="search">
    <Row>
        <Col>
            <Card>
                <br>
                <Row class="operation">
                    <span style="margin:0 5px 0 0px">类型:</span>
                    <Select style="width:20%" v-model="searchForm.type">
                        <Option value="1">生活</Option>
                        <Option value="2">黑坑</Option>
                        <Option value="3">教学</Option>
                        <Option value="4">装备</Option>
                        <Option value="5">路亚</Option>
                        <Option value="6">野钓</Option>
                        <Option value="7">试用</Option>
                    </Select>
                    <span style="margin:0 5px 0 20px">标题:</span>
                    <Input v-model="searchForm.title" style="width:20%"/>
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

                <Modal  title="视频详情" v-model="spdetails" :mask-closable='false' :width="600">
                    <Form  :label-width="100" >
                        <FormItem label="封面图:">
                            <img :src="videodata.image" alt="" style="width: 100px;height: 100px;">
                        </FormItem>
                        <FormItem label="视频:">
                            <video :src="videodata.video" controls  style="width:300px;height: 300px;"></video>
                        </FormItem>
                        <FormItem label="标题:">
                            <div>{{videodata.title}}</div>
                        </FormItem>
                        <FormItem label="地址:">
                            <div>{{videodata.address}}</div>
                        </FormItem>
                        <FormItem label="鱼塘类型:">
                            <!-- <img :src="" alt="" style="width:100px;height:100px"> -->
                            <div v-if="videodata.type==1">生活</div>
                            <div v-if="videodata.type==2">黑坑</div>
                            <div v-if="videodata.type==3">教学</div>
                            <div v-if="videodata.type==4">装备</div>
                            <div v-if="videodata.type==5">路亚</div>
                            <div v-if="videodata.type==6">野钓</div>
                            <div v-if="videodata.type==7">使用</div>
                        </FormItem>
                        <FormItem label="点赞数量:">
                            <div>{{videodata.likeCount}}</div>
                        </FormItem>
                    </Form>
                    <div slot="footer">
                        <Button type="primary" @click="spdetails=false" >确定</Button>
                    </div>
                </Modal>

                <Modal  title="删除" v-model="popshen" :mask-closable='false' :width="600">
                    <Form  :label-width="100" >
                        <FormItem label="删除原因:">
                            <el-input style="width:80%" type="textarea" :rows="2" placeholder="请输入删除原因" v-model="reasonAuditFailure"></el-input>
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
        videodata:{},
        searchForm: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
            type:'',
            title:'',
        },
        approvalStatus:2,
        reasonAuditFailure:'',
        chenkid:'',

        type:'',
        spdetails:false,
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
                title:'标题',
                key: 'title',
                minWidth:90,
                sortable:false,
            },
            {
                title: "封面图",
                key: "image",
                minWidth: 120,
                sortable: false,
                 render: (h, params) => {
                    if (params.row.image != null && params.row.image != '' && params.row.image != undefined) {
                    return h(
                        "div",
                        [
                        h("img", {
                            props: {
                            type: "primary",
                            size: "small",
                            display: params.row.image == "" ? "none" : "inline-block"
                            },
                            attrs: {
                            src: params.row.image,
                            style: "width: 100px;height: 100px;"
                            },
                            style: {},
                            on: {
                            click: () => {
                                this.viewImage = true;
                                this.currentValue = params.row.image;
                            }
                            }
                        })
                        ]
                    );
                    }
                }
            },
            {
                title: "地址",
                key: "address",
                minWidth: 200,
                sortable: false,
            },
            {
                title: "类型",
                key: "type",
                minWidth: 120,
                sortable: false,
                 render:(h, params) =>{
                    if(params.row.type == '1'){
                        return h("span","生活")
                    }else if(params.row.type == '2'){
                        return h("span", '黑坑')
                    }else if(params.row.type == '3'){
                        return h("span", '教学')
                    }else if(params.row.type == '4'){
                        return h("span", '装备')
                    }else if(params.row.type == '5'){
                        return h("span", '路亚')
                    }else if(params.row.type == '6'){
                        return h("span", '野钓')
                    }else if(params.row.type == '7'){
                        return h("span", '试用')
                    }
                }
            },
            {
                title: "分类",
                key: "classification",
                minWidth: 120,
                sortable: false,
                 render:(h, params) =>{
                    if(params.row.classification == '1'){
                        return h("span","视频")
                    }else if(params.row.classification == '2'){
                        return h("span", '文章')
                    }
                }
            },
            {
                title: "点赞数量",
                key: "likeCount",
                minWidth: 120,
                sortable: false,
            },
            {
                title: "评论数量",
                key: "reviewsNumber",
                minWidth: 120,
                sortable: false,
            },
            {
                title: "审核状态",
                key: "approvalStatus",
                minWidth: 120,
                sortable: false,
                 render:(h, params) =>{
                    if(params.row.approvalStatus == '1'){
                        return h("span","通过")
                    }else if(params.row.approvalStatus == '2'){
                        return h("span", '未通过')
                    }
                }
            },
            {
            title: "操作",
            key: "action",
            align: "center",
            width: 260,
            render: (h, params) => {
                return h("div", [
                    h(
                        "Button",
                        {
                            props: {
                                type: "error",
                                size: "small",
                                icon: "md-trash"
                            },
                            style: {
                            marginRight: "5px"
                            },
                            on: {
                            click: () => {
                                this.checkd(params.row);
                            }
                            }
                        },
                        "删除"
                    ),
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
                        "详情"
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
         if(this.searchForm.type==undefined){this.searchForm.type=''}
         if(this.searchForm.title==undefined){this.searchForm.title=''}
        this.getDataList()
    },
    replacement(){
        this.searchForm.type='',
        this.searchForm.title='',
        this.loading = true;
        this.postRequest("/shortVideo/getByPage",{pageNumber:1,pageSize:10}).then(res => {
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
    getOrderInfo(v){
        console.log(v,'ssss')
        this.spdetails=true
        this.videodata=v
    },
    getDataList () {
        this.loading = true;
        this.postRequest("/shortVideo/getByPage",this.searchForm).then(res => {
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