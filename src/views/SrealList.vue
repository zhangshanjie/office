<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
           <br />
            <span>审核状态：</span>
            <Select
              v-model="searchForm.status"
              style="width: 13%"
              clearable
            >
                  <Option :value="1">审核中</Option>
                  <Option :value="2">审核成功</Option>
                  <Option :value="3">审核失败</Option>
            </Select>
            <span style="margin-left: 15px">真实姓名：</span>
            <Input
              v-model="searchForm.name"
              style="width: 13%"
              placeholder="输入真实姓名"
              clearable
            />
            <span style="margin-left: 15px">身份证号码：</span>
            <Input
              v-model="searchForm.cardNo"
              style="width: 13%"
              placeholder="输入真实姓名"
              clearable
            />
            <br/>
          <br />
          <Row class="operation">
            <Button
              @click="handleDownload"
              icon="ios-search"
              type="primary"
              style="margin-left: 10px"
            >导出</Button>
             <Button
              @click="search"
              icon="ios-search"
              type="primary"
              style="margin-left: 10px"
            >搜索</Button>
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
          <Modal title="审核" v-model="popshen" :mask-closable="false" :width="550">
            <Form :label-width="100">
              <FormItem label="审核状态:" style="width: 75%;">
                <Select v-model="checkfrom.status">
                  <Option :value="1">审核中</Option>
                  <Option :value="2">审核成功</Option>
                  <Option :value="3">审核失败</Option>
                </Select>
              </FormItem>
              <FormItem v-if="checkfrom.status==3" label="失败原因:" style="width: 75%;">
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                  v-model="checkfrom.reasonAuditFailure"
                ></el-input>
              </FormItem>
            </Form>
            <div slot="footer">
              <Button type="primary" @click="popshenbtn">确定</Button>
            </div>
          </Modal>
          <Modal title="详情" v-model="dtailsModal" :mask-closable="false" :width="600">
            <Form :label-width="100">
              <FormItem label="真实姓名:">
                <Input disabled v-model="dtalsdata.name" />
              </FormItem>
              <FormItem label="身份证号:">
                <Input disabled v-model="dtalsdata.cardNo" />
              </FormItem>
              <FormItem label="用户id:">
                <Input disabled v-model="dtalsdata.userId" />
              </FormItem>
              <FormItem label="身份证反面:">
                <img
                  v-if="magnifydata"
                  :src="dtalsdata.cardPositive"
                  alt
                  @click="magnify(dtalsdata.cardPositive)"
                  style="width: 180px;height: 220px;"
                />
                <img
                  v-else
                  :src="magnifyimg"
                  @click="magnifydata=!magnifydata"
                  alt
                  style="width: 340px;height: 380px;"
                />
              </FormItem>
              <FormItem label="身份证正面:">
                <img
                  v-if="magnifyReverse"
                  :src="dtalsdata.cardReverse"
                  alt
                  @click="magnReverse(dtalsdata.cardReverse)"
                  style="width: 180px;height: 220px;"
                />
                <img
                  v-else
                  :src="reverseImg"
                  @click="magnifyReverse=!magnifyReverse"
                  alt
                  style="width: 340px;height: 380px;"
                />
              </FormItem>
              <FormItem label="手持身份证:">
                <img
                  v-if="magnifyCard"
                  :src="dtalsdata.handHeldCard"
                  alt
                  @click="magnCard(dtalsdata.handHeldCard)"
                  style="width: 180px;height: 220px;"
                />
                <img
                  v-else
                  :src="cardImg"
                  @click="magnifyCard=!magnifyCard"
                  alt
                  style="width: 340px;height: 380px;"
                />
              </FormItem>
            </Form>
            <div slot="footer">
              <Button type="primary" @click="dtailsModal=false">确定</Button>
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
      popshen: false,
      dtalsdata: {},
      selectDate: [],
      educedata: [],
      magnifyimg: "",
      magnifydata: true,
      magnifyReverse: true,
      reverseImg: "",
      magnifyCard: true,
      cardImg: "",
      chartType: "",
      dtailsModal: false,
      commodityTypeId: "",
      searchForm: {
        // 搜索框初始化对象
        pageNumber: 1, //页号
        pageSize: 10,
        name:"",
        status:"",
        cardNo:""

      },
      checkfrom: {
        status: "",
        reasonAuditFailure: "",
        realNameEntityId: "",
      },
      approvalStatus: 2,
      reasonAuditFailure: "",
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
          title: "真实姓名",
          key: "name",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "昵称",
          key: "userNickname",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "身份证号",
          key: "cardNo",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "用户id",
          key: "userId",
          minWidth: 120,
          sortable: false,
        },
        {
          title: "审核状态",
          key: "status",
          minWidth: 120,
          sortable: false,
          render: (h, params) => {
            if (params.row.status == "1") {
              return h("span", "审核中");
            } else if (params.row.status == "2") {
              return h("span", "审核成功");
            } else if (params.row.status == "3") {
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
              h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small",
                    icon: "ios-nutrition-outline",
                    disabled: params.row.status != 1,
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.awaitdelivery(params.row);
                    },
                  },
                },
                params.row.status == 1
                  ? "审核"
                  : params.row.status == 2
                  ? "审核成功"
                  : "审核失败"
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
      this.educelist(); //调用接口获取数据
    },
    //单个数据导出
    downloadExcel() {
      if (this.selectList.length > 0) {
        let fieldTitle = ["真实姓名", "昵称", "身份证号", "用户ID"];
        let fieldName = ["name", "userNickname", "cardNo", "userId"];
        this.common.downloadExcel(
          this.selectList,
          fieldTitle,
          fieldName,
          "认证列表"
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
    magnify(v) {
      this.magnifydata = !this.magnifydata;
      this.magnifyimg = v;
    },
    magnReverse(v) {
      this.magnifyReverse = !this.magnifyReverse;
      this.reverseImg = v;
    },
    magnCard(v) {
      this.magnifyCard = !this.magnifyCard;
      this.cardImg = v;
    },
    educelist() {
      this.postRequest("/realNameEntity/getExportByList", this.searchForm).then(
        (res) => {
          this.loading = false;
          if (res.success) {
            this.educedata = res.result;
            this.downloadLoading = true;
           
              import("./vendor/Export2Excel").then((excel) => {
                const tHeader = ["真实姓名", "身份证号", "用户id", "审核状态"];
                const filterVal = ["name", "cardNo", "userId", "status"];
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
            
          }
        }
      );
    },
    search(){
       this.postRequest("/realNameEntity/getPcByPage", this.searchForm).then(
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
    awaitdelivery(v) {
      this.popshen = true;
      this.checkfrom.realNameEntityId = v.id;
      this.checkfrom.status = "";
      this.checkfrom.reasonAuditFailure = "";
    },
    replacement() {
      this.loading = true;
      this.postRequest("/realNameEntity/getPcByPage", {
        pageNumber: 1,
        pageSize: 10,
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
      this.postRequest("/realNameEntity/getPcByPage", this.searchForm).then(
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
    checkd(v) {
      this.popshen = true;
      this.chenkid = v.id;
      this.reasonAuditFailure = "";
      console.log(v, "sss");
    },
    details(v) {
      console.log(v);
      this.dtalsdata = v;
      this.dtailsModal = true;
    },
    popshenbtn(v) {
      this.postRequest("/realNameEntity/updateNameEntity", this.checkfrom).then(
        (res) => {
          if (res.success) {
            this.getDataList();
            this.$Message.success("操作成功");
            this.popshen = false;
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