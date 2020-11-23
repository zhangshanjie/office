<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <br />
          <div>
            <span>资金类型：</span>
            <Select v-model="searchForm.fundType" style="width:15%">
              <Option value="1">支付宝</Option>
              <Option value="2">微信</Option>
              <Option value="3">渔票</Option>
              <Option value="4">渔币</Option>
              <Option value="5">渔泡</Option>
            </Select>
            <span style="margin-left: 15px;">输出类型：</span>
            <Select v-model="searchForm.outType" style="width:15%">
              <Option value="1">支付</Option>
              <Option value="2">充值</Option>
              <Option value="3">转账</Option>
              <Option value="4">赛事报名</Option>
              <Option value="5">消费奖励</Option>
              <Option value="6">提现</Option>
              <Option value="7">兑换</Option>
              <Option value="8">创建战队</Option>
              <Option value="9">升级奖励</Option>
              <Option value="10">充值奖励</Option>
              <Option value="11">实名认证奖励</Option>
              <Option value="12">邀请奖励</Option>
              <Option value="13">签到奖励</Option>
              <Option value="14">渔票转换渔泡</Option>
            </Select>
            <span style="margin-left: 15px;">方式：</span>
            <Select v-model="searchForm.direction" style="width:15%">
              <Option value="1">支出</Option>
              <Option value="2">支入</Option>
            </Select>
            <span style="margin-left: 15px;">用户昵称：</span>
            <Input v-model="searchForm.userNickName" style="width:13%" placeholder="输入用户名" />
            <span style="margin-left: 15px;">时间查询：</span>
            <Date-picker
              type="daterange"
              @on-change="handleChange"
              placement="bottom-end"
              placeholder="选择日期"
              style="width: 200px"
            ></Date-picker>
            <br />
            <br />
            <span style="margin-left: 15px;">编号：</span>
            <Input v-model="searchForm.fundingDetailsId" style="width:13%" placeholder="输入编号" />
            <Button
              @click="getDataList"
              icon="ios-search"
              type="primary"
              style="margin-left: 10px"
            >搜索</Button>
            <Button
              @click="handleDownload"
              icon="ios-search"
              type="primary"
              style="margin-left: 10px"
            >导出</Button>
            <Button
              @click="downloadExcel"
              icon="ios-search"
              type="primary"
              style="margin-left: 10px"
            >单个数据导出</Button>
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
        fundType: "",
        outType: "",
        direction: "",
        startDate: "",
        endDate: "",
        userNickName: "",
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
          title: "标题",
          key: "title",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "资金类型",
          key: "fundType",
          minWidth: 90,
          sortable: false,
          render: (h, params) => {
            if (params.row.fundType == "1") {
              return h("span", "支付宝");
            } else if (params.row.fundType == "2") {
              return h("span", "微信");
            } else if (params.row.fundType == "3") {
              return h("span", "渔票");
            } else if (params.row.fundType == "4") {
              return h("span", "渔币");
            } else if (params.row.fundType == "5") {
              return h("span", "渔泡");
            }
          },
        },
        {
          title: "金额",
          key: "amount",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "编号",
          key: "id",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "输出类型",
          key: "outType",
          minWidth: 90,
          sortable: false,
          render: (h, params) => {
            if (params.row.outType == "1") {
              return h("span", "支付");
            } else if (params.row.outType == "2") {
              return h("span", "充值");
            } else if (params.row.outType == "3") {
              return h("span", "转账");
            } else if (params.row.outType == "4") {
              return h("span", "赛事报名");
            } else if (params.row.outType == "5") {
              return h("span", "消费奖励");
            } else if (params.row.outType == "6") {
              return h("span", "提现");
            } else if (params.row.outType == "7") {
              return h("span", "兑换");
            } else if (params.row.outType == "8") {
              return h("span", "创建战队");
            } else if (params.row.outType == "9") {
              return h("span", "升级奖励");
            } else if (params.row.outType == "10") {
              return h("span", "充值奖励");
            } else if (params.row.outType == "11") {
              return h("span", "实名认证奖励");
            } else if (params.row.outType == "12") {
              return h("span", "邀请奖励");
            } else if (params.row.outType == "13") {
              return h("span", "签到奖励");
            } else if (params.row.outType == "14") {
              return h("span", "渔票转换渔泡");
            }
          },
        },
        {
          title: "方式",
          key: "direction",
          minWidth: 90,
          sortable: false,
          render: (h, params) => {
            if (params.row.direction == "1") {
              return h("span", "支出");
            } else if (params.row.direction == "2") {
              return h("span", "支入");
            }
          },
        },
        
        {
          title: "用户昵称",
          key: "userNickName",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "时间",
          key: "createTime",
          minWidth: 200,
          sortable: false,
        },
      ],
      data: [], // 表单数据
      total: 0, // 表单数据总数
    };
  },
  methods: {
    // 导出
    handleDownload() {
      if (this.searchForm.fundType == undefined) {
        this.searchForm.fundType = "";
      }
      if (this.searchForm.outType == undefined) {
        this.searchForm.outType = "";
      }
      if (this.searchForm.direction == undefined) {
        this.searchForm.direction = "";
      }
      if (this.searchForm.userNickName == undefined) {
        this.searchForm.userNickName = "";
      }
      this.educelist(); //调用接口获取数据
    },
    //单个导出
    downloadExcel() {
      if (this.selectList.length > 0) {
        let fieldTitle = [
          "编号",
          "名称",
          "资金类型",
          "金额",
          "方式",
          "输出类型",
          "用户昵称",
          "时间",
        ];
        let fieldName = [
          "id",
          "title",
          "fundType",
          "amount",
          "direction",
          "outType",
          "userNickName",
          "createTime",
        ];
        this.common.downloadExcel(
          this.selectList,
          fieldTitle,
          fieldName,
          "资金明细列表"
        );
      } else {
        this.$message({
          message: "警告哦，请选择需要导出的数据！",
          type: "warning",
        });
      }
    },
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
      this.postRequest("/fundingDetails/getPcByList", this.searchForm).then(
        (res) => {
          console.log(res);
          this.loading = false;
          if (res.success) {
            this.educedata = res.result;
            for (var i = 0; i < this.educedata.length; i++) {
              console.log(this.educedata[i]);
              this.educedata[i].directionName =
                this.educedata[i].direction == 1 ? "支出" : "支入";
              this.educedata[i].outTypeName = this.returnOutTypeName(
                this.educedata[i].outType
              );
              this.educedata[i].fundTypeName = this.returnfundTypeName(
                this.educedata[i].fundType
              );
              console.log(this.educedata[i]);
            }
          }
          this.downloadLoading = true;
          setTimeout(() => {
            import("./vendor/Export2Excel").then((excel) => {
              const tHeader = [
                "标题",
                "用户昵称",
                "资金类型",
                "金额",
                "方式",
                "输入类型",
                "时间",
              ];
              const filterVal = [
                "title",
                "userNickName",
                "fundTypeName",
                "amount",
                "directionName",
                "outTypeName",
                "createTime",
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
        }
      );
    },
    returnfundTypeName: function (type) {
      switch (type) {
        case 1:
          return "支付宝";
          break;
        case 2:
          return "微信";
          break;
        case 3:
          return "渔票";
          break;
        case 4:
          return "渔币";
          break;
        case 5:
          return "渔泡";
          break;
      }
    },
    returnOutTypeName: function (type) {
      switch (type) {
        case 1:
          return "支付";
          break;
        case 2:
          return "充值";
          break;
        case 3:
          return "转账";
          break;
        case 4:
          return "赛事报名";
          break;
        case 5:
          return "消费奖励";
          break;
        case 6:
          return "提现";
          break;
        case 7:
          return "兑换";
          break;
        case 8:
          return "创建战队";
          break;
        case 9:
          return "升级奖励";
          break;
        case 10:
          return "充值奖励";
          break;
        case 11:
          return "实名认证奖励";
          break;
        case 12:
          return "邀请奖励";
          break;
      }
    },

    init() {
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
      this.postRequest("/fundingDetails/getPcByPage", this.searchfan).then(
        (res) => {
          this.loading = false;
          if (res.success) {
            this.total = res.result.total;
            var dataList = res.result.records;
            this.data = dataList;
          }
        }
      );
    },
    handleChange(v) {
      console.log(v);
      this.searchForm.startDate = v[0];
      this.searchForm.endDate = v[1];
    },
    getDataList() {
      if (this.searchForm.fundType == undefined) {
        this.searchForm.fundType = "";
      }
      if (this.searchForm.outType == undefined) {
        this.searchForm.outType = "";
      }
      if (this.searchForm.direction == undefined) {
        this.searchForm.direction = "";
      }
      if (this.searchForm.userNickName == undefined) {
        this.searchForm.userNickName = "";
      }
      this.loading = true;
      this.postRequest("/fundingDetails/getPcByPage", this.searchForm).then(
        (res) => {
          this.loading = false;
          if (res.success) {
            this.total = res.result.total;
            var dataList = res.result.records;
            this.data = dataList;
          }
          console.log(res);
        }
      );
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