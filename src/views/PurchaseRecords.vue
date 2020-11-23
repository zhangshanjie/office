<template>
  <div class="search">
    <!-- 添加代金券 -->
    <Modal :title="titleSelect" v-model="modalVisible" :mask-closable="false" :width="700">
      <Form :label-width="130"  :rules="ruleCustom">
        <FormItem label="优惠券名称:">
          <Input v-model="advertising.couponName" />
        </FormItem>
        <FormItem label="购买金额:" prop="age">
          <Input v-model="advertising.payAmount"  number placeholder="输入购买金额" />
        </FormItem>
        <FormItem label="优惠券类型:">
          <el-radio-group v-model="advertising.type">
            <el-radio :label="0">全场通用券</el-radio>
            <el-radio :label="1">鱼塘活动券</el-radio>
          </el-radio-group>
        </FormItem>
        <FormItem label="优惠券面值:">
          <el-radio-group v-model="advertising.singleAmount">
            <el-radio :label="10">十元券</el-radio>
            <el-input-number v-model="num" :min="1" :max="50" label="描述文字" size="small"></el-input-number>
            <!-- <el-radio :label="6">二十元券</el-radio>
            <el-radio :label="9">三十元券</el-radio>-->
          </el-radio-group>
        </FormItem>
        <FormItem label="赠送券：">
          <el-input-number
            v-model="advertising.giveNumber"
            style="margin-left:20px"
            :min="1"
            :max="100"
            label="描述文字"
            size="small"
          ></el-input-number>
        </FormItem>
        <FormItem label="优惠券状态:">
          <el-select v-model="advertising.status" placeholder="请选择" size="mini">
            <el-option
              v-for="item in [{label:'待上架',value:'0'},{label:'已上架',value:'1'},{label:'已下架',value:'2'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </FormItem>
        <FormItem label="使用类型:">
          <el-radio-group v-model="advertising.useTypeLable">
            <el-radio :label="0">不可叠加</el-radio>
            <el-radio :label="1">可叠加</el-radio>
          </el-radio-group>
        </FormItem>

        <FormItem label="优惠券有效时间:">
          <Date-picker
            type="date"
            @on-change="startTimeChange"
            placeholder="选择开始时间"
            format="yyyy-MM-dd"
            v-model="advertising.startValidDate"
            style="width: 200px"
          ></Date-picker>
          <!-- <Date-picker
            type="datetime"
            @on-change="startTimeChange"
            placeholder="选择开始时间"
            format="yyyy-MM-dd"
            v-model="advertising.startValidDate"
            style="width: 200px"
          ></Date-picker>-->
          至
          <Date-picker
            type="date"
            @on-change="endTimeChange"
            format="yyyy-MM-dd"
            v-model="advertising.endValidDate"
            placeholder="选择结束时间"
            style="width: 200px"
          ></Date-picker>
          <!-- <Date-picker
            type="datetime"
            @on-change="endTimeChange"
            placeholder="选择结束时间"
            format="yyyy-MM-dd"
            v-model="advertising.endValidDate"
            style="width: 200px"
          ></Date-picker>-->
        </FormItem>
        <FormItem label="适用范围：">
          <Input placeholder="适用范围" v-model="advertising.remark" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="handleSubmit()">立即添加</Button>
        <Button type="primary" @click="modalVisible = false">取消</Button>
      </div>
    </Modal>

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
          <span style="margin:0 5px 0 0px">拥有面值:</span>
          <Input
            clearable
            v-model="searchForm.singleAmount"
            placeholder="输入拥有面值"
            style="width:12%;margin-right: 15px;"
          />
          <span style="margin:0 5px 0 0px">优惠券类型:</span>
          <Select style="width:12%" v-model="searchForm.type" clearable>
            <Option value="1">鱼塘活动券</Option>
            <Option value="0">全场通券</Option>
          </Select>
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
          <Button @click="searcher" type="primary" icon="ios-search" style="margin-left: 10px">搜索</Button>
          <br />
          <br />
          <Row class="operation">
            <Button
              @click="handleDownload"
              icon="ios-search"
              type="primary"
              style="margin-left: 10px"
            >添加优惠券</Button>

            <Button @click="replacement" icon="md-refresh">刷新</Button>
          </Row>
          <!-- <Row class="operation">
            <div class="showUsers">
              <el-card shadow="always" class="toDayNewUsers">今日新增用户:{{nowcount}}</el-card>
              <el-card shadow="always" class="yestdayNewUsers">昨日新增用户:{{yestcount}}</el-card>
            </div>
          </Row>-->
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
import uploadPicInput from "@/views/my-components/xboot/upload-pic-input";
export default {
  components: {
    uploadPicInput,
  },
  data() {
    const validateAge = (rule, value, callback) => {
      // console.log(value,'tttttttt')
      if (!this.advertising.payAmount) {
        return callback(new Error("金额不能为空"));
      }
      // 模拟异步验证效果
      setTimeout(() => {
        if (!Number.isInteger(this.advertising.payAmount)) {
          callback(new Error("请输入数字值"));
        } else {
          if (this.advertising.payAmount < 10) {
            callback(new Error("金额必须大于10元"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    return {
      ruleCustom: {
        age: [{ validator: validateAge, trigger: "blur" }],
      },
      titleSelect: "",
      dateString: "",
      inputVisible: false,
      inputValue: "",
      dynamicTags: [],
      num: 1,
      useType: "",
      advertising: {
        giveNumber: 1, //赠送券数量
        couponName: "活动优惠券", //代金券名称
        totalAmount: null, //代金券总面额
        payAmount: null, //实际支付金额
        originalNumber: null, //原始数量
        actualNumber: null, //实际数量
        singleAmount: 10, //代金券面额
        useTypeLable: null,
        remark: "",
        type: null,
        startValidDate: "",
        status: null,
        endValidDate: "",
      },
      modalVisible: false,
      yestcount: "",
      nowcount: "",
      loading: true, // 表单加载状态
      usersCount: "",
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
        singleAmount: "",
        type: "",
        startValidDate: "",
        endValidDate: "",
      },
      approvalStatus: 2,
      reasonAuditFailure: "",
      chenkid: "",
      type: "",
      prohibit: "",
      selectList: [], // 多选数据
      selectCount: 0, // 多选计数
      columns1: [
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
          title: "代金券模板名称",
          key: "nickName",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "类型",
          key: "avatar",
          minWidth: 120,
          sortable: false,
          render: (h, params) => {
            if (
              params.row.avatar != null &&
              params.row.avatar != "" &&
              params.row.avatar != undefined
            ) {
              return h("div", [
                h("img", {
                  props: {
                    type: "primary",
                    size: "small",
                    display: params.row.avatar == "" ? "none" : "inline-block",
                  },
                  attrs: {
                    src: params.row.avatar,
                    style: "width: 60px;height: 60px;border-radius:50%;",
                  },
                  style: {},
                  on: {
                    click: () => {
                      this.viewImage = true;
                      this.currentValue = params.row.avatar;
                    },
                  },
                }),
              ]);
            }
          },
        },
        // {
        //   title: "编号",
        //   key: "mobile",
        //   minWidth: 90,
        //   sortable: false,
        // },
        {
          title: "原始数量",
          key: "fishWorldRacing",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "赠送数量",
          key: "fishBubble",
          minWidth: 90,
          align: "center",
        },
        {
          title: "渔票",
          key: "fishTicket",
          minWidth: 90,
          align: "center",
        },
        {
          title: "渔币",
          key: "fishCoin",
          minWidth: 90,
          align: "center",
          render: (h, params) => {
            if (params.row.fishCoin == 0) {
              return h("span", 10);
            }
          },
        },

        {
          title: "是否实名认证",
          key: "isRealName",
          minWidth: 90,
          sortable: false,
          render: (h, params) => {
            if (params.row.isRealName == "1") {
              return h("span", "未实名");
            } else if (params.row.isRealName == "2") {
              return h("span", "已实名");
            }
          },
        },
        {
          title: "等级",
          key: "level",
          minWidth: 90,
          sortable: false,
          render: (h, params) => {
            if (params.row.level == "1") {
              return h("span", "渔界小白");
            } else if (params.row.level == "2") {
              return h("span", "渔界萌新");
            } else if (params.row.level == "3") {
              return h("span", "渔界猎手");
            } else if (params.row.level == "4") {
              return h("span", "渔界高手");
            } else if (params.row.level == "5") {
              return h("span", "渔界大师");
            } else if (params.row.level == "6") {
              return h("span", "渔界元老");
            } else if (params.row.level == "7") {
              return h("span", "渔界佳话");
            } else if (params.row.level == "8") {
              return h("span", "渔界传说");
            } else if (params.row.level == "9") {
              return h("span", "渔界神话");
            } else if (params.row.level == "10") {
              return h("span", "渔界霸主");
            } else if (params.row.level == "11") {
              return h("span", "渔界独尊");
            }
          },
        },
      ],
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
        {
          title: "编号",
          key: "id",
          minWidth: 145,
          sortable: true,
        },
        {
          title: "优惠券模板名称",
          key: "couponName",
          width: 145,
          fixed: "left",
        },
        // {
        //   title: "昵称",
        //   key: "nickName",
        //   minWidth: 145,
        // },
        {
          title: "类型",
          key: "type;",
          minWidth: 80,
          align: "center",
          render: (h, params) => {
            let re = "";
            if (params.row.type == 1) {
              re = "鱼塘活动券";
            } else if (params.row.type == 0) {
              re = "全场通用券";
            }
            return h("div", re);
          },
        },

        {
          title: "原始数量",
          key: "originalNumber",
          minWidth: 100,
          align: "center",
        },
        {
          title: "赠送数量",
          key: "giveNumber",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "开始时间",
          key: "startValidDate",
          align: "center",
          minWidth: 105,
        },
        {
          title: "结束时间",
          key: "endValidDate",
          align: "center",
          minWidth: 105,
        },
        {
          title: "状态",
          key: "status",
          align: "center",
          minWidth: 140,
          render: (h, params) => {
            if (params.row.status == 1) {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "success",
                    text: "已上架",
                  },
                }),
              ]);
            } else if (params.row.status == 0) {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "error",
                    text: "未上架",
                  },
                }),
              ]);
            } else {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "error",
                    text: "以下架",
                  },
                }),
              ]);
            }
          },
          filters: [
            {
              label: "待上架",
              value: 0,
            },
            {
              label: "已上架",
              value: 1,
            },
            {
              label: "已下架",
              value: 2,
            },
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value == 0) {
              return row.status == 0;
            } else if (value == -1) {
              return row.status == -1;
            }
          },
        },

        {
          title: "实付款",
          key: "payAmount",
          sortable: true,
          sortType: "desc",
          minWidth: 100,
        },
        {
          title: "补贴金额",
          key: "subsidyAmount",
          sortable: true,
          sortType: "desc",
          minWidth: 100,
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          minWidth: 230,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    // type: params.row.status == -1 ? "warning" : "error",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.onShelf(params.row);
                    },
                  },
                },
                "上架"
              ),
              h(
                "Button",
                {
                  props: {
                    // type: params.row,
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.OffShelf(params.row);
                    },
                  },
                },
                "下架"
              ),
              h(
                "Button",
                {
                  props: {
                    // type: params.row.id,
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.remove(params.row.id);
                    },
                  },
                },
                "删除"
              ),
              h(
                "Button",
                {
                  props: {
                    // type: params.row.id,
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.detail(params.row.id);
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
      data1: [], // 表单数据
      total: 0, // 表单数据总数
      total1: 0,
      RecordsVisible: false,
      recordsValue: "",
      index: 0,
    };
  },
  methods: {
    startTimeChange(e) {
      this.advertising.startValidDate = e + " " + "00:00:00";
    },
    endTimeChange(e) {
      this.advertising.endValidDate = e + " " + "23:59:59";
    },
    //提交新增代金券
    handleSubmit() {
      if (this.titleSelect == "添加优惠券") {
        let sums = Math.ceil(
          this.advertising.payAmount / this.advertising.singleAmount
        );
        let actualNumber = sums + this.num;
        this.advertising.originalNumber = sums;
        this.advertising.actualNumber = actualNumber;
        this.advertising.totalAmount =
          actualNumber * this.advertising.singleAmount;
        this.$http("/cashCoupon/addCashCoupon", this.advertising).then(
          (res) => {
            if (res.success) {
              this.getDataList();
              this.modalVisible = false;
              this.advertising = {};
              this.num = "";
            }
          }
        );
      } else if (this.titleSelect == "修改优惠券") {
        let sums = Math.ceil(
          this.advertising.payAmount / this.advertising.singleAmount
        );
        let actualNumber = sums + this.num;
        this.advertising.originalNumber = sums;
        this.advertising.actualNumber = actualNumber;
        this.advertising.totalAmount =
          actualNumber * this.advertising.singleAmount;
        // this.advertising.status =parseInt(this.advertising.status)
        this.$http("/cashCoupon/updateCashCoupon", this.advertising).then(
          (res) => {
            if (res.success) {
              this.getDataList();
              this.modalVisible = false;
              this.advertising = {};
              this.num = "";
            }
          }
        );
      }
    },
    //详情
    detail(v) {
      this.modalVisible = true;
      this.titleSelect = "修改优惠券";
      let params = {
        id: v,
      };
      this.$http("/cashCoupon/getCashCouponById", params).then((res) => {
        if (res.success) {
          this.advertising = res.result;
          this.advertising.useTypeLable = parseInt(
            this.advertising.useTypeLable
          );
          this.num = res.result.actualNumber - res.result.originalNumber;
        }
      });
    },
    //上架代金券
    onShelf(v) {
      let params = {
        id: v.id,
        status: 1,
      };
      this.$http("/cashCoupon/operateCashCoupon", params).then((res) => {
        this.getDataList();
      });
    },
    //下架代金券
    OffShelf(v) {
      let params = {
        id: v.id,
        status: 2,
      };
      this.$http("/cashCoupon/operateCashCoupon", params).then((res) => {
        this.getDataList();
      });
    },
    //删除代金券
    remove(v) {
      this.$confirm("此操作将永久删除该优惠券, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            id: v,
          };
          this.$http("/cashCoupon/deleteCashCoupon", params).then((res) => {
            if (res.success) {
              this.getDataList();
            }
          });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //
    handleCheckedTypeChange(value) {},

    handleDownload() {
      this.modalVisible = true;
      this.titleSelect = "添加优惠券";
      this.advertising = {
        giveNumber: 1, //赠送券数量
        couponName: "活动优惠券", //代金券名称
        totalAmount: null, //代金券总面额
        payAmount: null, //实际支付金额
        originalNumber: null, //原始数量
        actualNumber: null, //实际数量
        singleAmount: 10, //代金券面额
        useTypeLable: null,
        remark: "",
        type: null,
        startValidDate: "",
        status: null,
        endValidDate: "",
      };
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
    handleChange(v) {
      console.log(v);
      this.searchForm.startValidDate = v[0];
      this.searchForm.endValidDate = v[1];
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
      // this.searcher.payAmount = Number(this.searcher.payAmount)
      this.getDataList();
    },
    replacement() {
      // this.searchForm = {};
      this.loading = true;
      this.$fetch("/cashCoupon/getPage", {
        pageNumber: 1,
        pageSize: 10,
      }).then((res) => {
        this.loading = false;
        if (res.success) {
          this.total = res.result.total;
          var dataList = res.result.list;
          this.data = dataList;
        }
      });
    },
    getDataList() {
      this.loading = true;
      this.$fetch("/cashCoupon/getPage", this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.total = res.result.total;
          // this.usersCount = res.result.total;
          var dataList = res.result.list;
          this.data = dataList;
        }
        console.log(res);
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
<style scoped>
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>