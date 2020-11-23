<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <br />
          <div>
            <span style="margin-left: 15px">比赛标题：</span>
            <Input v-model="searchForm.gameName" placeholder="输入标题" style="width:15%;" />
            <Button @click="seekwe" icon="ios-search" type="primary" style="margin-left: 10px">搜索</Button>
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
          <Modal title="详情" v-model="addallSpot" :mask-closable="false" :width="600">
            <Form :label-width="130">
              <FormItem label="比赛名称:">
                <Input disabled v-model="second.gameName" />
              </FormItem>
              <FormItem label="比赛封面图:">
                <img :src="second.imgUrl" alt style="width: 100px;height: 100px;" />
              </FormItem>
              <FormItem label="赛事标签:">
                <!-- <Input disabled v-model="second.gameSite" /> -->
                <el-radio-group v-model="second.gameLable">
                  <el-radio :label="1">公益赛</el-radio>
                  <el-radio :label="0">官方赛</el-radio>
                  <el-radio :label="2">主题赛</el-radio>
                </el-radio-group>
              </FormItem>
              <FormItem label="比赛地点(鱼塘id):">
                <Input disabled v-model="second.gameSite" />
              </FormItem>
              <FormItem label="比赛地点名称:">
                <Input disabled v-model="second.organizers" />
              </FormItem>
              <FormItem label="报名开始-结束时间:">
                <Date-picker
                  type="datetime"
                  placeholder="选择报名开始时间"
                  disabled
                  v-model="second.signStartDate"
                  style="width: 200px"
                ></Date-picker>至
                <Date-picker
                  type="datetime"
                  placeholder="选择结束开始时间"
                  disabled
                  v-model="second.signEndDate"
                  style="width: 200px"
                ></Date-picker>
              </FormItem>
              <FormItem label="比赛开始-结束时间:">
                <Date-picker
                  type="datetime"
                  placeholder="选择比赛开始时间"
                  disabled
                  v-model="second.gameStartDate"
                  style="width: 200px"
                ></Date-picker>至
                <Date-picker
                  type="datetime"
                  placeholder="选择比赛结束时间"
                  disabled
                  v-model="second.gameEndDate"
                  style="width: 200px"
                ></Date-picker>
              </FormItem>
              <FormItem label="联系方式:">
                <Input disabled v-model="second.phoneNum" />
              </FormItem>
              <FormItem label="限制人数量:">
                <Input disabled v-model="second.number" />
              </FormItem>
              <FormItem label="比赛章程:">
                <div>{{second.constitution}}</div>
              </FormItem>
              <FormItem label="比赛规则:">
                <div>{{second.rules}}</div>
              </FormItem>
            </Form>
            <div slot="footer">
              <Button type="primary" @click="addallSpot=false">确定</Button>
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
          <Modal title="报名信息" v-model="applyModal" :mask-closable="false" :width="800">
            <el-table :data="applydata" style="width: 100%">
              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column prop="avatar" label="头像">
                <template slot-scope="scope">
                  <el-avatar :size="large" :src="scope.row.avatar"></el-avatar>
                </template>
              </el-table-column>
              <el-table-column prop="realName" label="实名信息"></el-table-column>
              <el-table-column prop="mobile" label="联系方式"></el-table-column>
              <el-table-column prop="level" label="段位" :formatter="level"></el-table-column>
              <el-table-column label="报名时间">
                <template slot-scope="scope">
                  <span>{{createTime | capitalize }}</span>
                </template>
              </el-table-column>
            </el-table>
            <div slot="footer">
              <Button type="primary" @click="applyModal=false">确定</Button>
            </div>
          </Modal>

          <Modal title="名次信息" v-model="rankingModal" :mask-closable="false" :width="800">
            <!-- <Form :label-width="130">
              <div v-for="item in rankingdata" :key="item.index" style="display: flex;">
                <div style="line-height: 57px;">
                  <span style="font-size:22px">{{item.rownum}}</span>名
                </div>
                <img :src="item.avatar" alt style="width: 50px;height: 50px;margin: 0 10px 0 10px;" />
                <div style="line-height: 57px;margin: 0 30px 0 0px;">{{item.nick_name}}</div>
                <div style="line-height: 57px;" v-if="item.level==1">渔界小白</div>
                <div style="line-height: 57px;" v-if="item.level==2">渔界萌新</div>
                <div style="line-height: 57px;" v-if="item.level==3">渔界猎手</div>
                <div style="line-height: 57px;" v-if="item.level==4">渔界高手</div>
                <div style="line-height: 57px;" v-if="item.level==5">渔界大师</div>
                <div style="line-height: 57px;" v-if="item.level==6">渔界元老</div>
                <div style="line-height: 57px;" v-if="item.level==7">渔界佳话</div>
                <div style="line-height: 57px;" v-if="item.level==8">渔界传说</div>
                <div style="line-height: 57px;" v-if="item.level==9">渔界神话</div>
                <div style="line-height: 57px;" v-if="item.level==10">渔界霸主</div>
                <div style="line-height: 57px;" v-if="item.level==11">渔界独尊</div>
                <div style="line-height: 57px;margin: 0 0px 0 30px;">{{item.fish_world_racing}}</div>
                <div style="line-height: 57px;margin: 0 0px 0 30px;">{{item.score}}</div>
              </div>
            </Form>-->
            <el-table :data="rankingdata" style="width: 100%">
              <el-table-column prop="rownum" label="排名"></el-table-column>
              <el-table-column prop="realName" label="实名信息"></el-table-column>
              <el-table-column prop="mobile" label="联系方式"></el-table-column>
              <el-table-column prop="level" label="段位" :formatter="level"></el-table-column>
            </el-table>
            <div slot="footer">
              <Button type="primary" @click="rankingModal=false">确定</Button>
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
          title: "封面图",
          key: "imgUrl",
          minWidth: 120,
          sortable: false,
          render: (h, params) => {
            if (
              params.row.imgUrl != null &&
              params.row.imgUrl != "" &&
              params.row.imgUrl != undefined
            ) {
              return h("div", [
                h("img", {
                  props: {
                    type: "primary",
                    size: "small",
                    display: params.row.imgUrl == "" ? "none" : "inline-block",
                  },
                  attrs: {
                    src: params.row.imgUrl,
                    style: "width: 100px;height: 100px;",
                  },
                  style: {},
                  on: {
                    click: () => {
                      this.viewImage = true;
                      this.currentValue = params.row.imgUrl;
                    },
                  },
                }),
              ]);
            }
          },
        },
        {
          title: "奖金",
          key: "bonus",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "报名费用",
          key: "signFee",
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
                      this.getOrderInfo(params.row);
                    },
                  },
                },
                "详情"
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
                      this.applymessage(params.row);
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
                      this.rankingmessage(params.row);
                    },
                  },
                },
                "名次信息"
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
    };
  },
  methods: {
    level(column, rows) {
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
      this.postRequest(
        "/fishingGameMp/getFishingGamePcPage",
        this.searchfan
      ).then((res) => {
        this.loading = false;
        if (res.success) {
          this.total = res.result.total;
          var dataList = res.result.records;
          this.data = dataList;
        }
        console.log(res);
      });
    },

    applymessage(v) {
      //报名信息
      this.applyModal = true;
      this.postRequest("/fishingGame/queryFishingGameScore", {
        gameId: v.id,
        type: 1,
      }).then((res) => {
        if (res.success) {
          this.applydata = res.result;
          this.createTime = res.timestamp;
        }
        console.log(res, "名次信息");
      });
    },

    rankingmessage(v) {
      //名次信息
      this.rankingModal = true;
      this.postRequest("/fishingGame/queryFishingGameScore", {
        gameId: v.id,
      }).then((res) => {
        if (res.success) {
          this.rankingdata = res.result;
        }
        console.log(res, "名次信息");
      });
    },
    getOrderInfo(v) {
      console.log(v);
      this.second = v;
      this.second.gameLable = 0
      this.addallSpot = true;
    },
    getDataList() {
      this.loading = true;
      this.postRequest(
        "/fishingGameMp/getFishingGamePcPage",
        this.searchForm
      ).then((res) => {
        this.loading = false;
        if (res.success) {
          this.total = res.result.total;
          var dataList = res.result.records;
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
          // 删除
          this.postRequest(
            "/fishingGameMp/delPrivateCompetitionById?fishingGameId=" + v.id
          ).then((res) => {
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