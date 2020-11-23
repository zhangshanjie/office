<template>
  <!-- 查看用户申请退款列表申请 -->
  <div class="search">
    <Row>
      <Col>
        <Card>
          <div style="margin-bottom: 20px;">
            <Button type="primary" @click="addtangz">添加塘主</Button>
          </div>
          <div style="margin-bottom: 20px;">
            <span>昵称：</span>
            <Input
              placeholder="请输入昵称"
              v-model="searchForm.nickName"
              style="width:15%;margin-right: 20px"
            />
            <span>手机号：</span>
            <Input
              placeholder="请输入手机号码"
              v-model="searchForm.mobile"
              style="width:15%;margin-right: 20px"
            />
            <span>状态：</span>
            <Select v-model="searchForm.status" style="width:15%;margin-right: 20px">
              <Option value="0">冻结</Option>
              <Option value="-1">解冻</Option>
            </Select>
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
            <Button @click="shousuo" type="primary" icon="ios-search" style="margin-left: 10px">搜索</Button>
          </div>
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
              :page-size-opts="[10,20,50]"
              size="small"
              show-total
              show-elevator
              show-sizer
            ></Page>
          </Row>

          <Modal title="添加塘主" v-model="modalVisible" :mask-closable="false" :width="500">
            <Form :label-width="100">
              <FormItem label="账号:">
                <Input v-model="advertising.username" />
              </FormItem>
              <FormItem label="密码:">
                <Input v-model="advertising.password" />
              </FormItem>
              <FormItem label="昵称:">
                <Input v-model="advertising.nickName" />
              </FormItem>
              <FormItem label="等级:" style="width: 80%;">
                <Select v-model="advertising.grade">
                  <Option value="普通">普通</Option>
                  <Option value="白衣">白衣</Option>
                  <Option value="青衣">青衣</Option>
                  <Option value="紫衣">紫衣</Option>
                  <Option value="金衣">金衣</Option>
                </Select>
              </FormItem>
              <FormItem label="头像:">
                <upload-pic-input v-model="advertising.avatar" style="width:100%"></upload-pic-input>
              </FormItem>
              <div>
                <span style="margin-right:20px;margin-left: 63px;display: inline-block;">性别:</span>
                <el-radio v-model="advertising.sex" label="男">男</el-radio>
                <el-radio v-model="advertising.sex" label="女">女</el-radio>
              </div>
            </Form>
            <div slot="footer">
              <Button type="primary" @click="handleSubmit">确定</Button>
            </div>
          </Modal>
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
              @click="handleDownload"
              icon="ios-search"
              type="primary"
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
          <!-- 添加修改编辑鱼塘 -->
          <Modal
            title="编辑鱼塘"
            v-model="addyutangs"
            :mask-closable="false"
            @on-cancel="cancel"
            :width="700"
          >
            <Form :label-width="200">
              <FormItem label="标题:" style="width: 80%;">
                <Input v-model="form.title" />
              </FormItem>
              <FormItem label="钓场类型:" style="width: 80%;">
                <Select v-model="form.FishingGroundType">
                  <Option :value="1">江河</Option>
                  <Option :value="3">湖海</Option>
                  <Option :value="4">黑坑</Option>
                  <Option :value="5">农家乐</Option>
                  <Option :value="6">水库</Option>
                  <Option :value="2">鱼塘</Option>
                </Select>
              </FormItem>
              <!-- 省市区 -->
              <FormItem label="地理位置:" style="width: 100%;">
                <el-cascader
                  :options="options"
                  clearable
                  filterable
                  @change="changeCity"
                  ref="cascaderAddr"
                  size="mini"
                  style="width:334px"
                ></el-cascader>
              </FormItem>
              <FormItem label="详细地址:" style="width: 80%;">
                <Input v-model="form.address" />
              </FormItem>
              <FormItem label="经度:" style="width: 80%;">
                <Input v-model="form.longitude" placeholder="请双击地图来获得经纬度" disabled />
              </FormItem>
              <FormItem label="纬度:" style="width: 80%;">
                <Input v-model="form.latitude" placeholder="请双击地图来获得经纬度" disabled />
              </FormItem>
              <!-- 百度地图 -->
              <Input v-model="addressKeyword" placeholder="请输入地址来直接查找相关位置" style="width: 100%;" />
              <baidu-map
                class="bmView"
                :scroll-wheel-zoom="true"
                :center="location"
                :zoom="zoom"
                @click="getLocationPoint"
                ak="YOUR_APP_KEY"
              >
                <bm-view style="width: 100%; height:400px; flex: 1"></bm-view>
                <bm-local-search
                  :keyword="addressKeyword"
                  :auto-viewport="true"
                  style="display: none"
                ></bm-local-search>
              </baidu-map>
              <br />

              <FormItem label="鱼种:" style="width: 80%;">
                <el-checkbox-group v-model="form.fishSpecies">
                  <el-checkbox
                    v-for="item in fishdatalist"
                    :label="item.fingerlingInfoName"
                    :key="item.index"
                  >{{item.fingerlingInfoName}}</el-checkbox>
                </el-checkbox-group>
              </FormItem>

              <FormItem label="收费方式:" style="width: 80%;">
                <Select v-model="form.chargeMethod">
                  <Option :value="1">免费</Option>
                  <Option :value="2">按斤收费</Option>
                  <Option :value="3">按场收费</Option>
                  <Option :value="4">按天收费</Option>
                  <Option :value="5">按小时收费</Option>
                </Select>
              </FormItem>
              <FormItem label="允许钓法:" style="width: 80%;">
                <Select v-model="form.allowedFishing" multiple>
                  <Option value="路亚">路亚</Option>
                  <Option value="筏钓">筏钓</Option>
                  <Option value="远投">远投</Option>
                  <Option value="台钓">台钓</Option>
                  <Option value="炮杆">炮杆</Option>
                  <Option value="海钓">海钓</Option>
                  <Option value="海围">海围</Option>
                  <Option value="矶钓">矶钓</Option>
                </Select>
              </FormItem>
              <FormItem label="是否推荐:" style="width: 80%;">
                <Select v-model="form.recommend">
                  <Option :value="1">推荐</Option>
                  <Option :value="2">不推荐</Option>
                </Select>
              </FormItem>
              <FormItem label="主图:" style="width: 80%;">
                <upload-pic-input v-model="form.mainPicture" style="width:100%"></upload-pic-input>
              </FormItem>
              <!-- <FormItem label="人均价格:" style="width: 80%;">
                            <Input v-model="form.perCapita"/>
              </FormItem>-->
              <FormItem label="钓位数量:" style="width: 80%;">
                <Input v-model="form.fishingPosition" />
              </FormItem>

              <FormItem label="回收价格:" style="width: 80%;">
                <Input v-model="form.recyclingPrice" />
              </FormItem>
              <FormItem label="手机号:" style="width: 80%;">
                <Input v-model="form.phoneNumber" />
              </FormItem>
              <FormItem label="是否回鱼:" style="width: 80%;">
                <Select v-model="form.whetherReturnRish">
                  <Option :value="1">回鱼</Option>
                  <Option :value="2">不回鱼</Option>
                </Select>
              </FormItem>
              <FormItem label="营业时间:" style="width: 80%;">
                <Time-picker
                  v-model="form.openingTime"
                  format="HH:mm"
                  placeholder="选择时间"
                  style="width: 112px"
                ></Time-picker>至
                <Time-picker
                  v-model="form.closingTime"
                  format="HH:mm"
                  placeholder="选择时间"
                  style="width: 112px"
                ></Time-picker>
              </FormItem>
              <FormItem label="水深(米):" style="width: 80%;">
                <Input type="number" v-model="form.waterDepth" />
              </FormItem>
              <!-- <FormItem label="餐饮:" style="width: 80%;">
                            <Input v-model="form.food"/>
              </FormItem>-->
              <FormItem label="钓场简介:" style="width: 80%;">
                <Input v-model="form.introductionFishingGrounds" />
              </FormItem>
              <!-- <FormItem label="规则:" style="width: 80%;">
                            <Input v-model="form.rule"/>
              </FormItem>-->
              <FormItem label="面积:" style="width: 80%;">
                <Input type="number" v-model="form.acreage" />
              </FormItem>
            </Form>
            <div slot="footer" style="margin-left: 510px;display: flex;">
              <Button @click="addyutangs=false">取消</Button>
              <Button type="primary" @click="addfish">确定添加</Button>
            </div>
          </Modal>
          <Modal title="修改等级" v-model="modalgrade" :mask-closable="false" :width="500">
            <Form :label-width="100">
              <FormItem label="修改等级:" style="width: 80%;">
                <Select v-model="gradedata">
                  <Option value="普通">普通</Option>
                  <Option value="白衣">白衣</Option>
                  <Option value="青衣">青衣</Option>
                  <Option value="紫衣">紫衣</Option>
                  <Option value="金衣">金衣</Option>
                </Select>
              </FormItem>
            </Form>
            <div slot="footer">
              <Button type="primary" @click="gradeSubmit">确定</Button>
            </div>
          </Modal>
          <Modal title="调整渔币" v-model="dollarmodal" :mask-closable="false" :width="400">
            <Form :label-width="100">
              <FormItem label="调整渔币数量:">
                <Input
                  type="number"
                  v-model="dollarnumber"
                  placeholder="输入调整渔币数量"
                  style="width:90%"
                />
              </FormItem>
            </Form>
            <div slot="footer">
              <Button type="primary" @click="dollarSure">确定</Button>
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
      location: {
        lng: 116.404,
        lat: 39.915,
      },
      options: [],
      label: [],
      addmatchmodal: false,
      dollarmodal: false,
      dollarid: "",
      dollarnumber: "",
      gradeid: "",
      modalgrade: false,
      fishdatalist: [],
      valuedata: [],
      gradedata: "",
      isFishPond: "",
      zoom: 12.8,
      secondForm: {
        pageNumber: 1, //页号
        pageSize: 10,
        isRealName: "",
        startDate: "",
        endDate: "",
        fishPondsUserId: "",
      },
      addressKeyword: "",
      form: {
        province: "", //省
        area: "", //区
        title: "", //标题
        FishingGroundType: "", //钓场类型
        address: "", //详细地址
        longitude: "", //经度
        latitude: "", //纬度
        fishSpecies: [], //鱼种
        chargeMethod: "", //收费方式
        allowedFishing: [], //允许钓法
        recommend: "", //是否推荐
        city: "", //市
        mainPicture: "", //主图
        // perCapita: "", //人均价格
        fishingPosition: "", //钓位数量
        recyclingPrice: "", //回收价格
        fishingRodRules: "", //吊杆规则
        timeRule: "", //时间规则
        phoneNumber: "", //手机号
        whetherReturnRish: "", //是否回鱼
        // nightFishingAllowed:"",//是否允许夜钓
        waterDepth: "", //水深
        waterQuality: "", //水质
        food: "", //餐饮
        introductionFishingGrounds: "", //钓场简介
        rule: "", //规则
        acreage: "", //面积
        openingTime: "",
        closingTime: "",
        fishPondId: "",
        // isCertification:'',//是否认证
        userId: "",
      },
      searchfan: {
        // 搜索框初始化对象
        pageNumber: 1, //页号
        pageSize: 10,
      },
      addyutangs: false,
      modalVisible: false,
      advertising: {
        username: "",
        password: "",
        nickName: "",
        avatar: "",
        sex: "",
        grade: "",
      },
      loading: true, // 表单加载状态
      searchForm: {
        // 搜索框初始化对象
        pageNumber: 1, //页号
        pageSize: 10,
        nickName: "",
        mobile: "",
        status: "",
      },
      thsAreaCode: "", // 拼接 三级联动地址代码
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
          title: "渔界竞钓号",
          key: "fishWorldRacing",
          minWidth: 90,
          sortable: false,
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
        },
        {
          title: "邀请时间",
          key: "invitationCreateTime",
          minWidth: 90,
          sortable: false,
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
        // 表头
        {
          type: "selection",
          width: 60,
          align: "center",
        },
        {
          type: "index",
          width: 60,
          align: "center",
        },
        {
          title: "用户头像",
          key: "avatar",
          minWidth: 80,
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
                    style: "width: 60px;height: 60px;",
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
          title: "账号",
          key: "username",
          minWidth: 120,
          sortable: false,
        },
        {
          title: "昵称",
          key: "nickName",
          minWidth: 120,
          sortable: false,
        },
        {
          title: "手机",
          key: "mobile",
          minWidth: 120,
          sortable: false,
        },
        {
          title: "等级",
          key: "grade",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small",
                    icon: "ios-heart",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.gradeji(params.row);
                    },
                  },
                },
                params.row.grade == "白衣"
                  ? "白衣"
                  : params.row.grade == "青衣"
                  ? "青衣"
                  : params.row.grade == "紫衣"
                  ? "紫衣"
                  : params.row.grade == "金衣"
                  ? "金衣"
                  : "普通"
              ),
            ]);
          },
        },
        {
          title: "会员数量",
          key: "gameMembersCount",
          align: "center",
          sortable: true,
          width: 120,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small",
                    // icon: "ios-heart"
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
          title: "渔泡",
          key: "fishBubble",
          sortable: true,
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
          title: "操作",
          key: "action",
          align: "center",
          width: 320,
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
              h(
                "Button",
                {
                  props: {
                    type: params.row.isFishPond ? "success" : "info",
                    size: "small",
                    icon: "ios-create-outline",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.addyubtn(params.row);
                    },
                  },
                },
                // "添加鱼塘"
                params.row.isFishPond ? "编辑鱼塘" : "添加鱼塘"
              ),
              //删除塘主
             
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
    init() {
      this.getDataList();
      this.getAllInfo();
    },
    shousuo() {
      this.searchForm.pageNumber = 1;
      this.getDataList();
    },
    // 导出
    handleDownload() {
      this.educelist(); //调用接口获取数据
      this.downloadLoading = true;
      setTimeout(() => {
        import("./vendor/Export2Excel").then((excel) => {
          const tHeader = [
            "昵称",
            "手机号",
            "渔界竞钓号",
            "是否认证",
            "邀请时间",
            "渔泡",
            "渔票",
            "渔币",
            "等级",
          ];
          const filterVal = [
            "nickName",
            "mobile",
            "fishWorldRacing",
            "isRealNamecs",
            "invitationCreateTime",
            "fishBubble",
            "fishTicket",
            "fishCoin",
            "levelName",
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
    // 导出
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j];
        })
      );
    },
    educelist() {
      //导出数据的接口
      this.postRequest(
        "/user/getExportGameMembersByFishPondsUserId",
        this.secondForm
      ).then((res) => {
        this.loading = false;
        if (res.success) {
          this.educedata = res.result;
          for (var i = 0; i < this.educedata.length; i++) {
            console.log(this.educedata[i].isRealName, "啦啦啦啦啦");
            this.educedata[i].isRealNamecs =
              this.educedata[i].isRealName == 1 ? "未实名" : "已实名";
            this.educedata[i].levelName = this.returnOutTypeName(
              this.educedata[i].level
            );
          }
        }
      });
    },
    returnOutTypeName(type) {
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
    changeCity(item) {
      console.log(this.$refs["cascaderAddr"].getCheckedNodes()[0]);
      this.form.province = this.$refs[
        "cascaderAddr"
      ].getCheckedNodes()[0].pathLabels[0];
      this.form.city = this.$refs[
        "cascaderAddr"
      ].getCheckedNodes()[0].pathLabels[1];
      this.form.area = this.$refs[
        "cascaderAddr"
      ].getCheckedNodes()[0].pathLabels[2];
      this.addressKeyword =
        this.form.city +
        this.form.area +
        this.form.address +
        this.addressKeyword;
      console.log(
        this.form.province,
        this.form.city,
        this.form.area,
        this.addressKeyword
      );
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
        userType: 2,
      }).then((res) => {
        if (res.success) {
          this.$Message.success("修改成功");
          this.dollarmodal = false;
          this.getDataList();
        }
      });
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
    getAllInfo() {
      this.postRequest("/fingerlingInfo/getAll").then((res) => {
        if (res.success) {
          console.log(res, "获取所有鱼种");
          this.fishdatalist = res.result;
        }
      });
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
    addfish() {
      console.log();
      this.postRequest("/fishPond/insertOrUpdate", this.form).then((res) => {
        if (res.success) {
          this.addyutangs = false;
          this.$Message.success("操作成功");
          this.isFishPond = true;
          this.fishPondId = "";
          this.getDataList();

          this.form.fishSpecies = [];
          (this.form.city = ""),
            (this.form.title = ""),
            (this.form.FishingGroundType = ""),
            (this.form.address = ""),
            (this.form.longitude = ""),
            (this.form.latitude = ""),
            (this.form.chargeMethod = ""),
            (this.form.allowedFishing = []),
            (this.form.recommend = ""),
            (this.form.mainPicture = ""),
            // (this.form.perCapita = ""),
            (this.form.fishingPosition = ""),
            (this.form.recyclingPrice = ""),
            (this.form.fishingRodRules = ""),
            (this.form.timeRule = ""),
            (this.form.phoneNumber = ""),
            (this.form.whetherReturnRish = ""),
            // this.form.nightFishingAllowed='',
            (this.form.waterDepth = ""),
            (this.form.waterQuality = ""),
            (this.form.food = ""),
            (this.form.introductionFishingGrounds = ""),
            (this.form.rule = ""),
            (this.form.acreage = "");
          this.form.fishPondId = "";
          this.addressKeyword = "";
          this.form.openingTime = "";
          this.form.closingTime = "";
        }
        console.log(res);
      });
    },
    cancel() {
      this.form.fishSpecies = [];
      (this.form.city = ""),
        (this.form.title = ""),
        (this.form.FishingGroundType = ""),
        (this.form.address = ""),
        (this.form.longitude = ""),
        (this.form.latitude = ""),
        (this.form.chargeMethod = ""),
        (this.form.allowedFishing = []),
        (this.form.recommend = ""),
        (this.form.mainPicture = ""),
        // (this.form.perCapita = ""),
        (this.form.fishingPosition = ""),
        (this.form.recyclingPrice = ""),
        (this.form.fishingRodRules = ""),
        (this.form.timeRule = ""),
        (this.form.phoneNumber = ""),
        (this.form.whetherReturnRish = ""),
        (this.form.waterDepth = ""),
        (this.form.waterQuality = ""),
        (this.form.food = ""),
        (this.form.introductionFishingGrounds = ""),
        (this.form.rule = ""),
        (this.form.acreage = "");
      this.form.fishPondId = "";
      this.addressKeyword = "";
      this.form.openingTime = "";
      this.form.closingTime = "";
    },
    getLocationPoint(e) {
      this.lng = e.point.lng;
      this.lat = e.point.lat;
      this.form.longitude = e.point.lng;
      this.form.latitude = e.point.lat;
      console.log(e.point.lng);
      console.log(e.point.lat);
      /* 创建地址解析器的实例 */
      let geoCoder = new BMap.Geocoder();
      /* 获取位置对应的坐标 */
      geoCoder.getPoint(this.addressKeyword, (point) => {
        this.selectedLng = point.lng;
        this.selectedLat = point.lat;
        console.log(this.addressKeyword);
      });
      /* 利用坐标获取地址的详细信息 */
      geocoder.getLocation(e.point, (res) => {
        console.log(res);
      });
    },
    secondChange(v) {
      console.log(v);
      this.secondForm.startDate = v[0];
      this.secondForm.endDate = v[1];
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
    edit(v) {
      //编辑按钮
      console.log(v);
    },
    remove(v) {
      //删除按钮
      console.log(v);
    },
    addtangz() {
      this.modalVisible = true;
    },
    gradeSubmit() {
      this.postRequest("/fishpondsUser/updateFishPondsUserEntity", {
        grade: this.gradedata,
        id: this.gradeid,
      }).then((res) => {
        if (res.success) {
          this.$Message.warning("修改成功");
          this.modalgrade = false;
          this.getDataList();
        }
        console.log(res);
      });
    },
    gradeji(v) {
      this.gradedata = v.grade;
      this.gradeid = v.id;
      this.modalgrade = true;
      console.log(v);
    },
    vipnumber(v) {
      this.secondForm.fishPondsUserId = v.id;
      if (v.gameMembersCount == 0) {
        this.$Message.warning("该塘主还没有会员");
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
    freeze(v) {
      console.log(v);
      this.$Modal.confirm({
        title: v.status == -1 ? "确认解冻账户" : "确认冻结账户",
        content: v.status == -1 ? "您确认要解冻？" : "您确认要冻结？",
        loading: true,
        onOk: () => {
          // 删除
          this.postRequest("/fishpondsUser/updateFishPondsUserEntity", {
            id: v.id,
            status: v.status == -1 ? "0" : "-1",
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

  
    addyubtn(v) {
      //添加鱼塘按钮
      console.log(v);
      this.sqcity();
      console.log(this.form.fishPondId, "鱼塘id");
      this.addyutangs = true;
      this.form.userId = v.id;
      this.postRequest("/fishPondDetails/get", { userId: v.id }).then((res) => {
        if (res.success) {
          this.isFishPond = v.isFishPond;
          console.log(this.form.fishSpecies, "ssdddfff");
          console.log(res, "eerrr");
          this.form.city = res.result.fishPond.city;
          this.form.title = res.result.fishPond.title;
          this.form.FishingGroundType = res.result.fishPond.fishingGroundType;
          this.form.address = res.result.address;
          this.form.longitude = res.result.fishPond.longitude;
          this.form.latitude = res.result.fishPond.latitude;
          this.form.fishSpecies = res.result.fishPond.fishSpecies.split(",");
          this.form.chargeMethod = res.result.fishPond.chargeMethod;
          this.form.allowedFishing = res.result.fishPond.allowedFishing;
          this.form.recommend = res.result.fishPond.recommend;
          this.form.mainPicture = res.result.fishPond.mainPicture;
          // this.form.perCapita = res.result.perCapita;
          this.form.fishingPosition = res.result.fishingPosition;
          this.form.recyclingPrice = res.result.recyclingPrice;
          this.form.fishingRodRules = res.result.fishingRodRules;
          this.form.timeRule = res.result.timeRule;
          this.form.phoneNumber = res.result.phoneNumber;
          this.form.whetherReturnRish = res.result.whetherReturnRish;
          // this.form.nightFishingAllowed=res.result.nightFishingAllowed
          this.form.waterDepth = res.result.waterDepth;
          this.form.waterQuality = res.result.waterQuality;
          this.form.food = res.result.food;
          this.form.introductionFishingGrounds =
            res.result.introductionFishingGrounds;
          this.form.rule = res.result.rule;
          this.form.acreage = res.result.acreage;
          this.form.fishPondId = res.result.fishPondId;
          this.form.openingTime = res.result.openingTime;
          this.form.closingTime = res.result.closingTime;
          this.addressKeyword =
            res.result.fishPond.province +
            res.result.fishPond.city +
            res.result.fishPond.area +
            res.result.address;

          // this.form.isCertification=res.result.isCertification
        }
        console.log(res, "ssddd");
      });
    },
    handleSubmit() {
      if (this.advertising.username == "") {
        this.$Message.warning("请输入账号");
      } else if (this.advertising.password == "") {
        this.$Message.warning("请输入密码");
      } else if (this.advertising.nickName == "") {
        this.$Message.warning("请输入昵称");
      } else if (this.advertising.avatar == "") {
        this.$Message.warning("请选择头像");
      } else if (this.advertising.sex == "") {
        this.$Message.warning("请选择性别");
      } else {
        this.postRequest(
          "/fishpondsUser/saveFishPondsUserEntity",
          this.advertising
        ).then((res) => {
          if (res.success) {
            this.$Message.success("添加成功");
            this.modalVisible = false;
            this.advertising = {};
            this.getDataList();
          }
          console.log(res);
        });
      }
    },
    searcher() {
      //搜索
      this.searchForm.status = "";
      this.searchForm.mobile = "";
      this.searchForm.nickName = "";
      this.loading = true;
      this.postRequest("/fishpondsUser/getByPage", this.searchfan).then(
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
    getDataList() {
      if (this.searchForm.status == undefined) {
        this.searchForm.status = "";
      }
      if (this.searchForm.mobile == undefined) {
        this.searchForm.mobile = "";
      }
      if (this.searchForm.nickName == undefined) {
        this.searchForm.nickName = "";
      }
      if (this.searchForm.city == undefined) {
        this.searchForm.city = "";
      }
      if (this.searchForm.area == undefined) {
        this.searchForm.area = "";
      }

      this.postRequest("/fishpondsUser/getByPage", this.searchForm).then(
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
  },
  mounted() {
    this.init();
    this.sqcity();
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
  .bm-view {
    width: 100%;
    height: 300px;
  }
}
</style>