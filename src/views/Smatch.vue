<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <br />
          <div>
            <span>支付方式：</span>
            <Select
              v-model="searchForm.paymentMethod"
              style="width: 13%"
              clearable
            >
              <Option value="1">支付宝 </Option>
              <Option value="2">微信</Option>
              <Option value="3">渔票支付</Option>
              <Option value="4">渔币支付</Option>
            </Select>
            <span style="margin-left: 15px">鱼塘名称：</span>
            <Input
              v-model="searchForm.fishTitle"
              style="width: 13%"
              placeholder="输入鱼塘名称"
              clearable
            />

            <span style="margin-left: 15px">昵称：</span>
            <Input
              v-model="searchForm.nickName"
              style="width: 13%"
              placeholder="输入昵称"
              clearable
            />

            <span style="margin-left: 15px">赛事名称：</span>
            <Input
              v-model="searchForm.gameName"
              style="width: 13%"
              placeholder="输入赛事名称"
              clearable
            />

            <span style="margin-left: 15px">赛事标签：</span>
            <Select v-model="searchForm.gameLable" style="width: 15%" clearable>
              <Option value="0">官方赛</Option>
              <Option value="1">公益赛</Option>
              <Option value="2">主题赛 </Option>
            </Select>
            <br />
            <br />
            <span style="margin-left: 15px">订单号：</span>
            <Input
              placeholder="请输入订单号"
              v-model="searchForm.orderNo"
              style="width: 13%; margin-right: 20px"
              clearable
            />
            <span style="margin-left: 15px">支付价格：</span>
            <Input
              placeholder="请输入支付价格"
              v-model="searchForm.payPrice"
              style="width: 13%; margin-right: 20px"
              clearable
            />
            <br />
            <br />
            <span style="">订单状态：</span>
            <Select
              v-model="searchForm.orderStatus"
              style="width: 15%"
              clearable
            >
              <Option value="0">待付款</Option>
              <Option value="1">待使用</Option>
              <Option value="2">已完成 </Option>
              <Option value="3">退款中</Option>
              <Option value="4">已退款</Option>
              <Option value="5">支付超时</Option>
              <Option value="6">已付款</Option>
              <Option value="7">进行中</Option>
              <Option value="8">退款失败</Option>
              <Option value="9">取消订单</Option>

              <!-- <Option value="6">退款完成</Option> -->
            </Select>
            <Button
              @click="seekwe"
              icon="ios-search"
              type="primary"
              style="margin-left: 10px"
              >搜索</Button
            >
            <Button
              @click="handleDownload"
              icon="ios-search"
              type="primary"
              style="margin-left: 10px"
              >导出</Button
            >
            <Button
              @click="downloadExcel"
              icon="ios-search"
              type="primary"
              style="margin-left: 10px"
              >单个数据导出</Button
            >
          </div>
          <br />
          <Row class="operation">
            <Button @click="searcher" icon="md-refresh">刷新</Button>
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
              :page-size-opts="[10, 20, 50]"
              size="small"
              show-total
              show-elevator
              show-sizer
            ></Page>
          </Row>
          <Modal
            title="鱼塘详情"
            v-model="spdetails"
            :mask-closable="false"
            :width="550"
          >
            <Form :label-width="100">
              <FormItem label="支付方式:">
                <div v-if="detailsform.paymentMethod == 1">支付宝</div>
                <div v-if="detailsform.paymentMethod == 2">微信</div>
                <div v-if="detailsform.paymentMethod == 3">渔票支付</div>
              </FormItem>
              <FormItem label="实付价格:">
                <div>{{ detailsform.paidPrice }}</div>
              </FormItem>
              <FormItem label="下单人:">
                <div>{{ sdNickName }}</div>
              </FormItem>
              <FormItem label="鱼塘名称:">
                <div>{{ detailsform.fishPondName }}</div>
              </FormItem>
              <FormItem label="鱼塘图片:">
                <img
                  :src="detailsform.fishPondImage"
                  alt=""
                  style="width: 100px; height: 100px"
                />
              </FormItem>
              <FormItem
                label="鱼塘活动详情:"
                v-for="item in orderGoodsList"
                :key="item.index"
              >
                <FormItem label="鱼塘活动名称:">
                  <div>{{ item.goodsName }}</div>
                </FormItem>
                <FormItem label="鱼塘活动价格:">
                  <div>{{ item.goodsPrice }}</div>
                </FormItem>
                <FormItem label="鱼塘活动图片:">
                  <img
                    :src="item.mainPhoto"
                    alt=""
                    style="width: 100px; height: 100px"
                  />
                </FormItem>
              </FormItem>
            </Form>
            <div slot="footer">
              <Button type="primary" @click="spdetails = false">确定</Button>
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
      detailsform: "",
      orderGoodsList: [],
      loading: true, // 表单加载状态
      spdetails: false,
      sdNickName: false,
      searchForm: {
        // 搜索框初始化对象
        pageNumber: 1, //页号
        pageSize: 10,
        gameName: "",
        paymentMethod: "",
        fishTitle: "",
        gameLable: "",
        orderNo: "",
        orderStatus: "",
        nickName: "",
        payPrice: "",
      },
      sendgoods: {
        id: "",
        orderType: "",
      },
      searchfan: {
        // 搜索框初始化对象
        pageNumber: 1, //页号
        pageSize: 10,
        gameName: "",
        paymentMethod: "",
        fishTitle: "",
        gameLable: "",
        orderNo: "",
        orderStatus: "",
        nickName: "",
        payPrice: "",
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
          title: "昵称",
          key: "nickName",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "赛事名称",
          key: "gameName",
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
          title: "实名信息",
          key: "realName",
          minWidth: 120,
          sortable: false,
        },
        {
          title: "预留电话",
          key: "mobile",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "支付时间",
          key: "payTime",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "支付价格",
          key: "payPrice",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "赛事标签",
          key: "gameLable",
          minWidth: 90,
          sortable: false,
          render: (h, params) => {
            if (params.row.gameLable == "0") {
              return h("span", "官方赛事");
            } else if (params.row.gameLable == "1") {
              return h("span", "公益赛");
            } else if (params.row.gameLable == "2") {
              return h("span", "主题赛");
            }
          },
        },
        {
          title: "订单状态",
          key: "orderStatus",
          minWidth: 90,
          sortable: false,
          render: (h, params) => {
            if (params.row.orderStatus == "0") {
              return h("span", "待付款");
            } else if (params.row.orderStatus == "1") {
              return h("span", "待使用");
            } else if (params.row.orderStatus == "2") {
              return h("span", "已完成");
            } else if (params.row.orderStatus == "3") {
              return h("span", "退款中");
            } else if (params.row.orderStatus == "4") {
              return h("span", "已退款");
            } else if (params.row.orderStatus == "5") {
              return h("span", "支付超时");
            } else if (params.row.orderStatus == "6") {
              return h("span", "已付款");
            } else if (params.row.orderStatus == "7") {
              return h("span", "进行中");
            } else if (params.row.orderStatus == "8") {
              return h("span", "退款失败");
            } else if (params.row.orderStatus == "9") {
              return h("span", "取消订单");
            }
          },
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
            } else if (params.row.paymentMethod == "3") {
              return h("span", "渔票");
            } else if (params.row.paymentMethod == "4") {
              return h("span", "渔币");
            }
          },
        },
        // {
        //     title: "操作",
        //     //   key: "action",
        //     align: "center",
        //     width: 300,
        //     render: (h, params) => {
        //         return h("div",[
        //             h(
        //                 "Button",{
        //                 props:{
        //                     type: 'primary',
        //                     size: 'small',
        //                     icon: 'ios-create-outline'
        //                 },
        //                 style:{
        //                     marginRight: '5px'
        //                 },
        //                 on:{
        //                     click:() =>{
        //                     this.details(params.row)
        //                     }
        //                 }
        //                 },
        //                 '详情'
        //             ),
        //         ])
        //     }
        //     }
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
        let fieldTitle = [
          "鱼塘名称",
          "赛事名称",
          "订单号",
          "支付时间",
          "预留电话",
          "真实姓名",
          '支付价格'
        ];
        let fieldName = [
          "fishTitle",
          "gameName",
          "orderNo",
          "payTime",
          "mobile",
          "realName",
          'payPrice'
        ];
        this.common.downloadExcel(
          this.selectList,
          fieldTitle,
          fieldName,
          "赛事订单列表"
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

    educelist(){
        let params = {}
        this.postRequest("/angleGame/getAllGameOrderList",params).then(res => {
            console.log(res)
            this.loading = false;
            if (res.success) {
                this.educedata = res.result.list
                this.downloadLoading = true
        setTimeout(() => {
            import('./vendor/Export2Excel').then(excel => {
            const tHeader = ['鱼塘名称','赛事名称','订单号','支付时间','预留电话','真实姓名','支付价格']
            const filterVal = ['fishTitle','gameName','orderNo','payTime','mobile','realName','payPrice']
            const list = this.educedata
            const data = this.formatJson(filterVal,list)
            console.log(excel)
            excel.export_json_to_excel({
                header:tHeader,
                data,
                filename:'导出列表名称',
                autoWidth:this.autoWidth,
                bookType:this.bookType,
                autoWidth:true,
                bookType:'xlsx',
            })
        })
        }, 2000);
            }
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
    handleChange(v) {
      console.log(v);
      this.searchForm.startDate = v[0];
      this.searchForm.endDate = v[1];
    },
    searcher() {
      //刷新按钮
      this.$refust("/angleGame/getAllGameOrderList", this.searchfan).then(
        (res) => {
          if (res.success) {
            this.total = res.result.total;
            var dataList = res.result.list;
            this.data = dataList;
          }
        }
      );
    },
    getDataList() {
      if (this.searchForm.paymentMethod == undefined) {
        this.searchForm.paymentMethod = "";
      }
      if (this.searchForm.fishPondName == undefined) {
        this.searchForm.fishPondName = "";
      }
      if (this.searchForm.fishPondAddress == undefined) {
        this.searchForm.fishPondAddress = "";
      }
      if (this.searchForm.orderId == undefined) {
        this.searchForm.orderId = "";
      }
      if (this.searchForm.orderType == undefined) {
        this.searchForm.orderType = "";
      }
      this.loading = true;
      this.postRequest("/angleGame/getAllGameOrderList", this.searchForm).then(
        (res) => {
          this.loading = false;
          if (res.success) {
            this.total = res.result.total;
            var dataList = res.result.list;
            this.data = dataList;
          }
          console.log(res);
        }
      );
    },
    details(v) {
      //详情按钮
      this.sdNickName = v.userNickName;
      this.spdetails = true;
      this.postRequest("/orderInfo/getOrder?id=" + v.id).then((res) => {
        if (res.success) {
          this.detailsform = res.result;
          this.orderGoodsList = res.result.orderGoodsList;
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