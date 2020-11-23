<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <br />
          <div>
            <span>支付方式：</span>
            <Select v-model="searchForm.payType" style="width:13%">
              <Option value="1">支付宝</Option>
              <Option value="2">微信</Option>
              <Option value="3">渔票支付</Option>
              <Option value="4">渔币支付</Option>
              <Option value="5">渔泡支付</Option>
            </Select>
            <span style="margin-left: 15px;">鱼塘名称：</span>
            <Input v-model="searchForm.fishTitle" style="width:13%" placeholder="输入鱼塘名称" />
            <span style="margin-left: 15px;">商品名称：</span>
            <Input v-model="searchForm.couponName" style="width:13%" placeholder="输入商品名称" />
            <span style="margin-left: 15px;">时间查询：</span>
            <!-- <Date-picker
              type="daterange"
              @on-change="handleChange"
              placement="bottom-end"
              placeholder="选择日期"
              style="width: 200px"
            ></Date-picker>-->
            <Date-picker
              type="datetime"
              @on-change="handleChange"
              placement="bottom-end"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期和时间"
              style="width: 200px"
            ></Date-picker>
            <span style="margin-left: 15px;">订单号：</span>
            <Input
              placeholder="请输入订单号"
              v-model="searchForm.orderNo"
              style="width:13%;margin-right: 20px"
            />
            <br />
            <br />
            <span style>订单类型：</span>
            <Select v-model="searchForm.orderStatus" style="width:15%">
              <Option value="0">待支付</Option>
              <Option value="1">支付成功</Option>
              <Option value="2">支付失败</Option>
              <Option value="3">取消支付</Option>
            </Select>
            <Button @click="seekwe" icon="ios-search" type="primary" style="margin-left: 10px">搜索</Button>
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
            <Button @click=" searcher"  style="margin-left: 10px" icon="md-refresh">刷新</Button>
          </div>
          <br />
          <Row class="operation">
            <!-- <Button @click="replacement" icon="md-refresh">刷新</Button> -->
            <div class="showUsers">
              <el-card shadow="always" class="toDayNewUsers">总消费金额:{{totalPayAmount}}</el-card>
              <el-card shadow="always" class="yestdayNewUsers">优惠券使用金额:{{totalCouponAmount}}</el-card>
              <el-card shadow="always" class="yestdayNewUsers">补贴金额:{{totalSubsidy}}</el-card>
              <!-- <el-card shadow="always" class="todayUsers">今日用户总数:{{usersCount}}</el-card>
              <el-card shadow="always" class="yestdayUsers">昨日用户总数:{{100}}</el-card>-->
            </div>
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
              :page-size-opts="[10,20,50,100]"
              size="small"
              show-total
              show-elevator
              show-sizer
            ></Page>
          </Row>
          <Modal title="鱼塘详情" v-model="spdetails" :mask-closable="false" :width="550">
            <Form :label-width="100">
              <FormItem label="支付方式:">
                <div v-if="detailsform.payType==1">支付宝</div>
                <div v-if="detailsform.payType==2">微信</div>
                <div v-if="detailsform.payType==3">渔票支付</div>
                <div v-if="detailsform.payType==4">渔币支付</div>
                <div v-if="detailsform.payType==5">渔泡支付</div>

              </FormItem>
              <FormItem label="实付价格:">
                <div>{{detailsform.payAmount}}</div>
              </FormItem>
              <FormItem label="活动价格:">
                <div>{{detailsform.activePrice}}</div>
              </FormItem>
               <FormItem label="优惠券金额:">
                <div>{{detailsform.couponAmount}}</div>
              </FormItem>
              <FormItem label="下单人:">
                <div>{{detailsform.nickName}}</div>
              </FormItem>
              <FormItem label="鱼塘名称:">
                <div>{{detailsform.fishPondTitle}}</div>
              </FormItem>
               <FormItem label="活动名称:">
                <div>{{detailsform.activeTitle}}</div>
              </FormItem>
              <FormItem label="鱼塘图片:">
                <img :src="detailsform.fishPondPicture" alt style="width:100px;height:100px" />
              </FormItem>
              <!-- <FormItem label="鱼塘活动详情:" v-for="item in orderGoodsList" :key="item.index">
                <FormItem label="鱼塘活动名称:">
                  <div>{{item.goodsName}}</div>
                </FormItem>
                <FormItem label="鱼塘活动价格:">
                  <div>{{item.goodsPrice}}</div>
                </FormItem>
                <FormItem label="鱼塘活动图片:">
                  <img :src="item.mainPhoto" alt style="width:100px;height:100px" />
                </FormItem>
              </FormItem> -->
            
            </Form>
            <div slot="footer">
              <Button type="primary" @click="spdetails=false">确定</Button>
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
      totalPayAmount: "", //总消费金额
      totalCouponAmount: "", //优惠券使用金额
      totalSubsidy: "", //总补贴金额
      detailsform: "",
      educedata: "",
      orderGoodsList: [],
      loading: true, // 表单加载状态
      spdetails: false,
      sdNickName: false,
      searchForm: {
        // 搜索框初始化对象
        pageNumber: 1, //页号
        pageSize: 10,
        fishTitle: "", //鱼塘名称
        activePrice: "", //活动价格
        orderNo: "", //订单号
        usage: "", //优惠券使用数量
        couponAmount: "", //使用的优惠券总金额
        payAmount: "", //实际支付金额
        orderStatus: "", //订单状态：0->待支付；1->支付成功；2->支付失败；3-取消支付
        couponName: "", //商品名称
        type: "", //代金券类型：0->全场通用券
        nickName: "", //用户昵称
        mobile: "", //用户手机号
        payType: "", //资金类型(1.支付宝 2.微信 3.渔票 4.渔币 5.渔泡)
        orderTime: "", //下单时间
      },
      sendgoods: {
        id: "",
        orderType: "",
      },
      searchfan: {
        // 搜索框初始化对象
        pageNumber: 1, //页号
        pageSize: 10,
      },
      type: "",
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
          title: "鱼塘名称",
          key: "fishTitle",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "鱼塘活动价格",
          key: "activePrice",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "订单号",
          key: "orderNo",
          minWidth: 120,
          sortable: false,
        },
        {
          title: "下单时间",
          key: "orderTime",
          minWidth: 120,
          sortable: false,
        },
        {
          title: "优惠券使用数量",
          key: "usage",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "使用优惠券总金额",
          key: "couponAmount",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "实际支付金额",
          key: "payAmount",
          minWidth: 60,
          sortable: false,
        },

    

        {
          title: "订单/商品状态",
          key: "orderStatus",
          minWidth: 90,
          sortable: false,
          render: (h, params) => {
            if(params.row.orderClassification == 1){
              if (params.row.orderStatus == "1") {
              return h("span", "待付款-塘口");
            } else if (params.row.orderStatus == "2") {
              return h("span", "待消费-塘口");
            } else if (params.row.orderStatus == "3") {
              return h("span", "进行中-塘口");
            } else if (params.row.orderStatus == "4") {
              return h("span", "已完成-塘口");
            }
             else if (params.row.orderStatus == "5") {
              return h("span", "退款中-塘口");
            }
             else if (params.row.orderStatus == "6") {
              return h("span", "退款完成-塘口");
            }
             else if (params.row.orderStatus == "7") {
              return h("span", "取消订单-塘口");
            }
             else if (params.row.orderStatus == "8") {
              return h("span", "退款失败-塘口");
            }

            }else{
              if (params.row.orderStatus == "1") {
              return h("span", "待付款-商品");
            } else if (params.row.orderStatus == "2") {
              return h("span", "待发货-商品");
            } else if (params.row.orderStatus == "3") {
              return h("span", "待收货-商品 ");
            } else if (params.row.orderStatus == "4") {
              return h("span", "待评价-商品");
            }
            else if (params.row.orderStatus == "5") {
              return h("span", "退款中-商品");
            }
            else if (params.row.orderStatus == "6") {
              return h("span", "退款完成-商品");
            }
            else if (params.row.orderStatus == "7") {
              return h("span", "已完成-商品");
            }
            else if (params.row.orderStatus == "8") {
              return h("span", "取消订单-商品");
            }
            }
            
          },
        },
       
        {
          title: "用户昵称",
          key: "nickName",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "用户手机号",
          key: "mobile",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "支付方式",
          key: "payType",
          minWidth: 90,
           render: (h, params) => {
            if (params.row.payType == 1) {
              return h("span", "支付宝");
            }else if (params.row.payType == 2) {
              return h("span", "微信");
            }else if (params.row.payType == 3) {
              return h("span", "鱼票");
            }else if (params.row.payType == 4) {
              return h("span", "渔币");
            }else{
              return h("span", "渔泡");
            }
          },
        },

        {
          title: "操作",
          key: "action",
          align: "center",
          width: 100,
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
      // if (this.searchForm.orderType == undefined) {
      //   this.searchForm.orderType = "";
      // }
      // if (this.searchForm.receiver == undefined) {
      //   this.searchForm.receiver = "";
      // }
      // if (this.searchForm.fishPondAddress == undefined) {
      //   this.searchForm.fishPondAddress = "";
      // }
      // if (this.searchForm.orderId == undefined) {
      //   this.searchForm.orderId = "";
      // }
      this.educelist(); //调用接口获取数据

      // }
    },
    //单个数据导出
    downloadExcel() {
      if (this.selectList.length > 0) {
        let fieldTitle = [
          "鱼塘名称",
          "订单号",
          "支付时间",
          // "鱼塘地址",
          "预留电话",
          "预定昵称",
        ];
        let fieldName = [ 
          "fishTitle",
          "orderNo",
          "orderTime",
          "mobile",
          "nickName",
        ];
        this.common.downloadExcel(
          this.selectList,
          fieldTitle,
          fieldName,
          "鱼塘订单列表"
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
      this.postRequest(
        "/cashCoupon/getUserConsumeCouponRecordList",
        this.searchForm
      ).then((res) => {
        console.log(res);
        this.loading = false;
        if (res.success) {
          this.educedata = res.result.consumeCouponList.list;
          this.downloadLoading = true;
          import("./vendor/Export2Excel").then((excel) => {
            const tHeader = [
              "昵称",
              "鱼塘名称",
              "订单号",
              "下单时间",
              "预留电话",
            ];
            const filterVal = [
              "nickName",
              "fishTitle",
              "orderNo",
              "orderTime",
              "mobile",
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
        }
      });
    },
    init() {
      // this.getDataList();
      this.getConsumption();
      this.getSubsidy();
    },
    seekwe() {
      this.searchForm.pageNumber = 1;
      this.getConsumption();
    },
    changePage(v) {
      //点击吧页号赋值给pageNumber
      console.log(v);
      this.searchForm.pageNumber = v;
      this.getConsumption();
      this.clearSelectAll();
    },
    changePageSize(v) {
      console.log(v);
      this.searchForm.pageSize = v;
      this.getConsumption();
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
    changeSelect(e) {
      this.selectList = e;
      this.selectCount = e.length;
    },
    handleChange(v) {
      this.searchForm.orderTime = v;
    },
    searcher() {
      //刷新按钮
      this.searchForm = {
        pageNumber: 1, //页号
        pageSize: 10,
        fishTitle: "", //鱼塘名称
        activePrice: "", //活动价格
        orderNo: "", //订单号
        usage: "", //优惠券使用数量
        couponAmount: "", //使用的优惠券总金额
        payAmount: "", //实际支付金额
        orderStatus: "", //订单状态：0->待支付；1->支付成功；2->支付失败；3-取消支付
      
       
        nickName: "", //用户昵称
        mobile: "", //用户手机号
        fundType: "", //资金类型(1.支付宝 2.微信 3.渔票 4.渔币 5.渔泡)
        orderTime: "", //下单时间
      };
      this.loading = true;
      this.$fetch(
        "/appCoupon/getAppUserConsumeCouponRecordList",
        this.searchForm
      ).then((res) => {
        this.loading = false;
        if (res.success) {
          this.total = res.result.total;
          var dataList = res.result.records;
          this.data = dataList;
        }
      });
    },
    //获取补贴金额
    getSubsidy() {
      let params = {};
      this.$http("/cashCoupon/getTotalSubsidyAmount", params).then((res) => {
        if (res.success) {
          this.totalSubsidy = res.result;
        }
      });
    },
    getConsumption() {
      this.loading = true;
      this.$fetch(
        "/appCoupon/getAppUserConsumeCouponRecordList",
        this.searchForm
      ).then((res) => {
        this.loading = false;
        if (res.success) {
          this.total = res.result.consumeCouponList.total;
          this.totalPayAmount = res.result.totalPayAmount;
          this.totalCouponAmount = res.result.totalCouponAmount;
          var dataList = res.result.consumeCouponList.list;
          this.data = dataList;
        }
      });
    },
    details(v) {
      //详情按钮
      this.spdetails = true;
      let params = {
        id:v.id
      }
      this.$http("/cashCoupon/getUserConsumeCouponRecordById",params).then((res) => {
        if (res.success) {
          this.detailsform = res.result;
          // this.orderGoodsList = res.result.orderGoodsList;
        }
        console.log(res);
      });
      console.log(v);
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
.showUsers {
  display: flex;
  justify-content: center;
  align-items: center;
  //  box-shadow:10px rgba(0,0,0,0.9)
  //   flex-direction: column;
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