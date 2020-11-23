<template>
<div class="search">
    <Row>
        <Col>
            <Card>
                <div>
                    <Button @click="addadvertising" icon="plus" type="primary" style="margin-left: 10px">添加广告</Button>
                </div>
                <br>
                <div>
                    <span>广告类型：</span>
                     <Select v-model="searchForm.adverType" style="width:30%">
                        <Option value="1">首页 </Option>
                        <Option value="2">钓点</Option>
                        <Option value="3">渔界竞钓</Option>
                        <Option value="4">圈子 </Option>
                        <Option value="5">商城</Option>
                        <Option value="6">渔具店</Option>
                        <Option value="7">订单</Option>
                        <Option value="8">我的战队</Option>
                        <Option value="9">我的粉丝</Option>
                        <Option value="10">我的收藏</Option>
                        <Option value="15">我的动态-帖子</Option>
                        <Option value="16">我的动态-直播</Option>
                        <Option value="17">我的动态-小视频</Option>
                        <Option value="18">赛事</Option>
                    </Select>
                    <Button @click="searcher" icon="ios-search" type="primary" style="margin-left: 10px">搜索</Button>
                </div>
                <br>
                <Row class="operation">
                    <Button @click="getDataList" icon="md-refresh">刷新</Button>
                    
                </Row>
                <Row>
                    <Table :loading="loading" border :columns="columns" :data="data" ref="table" sortable="custom" @on-selection-change="changeSelect"></Table>
                </Row>
                <Row type="flex" justify="end" class="page">
                    <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
                </Row>

                <Modal title="添加广告" v-model="modalVisible" :mask-closable='false' :width="500">
                    <Form  :label-width="100" >       
                        <FormItem label="广告类型:">
                            <Select v-model="advertising.adverType">
                                <Option value="1">首页 </Option>
                                <Option value="2">钓点</Option>
                                <Option value="3">渔界竞钓</Option>
                                <Option value="4">圈子 </Option>
                                <Option value="5">商城</Option>
                                <Option value="6">渔具店</Option>
                                <Option value="7">订单</Option>
                                <Option value="8">我的战队</Option>
                                <Option value="9">我的粉丝</Option>
                                <Option value="10">我的收藏</Option>
                                <Option value="15">我的动态-帖子</Option>
                                <Option value="16">我的动态-直播</Option>
                                <Option value="17">我的动态-小视频</Option>
                                <Option value="18">赛事</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="排序:">
                            <Input v-model="advertising.sortNum"/>
                        </FormItem>
                        <FormItem label="图片:">
                            <upload-pic-input v-model="advertising.image" style="width:100%"></upload-pic-input>
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
            adverType:'',
            image:'',
            sortNum:'',
        },
        searchForm: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
            adverType:'',
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
                title:'广告类型',
                key: 'adverType',
                minWidth:90,
                sortable:false,
                // render:(h, params) =>{
                //     if(params.row.adverType == 1){
                //         return h("span","首页")
                //     }else if(params.row.adverType == 2){
                    
                //         return h("span", '钓点')
                //     }else if(params.row.adverType == 3){
                //         return h("span", '鱼界竞钓')
                //     }else if(params.row.adverType == 4){
                //         return h("span", '圈子 ')
                //     }else if(params.row.adverType == 5){
                //         return h("span", '商城')
                //     }else if(params.row.adverType == 6){
                //         return h("span", '渔具店')
                //     }else if(params.row.adverType == 7){
                //         return h("span", '订单')
                //     }else if(params.row.adverType == 8){
                //         return h("span", '我的战队')
                //     }else if(params.row.adverType == 9){
                //         return h("span", '我的粉丝')
                //     }else if(params.row.adverType == 10){
                //         return h("span", '我的收藏 ')
                //     }else if(params.row.adverType == 15){
                //         return h("span", '我的动态-帖子')
                //     }else if(params.row.adverType == 16){
                //         return h("span", '我的动态-直播 ')
                //     }else if(params.row.adverType == 17){
                //         return h("span", '我的动态-小视频')
                //     }else if(params.row.adverType == 18){
                //         return h("span", '赛事')
                //     }
                // }
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
                                type: "error",
                                size: "small",
                                icon: "md-trash"
                            },
                            style: {
                                marginRight: "5px"
                            },
                            on: {
                                click: () => {
                                this.remove(params.row);
                                }
                            }
                        },
                        "删除"
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
    addadvertising(){
        this.modalVisible=true
    },
    searcher(){
        this.loading = true;
        // this.postRequest('/adverInfo/getByAdverTypeAll',{adverType:this.gLtype}).then(res=>{
        //     this.loading = false;
        //     if(res.success){
        //         this.total = res.result.length;
        //         var dataList = res.result
        //         this.data=dataList
        //         this.$Message.success("搜索成功");
        //     }
        //     console.log(res)
        // })
        this.getDataList()
    },
    getDataList () {
        this.loading = true;
        this.postRequest("/adverInfo/getByPage",this.searchForm).then(res => {
            this.loading = false;
            if (res.success) {
                this.total = res.result.total;
                var dataList = res.result.records
                this.data=dataList
            }
            console.log(res)
        });
    },
    handleSubmit(){
        this.modalVisible=false
        this.postRequest('/adverInfo/saveAdverInfo',this.advertising).then(res=>{
            if(res.success){
                this.$Message.success("添加成功");
                this.advertising=''
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