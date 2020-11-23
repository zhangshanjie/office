<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <br />
          <div>
            <span style="margin-left: 15px">比赛标题：</span>
            <Input
              v-model="searchForm.gameName"
              placeholder="输入标题"
              style="width: 15%"
            />
            <Button
              @click="seekwe"
              icon="ios-search"
              type="primary"
              style="margin-left: 10px"
              >搜索</Button
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
            title="详情"
            v-model="addallSpot"
            :mask-closable="false"
            :width="600"
          >
            <Form :label-width="130">
              <FormItem label="比赛名称:">
                <Input v-model="second.gameName" />
              </FormItem>
              <FormItem label="比赛封面图:">
                <img
                  :src="second.topicImageUrl"
                  alt
                  style="width: 100px; height: 100px"
                />
              </FormItem>
              <FormItem label="赛事标签:">
                <!-- <Input disabled v-model="second.gameSite" /> -->
                <el-radio-group v-model="second.gameLable">
                  <el-radio :label="1">公益赛</el-radio>
                  <el-radio :label="0">官方赛</el-radio>
                  <el-radio :label="2">主题赛</el-radio>
                </el-radio-group>
              </FormItem>
              <!-- <FormItem label="比赛地点(鱼塘id):">
                <Input disabled v-model="second.address" />
              </FormItem> -->
              <FormItem label="比赛地点名称:">
                <Input v-model="second.address" />
              </FormItem>
              <FormItem label="报名开始-结束时间:">
                <Date-picker
                  type="datetime"
                  @on-change="handleChangeStart"
                  placeholder="选择报名开始时间"
                  format="yyyy-MM-dd"
                  v-model="second.enrollStartTime"
                  style="width: 200px"
                ></Date-picker
                >至
                <Date-picker
                  @on-change="handleChangeEnd"
                  type="datetime"
                  placeholder="选择结束开始时间"
                  format="yyyy-MM-dd"
                  v-model="second.enrollEndTime"
                  style="width: 200px"
                ></Date-picker>
              </FormItem>

              <FormItem label="比赛开始-结束时间:">
                <Date-picker
                  @on-change="handleChangeEventStart"
                  type="datetime"
                  placeholder="选择比赛开始时间"
                  v-model="second.gameStartTime"
                  style="width: 200px"
                ></Date-picker
                >至
                <Date-picker
                  @on-change="handleChangeEventEnd"
                  type="datetime"
                  placeholder="选择比赛结束时间"
                  v-model="second.gameEndTime"
                  style="width: 200px"
                ></Date-picker>
              </FormItem>
              <FormItem label="联系方式:">
                <Input v-model="second.mobile" />
              </FormItem>
              <FormItem label="报名费:">
                <Input v-model="second.enrollCost" />
              </FormItem>
              <FormItem label="奖金:">
                <Input v-model="second.rewardAmount" />
              </FormItem>
              <FormItem label="限制人数量:">
                <Input v-model="second.limitNumber" />
              </FormItem>
              <FormItem label="主办方:">
                <div>{{ second.sponsor }}</div>
              </FormItem>
              <FormItem label="协办方:">
                <div>{{ second.cosponsor }}</div>
              </FormItem>
            </Form>
            <div slot="footer">
              <Button type="primary" @click="editEvent()">确定</Button>
            </div>
          </Modal>
          <!-- <el-dialog
            title="提示"
            :visible.sync="applyModal"
            width="30%"
          >
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
          </el-dialog>-->
          <Modal
            title="报名信息"
            v-model="applyModal"
            :mask-closable="false"
            :width="800"
          >
            <el-table :data="applydata" style="width: 100%">
              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column prop="avatar" label="头像">
                <template slot-scope="scope">
                  <el-avatar :src="scope.row.avatar"></el-avatar>
                </template>
              </el-table-column>
              <el-table-column
                prop="realName"
                label="实名信息"
              ></el-table-column>
              <el-table-column
                prop="cardNo"
                label="身份证号码"
              ></el-table-column>
              <el-table-column prop="mobile" label="联系方式"></el-table-column>
              <el-table-column prop="level" label="段位">
                <template slot-scope="scope">
                  <span v-if="scope.row.level == 1">渔界小白</span>
                  <span v-if="scope.row.level == 2">鱼界萌新</span>
                  <span v-if="scope.row.level == 3">鱼界猎手</span>
                  <span v-if="scope.row.level == 4">鱼界高手</span>
                  <span v-if="scope.row.level == 5">渔界大师</span>
                  <span v-if="scope.row.level == 6">渔界元老</span>
                  <span v-if="scope.row.level == 7">渔界佳话</span>
                  <span v-if="scope.row.level == 8">渔界传说</span>
                  <span v-if="scope.row.level == 9">渔界神话</span>
                  <span v-if="scope.row.level == 10">渔界霸主</span>
                  <span v-if="scope.row.level == 11">渔界独尊</span>
                </template>
              </el-table-column>
              <el-table-column label="报名时间" prop="enrollTime">
              </el-table-column>
            </el-table>
             <Page
              :current="paramsList.pageNumber"
              :total="totals"
              :page-size="paramsList.pageSize"
              @on-change="changePageList"
              @on-page-size-change="changePageSizeList"
              size="small"
              show-total
              show-elevator
              show-sizer
            ></Page>
            <!-- <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage1"
              :page-size="100"
              layout="total, prev, pager, next"
              :total="totals"
            > -->
            </el-pagination>
            <div slot="footer">
              <Button type="primary" @click="applyModal = false">确定</Button>
              <Button type="primary" @click="downBooking">导出报名信息</Button>
            </div>
          </Modal>

          <Modal
            title="名次信息"
            v-model="rankingModal"
            :mask-closable="false"
            :width="800"
          >
            <el-table :data="rankingdata" style="width: 100%">
              <!-- <el-table-column prop="rownum" label="排名"></el-table-column>
              <el-table-column prop="realName" label="实名信息"></el-table-column>
              <el-table-column prop="mobile" label="联系方式"></el-table-column>
              <el-table-column prop="level" label="段位" :formatter="level"></el-table-column> -->

              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column prop="avatar" label="头像">
                <template slot-scope="scope">
                  <el-avatar :src="scope.row.avatar"></el-avatar>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="实名信息"></el-table-column>
              <el-table-column prop="sort" label="排名"></el-table-column>
              <el-table-column prop="score" label="分数"></el-table-column>
            </el-table>
             <Page
              :current="paramsRank.pageNumber"
              :total="totalRank"
              :page-size="paramsRank.pageSize"
              @on-change="changePageRank"
              @on-page-size-change="changePageSizeRank"
              size="small"
              show-total
              show-elevator
              show-sizer
            ></Page>
            <div slot="footer">
              <Button type="primary" @click="rankingModal = false">确定</Button>
              <Button type="primary" @click="downLoad">导出名次数据</Button>
            </div>
          </Modal>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import uploadPicInput from "@/views/my-components/xboot/upload-pic-input";
