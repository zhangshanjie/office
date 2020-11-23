<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <br />
          <Row class="operation">
            <span style="margin:0 5px 0 20px">登录账号:</span>
            <Input v-model="searchForm.registrationUserName" style="width:13%" />
            <span style="margin:0 5px 0 20px">登录地址:</span>
            <Input v-model="searchForm.registrationAddress" style="width:13%" />
            <span style="margin:0 5px 0 20px">渔界竞钓号:</span>
            <Input v-model="searchForm.fishWorldRacing" style="width:13%" />
            <span style="margin-left: 15px;">时间查询：</span>
            <Date-picker
              type="daterange"
              @on-change="handleChange"
              placement="bottom-end"
              placeholder="选择日期"
              style="width: 200px"
            ></Date-picker>
            <Button @click="searcher" type="primary" icon="ios-search" style="margin-left: 10px">搜索</Button>
            <Button @click="replacement" icon="md-refresh">刷新</Button>
          </Row>
          <Row class="operation">
            <div class="showUsers">
              <el-card shadow="always" class="toDayNewUsers">今日登录用户总数:{{nowcount}}</el-card>
              <el-card shadow="always" class="yestdayNewUsers">昨日登录用户总数:{{yestcount}}</el-card>
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
              :page-size-opts="[10,20,50]"
              size="small"
              show-total
              show-elevator
              show-sizer
            ></Page>
          </Row>
          <Modal title="删除" v-model="popshen" :mask-closable="false" :width="600">
            <Form :label-width="100">
              <FormItem label="删除原因:">
                <!-- <Input v-model="reasonAuditFailure" style="width:80%;margin-right: 20px;"/> -->
                <el-input
                  style="width:80%"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入删除原因"
                  v-model="reasonAuditFailure"
                ></el-input>
              </FormItem>
            </Form>
            <div slot="footer">
              <Button type="primary" @click="popshenbtn">删除</Button>
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
        nowcount:"",
        yestcount:"",
      loading: true, // 表单加载状态
      popshen: false,
      selectDate: [],
      chartType: "",
      commodityTypeId: "",
      searchForm: {
        // 搜索框初始化对象
        pageNumber: 1, //页号
        pageSize: 10,
        startDate: "",
        endDate: "",
        registrationUserName: "",
        registrationAddress: "",
        fishWorldRacing: "",
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
          title: "登录账号",
          key: "registrationUserName",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "登录地址",
          key: "registrationAddress",
          minWidth: 120,
          sortable: false,
        },
        {
          title: "渔界竞钓号",
          key: "fishWorldRacing",
          minWidth: 120,
          sortable: false,
        },
        {
          title: "登录时间",
          key: "createTime",
          minWidth: 120,
          sortable: false,
        },
      ],
      data: [], // 表单数据
      total: 0, // 表单数据总数
    };
  },
  methods: {
    init() {
      this.getDataList();
      this.getYestDayDataList();
      this.getNowDayDataList();
    },
    getDataList() {
      this.loading = true;
      this.postRequest("/user/getByPage", this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.total = res.result.total;
          this.usersCount = res.result.total;
          var dataList = res.result.records;
          this.data = dataList;
        }
        console.log(res);
      });
    },
    getYestDayDataList() {
      this.loading = true;
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      var nowDate = year + "-" + month + "-" + day;
      var time = new Date().getTime() - 24 * 60 * 60 * 1000;
      var yesday = new Date(time);
      var month = yesday.getMonth();
      var day = yesday.getDate();
      var yesdays =
        yesday.getFullYear() +
        "-" +
        (yesday.getMonth() > 9
          ? yesday.getMonth() + 1
          : "0" + (yesday.getMonth() + 1)) +
        "-" +
        (yesday.getDate() > 9 ? yesday.getDate() : "0" + yesday.getDate());
      const data = {
        pageNumber: 1, //页号
        pageSize: 10,
        startDate: yesdays,
        endDate: nowDate,
      };
      this.postRequest("/registrationRecord/getPcByPage", data).then((res) => {
        this.loading = false;
        if (res.success) {
          this.yestcount = res.result.total;
          //   this.usersCount = res.result.total;
          //   var dataList = res.result.records;
          //   this.data = dataList;
        }
        console.log(res);
      });
    },
    //今日新增
    getNowDayDataList() {
      this.loading = true;
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      var nowDate = year + "-" + month + "-" + day;
      var time = new Date().getTime() + 24 * 60 * 60 * 1000;
      var yesday = new Date(time);
      var month = yesday.getMonth();
      var day = yesday.getDate();
      var yesdays =
        yesday.getFullYear() +
        "-" +
        (yesday.getMonth() > 9
          ? yesday.getMonth() + 1
          : "0" + (yesday.getMonth() + 1)) +
        "-" +
        (yesday.getDate() > 9 ? yesday.getDate() : "0" + yesday.getDate());
      const data = {
        pageNumber: 1, //页号
        pageSize: 10,
        startDate: nowDate,
        endDate: yesdays,
      };
      this.postRequest("/registrationRecord/getPcByPage", data).then((res) => {
        this.loading = false;
        if (res.success) {
          this.nowcount = res.result.total;
        }
        console.log(res);
      });
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
      this.getDataList();
    },
    handleChange(v) {
      console.log(v);
      this.searchForm.startDate = v[0];
      this.searchForm.endDate = v[1];
    },
    replacement() {
      (this.searchForm.registrationUserName = ""),
        (this.searchForm.registrationAddress = ""),
        (this.searchForm.fishWorldRacing = ""),
        (this.loading = true);
      this.postRequest("/registrationRecord/getPcByPage", {
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
      this.postRequest("/registrationRecord/getPcByPage", this.searchForm).then(
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
    popshenbtn(v) {
      if (this.reasonAuditFailure == "") {
        this.$Message.warning("请填写原因");
      } else {
        this.postRequest("/shortVideo/approvalShortVideo", {
          approvalStatus: this.approvalStatus,
          reasonAuditFailure: this.reasonAuditFailure,
          id: this.chenkid,
        }).then((res) => {
          if (res.success) {
            this.getDataList();
            this.$Message.success("操作成功");
            this.popshen = false;
          }
          console.log(res);
        });
      }
    },
    remove(v) {
      //删除按钮
      console.log(v);
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除?",
        loading: true,
        onOk: () => {
          // 删除
          this.postRequest("/forumInfo/delByIds?ids=" + v.id).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("删除成功");
              this.getDataList();
            }
            console.log(res);
          });
        },
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
.showUsers {
  display: flex;
  justify-content: center;
  align-items: center;
  //  box-shadow:10px rgba(0,0,0,0.9)
  //   flex-direction: column;
}
</style>