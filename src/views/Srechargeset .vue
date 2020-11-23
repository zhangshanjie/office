<template>
<div class="search">
    <Row>
        <Col>
            <Card>
                <div>
                    <Button @click="addadvertising" icon="plus" type="primary" style="margin-left: 10px">添加套餐</Button>
                </div>
                <br>
                <div>
                    <span style="margin-left: 15px">标题：</span>
                    <Select v-model="searchForm.type" style="width:15%">
                        <Option value="1">渔票 </Option>
                        <Option value="2">渔泡</Option>
                    </Select>
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

                <Modal title="添加套餐" v-model="modalVisible" :mask-closable='false' :width="500">
                    <Form  :label-width="100" >       
                        <FormItem label="充值金额:">
                            <Input type="Number" v-model="advertising.rechargeAmount"/>
                        </FormItem>
                        <FormItem label="充值数量:">
                            <Input type="Number" v-model="advertising.quantity"/>
                        </FormItem>
                        <FormItem label="充值类型:">
                            <Select v-model="advertising.type">
                                <Option value="1">渔票 </Option>
                                <Option value="2">渔泡</Option>
                            </Select>
                        </FormItem>
                        <!-- <FormItem label="充值送类型:">
                            <Select v-model="advertising.rechargeHandselType">
                                <Option value="1">渔票 </Option>
                                <Option value="2">渔泡</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="充值赠送的数量:">
                            <Input v-model="advertising.rechargeHandselQuantity"/>
                        </FormItem> -->
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
            rechargeAmount:'',
            quantity:'',
            type:'',
            // rechargeHandselQuantity:"",
            // rechargeHandselType:"",
        },
        searchForm: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
            type:'',
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
                title:'充值金额',
                key: 'rechargeAmount',
                minWidth:90,
                sortable:false,
            },
            {
                title:'数量',
                key: 'quantity',
                minWidth:90,
                sortable:false,
            },
            {
                title:'充值类型',
                key: 'type',
                minWidth:90,
                sortable:false,
                render:(h, params) =>{
                    if(params.row.type == '1'){
                        return h("span","渔票")
                    }else if(params.row.type == '2'){
                        return h("span", '渔泡')
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
    addadvertising(){
        this.modalVisible=true
    },
    selectDateRange(value){//选择时间
        this.searchForm.startDate = value[0]
        this.searchForm.endDate = value[1]
    },
    searcher(){
        this.loading = true;
        this.postRequest("/rechargePackage/getByPage",this.searchfan).then(res => {
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
        this.postRequest("/rechargePackage/getByPage",this.searchForm).then(res => {
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
        this.postRequest('/rechargePackage/saveRechargePackage',this.advertising).then(res=>{
            if(res.success){
                this.$Message.success("添加成功");
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
            this.postRequest("/rechargePackage/delByIds?id=" + v.id).then(res => {
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