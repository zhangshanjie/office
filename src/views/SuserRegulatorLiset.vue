<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <span style="margin:0 5px 0 0px">昵称:</span>
          <Input
            v-model="searchForm.nickName"
            placeholder="输入标题"
            style="width:12%;margin-right: 15px;"
          />
          <span style="margin:0 5px 0 0px">手机号:</span>
          <Input
            v-model="searchForm.mobile"
            placeholder="输入标题"
            style="width:12%;margin-right: 15px;"
          />
          <span style="margin:0 5px 0 0px">渔界竞钓号:</span>
          <Input
            v-model="searchForm.fishWorldRacing"
            placeholder="输入标题"
            style="width:12%;margin-right: 15px;"
          />
          <span style="margin:0 5px 0 0px">当前状态:</span>
          <Select style="width:12%" v-model="searchForm.status">
            <Option value="0">正常用户</Option>
            <Option value="-1">拉黑用户</Option>
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
          <span>地区查询：</span>
          <el-cascader
            :options="options"
            clearable
            filterable
            @change="searchCity"
            :props="{ checkStrictly: true }"
            ref="searcherAddr"
            size="mini"
            style="width:250px"
          ></el-cascader>

          <Button @click="searcher" type="primary" icon="ios-search" style="margin-left: 10px">搜索</Button>
          <br />
          <br />
          <Row class="operation">
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
            <Button @click="replacement" icon="md-refresh">刷新</Button>
          </Row>
          <Row class="operation">
            <!-- <Button @click="replacement" icon="md-refresh">刷新</Button> -->
            <div class="showUsers">
              <el-card shadow="always" class="toDayNewUsers">今日新增用户:{{nowcount}}</el-card>
              <el-card shadow="always" class="yestdayNewUsers">昨日新增用户:{{yestcount}}</el-card>
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
        </Card>
        <!-- 二级页面 -->
        <Modal title="会员列表" v-model="addmatchmodal" :mask-closable="false" :width="1300">
          <span style="margin-left: 15px;">是否实名：</span>
          <Select style="width:12%" v-model="secondForm.isRealName">
            <Option value="1">未实名</Option>
            <Option value="2">已实名</Option>
            <Option value="3">审核中</Option>
          </Select>
          <span style="margin-left: 15px;">时间查询：</span>
          <Date-picker
            type="daterange"
            @on-change="secondChange"
            placement="bottom-end"
            placeholder="选择日期"
            style="width: 200px"
          ></Date-picker>
          <Button
            @click="secondsearcher"
            type="primary"
            icon="ios-search"
            style="margin-left: 10px"
          >搜索</Button>
          <Button
            @click="secondDownload"
            type="primary"
            icon="ios-search"
            style="margin-left: 10px"
          >导出</Button>
          <br />
          <br />
          <Row>
            <Table
              :loading="loading"
              border
              :columns="columns1"
              :data="data1"
              ref="table"
              sortable="custom"
              @on-selection-change="changeSelect"
            ></Table>
          </Row>
          <br />
          <Row type="flex" justify="end" class="page">
            <Page
              :current="searchForm.pageNumber"
              :total="total1"
              :page-size="searchForm.pageSize"
              @on-change="changePage1"
              @on-page-size-change="changePageSize"
              :page-size-opts="[10,20,50]"
              size="small"
              show-total
              show-elevator
              show-sizer
            ></Page>
          </Row>
          <br />
          <div slot="footer">
            <Button type="primary" @click="addmatchmodal=false">确定</Button>
          </div>
        </Modal>
        <Modal title="调整渔币" v-model="dollarmodal" :mask-closable="false" :width="400">
          <Form :label-width="100">
            <FormItem label="调整渔币数量:">
              <Input type="number" v-model="dollarnumber" placeholder="输入调整渔币数量" style="width:90%" />
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="primary" @click="dollarSure">确定</Button>
          </div>
        </Modal>
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
      yestcount: "",
      nowcount: "",
      loading: true, // 表单加载状态
      usersCount: "",
      selectDate: [],
      educedata: [],
      chartType: "",
      options: [],
      addmatchmodal: false,
      commodityTypeId: "",
      dollarmodal: false,
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
        nickName: "",
        mobile: "",
        status: "",
        type: "",
        startDate: "",
        endDate: "",
        fishWorldRacing: "",
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
          title: "昵称",
          key: "nickName",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "用户头像",
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
        {
          title: "手机号",
          key: "mobile",
          minWidth: 90,
          sortable: false,
        },
         {
          title: "创建时间",
          key: "createTime",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "渔界竞钓号",
          key: "fishWorldRacing",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "渔泡",
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
          title: "用户名",
          key: "username",
          width: 145,
          fixed: "left",
        },
        {
          title: "头像",
          key: "avatar",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h("Avatar", {
              props: {
                src: params.row.avatar,
              },
            });
          },
        },
        {
          title: "昵称",
          key: "nickName",
          minWidth: 145,
        },
        {
          title: "性别",
          key: "sex",
          minWidth: 80,
          align: "center",
        },
        {
          title: "手机",
          key: "mobile",
          minWidth: 145,
          sortable: true,
          render: (h, params) => {
            if (this.getStore("roles").includes("ROLE_ADMIN")) {
              return h("span", params.row.mobile);
            } else {
              return h("span", "您无权查看该数据");
            }
          },
        },
        {
          title: "渔界竞钓号",
          key: "fishWorldRacing",
          minWidth: 100,
          align: "center",
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
        {
          title: "用户类型",
          key: "type",
          align: "center",
          minWidth: 105,
          render: (h, params) => {
            let re = "";
            if (params.row.type == 1) {
              re = "管理员";
            } else if (params.row.type == 0) {
              re = "普通用户";
            }
            return h("div", re);
          },
        },
        {
          title: "渔泡",
          key: "fishBubble",
          minWidth: 90,
          align: "center",
        },
        {
          title: "渔票",
          key: "fishTicket",
          minWidth: 90,
          sortable: true,
          align: "center",
        },
        {
          title: "渔币",
          key: "fishCoin",
          minWidth: 90,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small",
                    icon: "ios-football-outline",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.dollarbtn(params.row);
                    },
                  },
                },
                params.row.fishCoin
              ),
            ]);
          },
        },
        {
          title: "状态",
          key: "status",
          align: "center",
          minWidth: 135,
          render: (h, params) => {
            if (params.row.status == 0) {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "success",
                    text: "正常启用",
                  },
                }),
              ]);
            } else if (params.row.status == -1) {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "error",
                    text: "禁用",
                  },
                }),
              ]);
            }
          },
          filters: [
            {
              label: "正常启用",
              value: 0,
            },
            {
              label: "禁用",
              value: -1,
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
          title: "创建时间",
          key: "createTime",
          sortable: true,
          sortType: "desc",
          minWidth: 150,
        },
        {
          title: "是否达人",
          key: "isRecommend",
          align: "center",
          width: 90,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small",
                    icon: "ios-star",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.intelligent(params.row);
                    },
                  },
                },
                params.row.isRecommend == 1 ? "否" : "是"
              ),
            ]);
          },
        },
        {
          title: "会员数量",
          key: "gameMembersCount",
          align: "center",
          width: 90,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small",
                    icon: "ios-star",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.vipnumber(params.row);
                    },
                  },
                },
                params.row.gameMembersCount
              ),
            ]);
          },
        },
        {
          title: "省",
          key: "province",
          minWidth: 120,
          sortable: false,
        },
        {
          title: "市",
          key: "city",
          minWidth: 120,
          sortable: false,
        },
        {
          title: "区",
          key: "area",
          minWidth: 120,
          sortable: false,
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          minWidth: 200,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: params.row.status == -1 ? "warning" : "error",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.freeze(params.row);
                    },
                  },
                },
                params.row.status == -1 ? "账户解冻" : "账号冻结"
              ),
            ]);
          },
        },
      ],
      data: [], // 表单数据
      data1: [], // 表单数据
      total: 0, // 表单数据总数
      total1: 0,
    };
  },
  methods: {
    downloadExcel() {
      if (this.selectList.length > 0) {
        let fieldTitle = [
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
          "会员数量",
        ];
        let fieldName = [
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
          "gameMembersCount",
        ];
        this.common.downloadExcel(
          this.selectList,
          fieldTitle,
          fieldName,
          "用户列表"
        );
      } else {
        this.$message({
          message: "警告哦，请选择需要导出的数据！",
          type: "warning",
        });
      }
    },

    handleDownload() {
      this.educelist(); //调用接口获取数据
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
    educelist() {
      this.postRequest("/user/getExportByList", this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.educedata = res.result;
          console.log(this.educedata, "这里");
          // for (var i = 0; i < this.educedata.length; i++) {
          //   this.educedata[i].typeName =
          //     this.educedata[i].type == 1 ? "管理员" : "普通用户";
          //   this.educedata[i].statusName =
          //     this.educedata[i].status == 0 ? "正常启用" : "禁用";
          //   this.educedata[i].levelName = this.returnlevelName(
          //     this.educedata[i].level
          //   );
          // }
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
              "会员数量",
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
              "gameMembersCount",
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
        
      });
    },
    searchCity(item) {
      console.log(item);
      console.log(this.$refs["searcherAddr"].getCheckedNodes()[0].pathLabels);
      this.searchForm.province = this.$refs[
        "searcherAddr"
      ].getCheckedNodes()[0].pathLabels[0];
      this.searchForm.city = this.$refs[
        "searcherAddr"
      ].getCheckedNodes()[0].pathLabels[1];
      this.searchForm.area = this.$refs[
        "searcherAddr"
      ].getCheckedNodes()[0].pathLabels[2];
      console.log(this.searchForm.province);
    },
    sqcity() {
      this.postRequest("/province/getAllList").then((res) => {
        if (res.success) {
          this.options = res.result.options;
          console.log(res, "省市区");
        }
        console.log(res);
      });
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

    secondChange() {
      console.log(v);
      this.secondForm.startDate = v[0];
      this.secondForm.endDate = v[1];
    },
    handleChange(v) {
      console.log(v);
      this.searchForm.startDate = v[0];
      this.searchForm.endDate = v[1];
    },
    vipnumber(v) {
      console.log(v);
      this.secondForm.fishPondsUserId = v.id;
      if (v.gameMembersCount == 0) {
        this.$Message.warning("该用户还没有会员");
      } else {
        this.addmatchmodal = true;
        this.viplist();
      }
    },
    viplist() {
      this.postRequest(
        "/user/getGameMembersByFishPondsUserIdPage",
        this.secondForm
      ).then((res) => {
        if (res.success) {
          this.total1 = res.result.total;
          var dataList = res.result.records;
          this.data1 = dataList;
        }
        console.log(res, "vip");
      });
    },
    dollarbtn(v) {
      //调整渔币
      console.log(v);
      this.dollarmodal = true;
      this.dollarid = v.id;
      this.dollarnumber = v.fishCoin;
    },
    dollarSure() {
      this.postRequest("/userAccount/updateFishCoin", {
        userId: this.dollarid,
        fishCoin: this.dollarnumber,
        userType: 1,
      }).then((res) => {
        if (res.success) {
          this.$Message.success("修改成功");
          this.dollarmodal = false;
          this.getDataList();
        }
      });
    },
    intelligent(v) {
      //是否达人
      console.log(v);
      this.postRequest("/user/updateIsRecommend", {
        userId: v.id,
        isRecommend: v.isRecommend == 1 ? "2" : "1",
      }).then((res) => {
        if (res.success) {
          this.$Message.success("操作成功");
          this.getDataList();
        }
      });
    },
    freeze(v) {
      //冻结账号
      console.log(v);
      this.$Modal.confirm({
        title: v.status == -1 ? "确认解冻账户" : "确认冻结账户",
        content: v.status == -1 ? "您确认要解冻？" : "您确认要冻结？",
        loading: true,
        onOk: () => {
          // 删除
          this.postRequest("/user/updateUserStatus", {
            id: v.id,
            status: v.status == 0 ? "-1" : "0",
          }).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("冻结成功");
              this.getDataList();
            }
            console.log(res);
            console.log(res);
          });
        },
      });
    },
    userList() {
      this.loading = true;
      this.postRequest("/nuser/getByPage", this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          console.log(res, "ttttttttt");
        }
        console.log(res);
      });
    },
    init() {
      this.getDataList();
      this.getYestDayDataList();
      this.getNowDayDataList();
      // this.userList()
    },
    changePage(v) {
      //点击吧页号赋值给pageNumber
      console.log(v);
      this.searchForm.pageNumber = v;
      this.getDataList();
      this.clearSelectAll();
    },
    changePage1(v) {
      console.log(v, "jjjjj");
      this.secondForm.pageNumber = v;
      this.viplist();
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
    secondsearcher() {
      this.postRequest(
        "/user/getGameMembersByFishPondsUserIdPage",
        this.secondForm
      ).then((res) => {
        if (res.success) {
          this.total1 = res.result.total;
          var dataList = res.result.records;
          this.data1 = dataList;
        }
        console.log(res, "vip");
      });
    },
    searcher() {
      this.searchForm.pageNumber = 1;
      if (this.searchForm.status == undefined) {
        this.searchForm.status = "";
      }
      if (this.searchForm.mobile == undefined) {
        this.searchForm.mobile = "";
      }
      if (this.searchForm.nickName == undefined) {
        this.searchForm.nickName = "";
      }
      if (this.searchForm.fishWorldRacing == undefined) {
        this.searchForm.fishWorldRacing = "";
      }
      if (this.searchForm.province == undefined) {
        this.searchForm.province = "";
      }
      if (this.searchForm.city == undefined) {
        this.searchForm.city = "";
      }
      if (this.searchForm.area == undefined) {
        this.searchForm.area = "";
      }
      this.getDataList();
    },
    replacement() {
      this.searchForm = {};
      this.loading = true;
      this.postRequest("/user/getByPage", {
        pageNumber: 1,
        pageSize: 10,
        nickName: "",
        mobile: "",
        status: "",
        type: "",
        startDate: "",
        endDate: "",
        fishWorldRacing: "",
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
      this.postRequest("/user/getByPage", data).then((res) => {
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
      this.postRequest("/user/getByPage", data).then((res) => {
        this.loading = false;
        if (res.success) {
          this.nowcount = res.result.total;
          //   this.usersCount = res.result.total;
          //   var dataList = res.result.records;
          //   this.data = dataList;
        }
        console.log(res);
      });
    },
    checkd(v) {
      this.chenkid = v.id;
      this.reasonAuditFailure = "";
      console.log(v, "sss");
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
    this.sqcity();
    console.log(this.selectDate);
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