<template>
<div class="search">
    <Row>
        <Col>
            <Card>
                <div>
                    <Button @click="addadvertising" icon="plus" type="primary" style="margin-left: 10px">添加公告</Button>
                </div>
                <br>
                <div>
                    <span>时间：</span>
                    <DatePicker 
                        type="datetimerange"
                        format="yyyy-MM-dd HH:mm:ss"
                        clearable
                        @on-change="selectDateRange"
                        placeholder="请选择时间可不选"
                        style="width:300px">
                    </DatePicker>
                    <span style="margin-left: 15px">标题：</span>
                    <Input v-model="searchForm.title" placeholder="输入标题" style="width:15%;"/>
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

                <Modal title="添加公告" v-model="modalVisible" :mask-closable='false' :width="500">
                    <Form  :label-width="100" >       
                        <FormItem label="标题:">
                            <Input v-model="advertising.title"/>
                        </FormItem>
                        <FormItem label="图片:">
                            <upload-pic-input v-model="advertising.image" style="width:100%"></upload-pic-input>
                        </FormItem>
                        <FormItem label="内容:">
                            <Input v-model="advertising.content" type="textarea"/>
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
            title:'',
            image:'',
            content:'',
            messageType:1,
            isTop:'',
        },
        searchForm: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
            messageType:1,
            title:'',
            startDate:'',
            endDate:''
        },
        searchfan: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
            messageType:1,
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
                title:'内容',
                key: 'content',
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
         this.advertising.title='',
        this.advertising.image='',
        this.advertising.content='',
        this.advertising.isTop=''
    },
    selectDateRange(value){//选择时间
        this.searchForm.startDate = value[0]
        this.searchForm.endDate = value[1]
    },
    searcher(){
        this.searchForm.title=''
        this.loading = true;
        this.postRequest("/systemNewsInfo/getByPage",this.searchfan).then(res => {
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
        this.postRequest("/systemNewsInfo/getByPage",this.searchForm).then(res => {
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
        this.postRequest('/systemNewsInfo/saveSystemNewsInfo',this.advertising).then(res=>{
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
            this.postRequest("/systemNewsInfo/delByIds?ids=" + v.id).then(res => {
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