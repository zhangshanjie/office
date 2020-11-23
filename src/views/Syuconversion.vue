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
                        <span>上下架：</span>
                        <Select v-model="searchForm.isShelf"  style="width:15%;margin-right: 20px">
                            <Option value="1">上架</Option>
                            <Option value="2">下架</Option>
                        </Select>
                        <span>是否联名卡：</span>
                        <Select v-model="searchForm.isJointNameCard"  style="width:15%;">
                            <Option value="1">是</Option>
                            <Option value="2">否</Option>
                        </Select>
                        <Button @click="getDataList" type="primary" icon="ios-search" style="margin-left: 10px">搜索</Button>    
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
                    <Form  :label-width="120" >       
                        <FormItem label="商品名称:">
                            <Input placeholder="请输入商品名称"  v-model="addfome.goodsName"/>
                        </FormItem>
                        <FormItem label="是否联名卡:">
                            <Select v-model="addfome.isJointNameCard" >
                                <Option :value="1">是</Option>
                                <Option :value="2">否</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="联名卡有效期:" v-if="addfome.isJointNameCard==1">
                            <i-col span="12">
                                <Date-picker @on-change="handleChange" v-model="addfome.ointNameCardEffectiveTime" type="datetime" placeholder="选择日期和时间"></Date-picker>
                            </i-col>
                        </FormItem>
                        <FormItem label="联名卡兑换比例(%):"  v-if="addfome.isJointNameCard==1">
                            <Input placeholder="例如5" type="number" v-model="addfome.jointNameCardExchangeRatio"/>
                        </FormItem>
                        <FormItem label="商品原价:" v-if="addfome.isJointNameCard==2">
                            <Input type="number" v-model="addfome.originalPrice"/>
                        </FormItem>
                         <FormItem label="价格:" v-if="addfome.isJointNameCard==2">
                            <el-input size="small "  v-model="addfome.mallPrice" placeholder="请输入价格，只能是整数"   @keyup.native="number"></el-input>
                        </FormItem>
                        <FormItem label="主图片:" >
                            <upload-pic-input v-model="addfome.mainPhoto" style="width:100%"></upload-pic-input>
                        </FormItem>
                        <FormItem label="轮播图:" v-if="addfome.isJointNameCard==2">
                            <upload-pic-thumb @on-change="addfome.image=$event"  style="width:100%" ref="uploadPicThumb"></upload-pic-thumb>
                        </FormItem>
                        <FormItem label="介绍图:" v-if="addfome.isJointNameCard==2">
                            <upload-pic-input v-model="addfome.introducePic" style="width:100%"></upload-pic-input>
                        </FormItem>
                        <FormItem label="商品规格:" v-if="addfome.isJointNameCard==2">
                            <br>
                            <div  v-for="(item,index) in addfome.exchangeGoodsSpecificationJson">
                                <FormItem label="规格名称:" style="margin-bottom: 10px;">
                                    <Input v-model="item.specificationName" style="width:60%"/>
                                </FormItem>
                                <FormItem  label="价格:"style="margin-bottom: 10px;">
                                    <Input type="number" v-model="item.specificationPrice" style="width:60%"/>
                                </FormItem>
                                <FormItem label="库存:"style="margin-bottom: 10px;">
                                    <Input type="number" v-model="item.inventory" style="width:60%"/>
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
                        <FormItem label="介绍图:" v-if="detail.isJointNameCard==2">
                            <img :src="detail.introducePic" alt="" style="width: 100px; height:100px;border-radius: 100px">
                        </FormItem>
                        <FormItem label="商品价格:" v-if="detail.isJointNameCard==2">
                            <span>{{detail.mallPrice}}</span>
                        </FormItem>
                        <FormItem label="是否联名卡:">
                           <span v-if="detail.isJointNameCard==1">是</span>
                           <span v-if="detail.isJointNameCard==2">否</span>
                        </FormItem>
                        <FormItem label="轮播图:" v-if="detail.isJointNameCard==2"> 
                           <span v-for="item in detail.image" :key="item.index">
                               <img :src="item" alt="" style="width: 80px; height:80px;">
                           </span>
                        </FormItem>

                        <div  v-for="(item,index) in detail.exchangeGoodsSpecificationJson">
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
            isShelf:'',
            isJointNameCard:'',
            goodsName:'',
        },
        searchfan: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
        },
        detail:{//详情
            goodsName:'',
            mainPhoto:'',
            mallPrice:'',
            introducePic:'',
            isJointNameCard:'',
            image:'',
            specificationName:'',//规格名称
            specificationPrice:'',//规格价格
            exchangeGoodsSpecificationJson:[]
        },
        addfome:{//添加商品
            goodsName:'',
            mainPhoto:'',
            mallPrice:'',
            introducePic:'',
            isJointNameCard:'',
            jointNameCardExchangeRatio:'',
            id:'',
            ointNameCardEffectiveTime:'',
            image:[],
            exchangeGoodsSpecificationJson:[
                {
                    specificationName:'',
                    specificationPrice:'',
                    inventory:'',
                    image:'',
                    id:'',
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
                minWidth:130,
                sortable:false,
            },
            {
                title: "商品图片",
                key: "mainPhoto",
                minWidth: 120,
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
                title: "商品价格",
                key: "mallPrice",
                minWidth: 120,
                sortable: false,
            },
            {
                title: "商品原价",
                key: "originalPrice",
                minWidth: 120,
                sortable: false,
            },
            {
                title: "是否联名卡",
                key: "isJointNameCard",
                minWidth: 120,
                sortable: false,
                 render:(h, params) =>{
                    if(params.row.isJointNameCard == '1'){
                        return h("span","是")
                    }else if(params.row.isJointNameCard == '2'){
                        return h("span", '否')
                    }
                }
            },
            {
                title: "联名卡有效时间",
                key: "ointNameCardEffectiveTime",
                minWidth: 120,
                sortable: false,
            },
            {
                title: "上下架状态",
                key: "isShelf",
                minWidth: 120,
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
    addguig(){//添加规格按钮
        this.addfome.exchangeGoodsSpecificationJson.push({
                    specificationName:'',
                    specificationPrice:'',
                    id:'',
                })
        console.log(this.addfome.exchangeGoodsSpecificationJson)
    },
    number(){　　
　　　  this.addfome.mallPrice=this.addfome.mallPrice.replace(/[^\.\d]/g,'');
        this.addfome.mallPrice=this.addfome.mallPrice.replace('.','');
　　},
    preventPoint(type, evt) {
        let newVal = parseInt(evt.target.value);
        evt.target.value = '';  // 这句话看起来多此一举，但不写的话就是会出问题，但是为啥会出问题呢，我不知道!!!
        evt.target.value = newVal;
        this[type] = newVal;
    },
    removeds(index){
        console.log(index)
        this.addfome.exchangeGoodsSpecificationJson.splice(index,1)
    },
    handleChange(v){//选择时间
        this.addfome.ointNameCardEffectiveTime=v
        console.log(v,this.addfome.ointNameCardEffectiveTime)
    },
    searcher(){//搜索
        this.searchForm.pageNumber=1
        this.searchForm.goodsName=''
        this.searchForm.isShelf=''
        this.searchForm.isJointNameCard=''
        this.loading = true;
        this.postRequest("/exchangeGoods/getByPcPage",this.searchfan).then(res => {
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
        this.postRequest("/exchangeGoods/updateExchangeGoodsByisShelf",{id:v.id}).then(res => {
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
            this.postRequest("/exchangeGoods/delByIds?ids=" + v.id).then(res => {
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
        this.addfome.exchangeGoodsSpecificationJson=[]
        this.addfome.goodsName=""
        this.addfome.mainPhoto=""
        this.addfome.mallPrice=""
        this.addfome.ointNameCardEffectiveTime=''
        this.addfome.originalPrice=''
        this.addfome.isJointNameCard=""
        this.addfome.id=''
        this.addfome.introducePic=''
        this.addfome.jointNameCardExchangeRatio=''
        this.addfome.image=[]
        this.adddata=true
        // this.$refs.uploadPicThumb.image = []
        // this.$refs.uploadPicThumb.setData(this.addfome.image)
        console.log(this.$refs.uploadPicThumb)
    },
    addDatapd(v){
        console.log(v)
        if(this.addfome.jointNameCardExchangeRatio<=0 && this.addfome.isJointNameCard==1){
            this.$Message.success("联名卡兑换比例不能小于0");
        }else{
            if(v.id==""){//如果没有id就是添加
                if(v.exchangeGoodsSpecificationJson.length==0 && this.addfome.isJointNameCard==2 ){
                    this.$Message.warning("添加商品必须要添加商品规格");
                }else{
                    this.postRequest("/exchangeGoods/saveExchangeGoods",{
                        goodsName:this.addfome.goodsName,
                        mainPhoto:this.addfome.mainPhoto,
                        introducePic:this.addfome.introducePic,
                        mallPrice:this.addfome.mallPrice,
                        isJointNameCard:this.addfome.isJointNameCard,
                        ointNameCardEffectiveTime:this.addfome.ointNameCardEffectiveTime,
                        originalPrice:this.addfome.originalPrice,
                        jointNameCardExchangeRatio:this.addfome.jointNameCardExchangeRatio,
                        image:this.addfome.image,
                        exchangeGoodsSpecificationJson: JSON.stringify(this.addfome.exchangeGoodsSpecificationJson)
                    }).then(res => {
                        if(res.success){
                            this.$Message.success("添加成功");
                            this.adddata=false
                            this.getDataList()
                        }
                    })
                }
            console.log(this.addfome)
        }else{//如果有id就是编辑
            this.postRequest("/exchangeGoods/updateGoodsInfo",{
                goodsName:this.addfome.goodsName,
                mainPhoto:this.addfome.mainPhoto,
                mallPrice:this.addfome.mallPrice,
                introducePic:this.addfome.introducePic,
                isJointNameCard:this.addfome.isJointNameCard,
                ointNameCardEffectiveTime:this.addfome.ointNameCardEffectiveTime,
                originalPrice:this.addfome.originalPrice,
                jointNameCardExchangeRatio:this.addfome.jointNameCardExchangeRatio,
                image:this.addfome.image,
                isJointNameCard:this.addfome.isJointNameCard,
                id:this.addfome.id,
                exchangeGoodsSpecificationJson: JSON.stringify(this.addfome.exchangeGoodsSpecificationJson)
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
        this.detail.goodsName=v.goodsName,
        this.detail.mainPhoto=v.mainPhoto,
        this.detail.introducePic=v.introducePic,
        this.detail.mallPrice=v.mallPrice,
        this.detail.isJointNameCard=v.isJointNameCard,
        this.detail.exchangeGoodsSpecificationJson=v.exchangeGoodsSpecificationList
        this.detail.image=v.image.split(',')
    },
    getOrderInfo(v){//编辑按钮
        this.addfome.exchangeGoodsSpecificationJson=v.exchangeGoodsSpecificationList
        this.addfome.goodsName=v.goodsName
        this.addfome.mainPhoto=v.mainPhoto
        this.addfome.mallPrice=v.mallPrice
        this.addfome.isJointNameCard=v.isJointNameCard
        this.addfome.ointNameCardEffectiveTime=v.ointNameCardEffectiveTime
        this.addfome.id=v.id
        this.addfome.introducePic=v.introducePic
        this.addfome.jointNameCardExchangeRatio=v.jointNameCardExchangeRatio.slice(0,-1)
        this.addfome.originalPrice=v.originalPrice
        this.addfome.image=v.image.split(',')
        // this.$refs.uploadPicThumb.image = []
        // this.$refs.uploadPicThumb.setData(this.addfome.image)
        this.adddata=true
        console.log(v)
        console.log(this.$refs.uploadPicThumb)
    },
    getDataList () {//获取列表
        this.loading = true;
        this.postRequest("/exchangeGoods/getByPcPage",this.searchForm).then(res => {
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