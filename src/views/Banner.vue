<template>
<div class="search">
    <Row>
        <Col>
            <Card>
                <div>
                    <Button @click="addadvertising(1)" icon="plus" type="primary" style="margin-left: 10px">添加Banner</Button>
                </div>
                <br>
                <div>
                    <span>广告位置：</span>
                     <Select v-model="searchForm.adverType" style="width:30%">
                        <Option value="1">首页 </Option>
                        <Option value="2">钓点</Option>
                        <Option value="3">渔界竞钓</Option>
                        <Option value="4">圈子 </Option>
                        <Option value="5">商城</Option>
                        <Option value="6">渔具店</Option>
               
                        <Option value="8">我的战队</Option>
                       
                        <Option value="18">赛事</Option>
                        <Option value="19">福利社</Option>
                    </Select>
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
                <Modal title="添加编辑广告" v-model="modalVisible" :mask-closable='false' :width="500">
                    <Form  :label-width="100" >       
                        <FormItem label="广告位置:">
                            <Select v-model="advertising.adverType">
                                <Option :value="1">首页 </Option>
                                <Option :value="2">钓点</Option>
                                <Option :value="3">渔界竞钓</Option>
                                <Option :value="4">圈子 </Option>
                                <Option :value="5">商城</Option>
                                <Option :value="6">渔具店</Option>
                                <!-- <Option :value="7">订单</Option> -->
                                <Option :value="8">我的战队</Option>
                                <!-- <Option :value="9">我的粉丝</Option> -->
                                <!-- <Option :value="10">我的收藏</Option> -->
                                <!-- <Option :value="15">我的动态-帖子</Option> -->
                                <!-- <Option :value="16">我的动态-直播</Option> -->
                                <!-- <Option :value="17">我的动态-小视频</Option> -->
                                <Option :value="18">赛事</Option>
                                <Option :value="19">福利社</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="标题:">
                            <Input placeholder="请输入标题" v-model="advertising.title"/>
                        </FormItem>
                        <FormItem  label="跳转类型:">
                            <Select v-model="advertising.jumpType" name="" id="">
                                <Option :value="1">不跳转</Option>
                                <Option :value="2">广告详情</Option>
                                <Option :value="3">外部链接</Option>
                                <Option :value="4">全国比赛</Option>
                                <Option :value="5">商品详情</Option>  
                                <Option :value="6">兑换商品详情</Option>
                                <Option :value="7">跳充值页面</Option>
                                <Option :value="8">跳兑换商品列表</Option> 
                            </Select>
                        </FormItem>
                        <FormItem v-if="advertising.jumpType=='3'" label="链接地址:">
                            <Input placeholder="链接地址必填" v-model="advertising.linkUrl"/>
                        </FormItem>
                        <FormItem label="内容:" v-if="advertising.jumpType=='2'">
                            <upload-pic-input placeholder="必选"  v-model="advertising.content" style="width:100%"></upload-pic-input>
                        </FormItem>
                        <FormItem v-if="advertising.jumpType=='5'||advertising.jumpType=='6'" label="跳转对象Id:">
                            <Input placeholder="跳转对象Id必填" v-model="advertising.gameId"/>
                        </FormItem>
                        <FormItem label="排序:">
                            <Input placeholder="值越小越靠前只能输入'整数'" v-model="advertising.sortNum"/>
                        </FormItem>
                        <FormItem label="图片:">
                            <upload-pic-input v-model="advertising.image" style="width:100%"></upload-pic-input>
                            <div>banner图片尺寸建议702*240</div>
                        </FormItem>
                    </Form>
                    <div slot="footer">
                        <Button type="primary"  @click="handleSubmit">确定</Button>
                    </div>
                </Modal>

                <Modal title="详情" v-model="modaldetails" :mask-closable='false' :width="500">
                    <Form  :label-width="100" >       
                        <FormItem label="广告类型:">
                            <Select v-model="advertising.adverType" disabled="disabled">
                                <Option :value="1">首页 </Option>
                                <Option :value="2">钓点</Option>
                                <Option :value="3">渔界竞钓</Option>
                                <Option :value="4">圈子 </Option>
                                <Option :value="5">商城</Option>
                                <Option :value="6">渔具店</Option>
                                <!-- <Option :value="7">订单</Option> -->
                                <Option :value="8">我的战队</Option>
                                <!-- <Option :value="9">我的粉丝</Option> -->
                                <!-- <Option :value="10">我的收藏</Option> -->
                                <!-- <Option :value="15">我的动态-帖子</Option> -->
                                <!-- <Option :value="16">我的动态-直播</Option> -->
                                <!-- <Option :value="17">我的动态-小视频</Option> -->
                                <Option :value="18">赛事</Option>
                                <Option :value="19">福利社</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="标题:">
                            <Input disabled v-model="advertising.title"/>
                        </FormItem>
                        <FormItem  label="跳转类型:">
                            <Select v-model="advertising.jumpType" name="" id="" disabled="disabled">
                                <Option :value="1">不跳转</Option>
                                <Option :value="2">广告详情</Option>
                                <Option :value="3">外部链接</Option>
                                <Option :value="4">全国比赛</Option>
                                <Option :value="5">商品详情</Option>  
                                <Option :value="6">兑换商品详情</Option> 
                                <Option :value="7">跳充值页面</Option>
                                <Option :value="8">跳兑换商品列表</Option> 
                            </Select>
                        </FormItem>
                        <FormItem v-if="advertising.jumpType=='3'" label="链接地址:" disabled="disabled">
                            <Input disabled v-model="advertising.linkUrl"/>
                        </FormItem>
                        <FormItem label="内容:" v-if="advertising.jumpType=='2'" >
                            <img :src="advertising.content" alt="" style=" width: 150px; height: 120px;">
                        </FormItem>
                        <FormItem label="排序:" disabled="disabled">
                            <Input disabled v-model="advertising.sortNum"/>
                        </FormItem>
                        <FormItem disabled="disabled" v-if="advertising.jumpType=='4'||advertising.jumpType=='5'||advertising.jumpType=='6'" label="跳转对象Id:">
                            <Input disabled v-model="advertising.gameId"/>
                        </FormItem>
                        <FormItem label="图片:">
                            <img :src="advertising.image" alt="" style=" width: 150px; height: 120px;">
                        </FormItem>
                        
                    </Form>
                    <div slot="footer">
                        <Button type="primary"  @click="modaldetails=false">确定</Button>
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
        modaldetails:false,//控制详情弹窗
        windowstype:"",//弹出类型
        advertising:{//轮播图数据
            adverType:'',
            image:'',
            sortNum:'',
            jumpType:'',//跳转类型
            linkUrl:'',//链接地址
            title:"",//标题
            content:'',//内容
            gameId:'',//全国比赛Id
            id:''
        },
        searchForm: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
            adverType:'',
        },
        searchfan: { // 搜索框初始化对象
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
            width: 60,
            align: "center"
            },
            {
                title:'广告位置',
                key: 'adverType',
                minWidth:90,
                sortable:false,
                render:(h, params) =>{
                    if(params.row.adverType == 1){
                        return h("span","首页")
                    }else if(params.row.adverType == 2){
                        return h("span", '钓点')
                    }else if(params.row.adverType == 3){
                        return h("span", '渔界竞钓')
                    }else if(params.row.adverType == 4){
                        return h("span", '圈子 ')
                    }else if(params.row.adverType == 5){
                        return h("span", '商城')
                    }else if(params.row.adverType == 6){
                        return h("span", '渔具店')
                    }else if(params.row.adverType == 8){
                        return h("span", '我的战队')
                    }else if(params.row.adverType == 18){
                        return h("span", '赛事')
                    }else if(params.row.adverType == 19){
                        return h("span", '福利社')
                    }
                }
            },
            {
                title:'标题',
                key: 'title',
                minWidth:90,
                sortable:false,
            },
            {
                title:'跳转类型',
                key: 'jumpType',
                minWidth:90,
                sortable:false,
                render:(h, params) =>{
                    if(params.row.jumpType == 1){
                        return h("span","不跳转")
                    }else if(params.row.jumpType == 2){
                        return h("span", '广告详情')
                    }else if(params.row.jumpType == 3){
                        return h("span", '外部链接')
                    }else if(params.row.jumpType == 4){
                        return h("span", '全国比赛 ')
                    }else if(params.row.jumpType == 5){
                        return h("span", '商商品详情')
                    }else if(params.row.jumpType == 6){
                        return h("span", '兑换商品详情')
                    }else if(params.row.jumpType == 7){
                        return h("span", '跳充值页面')
                    }else if(params.row.jumpType == 8){
                        return h("span", '跳兑换商品列表')
                    }
                }
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
            width: 280,
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
                            this.compile(params.row,2);
                            }
                        }
                        },
                        "编辑"
                    ),
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
                    h(
                        "Button",
                        {
                        props: {
                            type: "primary",
                            size: "small",
                        },
                        style: {
                            marginRight: "5px"
                        },
                        on: {
                            click: () => {
                            this.particulars(params.row);
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
    shousuo(){
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
    addadvertising(v){
        this.windowstype=v
        this.advertising={}
        this.modalVisible=true
    },
    searcher(){
        this.loading = true;
        this.postRequest("/adverInfo/getByPage",this.searchfan).then(res => {
            this.loading = false;
            if (res.success) {
                this.total = res.result.total;
                var dataList = res.result.records
                this.data=dataList
                this.searchForm.adverType=''
            }
            console.log(res)
        });
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
    bannertypeIf(){
        if(this.windowstype=='1'){
            this.postRequest('/adverInfo/saveAdverInfo',this.advertising).then(res=>{
                if(res.success){
                    this.modalVisible=false
                    this.$Message.success("添加成功");
                    this.getDataList()
                }
            })
        }else if(this.windowstype=='2'){
            this.postRequest('/adverInfo/updateAdverInfo',this.advertising).then(res=>{
                if(res.success){
                    this.modalVisible=false
                    this.$Message.success("编辑成功");
                    this.getDataList()
                }
            })
        }
    },
    handleSubmit(){
        if((this.advertising.jumpType==2) && this.advertising.content!='' && this.advertising.content!=null && this.advertising.content!=undefined){
            this.bannertypeIf()
        }else if(this.advertising.jumpType==3 && this.advertising.linkUrl!='' && this.advertising.linkUrl!=null && this.advertising.linkUrl!=undefined){
            this.bannertypeIf()
        }else if((this.advertising.jumpType==5||this.advertising.jumpType==6) && this.advertising.gameId!='' && this.advertising.gameId!=null && this.advertising.gameId!=undefined){
            this.bannertypeIf()
        }else if(this.advertising.jumpType==4||this.advertising.jumpType==1 || this.advertising.jumpType==7 || this.advertising.jumpType==8){
            this.bannertypeIf()
        }else{
            this.$Message.warning(" '内容'，或'链接地址'，或'跳转对象',不能为空");
        }
    },
    compile(v,s){//编辑
        this.advertising.adverType=v.adverType
        this.advertising.image=v.image
        this.advertising.sortNum=v.sortNum
        this.advertising.jumpType=v.jumpType
        this.advertising.linkUrl=v.linkUrl
        this.advertising.title=v.title
        this.advertising.content=v.content
        this.advertising.gameId=v.gameId
        this.advertising.id=v.id
        this.windowstype=s
        this.modalVisible=true
    },
    particulars(v){//详情按钮
        this.advertising.adverType=v.adverType
        this.advertising.image=v.image
        this.advertising.sortNum=v.sortNum
        this.advertising.jumpType=v.jumpType
        this.advertising.linkUrl=v.linkUrl
        this.advertising.title=v.title
        this.advertising.content=v.content
        this.advertising.gameId=v.gameId
        console.log(v)
        this.modaldetails=true
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