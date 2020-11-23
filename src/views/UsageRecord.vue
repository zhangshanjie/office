<template>
  <div class="search">
    <!-- 添加代金券 -->
    <!-- <Modal title="添加代金券" v-model="modalVisible" :mask-closable="false" :width="600">
      <Form :label-width="130">
        <FormItem label="代金券名称:">
          <Input v-model="advertising.Name" />
        </FormItem>
        <FormItem label="代金券类型:">
          <el-radio-group v-model="advertising.type">
            <el-radio :label="3">全场限时券</el-radio>
            <el-radio :label="6">全场通用券</el-radio>
          </el-radio-group>
        </FormItem>
        <FormItem label="代金券面值:">
          <el-radio-group v-model="advertising.moneyType">
            <el-radio :label="3">十元券</el-radio>
            <el-radio :label="6">二十元券</el-radio>
            <el-radio :label="9">三十元券</el-radio>
          </el-radio-group>
        </FormItem>
        <FormItem label="购买金额:">
          <Input v-model="advertising.money" placeholder="输入购买金额" />
        </FormItem>
        <FormItem label="比赛开始-结束时间:">
          <Date-picker
            type="datetime"
            placeholder="选择比赛开始时间"
            format="yyyy-MM-dd HH:mm:ss"
            v-model="advertising.gameStartDateStr"
            @on-change="gamestatetime"
            style="width: 200px"
          ></Date-picker>至
          <Date-picker
            type="datetime"
            placeholder="选择比赛结束时间"
            format="yyyy-MM-dd HH:mm:ss"
            v-model="advertising.gameEndDateStr"
            @on-change="gamesendtime"
            style="width: 200px"
          ></Date-picker>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          @click="handleSubmit(advertising)"
        >确定</Button>
      </div>
    </Modal>-->

    <Row>
      <Col>
        <Card>
          <span style="margin:0 5px 0 0px">优惠券名称:</span>
          <Input
            clearable
            v-model="searchForm.couponName"
            placeholder="输入优惠券"
            style="width:12%;margin-right: 15px;"
          />
          <span style="margin:0 5px 0 0px">实付款:</span>
          <Input
            clearable
            v-model="searchForm.payAmount"
            placeholder="输入实付款"
            style="width:12%;margin-right: 15px;"
          />
          <span style="margin:0 5px 0 0px">优惠券总面值:</span>
          <Input
            clearable
            v-model="searchForm.totalAmount"
            placeholder="输入优惠券总面值"
            style="width:12%;margin-right: 15px;"
          />
          <span style="margin:0 5px 0 0px">优惠券类型:</span>
          <Select style="width:12%" v-model="searchForm.couponType" clearable>
            <Option value="1">鱼塘优惠券</Option>
            <!-- <Option value="-1">临时券</Option> -->
            <Option value="0">全场通券</Option>
          </Select>
          <!-- <span style="margin-left: 15px;">时间查询：</span>
          <Date-picker
            type="daterange"
            @on-change="handleChange"
            placement="bottom-end"
            placeholder="选择日期"
            style="width: 200px"
          ></Date-picker>-->
          <br />
          <br />

          <Row class="operation">
            <Button @click="searcher" type="primary" icon="ios-search" style="margin-left: 10px">搜索</Button>

            <Button @click="replacement" icon="md-refresh">刷新</Button>
          </Row>

          <Row class="operation">
            <!-- <Button @click="replacement" icon="md-refresh">刷新</Button> -->
            <div class="showUsers">
              <el-card shadow="always" class="toDayNewUsers">总补贴金额:{{totalSubsidyAmount}}</el-card>
              <el-card shadow="always" class="yestdayNewUsers">总实付金额:{{totalPayAmount}}</el-card>
            </div>
          </Row>
          <Row>
            <Table
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
import uploadPicInput from "@/views/my-components/xboot/upload-pic-input";
export default {
  components: {
    uploadPicInput,
  },
  data() {
    return {
      totalSubsidyAmount: "", //总实付金额
      totalPayAmount: "", //总补贴金额
      advertising: {
        Name: "",
        type: "",
        moneyType: "",
        money: "",
        gameStartDateStr: "",
        gameEndDateStr: "",
      },
      modalVisible: false,
      yestcount: "",
      nowcount: "",
      loading: true, // 表单加载状态
      selectDate: [],
      educedata: [],
      chartType: "",
      options: [],
      commodityTypeId: "",
      dollarnumber: "",
      dollarid: "",
      secondForm: {
        pageNumber: 1, //页号
        pageSize: 10,
        isRealName: "",
        startDate: "",
        endDate: "",
        fishPondsUserId: "",
      },
      searchForm: {
        // 搜索框初始化对象
        pageNumber: 1, //页号
        pageSize: 10,
        couponName: "",
        payAmount: "",
        couponType: "",
        totalAmount: "",
      },
      approvalStatus: 2,
      reasonAuditFailure: "",
      chenkid: "",
      type: "",
      prohibit: "",
      selectList: [], // 多选数据
      selectCount: 0, // 多选计数
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left",
        },
        {
          type: "index",
          width: 60,
          align: "center",
          fixed: "left",
        },
        //  {
        //   title: "订单编号",
        //   key: "username",
        //   width: 145,
        //   fixed: "left",
        // },
        {
          title: "用户昵称",
          key: "nickName",
          width: 145,
          fixed: "left",
        },
        // {
        //   title: "昵称",
        //   key: "nickName",
        //   minWidth: 145,
        // },
        {
          title: "购买时间",
          key: "buyDate",
          minWidth: 100,
          sortType: "desc",
          sortable: true,
          align: "center",
        },
        {
          title: "支付方式",
          key: "payType",
          minWidth: 80,
          sortable: true,
          render: (h, params) => {
            let re = "";
            if (params.row.payType == 1) {
              re = "支付宝";
            } else if (params.row.payType == 0) {
              re = "微信";
            } else {
              re = "渔票";
            }
            return h("div", re);
          },
        },
        {
          title: "优惠券模板名称",
          key: "couponName",
          minWidth: 100,
          align: "center",
        },
        {
          title: "优惠券类型",
          key: "couponType",
          minWidth: 90,
          // sortable: ,
          render: (h, params) => {
            let re = "";
            if (params.row.couponType == 1) {
              re = "鱼塘活动券";
            } else if (params.row.couponType == 0) {
              re = "全场通用券";
            }
            return h("div", re);
          },
        },
        {
          title: "总张数",
          key: "actualNumber",
          align: "center",
          minWidth: 105,
        },
        //  {
        //   title: "开始时间",
        //   key: "startDate",
        //   align: "center",
        //   minWidth: 105,
        // },
        // {
        //   title: "结束时间",
        //   key: "endDate",
        //   align: "center",
        //   minWidth: 105,
        // },
        {
          title: "实付款",
          key: "payAmount",
          align: "center",
          minWidth: 135,
          //   render: (h, params) => {
          //     if (params.row.status == 0) {
          //       return h("div", [
          //         h("Badge", {
          //           props: {
          //             status: "success",
          //             text: "正常启用",
          //           },
          //         }),
          //       ]);
          //     } else if (params.row.status == -1) {
          //       return h("div", [
          //         h("Badge", {
          //           props: {
          //             status: "error",
          //             text: "禁用",
          //           },
          //         }),
          //       ]);
          //     }
          //   },
          //   filters: [
          //     {
          //       label: "正常启用",
          //       value: 0,
          //     },
          //     {
          //       label: "禁用",
          //       value: -1,
          //     },
          //   ],
          //   filterMultiple: false,
          //   filterMethod(value, row) {
          //     if (value == 0) {
          //       return row.status == 0;
          //     } else if (value == -1) {
          //       return row.status == -1;
          //     }
          //   },
        },
        {
          title: "补贴金额",
          key: "subsidyAmount",
          minWidth: 150,
        },
         {
          title: "优惠券总面值",
          key: "totalAmount",
          minWidth: 150,
        },
      ],
      data: [], // 表单数据
      data1: [], // 表单数据
      total: 0, // 表单数据总数
      total1: 0,
    };
  },
  methods: {
    handleDownload() {
      this.modalVisible = true;
    },
    secondDownload() {
      //会员导出
      this.secondlist(); //调用接口获取数据
      this.downloadLoading = true;
      setTimeout(() => {
        import("./vendor/Export2Excel").then((excel) => {
          const tHeader = [
            "用户名",
            "昵称",
            "手机号",
            "渔界竞钓号",
            "等级",
            "用户类型",
            "渔泡",
            "渔票",
            "渔币",
            "状态",
            "创建时间",
          ];
          const filterVal = [
            "username",
            "nickName",
            "mobile",
            "fishWorldRacing",
            "levelName",
            "typeName",
            "fishBubble",
            "fishTicket",
            "fishCoin",
            "statusName",
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
    },
    secondlist() {
      //会员导出
      this.postRequest(
        "/user/getExportGameMembersByFishPondsUserId",
        this.secondForm
      ).then((res) => {
        this.loading = false;
        if (res.success) {
          this.educedata = res.result;
          console.log(this.educedata, "这里");
          for (var i = 0; i < this.educedata.length; i++) {
            this.educedata[i].typeName =
              this.educedata[i].type == 1 ? "管理员" : "普通用户";
            this.educedata[i].statusName =
              this.educedata[i].status == 0 ? "正常启用" : "禁用";
            this.educedata[i].levelName = this.returnlevelName(
              this.educedata[i].level
            );
            console.log(this.educedata[i]);
          }
          console.log(res, "daochu");
        }
      });
    },
    // 导出
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j];
        })
      );
    },
    returnlevelName: function (type) {
      switch (type) {
        case 1:
          return "渔界小白";
          break;
        case 2:
          return "渔界萌新";
          break;
        case 3:
          return "渔界猎手";
          break;
        case 4:
          return "渔界高手";
          break;
        case 5:
          return "渔界大师";
          break;
        case 6:
          return "渔界元老";
          break;
        case 7:
          return "渔界佳话";
          break;
        case 8:
          return "渔界传说";
          break;
        case 9:
          return "渔界神话";
          break;
        case 10:
          return "渔界霸主";
          break;
        case 11:
          return "渔界独尊";
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
      this.getDataList();
    },
    replacement() {
      // this.searchForm = {};
      this.loading = true;
      this.postRequest("/cashCoupon/getUserBuyCashCouponRecordList", {
        pageNumber: 1, //页号
        pageSize: 10,
        couponName: "",
        payAmount: "",
        couponType: "",
        totalAmount: "",
      }).then((res) => {
        this.loading = false;
        if (res.success) {
          this.total = res.result.cashCouponList.total;
          this.totalPayAmount = res.result.totalPayAmount;
          this.totalSubsidyAmount = res.result.totalSubsidyAmount;
          var dataList = res.result.cashCouponList.list;
          this.data = dataList;
        }
        console.log(res);
      });
    },
    getDataList() {
      this.$fetch(
        "/cashCoupon/getUserBuyCashCouponRecordList",
        this.searchForm
      ).then((res) => {
        if (res.success) {
          this.total = res.result.cashCouponList.total;
          this.totalPayAmount = res.result.totalPayAmount;
          this.totalSubsidyAmount = res.result.totalSubsidyAmount;
          var dataList = res.result.cashCouponList.list;
          this.data = dataList;
        }
        console.log(res, "tttttttttttttt");
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang="less">
.showUsers {
  display: flex;
  justify-content: center;
  align-items: center;
  //  box-shadow:10px rgba(0,0,0,0.9)
  //   flex-direction: column;
}
.toDayNewUsers {
  font-size: 14px;
  font-family: "微软雅黑";
  color: #40a9ff;
  //   font-weight: 100;
}
.yestdayNewUsers {
  font-size: 14px;
  font-family: "微软雅黑";
  color: green;
}
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