<template>
<div class="search">
    <Row>
        <Col>
            <Card>
                <Row class="operation">
                    <Button @click="getDataList" icon="md-refresh">刷新</Button>
                </Row>
                <Row>
                    <Table :loading="loading" border :columns="columns" :data="data" ref="table" sortable="custom" @on-selection-change="changeSelect"></Table>
                </Row>
                <Row type="flex" justify="end" class="page">
                    <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
                </Row>
                <!-- 详情弹窗 -->
                <Modal title="详情" v-model="modalVisible" :mask-closable='false' :width="500">
                    <Form  :label-width="100" >       
                        <FormItem label="名称:">
                            <span>{{details.fishingStoreName}}</span>
                        </FormItem>
                        <FormItem label="电话:">
                            <span>{{details.phone}}</span>
                        </FormItem>
                        <FormItem label="省:">
                            <span>{{details.province}}</span>
                        </FormItem>
                        <FormItem label="市:">
                            <span>{{details.city}}</span>
                        </FormItem>
                        <FormItem label="区/县:">
                            <span>{{details.area}}</span>
                        </FormItem>
                        <FormItem label="详细地址:">
                            <span>{{details.address}}</span>
                        </FormItem>
                        <FormItem label="主营渔具:">
                            <span>{{details.mainFishingGear}}</span>
                        </FormItem>
                        <FormItem label="简介:">
                            <span>{{details.introduction}}</span>
                        </FormItem>
                        <FormItem label="图片:">
                            <span v-for="item in details.image" :key="item.index">
                                <img :src="item" alt="" style="width:100px;height: 100px;border-radius: 100px;">
                            </span>
                        </FormItem>
                        <FormItem label="封面:">
                            <img :src="details.coverPicture" alt="" style="width:100px;height: 100px;border-radius: 100px;">
                        </FormItem>
                         <FormItem label="距离:">
                            <span>{{details.distance}}</span>
                        </FormItem>
                    </Form>
                    <div slot="footer">
                        <Button type="primary"  @click="modalVisible=false">确定</Button>
                    </div>
                </Modal>
                <!-- 审核弹窗 -->
                <Modal title='删除' v-model="auditVisible" :mask-closable='false' :width="500">
                    <Form  :label-width="100" >       
                        <FormItem label="删除原因:">
                            <i-input type="textarea" placeholder="请输入删除原因"  v-model="auditfome.reasonAuditFailure"></i-input>
                        </FormItem>
                    </Form>
                    <div slot="footer">
                        <Button type="primary"  @click="auditbtn">确定</Button>
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
        auditVisible:false,
        commodityTypeId:'',
        auditfome:{
            approvalStatus:'2',
            reasonAuditFailure:"",
            id:''
        },
        advertising:{
            adverType:'',
            image:[],
            sortNum:'',
        },
        details:{
            fishingStoreName:"",  //名称
            phone: "",   //电话
            province: "",  //省
            city: "",  //
            area: "",  //区/县
            address: "",  //详细地址
            mainFishingGear: "",  //主营渔具
            introduction: "",  //简介
            image: [],   //图片
            coverPicture: "",  //封面图
            distance:'',
        },
        searchForm: { // 搜索框初始化对象
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
            width: 50,
            align: "center"
            },
            {
                title:'名称',
                key: 'fishingStoreName',
                minWidth:130,
                sortable:false,
            },
            {
                title:'电话',
                key: 'phone',
                minWidth:90,
                sortable:false,
            },
            {
                title:'市',
                key: 'city',
                minWidth:75,
                sortable:false,
            },
            {
                title:'区',
                key: 'area',
                minWidth:75,
                sortable:false,
            },
            {
                title:'详细地址',
                key: 'address',
                minWidth:140,
                sortable:false,
            },
            {
                title:'封面图',
                key: 'coverPicture',
                minWidth:90,
                sortable:false,
                render: (h, params) => {
                    if (params.row.coverPicture != null && params.row.coverPicture != '' && params.row.coverPicture != undefined) {
                    return h(
                        "div",
                        [
                        h("img", {
                            props: {
                            type: "primary",
                            size: "small",
                            display: params.row.coverPicture == "" ? "none" : "inline-block"
                            },
                            attrs: {
                            src: params.row.coverPicture,
                            style: "width: 100px;height: 100px;"
                            },
                            style: {},
                            on: {
                            click: () => {
                                this.viewImage = true;
                                this.currentValue = params.row.coverPicture;
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
            width: 170,
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
                            style: {
                            marginRight: "5px"
                            },
                            on: {
                            click: () => {
                                this.audit(params.row);
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
    getOrderInfo(v){
        this.modalVisible=true
        this.details.fishingStoreName=v.fishingStoreName,  //名称
        this.details.phone=v.phone,   //电话
        this.details.province=v.province,  //省
        this.details.city=v.city,  //
        this.details.area=v.area,  //区/县
        this.details.longitude=v.longitude,  //经度
        this.details.latitude=v.latitude,  //纬度
        this.details.address=v.address,  //详细地址
        this.details.mainFishingGear=v.mainFishingGear,  //主营渔具
        this.details.introduction=v.introduction,  //简介
        this.details.image=v.image.split(","),   //图片
        this.details.coverPicture=v.coverPicture //封面图
        this.details.distance=v.distance
        console.log(v)
    },
    audit(v){
        this.auditVisible=true
        this.auditfome.id=v.id
        console.log(v)
    },
    auditbtn(){
        this.auditVisible=false
        this.postRequest('/fishingStore/updateFishingStoreApprovalStatus',this.auditfome).then(res=>{
            if(res.success){
                this.$Message.success("删除成功");
                this.getDataList()
            }
            console.log(res)
        })
    },
    getDataList () {
        this.loading = true;
        this.postRequest("/fishingStore/getByPage",this.searchForm).then(res => {
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
                this.getDataList()
                this.advertising=''
            }
        })
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