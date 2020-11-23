<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <br />
          <div>
            <!-- <span>订单类型：</span> -->
            <!-- <Select v-model="searchForm.orderType" style="width:15%">
                        <Option value="1">待付款</Option>
                        <Option value="2">已付款</Option>
            </Select>-->
            <span style="margin-left: 15px;">订单分类：</span>
            <Select v-model="searchForm.orderClassification" style="width:15%">
              <Option value="1">渔票</Option>
              <Option value="2">渔泡</Option>
            </Select>
            <span style="margin-left: 15px;">支付方式：</span>
            <Select v-model="searchForm.paymentMethod" style="width:15%">
              <Option value="1">支付宝</Option>
              <Option value="2">微信</Option>
            </Select>
            <span style="margin-left: 15px;">时间查询：</span>
            <Date-picker
              type="daterange"
              @on-change="handleChange"
              placement="bottom-end"
              placeholder="选择日期"
              style="width: 200px"
            ></Date-picker>
            <Button @click="seekwe" icon="ios-search" type="primary" style="margin-left: 10px">搜索</Button>
            <Button
              @click="downloadExcel"
              icon="ios-search"
              type="primary"
              style="margin-left: 10px"
            >单个数据导出</Button>
            <Button
              @click="handleDownload"
              icon="ios-search"
              type="primary"
              style="margin-left: 10px"
            >导出</Button>
          </div>
          <br />
          <Row class="operation">
            <Button @click=" searcher" icon="md-refresh">刷新</Button>
          </Row>
          <Row>
            <Table
              :loading="loading"
              border
              :columns="columns"
              :data="data"
              ref="table"
              sortable="custom"
              @on-selection-change="changeSelect"
            ></Table>
          </Row>
          <Row type="flex" justify="end" class="page">
            <Page
              :current="searchForm.pageNumber"
              :total="total"
              :page-size="searchForm.pageSize"
              @on-change="changePage"
              @on-page-size-change="changePageSize"
              :page-size-opts="[10,20,50]"
              size="small"
              show-total
              show-elevator
              show-sizer
            ></Page>
          </Row>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import export_json_to_excel from "@/views/vendor/Export2Excel";
