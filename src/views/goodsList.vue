<template>
  <div class="search">
    <!-- 添加代金券 -->
    <Modal :title="titleSelect" v-model="modalVisible" :mask-closable="false" :width="700">
      <Form :label-width="130" :rules="ruleCustom">
        <FormItem label="商品名称:">
          <Input v-model="advertising.goodsName" />
        </FormItem>
        <FormItem label="商品数量:">
          <Input v-model="advertising.amount" />
        </FormItem>
        <FormItem label="商品原价:" prop="age">
          <Input v-model="advertising.originalPrice" number placeholder="输入优惠卷面额" />
        </FormItem>
        <FormItem label="商品现价:">
          <Input v-model="advertising.price" @on-change="showdis" number placeholder="输入优惠卷面额" />
        </FormItem>
        <FormItem label="商品状态:">
          <Select style="width:30%" v-model="advertising.status" clearable>
            <Option value="0">待上架</Option>
            <Option value="1">已上架</Option>
            <Option value="2">已下架</Option>
          </Select>
        </FormItem>
        <FormItem label="商品活动类型:">
          <Select style="width:30%" v-model="advertising.type" clearable>
            <Option value="1">购买优惠券</Option>
            <Option value="0">充值赠券</Option>
          </Select>
        </FormItem>
        <FormItem label="优惠卷:" v-for="(item,index) in appGoodsCouponList" :key="index">
          <Select style="width:30%" v-model="appGoodsCouponList[index].couponId" clearable>
            <Option
              :value="item.id"
              v-for="(item,index) in RecardList"
              :key="index"
            >{{item.couponName}}</Option>
          </Select>
          <el-input-number
            v-model="appGoodsCouponList[index].couponNum"
            @change="((val)=>{numChange(val, index)})"
            style="margin-left:15px"
            size="small"
            :min="0"
            :max="100"
            label="描述文字"
          ></el-input-number>
          <el-button class="button-new-tag" size="small" @click="showInput">+ New</el-button>
        </FormItem>
        <FormItem label="优惠金额">
          <Input v-model="advertising.discountedPrice" disabled />
        </FormItem>
        <FormItem label="适用范围：">
          <Input placeholder="适用范围" v-model="advertising.remark" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="handleSubmit()">立即添加</Button>
        <!-- <Button type="primary" @click="modalVisible = false">取消</Button> -->
      </div>
    </Modal>

    <Row>
      <Col>
        <Card>
          <span style="margin:0 5px 0 0px">商品名称:</span>
          <Input
            clearable
            v-model="searchForm.goodsName"
            placeholder="输入商品名称"
            style="width:12%;margin-right: 15px;"
          />
          <span style="margin:0 5px 0 0px">商品状态:</span>
          <Select style="width:12%" v-model="searchForm.useType" clearable>
            <Option value="0">待上架</Option>
            <Option value="1">已上架</Option>
            <Option value="2">已下架</Option>
          </Select>
          <span style="margin:0 5px 0 0px">商品价格:</span>
          <Input
            clearable
            v-model="searchForm.price"
            placeholder="输入商品价格"
            style="width:12%;margin-right: 15px;"
          />
          <span style="margin:0 5px 0 0px">商品活动类型:</span>
          <Select style="width:12%" v-model="searchForm.type" clearable>
            <Option value="1">购买优惠券</Option>
            <Option value="0">充值赠券</Option>
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
            >添加商品</Button>

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
      if (!this.advertising.price) {
        return callback(new Error("面额不能为空"));
      }
      // 模拟异步验证效果
      setTimeout(() => {
        if (!Number.isInteger(this.advertising.price)) {
          callback(new Error("请输入数字值"));
        } else {
          if (this.advertising.price < 4) {
            callback(new Error("面额必须大于5元"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    return {
      //   dynamicTags: [],
      inputVisible: false,
      inputValue: "",

      singleAmountList: [
        {
          num: "",
        },
      ],
      ruleCustom: {
        age: [{ validator: validateAge, trigger: "blur" }],
      },
      titleSelect: "",
      dateString: "",
      inputVisible: false,
      inputValue: "",
      dynamicTags: [
        {
          value: 5,
          modleValue: "",
        },
      ],
      num: 1,
      useType: "",

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
        goodsName: "", //商品名称
        amount: "", //商品数量
        price: "", //商品价格
        buyEndTime: "", //购买时间
        status: "", //商品状态
        discountedPrice: "", //优惠金额
        type: "", //商品活动类型
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
        {
          title: "编号",
          key: "id",
          minWidth: 145,
          sortable: true,
        },
        {
          title: "创建人",
          key: "createBy",
          width: 145,
          fixed: "left",
        },
        {
          title: "商品名称",
          key: "goodsName",
          width: 145,
          fixed: "left",
        },
        // {
        //   title: "昵称",
        //   key: "nickName",
        //   minWidth: 145,
        // },
        {
          title: "商品活动类型",
          key: "type;",
          minWidth: 80,
          align: "center",
          render: (h, params) => {
            let re = "";
            if (params.row.type == 1) {
              re = "充值赠券";
            } else if (params.row.type == 0) {
              re = "购买优惠卷";
            }
            return h("div", re);
          },
        },

        {
          title: "创建时间",
          key: "createTime",
          minWidth: 105,
          sortable: false,
        },
        {
          title: "购买时间",
          key: "buyEndTime",
          align: "center",
          minWidth: 105,
        },
        {
          title: "商品价格",
          key: "price",
          align: "center",
          minWidth: 105,
        },
        {
          title: "商品现价",
          key: "originalPrice",
          align: "center",
          minWidth: 105,
        },
        {
          title: "优惠卷金额",
          key: "discountedPrice",
          align: "center",
          minWidth: 105,
        },
        {
          title: "商品状态",
          key: "status",
          align: "center",
          minWidth: 140,
          render: (h, params) => {
            if (params.row.status == 0) {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "warning",
                    text: "待上架",
                  },
                }),
              ]);
            } else if (params.row.status == 1) {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "success",
                    text: "已上架",
                  },
                }),
              ]);
            } else {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "error",
                    text: "已下架",
                  },
                }),
              ]);
            }
          },
        },
        {
          title: "商品数量",
          key: "amount",
          minWidth: 100,
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          minWidth: 300,
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
                      this.onShelf(params.row.id);
                    },
                  },
                },
                "上架"
              ),
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
                      this.waitShelf(params.row.id);
                    },
                  },
                },
                "待上架"
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
                      this.OffShelf(params.row.id);
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
      arr: [],
      RecardList: [],
      appGoodsCouponList: [
        {
          couponId: "",
          couponNum: "",
          couponName: "",
        },
      ],
      advertising: {
        goodsName: "", //商品名称
        amount: "", //商品数量
        price: "", //商品现价
        status: "", //商品状态
        discountedPrice: "", //优惠金额
        type: "", //商品活动类型
        appGoodsCouponList: [],
        originalPrice: "", //商品原价
      },
      arr: [],
    };
  },
  //   watch: {
  //     "this.advertising.discountedPrice": function (newVal, oldVal) {
  //       if (this.advertising.originalPrice && this.advertising.price) {
  //         this.advertising.discountedPrice =
  //           this.advertising.originalPrice - this.advertising.price;
  //       } else {
  //         this.$message({
  //           message: "商品原价和现价不能为空！",
  //           type: "warning",
  //         });
  //       }
  //     },
  //   },
  methods: {
    valueChange(e, idx) {
      let obj = {};
      obj.valueName = idx;
      obj.nums = e;
      this.arr.push(obj);
      console.log(e, idx, this.arr);
    },
    //新增优惠卷form
    showInput() {
      let obj = {
        couponId: "",
        couponNum: "",
      };
      this.appGoodsCouponList.push(obj);
    },
    //计数器
    numChange(e, index) {
      let obj = {};
      obj.couponId = this.appGoodsCouponList[index].couponId;
      obj.couponNum = e;
      obj.couponName = this.RecardList[index].couponName;
      this.arr.push(obj);
      console.log(this.arr, "---------");
    },
    //优惠卷下拉
    getRecardList() {
      let params = {};
      this.$http("/appCoupon/getAllAppCouponList", params).then((res) => {
        if (res.success) {
          this.RecardList = res.result.list;

          console.log(this.RecardList, "-------------");
        }
      });
    },

    startTimeChange(e) {
      this.key = true;
      this.advertising.startValidDate = e;
    },
    endTimeChange(e) {
      this.key = true;
      this.advertising.endValidDate = e;
    },
    //获取优惠金额和控制原价大于现价
    showdis() {
      if (this.advertising.originalPrice - this.advertising.price > 0) {
        this.advertising.discountedPrice =
          this.advertising.originalPrice - this.advertising.price;
      } else {
        this.$message({
          message: "商品原价必须大于现价！",
          type: "warning",
        });
      }
    },

    //提交新增商品
    handleSubmit() {
      if (this.titleSelect == "添加商品") {
        this.advertising.buyEndTime = "2020-12-21 23:59:59";
        this.advertising.appGoodsCouponList = this.appGoodsCouponList;
        console.log(this.advertising, "-----------");
        if (this.advertising) {
          this.$http("/appgoods/add", this.advertising).then((res) => {
            if (res.success) {
              this.getDataList();
              this.modalVisible = false;
              this.advertising = {};
            }
          });
        }
      } else if (this.titleSelect == "修改商品") {
        // this.advertising.updateBy = sessionStorage.getItem("userInfo");
        // let data = this.rTime(this.advertising.startValidDate);
        this.advertising.appGoodsCouponList = this.appGoodsCouponList;
        this.advertising.buyEndTime = "2020-12-21 23:59:59";
        this.$http("/appgoods/update", this.advertising).then((res) => {
          if (res.success) {
            this.getDataList();
            this.modalVisible = false;
            this.advertising = {};
          }
        });
      }
    },
    //详情
    detail(v) {
      this.modalVisible = true;
      this.titleSelect = "修改商品";
      let params = {
        id: v,
      };
      this.$http("/appgoods/getGoodsInfoById", params).then((res) => {
        if (res.success) {
          this.advertising.goodsName = res.result.goodsName;
          this.advertising.amount = res.result.amount;
          this.advertising.remark = res.result.remark;
          this.advertising.price = res.result.price;
          this.advertising.originalPrice = res.result.originalPrice;
          this.advertising.discountedPrice = res.result.discountedPrice;
          this.advertising.status = String(res.result.status);
          this.advertising.type = String(res.result.type);
          this.appGoodsCouponList = res.result.appGoodsCouponList;
          console.log(this.advertising.appGoodsCouponList, "---------");
          this.advertising.id = v;
          //   this.num = res.result.actualNumber - res.result.originalNumber;
        }
      });
    },
    //上架代金券
    onShelf(v) {
      let params = {
        id: v,
        status: 1,
      };
      this.$http("/appgoods/updateAppGoodsStatus", params).then((res) => {
        this.getDataList();
      });
    },
    // //下架代金券
    OffShelf(v) {
      let params = {
        id: v,
        status: 2,
      };
      this.$http("/appgoods/updateAppGoodsStatus", params).then((res) => {
        this.getDataList();
      });
    },
    //待上架
    waitShelf(v) {
      let params = {
        id: v,
        status: 0,
      };
      this.$http("/appgoods/updateAppGoodsStatus", params).then((res) => {
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
          this.$http("/appgoods/delete", params).then((res) => {
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
      this.titleSelect = "添加商品";
      this.appGoodsCouponList = [
        {
          couponId: "",
          couponNum: "",
          couponName: "",
        },
      ];
      this.advertising = {
        couponName: "活动优惠券", //代金券名称
        singleAmount: 10, //代金券面额
        useType: null,
        remark: "",
        type: null,
        startValidDate: "",
        // status: null,
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
      // this.searcher.payAmount = Number(this.searcher.payAmount)
      this.getDataList();
    },
    replacement() {
      // this.searchForm = {};
      this.loading = true;
      this.$fetch("/appgoods/getPage", {
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
      this.$fetch("/appgoods/getPage", this.searchForm).then((res) => {
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
    this.getRecardList();
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
.el-tag + .el-tag {
  margin-left: 10px;
}
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