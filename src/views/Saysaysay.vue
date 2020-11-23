<template>
<!-- 查看用户申请退款列表申请 -->
<div class="search">
    <Row>
        <Col>
            <Card>
                <div>
                    <Select v-model="searchData.select" style="width:200px; margin-right: 43px;">
                        <Option value="1">商品</Option>
                        <Option value="2">商家</Option>
                        <Option value="3">图文</Option>
                    </Select>
                    <Button @click="getDataList" type="primary" icon="ios-search">搜索</Button>
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
                <!-- 商品的弹窗 -->
                 <Modal v-if="chartType==1" :title="titlee" v-model="modalVisible" :mask-closable='false' :width="500">
                    <Form  :label-width="100" >       
                        <FormItem label="商品名称:">
                            <div>{{form.commodityName}}</div>
                        </FormItem>
                        <FormItem label="商品价格:">
                            <div>{{form.commodityPrice}}</div>
                        </FormItem>
                        <FormItem label="商品类型:" prop="commodityTypeName" >
                            <div>{{form.commodityTypeName}}</div>
                        </FormItem>
                        <FormItem label="商品图片:">
                            <img :src="form.commodityPic" alt="" class="photo" style="width: 100px;height: 100px;border-radius: 100px">
                        </FormItem>
                        <FormItem label="商品描述:">
                            <div>{{form.commodityDetail}}</div>
                        </FormItem>
                    </Form>
                    <div slot="footer">
                        <Button type="primary"  @click="handleSubmit">确定</Button>
                    </div>
                </Modal>
                <!-- 商家弹窗 -->
                <Modal v-if="chartType==2" :title="titlee" v-model="modalVisible" :mask-closable='false' :width="500">
                    <Form  :label-width="100" >       
                        <FormItem label="商铺名称:">
                            <div>{{form2.shopName}}</div>
                        </FormItem>
                        <FormItem label="店铺所在省:">
                            <div>{{form2.provinceName}}</div>
                        </FormItem>
                        <FormItem label="店铺所在市:" prop="cityName" >
                            <div>{{form2.cityName}}</div>
                        </FormItem>
                        <FormItem label="店铺详细地址:" prop="shopAddress" >
                            <div>{{form2.shopAddress}}</div>
                        </FormItem>
                        <FormItem label="联系电话:">
                                <div>{{form2.tel}}</div>
                        </FormItem>
                        <FormItem label="商家介绍:">
                                <div>{{form2.shopIntroduction}}</div>
                        </FormItem>
                        <FormItem label="门面图:">
                                <img :src="form2.shopRecommendation" alt="" class="photo" style="width: 100px;height: 100px;border-radius: 100px">
                        </FormItem>
                    </Form>
                    <div slot="footer">
                        <Button type="primary"  @click="handleSubmit">确定</Button>
                    </div>
                </Modal>
                <!-- 图文弹窗 -->
                <Modal v-if="chartType==3" :title="titlee" v-model="modalVisible" :mask-closable='false' :width="500">
                    <Form  :label-width="100" >       
                        <FormItem label="排序:">
                            <div>{{form3.sort}}</div>
                        </FormItem>
                        <FormItem label="类型:">
                            <div>图文</div>
                        </FormItem>
                        <FormItem label="图文内容:">
                            <div>{{form3.picAndTextContent}}</div>
                        </FormItem>
                        <FormItem label="创建时间:">
                            <div>{{form3.createTime}}</div>
                        </FormItem>
                        <FormItem label="图文图片:">
                            <img :src='form3.pic' alt="" class="photo" style="width: 100px;height: 100px;border-radius: 100px">
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
export default {
data() {
    return {
        titlee:'详细数据',
        loading: true, // 表单加载状态
        modalVisible: false, // 添加或编辑显示
        chartType:'',
    searchForm: { // 搜索框初始化对象
        pageNumber: 1,//页号
        pageSize: 10,
        type:''
    },
    searchData:{
        select:''
    },
    form: { // 添加或编辑表单对象初始化数据   存放查看详情的数据
        commodityName:'',//名称，
        commodityPrice:"",//价格
        commodityTypeName:'',//类型
        commodityDetail:"",//商品描述
        commodityPic:''//图片
    },
    form2:{
        shopName:'',
        provinceName:'',
        cityName:"",
        shopAddress:"",
        tel:'',
        shopIntroduction:"",
        shopRecommendation:'',
    },
    form3:{
        sort:'',
        commodityPrice:'',
        picAndTextContent:'',
        createTime:'',
        pic:'',
    },
    type:'',
    prohibit:'',
    selectList: [], // 多选数据
    selectCount: 0, // 多选计数
    columns: [
        // 表头
        {
        type: "selection",
        width: 60,
        align: "center"
        },
        {
        type: "index",
        width: 60,
        align: "center"
        },
        {
            title:'排序',
            key: 'sort',
            minWidth:120,
            sortable:false,
        },
        {
            title:'图文内容',
            key: 'picAndTextContent',
            minWidth:120,
            sortable:false,
        },
        {
        title: "类型",
        key: "chartType",
        minWidth: 110,
        sortable: false,
         render:(h, params) =>{
                if(params.row.chartType == 1){
                    return h("span","商品")
                }else if(params.row.chartType == 2){
                    return h("span", '商家')
                }else if(params.row.chartType == 3){
                    return h("span", '图文')
                }
            }
        },
        {
          title: "图片",
          key: "pic",
          minWidth: 120,
          sortable: false,
           render: (h, params) => {
              return h(
                "div",
                {
                  attrs: {
                    style: "width: 100px;height: 100px;",
                    display: params.row.pic == "" ? "none" : "inline-block"
                  },
                  on: {
                    click: () => {}
                  }
                },
                [
                  h("img", {
                    props: {
                      type: "primary",
                      size: "small",
                      display: params.row.pic == "" ? "none" : "inline-block"
                    },
                    attrs: {
                      src: params.row.pic,
                      style: "width: 100px;height: 100px;"
                    },
                    style: {},
                    on: {
                      click: () => {
                        this.viewImage = true;
                        this.currentValue = params.row.pic;
                      }
                    }
                  })
                ]
              );
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 200,
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
                    "详情"
                ), 
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",
                    icon: "md-trash"
                  },
                  on: {
                    click: () => {
                      this.remove(params.row);
                    }
                  }
                },
                "删除"
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
    remove(v){//删除按钮
        console.log(v)
         this.$Modal.confirm({
            title: "确认删除",
            // 记得确认修改此处
            content: "您确认要删除?",
            loading: true,
            onOk: () => {
            // 删除
            this.getRequest("/rotationChart/deleteById?id=" + v.id).then(res => {
                this.$Modal.remove();
                if (res.success) {
                this.$Message.success("操作成功");
                this.getDataList();
                }
                console.log(res)
            });
            }
        });
    },
    getOrderInfo(v){//详情按钮
        this.modalVisible = true;
        if(v.chartType==1){//商品数据
            this.chartType=v.chartType
            this.getRequest("/commodity/findOneById?id=" + v.commodityId).then(res => {
                if(res.success){
                    this.form.commodityName=res.result.commodityName
                    this.form.commodityPrice=res.result.commodityPrice
                    this.form.commodityTypeName=res.result.commodityTypeName
                    this.form.commodityDetail=res.result.commodityDetail
                    this.form.commodityPic=res.result.commodityPic
                }
                console.log(res,"商品数据")
            })
        }else if(v.chartType==2){//商家数据
            this.chartType=v.chartType
            this.getRequest("/shop/getShopInfoByShopId?shopId=" + v.shopId).then(res => {
                if(res.success){
                    this.$Message.success("操作成功");
                    this.form2.shopName=res.result.shopName
                    this.form2.provinceName=res.result.provinceName
                    this.form2.cityName=res.result.cityName
                    this.form2.shopAddress=res.result.shopAddress
                    this.form2.tel=res.result.tel
                    this.form2.shopIntroduction=res.result.shopIntroduction
                    this.form2.shopRecommendation=res.result.shopRecommendation
                }
                console.log(res,"商家数据")
            })
        }else if(v.chartType==3){
            this.chartType=v.chartType
            this.form3.sort=v.sort
            this.form3.chartType=v.chartType
            this.form3.picAndTextContent=v.picAndTextContent
            this.form3.createTime=v.createTime
            this.form3.pic=v.pic
            console.log("图文的数据")
        }
        console.log(v)
    },
    handleSubmit(){
        this.modalVisible=false
    },
    getDataList () {//搜索按钮
        // type: 1 商品 2商家 3 图文
        this.loading = true;
        this.searchForm.type = this.searchData.select
        console.log(this.searchForm.type)
        this.postRequest("/rotationChart/findByTypePage",this.searchForm).then(res => {
            this.loading = false;
            if (res.success) {
                this.$Message.success("操作成功");
                this.total = res.result.totalElements;
                var dataList = res.result.content
                this.data=dataList
            }
             console.log(res)
             console.log(this.data)
        });
    },
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
        border-radius: 100px
    }
}
</style>