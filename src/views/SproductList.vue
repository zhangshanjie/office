<template>
<div class="search">
    <Row>
        <Col>
            <Card>
                <div>
                    <Button @click="addprodct" type="primary" icon="ios-search" style="margin-left: 10px">添加商品</Button> 
                </div>
                 <br>
                <div>
                    <Form  :label-width="100" >
                        <span>商品名称：</span>
                        <Input  v-model="searchForm.goodsName"  style="width:15%;margin-right: 20px"/>
                        <span>类型：</span>
                        <Select v-model="searchForm.goodsType"  style="width:15%;">
                            <Option value="1">鱼竿</Option>
                            <Option value="2">饵料</Option>
                            <Option value="3">鱼线</Option>
                            <Option value="4">装备</Option>
                            <Option value="5">配件</Option>
                        </Select>
                        <Button @click="seekwe" type="primary" icon="ios-search" style="margin-left: 10px">搜索</Button>    
                    </Form>
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
                <!-- 添加数据弹窗 -->
                <Modal title="添加数据" v-model="adddata" :mask-closable='false' :width="600">
                    <Form  :label-width="100" >       
                        <FormItem label="商品名称:">
                            <Input :maxlength='30' v-model="addfome.goodsName"/>
                        </FormItem>
                        <FormItem label="商品类型:">
                            <Select v-model="addfome.goodsType" >
                                <Option :value="1">鱼竿</Option>
                                <Option :value="2">饵料</Option>
                                <Option :value="3">鱼线</Option>
                                <Option :value="4">装备</Option>
                                <Option :value="5">配件</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="主图片:">
                            <upload-pic-input v-model="addfome.mainPhoto" style="width:100%"></upload-pic-input>
                        </FormItem>
                        <FormItem label="轮播图:">
                            <upload-pic-thumb @on-change="addfome.image=$event" style="width:100%" ref="uploadPicThumb"></upload-pic-thumb>
                        </FormItem>
                        <FormItem label="介绍图:">
                            <upload-pic-input v-model="addfome.introducePic" style="width:100%"></upload-pic-input>
                        </FormItem>
                        <FormItem label="价格:">
                            <Input  v-model="addfome.mallPrice"/>
                        </FormItem>
                        <FormItem label="商品规格:">
                            <br>
                            <div  v-for="(item,index) in addfome.goodsSpecificationJson">
                                <FormItem label="规格名称:" style="margin-bottom: 10px;">
                                    <Input v-model="item.specificationName" style="width:60%"/>
                                </FormItem>
                                <FormItem   label="价格:"style="margin-bottom: 10px;">
                                    <Input  type="number" v-model="item.specificationPrice" style="width:60%"/>
                                </FormItem>
                                <FormItem label="库存:"style="margin-bottom: 10px;">
                                    <Input v-model="item.inventory" style="width:60%"/>
                                </FormItem>
                                <FormItem label="图片:">
                                    <upload-pic-input v-model="item.image" style="width:60%"></upload-pic-input>
                                </FormItem>
                                <div class="deletesd" @click='removeds(index)'>
                                    移除
                                </div>
                            </div>
                            <div class="el-icon-plus" style=' margin-top: 38px;font-size: 15px;border: 1px solid #40a9ff;color: #40a9ff;padding: 5px;border-radius: 5px' @click='addguig'>添加规格</div>
                        </FormItem>
                    </Form>
                    <div slot="footer">
                        <Button type="primary"  @click="addDatapd(addfome)">确定</Button>
                    </div>
                </Modal>
                <!-- 详情弹窗 -->
                <Modal title="编辑数据" v-model="xiagnqing" :mask-closable='false' :width="500">
                    <Form  :label-width="100" >       
                        <FormItem label="商品名称:">
                            <span>{{detail.goodsName}}</span>
                        </FormItem>
                        <FormItem label="商品图片:">
                            <img :src="detail.mainPhoto" alt="" style="width: 100px; height:100px;border-radius: 100px">
                        </FormItem>
                        <FormItem label="介绍图:">
                            <img :src="detail.introducePic" alt="" style="width: 100px; height:100px;border-radius: 100px">
                        </FormItem>
                        <FormItem label="商品价格:">
                            <span>{{detail.mallPrice}}</span>
                        </FormItem>
                        <FormItem label="商品类型:">
                           <span v-if="detail.goodsType==1">鱼竿</span>
                           <span v-if="detail.goodsType==2">饵料</span>
                           <span v-if="detail.goodsType==3">鱼线</span>
                           <span v-if="detail.goodsType==4">装备</span>
                           <span v-if="detail.goodsType==5">配件</span>
                        </FormItem>
                        <FormItem label="轮播图:"> 
                           <span v-for="item in detail.image" :key="item.index">
                               <img :src="item" alt="" style="width: 80px; height:80px;">
                           </span>
                        </FormItem>
                        <div  v-for="(item,index) in detail.goodsSpecificationJson">
                            <div style="font-size:16px;margin-bottom:10px;font-weight: 600;">商品规格</div>
                            <FormItem label="规格名称:" style="margin-bottom: 10px;">
                                <Input disabled v-model="item.specificationName" style="width:60%"/>
                            </FormItem>
                            <FormItem label="价格:"style="margin-bottom: 10px;">
                                <Input disabled v-model="item.specificationPrice" style="width:60%"/>
                            </FormItem>
                            <FormItem label="库存:"style="margin-bottom: 10px;">
                                <Input disabled v-model="item.inventory" style="width:60%"/>
                            </FormItem>
                            <FormItem label="图片:">
                                <img :src="item.image" alt="" style="width:100px;height:100px">
                            </FormItem>
                        </div>
                    </Form>
                    <div slot="footer">
                        <Button type="primary"  @click="xiagnqing=false">确定</Button>
                    </div>
                </Modal>
            </Card>
        </Col>
    </Row>