import uploadPicInput from "@/views/my-components/xboot/upload-pic-input";
export default {
  components: {
    uploadPicInput,
  },
  data() {
    return {
      loading: true, // 表单加载状态
      selectDate: [],
      chartType: "",
      educedata: [],
      commodityTypeId: "",
      advertising: {
        adverType: "",
        image: "hah",
        sortNum: "",
      },
      searchForm: {
        // 搜索框初始化对象
        pageNumber: 1, //页号
        pageSize: 10,
        orderType: 2,
        orderClassification: "",
        paymentMethod: "",
        userNickName: "",
        startDate: "",
        endDate: "",
      },
      searchfan: {
        // 搜索框初始化对象
        pageNumber: 1, //页号
        pageSize: 10,
      },
      type: "",
      prohibit: "",
      selectList: [], // 多选数据
      selectCount: 0, // 多选计数
      columns: [
        // 表头
        {
          type: "selection",
          width: 50,
          align: "center",
        },
        {
          type: "index",
          width: 60,
          align: "center",
        },
        {
          title: "订单号",
          key: "id",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "用户名",
          key: "userNickName",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "支付方式",
          key: "paymentMethod",
          minWidth: 90,
          sortable: false,
          render: (h, params) => {
            if (params.row.paymentMethod == "1") {
              return h("span", "支付宝");
            } else if (params.row.paymentMethod == "2") {
              return h("span", "微信");
            }
          },
        },
        {
          title: "实付价钱",
          key: "paidPrice",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "付款时间",
          key: "payTime",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "订单分类",
          key: "orderClassification",
          minWidth: 90,
          sortable: false,
          render: (h, params) => {
            if (params.row.orderClassification == "1") {
              return h("span", "渔票");
            } else if (params.row.orderClassification == "2") {
              return h("span", "渔泡");
            }
          },
        },
      ],
      data: [], // 表单数据
      total: 0, // 表单数据总数
    };
  },
  methods: {
    // 导出
    handleDownload() {
      this.educelist(); //调用接口获取数据
    },
    downloadExcel() {
      if (this.selectList.length > 0) {
        let fieldTitle = [
          "订单号",
          "用户名",
          "支付方式",
          "实付价钱",
          "付款时间",
          "订单分类",
        ];
        let fieldName = [
          "id",
          "userNickName",
          "paymentMethod",
          "paidPrice",
          "payTime",
          "orderClassification",
        ];
        this.common.downloadExcel(
          this.selectList,
          fieldTitle,
          fieldName,
          "充值记录列表"
        );
      } else {
        this.$message({
          message: "警告哦，请选择需要导出的数据！",
          type: "warning",
        });
      }
    },
    //全部导出

    // 导出
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j];
        })
      );
    },

    educelist() {
      //导出数据的接口
      this.postRequest(
        "/rechargePackageOrder/getExportByList",
        this.searchForm
      ).then((res) => {
        console.log(res);
        if (res.success) {
          this.educedata = res.result;
          for (var i = 0; i < this.educedata.length; i++) {
            console.log(this.educedata[i]);
            this.educedata[i].paymentMethodName =
              this.educedata[i].paymentMethod == 1 ? "支付宝" : "微信";
            this.educedata[i].orderClassificationName =
              this.educedata[i].orderClassification == 1 ? "渔票" : "渔泡";
            console.log(this.educedata[i]);
          }
        }
        this.downloadLoading = true;
        setTimeout(() => {
          import("./vendor/Export2Excel").then((excel) => {
            const tHeader = [
              "订单号",
              "用户名",
              "支付方式",
              "实付价钱",
              "付款时间",
              "订单分类",
            ];
            const filterVal = [
              "id",
              "userNickName",
              "paymentMethodName",
              "paidPrice",
              "payTime",
              "orderClassificationName",
            ];
            const list = this.educedata;
            const data = this.formatJson(filterVal, list);
            console.log(excel);
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: "导出列表名称",
              autoWidth: this.autoWidth,
              bookType: this.bookType,
              autoWidth: true,
              bookType: "xlsx",
            });
          });
        }, 2000);
      });
    },

    init() {
      this.getDataList();
    },
    seekwe() {
      this.searchForm.pageNumber = 1;
      this.getDataList();
    },
    changePage(v) {
      //点击吧页号赋值给pageNumber
      console.log(v);
      this.searchForm.pageNumber = v;
      this.getDataList();
      this.clearSelectAll();
    },
    changePageSize(v) {
      console.log(v);
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
    searcher() {
      this.loading = true;
      this.searchForm = {};
      this.postRequest(
        "/rechargePackageOrder/getPcByPage",
        this.searchfan
      ).then((res) => {
        this.loading = false;
        if (res.success) {
          this.total = res.result.total;
          var dataList = res.result.records;
          this.data = dataList;
        }
      });
    },
    handleChange(v) {
      console.log(v);
      this.searchForm.startDate = v[0];
      this.searchForm.endDate = v[1];
    },
    getDataList() {
      this.loading = true;
      this.postRequest(
        "/rechargePackageOrder/getPcByPage",
        this.searchForm
      ).then((res) => {
        this.loading = false;
        if (res.success) {
          this.total = res.result.total;
          var dataList = res.result.records;
          this.data = dataList;
        }
        console.log(res);
      });
    },
    stateDateRange(v) {
      this.addfome.startTime = v;
    },
    endDateRange(v) {
      this.addfome.endTime = v;
    },
  },
  mounted() {
    this.init();
  },
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
  .createuser {
    width: 220px;
    height: 33px;
    border-radius: 3px;
    border: 1px solid #dcdee2;
    margin-right: 43px;
  }
  .fonts {
    font-size: 13px;
  }
  .photo {
    width: 100px;
    height: 100px;
    border-radius: 100px;
  }
}
</style>