import { parseTime } from "@/libs/index.js";
export default {
  components: {
    uploadPicInput,
  },
  data() {
    return {
      paramsRank: {
        pageNumber: 1,
        pageSize: 10,
        userId: sessionStorage.getItem("userId"),
      },
      totalRank: 0,
      total: 0,
      createTime: "",
      loading: true, // 表单加载状态
      addallSpot: false,
      applyModal: false,
      rankingModal: false,
      rankingdata: [],
      selectDate: [],
      applydata: [],
      chartType: "",
      commodityTypeId: "",
      ivibe: "",
      advertising: {
        title: "",
        image: "",
        content: "",
        messageType: 2,
      },
      second: {
        rewardAmount: "",
        enrollCost: "",
        topicImageUrl: "",
        gameLable: 0,
        gameName: "",
        gameSite: "",
        imgUrl: "",
        signStartDateStr: "",
        signEndDateStr: "",
        gameStartDateStr: "",
        gameEndDateStr: "",
        phoneNum: "",
        fishingGameFirstId: "",
        number: "",

        // gameLable:0
      },
      searchForm: {
        // 搜索框初始化对象
        pageNumber: 1, //页号
        pageSize: 10,
        type: 1,
        gameName: "",
      },
      searchfan: {
        // 搜索框初始化对象
        pageNumber: 1, //页号
        pageSize: 10,
        type: 1,
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
          title: "赛事类型",
          key: "gameLable",
          minWidth: 90,
          sortable: false,
          render: (h, params) => {
            if (params.row.gameLable == "0") {
              return h("span", "官方赛");
            } else if (params.row.gameLable == "1") {
              return h("span", "公益赛");
            } else if (params.row.gameLable == "") {
              return h("span", "主题赛");
            }
          },
        },
        {
          title: "比赛名称",
          key: "gameName",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "比赛地址",
          key: "address",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "封面图",
          key: "topicImageUrl",
          minWidth: 120,
          sortable: false,
          render: (h, params) => {
            if (
              params.row.topicImageUrl != null &&
              params.row.topicImageUrl != "" &&
              params.row.topicImageUrl != undefined
            ) {
              return h("div", [
                h("img", {
                  props: {
                    type: "primary",
                    size: "small",
                    display:
                      params.row.topicImageUrl == "" ? "none" : "inline-block",
                  },
                  attrs: {
                    src:
                      "https://fishingcircles.oss-cn-beijing.aliyuncs.com" +
                      params.row.topicImageUrl,
                    style: "width: 100px;height: 100px;",
                  },
                  style: {},
                  on: {
                    click: () => {
                      this.viewImage = true;
                      this.currentValue = params.row.topicImageUrl;
                    },
                  },
                }),
              ]);
            }
          },
        },
        {
          title: "奖金",
          key: "rewardAmount",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "报名费用",
          key: "enrollCost",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "限制人数",
          key: "limitNumber",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "报名开始时间",
          key: "enrollStartTime",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "报名结束时间",
          key: "enrollEndTime",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 360,
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
                      this.booking(params.row);
                    },
                  },
                },
                "报名信息"
              ),
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
                      this.rank(params.row);
                    },
                  },
                },
                "名次信息"
              ),

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
                      this.edit(params.row);
                    },
                  },
                },
                "修改"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",
                    icon: "md-trash",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.remove(params.row);
                    },
                  },
                },
                "删除"
              ),
            ]);
          },
        },
      ],
      data: [], // 表单数据
      total: 0, // 表单数据总数
      educedata: [],
      downId: "",
      dateString: "",
      imgUrl: "",
      totals: 0,
      paramsList: {
        pageNumber: 1,
        pageSize: 10,
      },
    };
  },
  methods: {
    //导出报名信息
    downBooking() {
      this.educeBooking();
    },
    educeBooking() {
      //导出数据的接口
      let params = {
        gameId: this.downId,
      };
      this.$refust("/angleGame/getEnrollByGameId", params).then((res) => {
        this.educedata = res.result.list;
        console.log(res);
        this.loading = false;

        this.downloadLoading = true;
        setTimeout(() => {
          import("./vendor/Export2Excel").then((excel) => {
            const tHeader = ["实名信息", "身份证号码", "联系方式", "报名时间"];
            const filterVal = ["realName", "cardNo", "mobile", "enrollTime"];
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

    //导出排名信息
    downLoad() {
      this.educelist(); //调用接口获取数据
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j];
        })
      );
    },
    educelist() {
      //导出数据的接口
      let params = {
        gameId: this.downId,
        userId: sessionStorage.getItem("userId"),
      };
      this.$http("/appgameorder/userScoreRank", params).then((res) => {
        this.educedata = res.result.appGameScoreList;
        console.log(res);
        this.loading = false;

        this.downloadLoading = true;
        setTimeout(() => {
          import("./vendor/Export2Excel").then((excel) => {
            const tHeader = ["实名信息", "排名", "分数"];
            const filterVal = ["name", "sort", "score"];
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
    //名次信息
    rank(rows) {
      this.rankingModal = true;
      this.downId = rows.id;
      this.paramsRank.gameId = rows.id;
    },
    getRankList() {
      this.$http("/appgameorder/userScoreRank", this.paramsRank).then((res) => {
        if (res.success) {
          this.rankingdata = res.result.appGameScoreList;
          this.totalRank = res.result.total;
        }
      });
    },
    //报名信息
    booking(rows) {
      this.applyModal = true;
      this.downId = rows.id;
      this.paramsList.gameId = rows.id;
      this.getBookList();
    },
    //获取报名
    getBookList() {
      this.$refust("/angleGame/getEnrollByGameId", this.paramsList).then(
        (res) => {
          if (res.success) {
            this.applydata = res.result.list;
            this.totals = res.result.total;
            console.log(res);
          }
        }
      );
    },
    level(column, rows) {
      console.log(rows, "++++++++");
      return rows.level == 1
        ? "渔界小白"
        : rows.level == 2
        ? "鱼界萌新"
        : rows.level == 3
        ? "鱼界猎手"
        : rows.level == 4
        ? "鱼界高手"
        : rows.level == 5
        ? "渔界大师"
        : rows.level == 6
        ? "渔界元老"
        : rows.level == 7
        ? "渔界佳话"
        : rows.level == 8
        ? "渔界传说"
        : rows.level == 9
        ? "渔界神话"
        : rows.level == 10
        ? "渔界霸主"
        : "渔界独尊";
    },

    init() {
      this.getDataList();
    },
    seekwe() {
      this.searchForm.pageNumber = 1;
      this.getDataList();
    },
    uploadFile(file) {
      console.log(file);
      this.postRequest("/alioss/upload?file=" + file).then((res) => {
        this.advertising.image = res;
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
    changePageList(v) {
      this.paramsList.pageNumber = v;
      this.getBookList();
    },
    changePageSizeList(v) {
      console.log(v);
      this.paramsList.pageSize = v;
      this.getBookList();
    },
    //排名信息
    changePageRank() {
      this.paramsRank.pageNumber = v;
      this.getRankList();
    },
    changePageSizeRank(v) {
      console.log(v);
      this.paramsRank.pageSize = v;
      this.getRankList();
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
    changeSelect(e) {
      this.selectList = e;
      this.selectCount = e.length;
    },
    selectDateRange(value) {
      //选择时间
      this.searchForm.startDate = value[0];
      this.searchForm.endDate = value[1];
    },
    searcher() {
      this.loading = true;
      this.refust("/angleGame/getAllGameList", this.searchfan).then((res) => {
        this.loading = false;
        if (res.success) {
          this.total = res.result.total;
          var dataList = res.result.records;
          this.data = dataList;
        }
        console.log(res);
      });
    },
    //赛事开始时间
    handleChangeEventStart(date) {
      this.second.gameStartTime = date;
      console.log(date);
    },
    //赛事结束时间
    handleChangeEventEnd(date) {
      this.second.gameEndTime = date;
    },
    //报名结束时间
    handleChangeEnd(date) {
      this.second.enrollEndTime = date;
    },
    //报名开始时间
    handleChangeStart(date) {
      this.second.enrollStartTime = date;
    },

    //时间转换
    dateToMs(dates) {
      let result = new Date(dates).getTime();
      const date = new Date(result);
      const Y = date.getFullYear() + "-";
      const M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      const D = date.getDate() + " ";

      const h =
        date.getHours() <= 0
          ? "0" + date.getHours() + ":"
          : date.getHours() + ":";

      const m =
        date.getMinutes() <= 0
          ? "0" + date.getMinutes() + ":"
          : date.getMinutes() + ":";

      const s =
        date.getSeconds() <= 0 ? "0" + date.getSeconds() : date.getSeconds(); // 秒

      var dateString = Y + M + D + h + m + s;
      return dateString;
    },

    edit(row) {
      this.second = row;
      this.imgUrl = row.topicImageUrl;
      this.second.gameLable = parseInt(row.gameLable);
      this.second.topicImageUrl =
        "https://fishingcircles.oss-cn-beijing.aliyuncs.com" +
        row.topicImageUrl;
      this.addallSpot = true;
    },
    editEvent() {
      console.log(this.second.gameStartTime, "----------");
      this.second.gameStartTime = this.dateToMs(this.second.gameStartTime);
      this.second.gameEndTime = this.dateToMs(this.second.gameEndTime);
      this.second.enrollStartTime = this.dateToMs(this.second.enrollStartTime);
      this.second.enrollEndTime = this.dateToMs(this.second.enrollEndTime);

      this.second.topicImageUrl = this.imgUrl;
      console.log(this.second.gameStartTime);

      this.$http("/angleGame/updateGame", this.second).then((res) => {
        if (res.success) {
          this.addallSpot = false;
          this.second = {};
          this.getDataList();
        }
      });
    },

    getDataList() {
      this.loading = true;
      this.$refust("/angleGame/getAllGameList", this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.total = res.result.total;
          var dataList = res.result.list;
          this.data = dataList;
        }
        console.log(res);
      });
    },
    handleSubmit() {
      this.modalVisible = false;
      this.postRequest(
        "/systemNewsInfo/saveSystemNewsInfo",
        this.advertising
      ).then((res) => {
        if (res.success) {
          this.$Message.success("添加成功");
          this.getDataList();
        }
      });
    },
    remove(v) {
      //删除按钮
      console.log(v);
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除?",
        loading: true,
        onOk: () => {
          let params = {
            id: v.id,
          };
          // 删除
          this.$http("/angleGame/deleteGame", params).then((res) => {
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