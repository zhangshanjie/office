<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <br />
          <Row class="operation">
            <span style="margin:0 5px 0 0px">提现类型类型:</span>
            <Select style="width:15%" v-model="searchForm.withdrawInfoType">
              <Option value="1">支付宝</Option>
              <Option value="2">微信</Option>
              <Option value="3">银行卡</Option>
            </Select>
            <span style="margin:0 5px 0 15px">审核状态:</span>
            <Select style="width:15%" v-model="searchForm.auditStatus">
              <Option value="1">待审核</Option>
              <Option value="2">审核成功</Option>
              <Option value="3">审核失败</Option>
            </Select>
            <span style="margin:0 5px 0 20px">提现账号:</span>
            <Input placeholder="请输入提现账号" v-model="searchForm.accountNumber" style="width:12%" />
            <span style="margin-left: 15px;">时间查询：</span>
            <Date-picker
              type="daterange"
              @on-change="handleChange"
              placement="bottom-end"
              placeholder="选择日期"
              style="width: 200px"
            ></Date-picker>
            <Button @click="searcher" type="primary" icon="ios-search" style="margin-left: 10px">搜索</Button>
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
          </Row>
          <Row class="operation">
            <Button @click="replacement" icon="md-refresh">刷新</Button>
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
          <Modal title="审核" v-model="modaldeposit" :mask-closable="false" :width="550">
            <Form :label-width="100">
              <FormItem label="审核状态:">
                <Select v-model="depositform.auditStatus" style="width: 80%;">
                  <Option :value="2">审核成功</Option>
                  <Option :value="3">审核失败</Option>
                </Select>
              </FormItem>
              <FormItem v-if="depositform.auditStatus==3" label="拒绝原因:" style="width: 85%;">
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入拒绝原因"
                  v-model="depositform.auditFailureReason"
                ></el-input>
              </FormItem>
            </Form>
            <div slot="footer">
              <Button type="primary" @click="deposittrue">确定</Button>
            </div>
          </Modal>
          <Modal title="详情" v-model="detailsModal" :mask-closable="false" :width="550">
            <Form :label-width="100">
              <FormItem label="提现人:" style="width: 85%;">
                <Input disabled v-model="detalsdata.userNickName" />
              </FormItem>
              <FormItem label="提现账号:" style="width: 85%;" v-if="detalsdata.withdrawInfoType!=3">
                <Input disabled v-model="detalsdata.accountNumber" />
              </FormItem>
              <FormItem label="提现类型:" style="width: 85%;">
                <Select disabled v-model="detalsdata.withdrawInfoType">
                  <Option :value="1">支付宝</Option>
                  <Option :value="2">微信</Option>
                  <Option :value="3">银行卡</Option>
                </Select>
              </FormItem>
              <FormItem label="提现账号姓名:" style="width: 85%;" v-if="detalsdata.withdrawInfoType!=3">
                <Input disabled v-model="detalsdata.accountNumberName" />
              </FormItem>
              <FormItem label="提现金额:" style="width: 85%;">
                <Input disabled v-model="detalsdata.withdrawalAmount" />
              </FormItem>
              <FormItem label="手续费:" style="width: 85%;">
                <Input disabled v-model="detalsdata.totalAmount" />
              </FormItem>
              <FormItem label="提现时间:" style="width: 85%;">
                <Input disabled v-model="detalsdata.createTime" />
              </FormItem>
              <FormItem label="审核人昵称:" style="width: 85%;">
                <Input disabled v-model="detalsdata.auditNickName" />
              </FormItem>
              <FormItem label="审核状态:" style="width: 85%;">
                <Select disabled v-model="detalsdata.auditStatus">
                  <Option :value="1">待审核</Option>
                  <Option :value="2">审核成功</Option>
                  <Option :value="3">审核失败</Option>
                </Select>
              </FormItem>
              <FormItem label="审核时间:" style="width: 85%;">
                <Input disabled v-model="detalsdata.auditTime" />
              </FormItem>
              <div v-if="detalsdata.withdrawInfoType==3">
                <FormItem label="开户行:" style="width: 85%;">
                  <Input disabled v-model="detalsdata.bankName" />
                </FormItem>
                <FormItem label="支行:" style="width: 85%;">
                  <Input disabled v-model="detalsdata.bankBranch" />
                </FormItem>
                <FormItem label="卡号:" style="width: 85%;">
                  <Input disabled v-model="detalsdata.accountNumber" />
                </FormItem>
                <FormItem label="开户人名称:" style="width: 85%;">
                  <Input disabled v-model="detalsdata.accountNumberName" />
                </FormItem>
              </div>
            </Form>
            <div slot="footer">
              <Button type="primary" @click="deposittrue">确定</Button>
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
    uploadPicInput,
  },
  data() {
    return {
      loading: true, // 表单加载状态
      selectDate: [],
      chartType: "",
      educedata: [],
      modaldeposit: false,
      detailsModal: false,
      detalsdata: "", //详情数据
      commodityTypeId: "",
      searchForm: {
        // 搜索框初始化对象
        pageNumber: 1, //页号
        pageSize: 10,
        userType: "2",
        withdrawInfoType: "",
        auditStatus: "",
        accountNumber: "",
      },
      depositform: {
        id: "",
        auditStatus: "",
        auditFailureReason: "",
      },
      approvalStatus: 2,
      chenkid: "",

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
          width: 50,
          align: "center",
        },
        {
          title: "提现人",
          key: "userNickName",
          minWidth: 120,
          sortable: false,
        },
        {
          title: "提现类型",
          key: "withdrawInfoType",
          minWidth: 120,
          sortable: false,
          render: (h, params) => {
            if (params.row.withdrawInfoType == "1") {
              return h("span", "支付宝");
            } else if (params.row.withdrawInfoType == "2") {
              return h("span", "微信");
            } else if (params.row.withdrawInfoType == "3") {
              return h("span", "银行卡");
            }
          },
        },
        {
          title: "提现账号姓名",
          key: "accountNumberName",
          minWidth: 120,
          sortable: false,
        },
        {
          title: "提现账号",
          key: "accountNumber",
          minWidth: 120,
          sortable: false,
        },
        {
          title: "提现金额",
          key: "withdrawalAmount",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "总金额",
          key: "totalAmount",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "手续费",
          key: "withdrawalHandlingFee",
          minWidth: 70,
          sortable: false,
        },
        {
          title: "提现时间",
          key: "createTime",
          minWidth: 120,
          sortable: false,
        },
        {
          title: "审核状态",
          key: "auditStatus",
          minWidth: 100,
          sortable: false,
          render: (h, params) => {
            if (params.row.auditStatus == "1") {
              return h("span", "待审核");
            } else if (params.row.auditStatus == "2") {
              return h("span", "审核成功");
            } else if (params.row.auditStatus == "3") {
              return h("span", "审核失败");
            }
          },
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
                    type: "primary",
                    size: "small",
                    icon: "ios-create-outline",
                    disabled: params.row.auditStatus != 1,
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.checksd(params.row);
                    },
                  },
                },
                params.row.auditStatus == 1
                  ? "审核"
                  : params.row.auditStatus == 2
                  ? "审核成功"
                  : "审核失败"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small",
                    icon: "ios-create-outline",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.details(params.row);
                    },
                  },
                },
                "详情"
              ),
            ]);
          },
        },
      ],
      data: [], // 表单数据
      total: 0, // 表单数据总数
    };
  },
  methods: {
    handleDownload() {
      if (this.searchForm.withdrawInfoType == undefined) {
        this.searchForm.withdrawInfoType = "";
      }
      if (this.searchForm.auditStatus == undefined) {
        this.searchForm.auditStatus = "";
      }
      if (this.searchForm.accountNumber == undefined) {
        this.searchForm.accountNumber = "";
      }
      this.educelist(); //调用接口获取数据
    },
    //单个数据导出
    downloadExcel() {
      if (this.selectList.length > 0) {
        let fieldTitle = [
          "提现人",
          "提现账号",
          "提现类型",
          "提现账号姓名",
          "提现金额",
          "总金额",
          "手续费",
          "提现时间",
          "审核状态",
        ];
        let fieldName = [
          "userNickName",
          "accountNumber",
          "withdrawInfoType",
          "accountNumberName",
          "withdrawalAmount",
          "totalAmount",
          "withdrawalHandlingFee",
          "createTime",
          "auditStatus",
        ];
        this.common.downloadExcel(
          this.selectList,
          fieldTitle,
          fieldName,
          "塘主提现列表"
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
    details(v) {
      //详情
      console.log(v);
      this.detalsdata = v;
      this.detailsModal = true;
    },
    educelist() {
      this.postRequest("/withdrawInfo/getExportByList", this.searchForm).then(
        (res) => {
          this.loading = false;
          if (res.success) {
            this.educedata = res.result;
            for (var i = 0; i < this.educedata.length; i++) {
              console.log(this.educedata[i]);
              this.educedata[i].withdrawInfoTypeName =
                this.educedata[i].withdrawInfoType == 1
                  ? "支付宝"
                  : this.educedata[i].withdrawInfoType == 3
                  ? "银行卡"
                  : "微信";
              this.educedata[i].auditStatusName =
                this.educedata[i].auditStatus == 1
                  ? "待审核"
                  : this.educedata[i].auditStatus == 2
                  ? "审核成功"
                  : "审核失败";
              console.log(this.educedata[i]);
            }
          }
          this.downloadLoading = true;
          setTimeout(() => {
            import("./vendor/Export2Excel").then((excel) => {
              const tHeader = [
                "提现类型",
                "提现账号姓名",
                "提现金额",
                "总金额",
                "提现时间",
                "手续费",
                "审核时间",
                "审核状态",
              ];
              const filterVal = [
                "withdrawInfoTypeName",
                "accountNumberName",
                "withdrawalAmount",
                "totalAmount",
                "createTime",
                "withdrawalHandlingFee",
                "auditTime",
                "auditStatusName",
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
    handleChange(v) {
      console.log(v);
      this.searchForm.startDate = v[0];
      this.searchForm.endDate = v[1];
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
      this.searchForm.pageNumber = 1;
      if (this.searchForm.withdrawInfoType == undefined) {
        this.searchForm.withdrawInfoType = "";
      }
      if (this.searchForm.auditStatus == undefined) {
        this.searchForm.auditStatus = "";
      }
      this.getDataList();
    },
    deposittrue() {
      if (this.searchForm.withdrawInfoType == undefined) {
        this.searchForm.withdrawInfoType = "";
      }
      if (this.searchForm.auditStatus == undefined) {
        this.searchForm.auditStatus = "";
      }
      if (this.searchForm.accountNumber == undefined) {
        this.searchForm.accountNumber = "";
      }
      this.postRequest(
        "/withdrawInfo/updateWithdrawInfo",
        this.depositform
      ).then((res) => {
        if (res.success) {
          this.modaldeposit = false;
          this.$Message.success("审核成功");
          this.getDataList();
        }
        console.log(res);
      });
    },
    replacement() {
      (this.searchForm.withdrawInfoType = ""),
        (this.searchForm.auditStatus = ""),
        (this.searchForm.accountNumber = "");
      this.loading = true;
      this.postRequest("/withdrawInfo/getByPage", {
        pageNumber: 1,
        pageSize: 10,
        userType: 2,
      }).then((res) => {
        this.loading = false;
        if (res.success) {
          this.total = res.result.total;
          var dataList = res.result.records;
          this.data = dataList;
        }
        console.log(res);
      });
    },
    getDataList() {
      this.loading = true;
      this.postRequest("/withdrawInfo/getByPage", this.searchForm).then(
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
    checksd(v) {
      (this.depositform.auditStatus = ""),
        (this.depositform.auditFailureReason = ""),
        (this.modaldeposit = true);
      this.depositform.id = v.id;
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
    console.log(this.selectDate);
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