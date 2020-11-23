<template>
<!-- 查看用户申请退款列表申请 -->
<div class="search">
    <Row>
        <Col>
            <Card>
                <div>
                    <span style="font-size:15px">鱼种类型:</span>
                    <Input  v-model="couponName"  style="width:15%;margin: 20px;"/>
                    <Button type="primary"  @click="addyuzhong">添加</Button>
                </div>
                <Row class="operation">
                    <Button @click="getDataList" icon="md-refresh">刷新</Button>
                </Row>
                <Row>
                    <Table :loading="loading" border :columns="columns" :data="data" ref="table" sortable="custom" @on-selection-change="changeSelect"></Table>
                </Row>
                <Row type="flex" justify="end" class="page">
                    <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
                </Row>
            </Card>
        </Col>
    </Row>

</div>
</template>

<script>     
export default {
data() {
    return {
        couponName:'',
    loading: true, // 表单加载状态
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
        width: 60,
        align: "center"
        },
        {
        type: "index",
        width: 60,
        align: "center"
        },
        {
            title: "添加时间",
            key: "createTime",
            minWidth: 120,
            sortable: false,
        },
        {
            title: "鱼种名称",
            key: "fingerlingInfoName",
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
    edit(v){//编辑按钮
        console.log(v)
    },
    remove(v){//删除按钮
        console.log(v)
        this.postRequest("/fingerlingInfo/delByIds",{ids:v.id}).then(res => {
            if (res.success) {
                console.log(res)
                this.getDataList()
                this.$Message.success("删除成功");
                
            }
        });
    },
    addyuzhong(){
        if(this.couponName==''){
            this.$Message.warning("鱼种类型不能为空");
        }else{
            this.postRequest("/fingerlingInfo/saveFingerlingInfo",{fingerlingInfoName:this.couponName,type:'1'}).then(res => {
                if (res.success) {
                    console.log(res)
                    this.getDataList()
                    this.$Message.success("添加成功");
                    this.couponName=''
                }
            });
        }
    },
    getDataList() {
        // this.loading = true;
        this.data=[];
        this.postRequest("/fingerlingInfo/getByPage", this.searchForm).then(res => {
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
}
</style>