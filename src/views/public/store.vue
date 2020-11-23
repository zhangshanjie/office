<template>
    <div class="search">
        <Row>
            <Col>
                <Card>
                    <Row @keydown.enter.native="handleSearch">
                        <Form inline :label-width="70" class="search-form">
                            <Form-item label="站点名">
                                <Input v-model="searchForm.mess" placeholder="请输入站点名" clearable/>
                            </Form-item>
                            <Form-item style="margin-left:-35px;" class="br">
                                <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                                <Button @click="handleReset">重置</Button>
                            </Form-item>
                        </Form>
                    </Row>
                    <Row class="operation">
                        <Button @click="getDataList" icon="md-refresh">刷新</Button>
                    </Row>
                    <Row>
                        <Table :loading="loading" border :columns="columns" :data="data" ref="table" sortable="custom" @on-sort-change="changeSort" @on-selection-change="changeSelect"></Table>
                    </Row>
                    <Row type="flex" justify="end" class="page">
                        <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal :title="modalTitle" v-model="modalVisible" :mask-closable='false' :width="500">
            <Form ref="form" :model="form" :label-width="100" :rules="formValidate" >        
                <FormItem label="站点名称" prop="storeName" >
                    <Input v-model="form.storeName" style="width: 100%"/>
                </FormItem>
                <FormItem label="详细位置" prop="address" >
                    <Input  v-model="form.address" style="width:100%"/>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="agreement" @click="modalVisible=false">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="handleSubmit">提交</Button>
            </div>
        </Modal>

        <Modal title="图片预览" v-model="viewImage" :styles="{top: '30px'}" draggable>
            <img :src="currentValue" alt="无效的图片链接" style="width: 100%;margin: 0 auto;display: block;" />
            <div slot="footer">
                <Button @click="viewImage=false">关闭</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import uploadPicInput from "@/views/my-components/xboot/upload-pic-input";
    import circleLoading from "@/views/my-components/circle-loading.vue";
    export default {
    name: "product",
    components: {
        circleLoading,
        uploadPicInput
    },
    data() {
        return {
            currentValue:'',
            viewImage: false,
            loading: true, // 表单加载状态
            modalType: 0, // 添加或编辑标识
            modalVisible: false, // 添加或编辑显示
            modalTitle: "", // 添加或编辑标题
            searchForm: { // 搜索框初始化对象
                pageNumber: 1, // 当前页数
                pageSize: 10, // 页面大小
                mess:''
            },
            form: { // 添加或编辑表单对象初始化数据
                id:'',
                address:'',
                storeName:''
            },
            // 表单验证规则
            formValidate: {
                storeName: [{ required: true, message: "站点名称不能为空", trigger: "blur" }],
                address: [{ required: true, message: "详细位置不能为空", trigger: "blur" }]
                
            },
            submitLoading: false, // 添加或编辑提交状态
            selectList: [], // 多选数据
            selectCount: 0, // 多选计数
            columns: [
            {
                type: "index",
                width: 60,
                align: "center"
            },
            {
                title: "站点名称",
                key: "storeName",
                minWidth: 120,
                sortable: false,
            },
            {
                title: "详细位置",
                key: "address",
                minWidth: 120,
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
                                this.edit(params.row);
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
            selectdata:[],
            total: 0 // 表单数据总数
        };
    },
    methods: {
        init() {
            this.getDataList();
        },
        changePage(v) {
            this.searchForm.pageNumber = v;
            this.getDataList();
            this.clearSelectAll();
        },
        changePageSize(v) {
            this.searchForm.pageSize = v;
            this.getDataList();
        },
        handleSearch() {
            this.searchForm.pageNumber = 1;
            this.searchForm.pageSize = 10;
            this.getDataList();
        },
        handleReset() {
            this.$refs.searchForm.resetFields();
            this.searchForm.pageNumber = 1;
            this.searchForm.pageSize = 10;
            // 重新加载数据
            this.getDataList();
        },
        changeSort(e) {
            this.searchForm.sort = e.key;
            this.searchForm.order = e.order;
            if (e.order === "normal") {
                this.searchForm.order = "";
            }
            this.getDataList();
        },
        clearSelectAll() {
            this.$refs.table.selectAll(false);
        },
        changeSelect(e) {
            this.selectList = e;
            this.selectCount = e.length;
        },
        getDataList() {
            this.loading = true;
            this.postRequest("/storeTable/getByPage", this.searchForm).then(res => {
                this.loading = false;
                if (res.success) {
                    this.data = res.result.records;
                    this.total = res.result.total;
                }
            });
        },

        handleSubmit() {
            console.log(this.form)
            for(var i=0;i<this.selectdata.length;i++){
                if(this.form.storeGoodsTypeId == this.selectdata[i].id){
                this.form.storeGoodsTypeName = this.selectdata[i].storeGoodsTypeName
                }
            }
            this.$refs.form.validate(valid => {
                if (valid) {
                if(this.form.storeGoodsPrice == 0 || this.form.storeGoodsPrice == ''){
                    this.$Message.success('请输入商品价格')
                }else{
                    this.submitLoading = true;
                    this.form.storeGoodsPic = (this.form.storeGoodsPic == null || this.form.storeGoodsPic == undefined || this.form.storeGoodsPic == "") ? 'http://file.hszn.group/d94f54f8767245edb46dd7140f81de02.jpg' : this.form.storeGoodsPic
                    if (this.modalType === 0) {
                    // 添加 避免编辑后传入id等数据 记得删除
                    delete this.form.id;
                    this.postRequest("/storeTable/insertOrUpdate", this.form).then(res => {
                        this.submitLoading = false;
                        if (res.success) {
                        this.$Message.success("操作成功");
                        this.form.storeGoodsPic = null
                        this.form.storeGoodsDescription = null
                        this.getDataList();
                        this.modalVisible = false;
                        }
                    });
                    } else {
                    this.postRequest("/storeTable/insertOrUpdate", this.form).then(res => {
                        this.submitLoading = false;
                        if (res.success) {
                        this.$Message.success("操作成功");
                        this.form.storeGoodsPic = null
                        this.form.storeGoodsDescription = null
                        this.getDataList();
                        this.modalVisible = false;
                        }
                    });
                    }
                }  
                }
            });
        },

        edit(v) {
            this.modalType = 1;
            this.modalTitle = "编辑";
            this.$refs.form.resetFields();
            // 转换null为""
            for (let attr in v) {
                if (v[attr] === null) {
                v[attr] = "";
                }
            }
            let str = JSON.stringify(v);
            let data = JSON.parse(str);
            this.form = data;
            this.modalVisible = true;
        },
        remove(v) {
            this.$Modal.confirm({
                title: "确认删除",
                // 记得确认修改此处
                content: "您确认要删除 " + v.storeGoodsName + " ?",
                loading: true,
                onOk: () => {
                // 删除
                this.getRequest("/store/goods/deleteById?id=" + v.id).then(res => {
                    this.$Modal.remove();
                    if (res.success) {
                    this.$Message.success("操作成功");
                    this.getDataList();
                    }
                });
                }
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
}
</style>