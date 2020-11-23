<template>
<div class="search">
    <Row>
        <Col>
            <Card>
                 <br>
                <div>
                    <Form  :label-width="100" >
                        <span>鱼塘名称：</span>
                        <Input  v-model="searchForm.title"  style="width:15%;margin-right: 20px"/>
                        <span>钓点类型：</span>
                        <Select v-model="searchForm.fishingPointTypes" style="width:15%;margin-right: 20px;">
                            <Option value="1">江河</Option>
                            <Option value="2">鱼塘</Option>
                            <Option value="3">湖库</Option>
                            <Option value="4">黑坑</Option>
                            <Option value="5">农家乐</Option>
                            <Option value="6">水库</Option>
                        </Select>
                        <span>鱼种类：</span>
                        <Select v-model="searchForm.fishSpecies"  style="width:15%">
                            <Option v-for="item in fishdatalist" :key="item.index" :value="item.fingerlingInfoName">{{item.fingerlingInfoName}}</Option>
                        </Select>
                        <Button @click="searcher" type="primary" icon="ios-search" style="margin-left: 10px">搜索</Button>
                    </Form>
                </div>
                <br>
                <Row class="operation">
                    <Button @click="shuxin" icon="md-refresh">刷新</Button>
                </Row>
                <Row>
                    <Table :loading="loading" border :columns="columns" :data="data" ref="table" sortable="custom" @on-selection-change="changeSelect"></Table>
                </Row>
                <Row type="flex" justify="end" class="page">
                    <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
                </Row>
                <!-- 详情弹窗 -->
                <Modal title="详情数据" v-model="xiagnqing" :mask-closable='false' :width="500">
                    <Form  :label-width="100" > 
                         <FormItem label="鱼塘标题:">
                            <span>{{detail.title}}</span>
                        </FormItem>      
                        <!-- <FormItem label="身份:">
                            <span v-if="detail.identity==1">钓客</span>
                            <span v-if="detail.identity==2">老板</span>
                        </FormItem> -->
                        <FormItem label="钓场类型:">
                            <span v-if="detail.fishingGroundType==1">天然钓场类</span>
                            <span v-if="detail.fishingGroundType==2">人工服务类</span>
                        </FormItem>
                        <FormItem label="钓点类型:">
                            <span v-if="detail.fishingPointType==1">江河</span>
                            <span v-if="detail.fishingPointType==2">鱼塘</span>
                            <span v-if="detail.fishingPointType==3">湖库</span>
                            <span v-if="detail.fishingPointType==4">黑坑</span>
                            <span v-if="detail.fishingPointType==5">农家乐</span>
                            <span v-if="detail.fishingPointType==6">水库</span>
                        </FormItem>
                        <FormItem label="省份:">
                           <span>{{detail.province}}</span>
                        </FormItem>
                        <FormItem label="市区:">
                            <span>{{detail.city}}</span>
                        </FormItem>
                        <FormItem label="区/县:">
                            <span>{{detail.area}}</span>
                        </FormItem>
                        <FormItem label="鱼种:">
                            <span>{{detail.fishSpecies}}</span>
                        </FormItem>
                        <FormItem label="收费方式:">
                            <span v-if="detail.chargeMethod==1">免费</span>
                            <span v-if="detail.chargeMethod==2">按斤收费</span>
                            <span v-if="detail.chargeMethod==3">按场收费</span>
                        </FormItem>
                        <FormItem label="允许钓法:">
                            <span v-if="detail.allowedFishing==1">路亚</span>
                            <span v-if="detail.allowedFishing==2">筏钓</span>
                            <span v-if="detail.allowedFishing==3">远投</span>
                            <span v-if="detail.allowedFishing==4">台钓</span>
                            <span v-if="detail.allowedFishing==5">炮杆</span>
                            <span v-if="detail.allowedFishing==6">海钓</span>
                            <span v-if="detail.allowedFishing==7">海围</span>
                            <span v-if="detail.allowedFishing==8">矶钓</span>
                        </FormItem>
                        <FormItem label="主图:">
                             <img :src="detail.mainPicture" alt="" style="width: 100px; height: 100px;">
                        </FormItem>
                        <FormItem label="手机号:">
                            <span>{{detail.phoneNumber}}</span>
                        </FormItem>
                        <FormItem label="是否回鱼:">
                            <span v-if="detail.whetherReturnRish==1">回鱼</span>
                            <span v-if="detail.whetherReturnRish==2">不回鱼</span>
                        </FormItem>
                        <FormItem label="允许夜钓:">
                            <span v-if="detail.nightFishingAllowed==1">允许</span>
                            <span v-if="detail.nightFishingAllowed==2">不允许</span>
                        </FormItem>
                        <FormItem label="水深:">
                             <span>{{detail.waterDepth}}</span>
                        </FormItem>
                        <FormItem label="水质:">
                            <span>{{detail.waterQuality}}</span>
                        </FormItem>
                        <FormItem label="餐饮:">
                            <span>{{detail.food}}</span>
                        </FormItem>
                        <FormItem label="钓场简介:">
                             <span>{{detail.introductionFishingGrounds}}</span>
                        </FormItem>
                    </Form>
                    <div slot="footer">
                        <Button type="primary"  @click="xiagnqing=false">确定</Button>
                    </div>
                </Modal>
                <Modal  title="删除" v-model="modaldelivery" :mask-closable='false' :width="500">
                    <Form  :label-width="100" >       
                        <FormItem  label="删除原因:" style="width: 85%;">
                            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="shipmencause"></el-input>
                        </FormItem>
                    </Form> 
                    <div slot="footer">
                        <Button type="primary" @click="physicalbtn">确定</Button>
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
        xiagnqing:false,
        location: {
            lng: 116.404,
            lat: 39.915
        },
        zoom: 12.8,
        addressKeyword: "",
        loading: true, // 表单加载状态
        modalVisible: false, // 添加或编辑显示
        xiagnqing:false,
        fishdatalist:[],
        modaldelivery:false,
        trollid:'',//保存删除的id
        shipmencause:'',//删除数据的原因
        chartType:'',
        searcherkey:'',
        commodityTypeId:'',
        searchForm: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
            fishSpecies:[],//鱼的种类
            userId:'',//塘主Id
            fishingPointType:'',//排序
            title:'',
        },
        detail:{
            title:"",  //标题
            identity :"", //身份 1.钓客   2.老板
            fishingGroundType:"",  //钓场类型  1.天然钓场类  2.人工服务类
            fishingPointType :"",//钓点类型  1.江河 2鱼塘 3.湖库 4.黑坑 5.农家乐
            score:"",  //评分
            province:'', //省
            city :"",//市
            area :"", //区/县
            address:"",  //详细地址
            longitude:"", //经度
            latitude:"",//纬度
            fishSpecies:"",  //鱼种
            chargeMethod:"",//收费方式 1.免费 2.按斤收费 3.按场收费
            allowedFishing:"",
            mainPicture:"",//主图
            phoneNumber:"", //手机号
            whetherReturnRish:"", //是否回鱼 1.回鱼 2.不回鱼
            nightFishingAllowed:"", //允许夜钓 1.允许 2.不允许
            waterDepth:"", //水深
            waterQuality:"",  //水质
            food:"",//餐饮
            introductionFishingGrounds:"",  //钓场简介
            features:"",  //特色
            fishingRodRules:"",  //钓竿规则
            timeRule:"", //时间规则
            recyclingPrice:"", //回收价格
            acreage:"",  //面积
            fishingPosition:"",  //钓位

        },
        searchfan: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
            userId:'',//塘主Id
            fishSpecies:[],//鱼的种类
            sort:''//排序
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
                title:'鱼塘名称',
                key: 'title',
                minWidth:90,
                sortable:false,
            },
            {
                title: "钓场类型",
                key: "fishingGroundType",
                minWidth: 130,
                sortable: false,
                   render:(h, params) =>{
                    if(params.row.fishingGroundType == '1'){
                        return h("span","天然钓场类")
                    }else if(params.row.fishingGroundType == '2'){
                        return h("span", '人工服务类')
                    }
                }
            },
            {
                title: "钓点类型",
                key: "fishingPointType",
                minWidth: 70,
                sortable: false,
                 render:(h, params) =>{
                    if(params.row.fishingPointType == '1'){
                        return h("span","江河")
                    }else if(params.row.fishingPointType == '2'){
                        return h("span", '鱼塘')
                    }else if(params.row.fishingPointType == '3'){
                        return h("span", '湖库')
                    }else if(params.row.fishingPointType == '4'){
                        return h("span", '黑坑')
                    }else if(params.row.fishingPointType == '5'){
                        return h("span", '农家乐')
                    }else if(params.row.fishingPointType == '6'){
                        return h("span", '水库')
                    }
                }
            },
            {
                title: "鱼种类",
                key: "fishSpecies",
                minWidth: 150,
                sortable: false,
            },
            {
                title: "鱼塘地址",
                key: "address",
                minWidth: 230,
                sortable: false,
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
        this.getAllInfo()
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
    searcher(){//搜索
        this.searchForm.pageNumber=1
        this.getDataList()
    },
    getAllInfo(){
        this.postRequest("/fingerlingInfo/getAll").then(res => {
            if (res.success) {
                console.log(res,'获取所有鱼种')
            this.fishdatalist=res.result
            }
        });
    },
    physicalbtn(){
        this.postRequest("/fishingPoint/delByIds",{ids:this.trollid,reasonAuditFailure:this.shipmencause}).then(res => {
                if (res.success) {
                this.$Message.success("删除成功");
                this.modaldelivery=false
                this.getDataList();
                }
                console.log(res)
            });
    },
    remove(v){//删除按钮
        console.log(v)
        this.shipmencause=''
        this.modaldelivery=true
        this.trollid=v.id //保存删除的id
    },
     getLocationPoint(e) {
            this.lng = e.point.lng;
            this.lat = e.point.lat;
            this.form.longitude=e.point.lng
            this.form.latitude=e.point.lat
             console.log(e.point.lng)
                console.log(e.point.lat)
            /* 创建地址解析器的实例 */
            let geoCoder = new BMap.Geocoder();
            /* 获取位置对应的坐标 */
            geoCoder.getPoint(this.addressKeyword, point => {
                this.selectedLng = point.lng;
                this.selectedLat = point.lat;
                console.log(this.addressKeyword)
            });
            /* 利用坐标获取地址的详细信息 */
            geocoder.getLocation(e.point,res=>{
                console.log(res)
            })
        },
    details(v){//详情按钮
        this.xiagnqing=true
        console.log(v)
         this.postRequest("/fishingPoint/get",{id:v.id,userId:v.userId}).then(res => {
            if (res.success) {
                this.detail=res.result
            }
             console.log(res)
        });
    },
    getDataList () {//列表数据
        this.loading = true;
        if(this.searchForm.fishingPointType==undefined){
           this.searchForm.fishingPointType=''
        }
        if(this.searchForm.fishSpecies==undefined){
            this.searchForm.fishSpecies=''
        }
        if(this.searchForm.title==undefined){
            this.searchForm.title=''
        }
        this.postRequest("/fishingPoint/getByPage",this.searchForm).then(res => {
            this.loading = false;
            if (res.success) {
                this.total = res.result.total;
                var dataList = res.result.records
                this.data=dataList
            }
             console.log(res)
        });
    },
    shuxin(){//刷新按钮
        this.loading = true;
        this.searchForm.fishingPointType='',
        this.searchForm.fishSpecies=''
        this.searchForm.title=''
      
        this.postRequest("/fishingPoint/getByPage",this.searchfan).then(res => {
            this.loading = false;
            if (res.success) {
                this.total = res.result.total;
                var dataList = res.result.records
                this.data=dataList
            }
             console.log(res)
        });
    },
    xqlist(){
        
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