</div>
</template>

<script>
import uploadPicInput from "@/views/my-components/xboot/upload-pic-input";
import uploadPicThumb from "@/views/my-components/xboot/upload-pic-thumb";
export default {
    components: {
        uploadPicInput,
        uploadPicThumb
    },
data() {
    return {
        loading: true, // 表单加载状态
        xiagnqing:false,
        adddata:false,
        chartType:'',
        searcherkey:'',
        commodityTypeId:'',
        searchForm: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
            goodsName:'',
            goodsType:'',
        },
        searchfan: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
            goodsName:'',
            goodsType:'',
        },
        form: {//编辑
            goodsName:'',
            mainPhoto:'',
            mallPrice:'',
            goodsSpecificationJson:'',
            id:'',
        },
        detail:{//详情
            goodsName:'',
            mainPhoto:'',
            mallPrice:'',
            goodsType:'',
            image:'',
            introducePic:'',
            specificationName:'',//规格名称
            specificationPrice:'',//规格价格
            goodsSpecificationJson:[]
        },
        addfome:{//添加商品
            goodsName:'',
            mainPhoto:'',
            mallPrice:'',
            goodsType:'',
            introducePic:"",
            id:'',
            image:[],
            goodsSpecificationJson:[
                {
                    specificationName:'',
                    specificationPrice:'',
                    inventory:'',
                    image:'',
                    id:''
                }
            ]
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
                title:'商品名称',
                key: 'goodsName',
                minWidth:90,
                sortable:false,
            },
            {
                title:'商品id',
                key: 'id',
                minWidth:90,
                sortable:false,
            },
            {
                title: "商品图片",
                key: "mainPhoto",
                minWidth: 100,
                sortable: false,
                render: (h, params) => {
                    if (params.row.mainPhoto != null && params.row.mainPhoto != '' && params.row.mainPhoto != undefined) {
                    return h(
                        "div",
                        [
                        h("img", {
                            props: {
                            type: "primary",
                            size: "small",
                            display: params.row.mainPhoto == "" ? "none" : "inline-block"
                            },
                            attrs: {
                            src: params.row.mainPhoto,
                            style: "width: 100px;height: 100px;"
                            },
                            style: {},
                            on: {
                            click: () => {
                                this.viewImage = true;
                                this.currentValue = params.row.mainPhoto;
                            }
                            }
                        })
                        ]
                    );
                    }
                }
            },
            {
            title: "商品类型",
                key: "goodsType",
                minWidth: 90,
                sortable: false,
                 render:(h, params) =>{
                    if(params.row.goodsType == '1'){
                        return h("span","鱼竿")
                    }else if(params.row.goodsType == '2'){
                        return h("span", '饵料')
                    }else if(params.row.goodsType == '3'){
                        return h("span", '鱼线')
                    }else if(params.row.goodsType == '4'){
                        return h("span", '装备')
                    }else if(params.row.goodsType == '5'){
                        return h("span", '配件')
                    }
                }
            },
            {
                title: "上下架状态",
                key: "isShelf",
                minWidth: 90,
                sortable: false,
                 render:(h, params) =>{
                    if(params.row.isShelf == '1'){
                        return h("span","上架")
                    }else if(params.row.isShelf == '2'){
                        return h("span", '下架')
                    }
                }
            },
            {
            title: "操作",
            key: "action",
            align: "center",
            width: 320,
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
                            type: "success",
                            size: "small",
                            icon: "ios-create-outline"
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
                        "详情"
                    ),
                     h(
                        "Button",
                        {
                            props: {
                            type: "warning",
                            size: "small",
                            icon: "ios-create-outline"
                            },
                            style: {
                            marginRight: "5px"
                            },
                            on: {
                            click: () => {
                                this.soldout(params.row);
                            }
                            }
                        },
                        params.row.isShelf==1?" 下架":"上架"
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
        this.addfome.mainPhoto = file
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
    addguig(){
        this.addfome.goodsSpecificationJson.push({
                    specificationName:'',
                    specificationPrice:'',
                    id:''
                })
        console.log(this.addfome.goodsSpecificationJson)
    },
    removeds(index){
        console.log(index)
        this.addfome.goodsSpecificationJson.splice(index,1)
    },
    searcher(){//刷新
        this.searchForm.goodsName=''
        this.searchForm.goodsType=''
        this.loading = true;
        this.postRequest("/goodsInfo/getByPcPage",this.searchfan).then(res => {
            this.loading = false;
            if (res.success) {
                this.total = res.result.total;
                var dataList = res.result.records
                this.data=dataList
            }
             console.log(res)
        });
    },
    soldout(v){
        console.log(v)
        this.postRequest("/goodsInfo/updateGoodsInfoByisShelf",{id:v.id}).then(res => {
            if (res.success) {
                this.$Message.success("操作成功");
                this.searcher()
            }
             console.log(res)
        });
    },
    remove(v){//删除按钮
        console.log(v)
         this.$Modal.confirm({
            title: "确认删除",
            content: "您确认要删除?",
            loading: true,
            onOk: () => {
            // 删除
            this.postRequest("/goodsInfo/delByIds?ids=" + v.id).then(res => {
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
    addprodct(){//添加按钮
        this.addfome.goodsSpecificationJson=[]
        this.addfome.goodsName=""
        this.addfome.mainPhoto=""
        this.addfome.mallPrice=""
        this.addfome.goodsType=""
        this.addfome.id=''
        this.addfome.introducePic=''
        this.addfome.image.length=0
        this.addfome.image = []
        this.$refs.uploadPicThumb.image = []
        this.$refs.uploadPicThumb.setData(this.addfome.image)
        console.log(this.$refs.uploadPicThumb)
        this.adddata=true
    },
    addDatapd(v){
        console.log(v,'dfdfgd')
        if(v.goodsSpecificationJson.length==0){
            this.$Message.error("不能没有商品规格");
        }else{
            if(v.id==""){
                this.postRequest("/goodsInfo/saveGoodsInfo",{
                    goodsName:this.addfome.goodsName,
                    mainPhoto:this.addfome.mainPhoto,
                    mallPrice:this.addfome.mallPrice,
                    goodsType:this.addfome.goodsType,
                    introducePic:this.addfome.introducePic,
                    image:this.addfome.image,
                    goodsSpecificationJson: JSON.stringify(this.addfome.goodsSpecificationJson)
                }).then(res => {
                    if(res.success){
                        this.$Message.success("添加成功");
                        this.adddata=false
                        this.getDataList()
                    }
                })
                console.log(this.addfome)
            }else{
                this.postRequest("/goodsInfo/updateGoodsInfo",{
                    goodsName:this.addfome.goodsName,
                    mainPhoto:this.addfome.mainPhoto,
                    mallPrice:this.addfome.mallPrice,
                    introducePic:this.addfome.introducePic,
                    goodsType:this.addfome.goodsType,
                    image:this.addfome.image,
                    id:this.addfome.id,
                    goodsSpecificationJson: JSON.stringify(this.addfome.goodsSpecificationJson)
                }).then(res => {
                    if(res.success){
                        this.$Message.success("编辑成功");
                        this.adddata=false
                        this.getDataList()
                    }
                })
            }
        }
    },
    details(v){//详情按钮
        console.log(v)
        this.xiagnqing=true
        this.postRequest("/goodsInfo/getGoodsInfo?goodsInfoId=" + v.id).then(res => {
            this.detail.goodsName=res.result.goodsName,
            this.detail.mainPhoto=res.result.mainPhoto,
            this.detail.introducePic=res.result.introducePic
            this.detail.mallPrice=res.result.mallPrice,
            this.detail.goodsType=res.result.goodsType,
            this.detail.goodsSpecificationJson=res.result.goodsSpecificationList
            this.detail.image=res.result.image.split(',')
            console.log(res)
        })
    },
    getOrderInfo(v){//编辑按钮
        this.addfome.goodsSpecificationJson=v.goodsSpecificationList
        this.addfome.goodsName=v.goodsName
        this.addfome.mainPhoto=v.mainPhoto
        this.addfome.mallPrice=v.mallPrice
        this.addfome.goodsType=v.goodsType
        this.addfome.id=v.id
        this.addfome.introducePic=v.introducePic
        this.addfome.image=v.image.split(',')
        this.$refs.uploadPicThumb.image = []
        this.$refs.uploadPicThumb.setData(this.addfome.image)
        console.log(this.$refs.uploadPicThumb)
        this.adddata=true
        console.log(v)
    },
    getDataList () {//获取列表
        this.loading = true;
        this.postRequest("/goodsInfo/getByPcPage",this.searchForm).then(res => {
            this.loading = false;
            if (res.success) {
                this.total = res.result.total;
                var dataList = res.result.records
                this.data=dataList
            }
             console.log(res)
        });
    },
},
mounted() {
    this.init();
}
};
</script>
<style lang="less">
.deletesd{
        width: 60px;
        height: 30px;
        background: #F56C6C;
        color:#ffffff;
        text-align: center;
        line-height: 30px;
        border-radius: 5px;
        margin: 12px 0 10px 320px;
    }
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