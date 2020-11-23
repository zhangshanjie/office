<template>
<div class="search">
    <Row>
    <Col>
        <Card>
        <Row class="operation" style="margin-bottom: 10px">
            <Button @click="getDataList" icon="md-refresh">刷新</Button>
        </Row>
        <Row>
            <Table
            :loading="loading"
            border
            :columns="columns"
            :data="data"
            ref="table"
            sortable="custom"
            @on-sort-change="changeSort"
            @on-selection-change="changeSelect"
            ></Table>
        </Row>
        </Card>
    </Col>
    </Row>
</div>
</template>

<script>
export default {
    name: "agreement",
    data() {
        return {
        loading: true, // 表单加载状态
        sortColumn: "create_time", // 排序字段
        sortType: "desc", // 排序方式
        
        submitLoading: false, // 添加或编辑提交状态
        selectList: [], // 多选数据
        selectCount: 0, // 多选计数
        userType:"1",
        columns: [
            // 表头
            {
                type: "index",
                width: 60,
                align: "center"
            },
            {
                title: "协议类型",
                key: "type",
                sortable: true,
                render: (h, params) => {
                    if(params.row.type==1){
                        return h("span","隐私协议")
                    }else if(params.row.type == 2){
                        return h("span","平台协议")
                    }else if(params.row.type == 3){
                        return h('span','关于我们')
                    }
                }
            },
            {
            title: "操作",
            key: "action",
            align: "center",
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
                )
                ]);
            }
            }
        ],
        data: [], // 表单数据
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        total: 0 // 表单数据总数
        };
    },
    methods: {
        init() {
            this.getDataList();
        },
        changePage(v) {
            this.pageNumber = v;
            this.getDataList();
            this.clearSelectAll();
        },
        changePageSize(v) {
            this.pageSize = v;
            this.getDataList();
        },
        changeSort(e) {
            this.sortColumn = e.key;
            this.sortType = e.order;
            if (e.order == "normal") {
                this.sortType = "";
            }
            this.getDataList();
        },
        getDataList() {
            this.loading = true;
            let params = {
                type: 0
            };
            this.getRequest("/protocol/getByType", params).then(res => {
                this.loading = false;
                if (res.success) {
                    this.data = res.result
                }
            });
        },
        handleCancel() {
            this.modalVisible = false;
        },
        add() {
            let query = { backRoute: this.$route.name };
            this.$router.push({
                name: "newsadd",
                query: query
            });
        },
        edit(v) {
            console.log(v)
            // 记录返回路由
            let query = { id: v.type, backRoute: this.$route.name};
            this.$router.push({
                name: "agreementEdit",
                query: query
            });
        },
        handleSearch() {
            this.pageNumber = 1;
            this.pageSize = 10;
            this.getDataList();
        },
        handleReset() {
            // this.$refs.searchForm.resetFields();
            this.pageNumber = 1;
            this.pageSize = 10;
            this.getDataList();
        },
        clearSelectAll() {
            this.$refs.table.selectAll(false);
        },
        changeSelect(e) {
            this.selectList = e;
            this.selectCount = e.length;
        }
    },
    mounted() {
        this.init();
    }
};
</script>