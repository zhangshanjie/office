<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <br />
          <div>
            <Form :label-width="100">
              <span>鱼塘名称：</span>
              <Input v-model="condition.title" style="width:15%;margin-right: 20px;" />
              <span>鱼塘类型：</span>
              <Select v-model="condition.fishingGroundTypes" style="width:15%;margin-right: 20px;">
                <Option value="1">江河</Option>
                <Option value="2">鱼塘</Option>
                <Option value="3">湖库</Option>
                <Option value="4">黑坑</Option>
                <Option value="5">农家乐</Option>
              </Select>
              <span>鱼种类：</span>
              <Select v-model="condition.fishSpecies" style="width:15%;margin-right: 20px;">
                <Option
                  v-for="item in fishdatalist"
                  :key="item.index"
                  :value="item.fingerlingInfoName"
                >{{item.fingerlingInfoName}}</Option>
              </Select>
              <span>塘主名称：</span>
              <Input v-model="condition.userNickName" style="width:15%" />
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
              <Button
                @click="searcher"
                type="primary"
                icon="ios-search"
                style="margin-left: 10px"
              >搜索</Button>
            </Form>
          </div>
          <br />
          <Row class="operation">
            <Button @click="shuxin" icon="md-refresh">刷新</Button>
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
              :current="condition.pageNumber"
              :total="total"
              :page-size="condition.pageSize"
              @on-change="changePage"
              @on-page-size-change="changePageSize"
              :page-size-opts="[10,20,50]"
              size="small"
              show-total
              show-elevator
              show-sizer
            ></Page>
          </Row>
          <!-- 详情弹窗 -->
          <Modal title="详情数据" v-model="xiagnqing" :mask-closable="false" :width="500">
            <Form :label-width="100">
              <FormItem label="鱼塘标题:">
                <span>{{detail.title}}</span>
              </FormItem>
              <FormItem label="人均价格:">
                <span>{{detail.perCapita}}</span>
              </FormItem>
              <FormItem label="钓位数量:">
                <span>{{detail.fishingPosition}}</span>
              </FormItem>
              <FormItem label="回收价格:">
                <span>{{detail.recyclingPrice}}</span>
              </FormItem>
              <FormItem label="钓竿规则:">
                <span>{{detail.fishingRodRules}}</span>
              </FormItem>
              <FormItem label="时间规则:">
                <span>{{detail.timeRule}}</span>
              </FormItem>
              <FormItem label="手机号:">
                <span>{{detail.phoneNumber}}</span>
              </FormItem>
              <FormItem label="是否回鱼:">
                <span>{{detail.whetherReturnRish}}</span>
              </FormItem>
              <FormItem label="水深:">
                <span>{{detail.waterDepth}}</span>
              </FormItem>
              <FormItem label="水质:">
                <span>{{detail.waterQuality}}</span>
              </FormItem>
              <FormItem label="餐饮:">
                <span>{{detail.food}}</span>
              </FormItem>
              <FormItem label="钓场简介:">
                <span>{{detail.introductionFishingGrounds}}</span>
              </FormItem>
              <FormItem label="评分:">
                <span>{{detail.score}}</span>
              </FormItem>
              <FormItem label="详细地址:">
                <span>{{detail.address}}</span>
              </FormItem>
              <FormItem label="钓法:">
                <span>{{detail.allowedFishing}}</span>
              </FormItem>
              <FormItem label="鱼种:">
                <span>{{detail.fishSpecies}}</span>
              </FormItem>
              <FormItem label="面积:">
                <span>{{detail.acreage}}</span>
              </FormItem>
            </Form>
            <div slot="footer">
              <Button type="primary" @click="xiagnqing=false">确定</Button>
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
      zoom: 12.8,
      addressKeyword: "",
      loading: true, // 表单加载状态
      xiagnqing: false,
      fishdatalist: [],
      options: [],
      chartType: "",
      searcherkey: "",
      commodityTypeId: "",
      condition: {
        pageNumber: 1, //页号
        pageSize: 10,
        fishSpecies: [], //鱼的种类
        userId: "", //塘主Id
        title: "",
        fishingGroundTypes: "",
        userNickName: "",
      },
      searchfan: {
        // 搜索框初始化对象
        pageNumber: 1, //页号
        pageSize: 10,
        userId: "", //塘主Id
        fishSpecies: [], //鱼的种类
      },
      detail: {
        //详情
        perCapita: "",
        fishingPosition: "",
        recyclingPrice: "",
        fishingRodRules: "",
        timeRule: "",
        phoneNumber: "",
        whetherReturnRish: "",
        waterDepth: "",
        waterQuality: "",
        food: "",
        introductionFishingGrounds: "",
        score: "",
        title: "",
        address: "",
        allowedFishing: "",
        fishSpecies: [],
        acreage: "",
        nightFishingAllowed: "",
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
          width: 50,
          align: "center",
        },
        {
          title: "塘主名称",
          key: "userNickName",
          minWidth: 130,
          sortable: false,
        },
        {
          title: "塘主手机号",
          key: "fishpondMobile",
          minWidth: 120,
          sortable: false,
        },
        {
          title: "鱼塘名称",
          key: "title",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "鱼塘id",
          key: "id",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "评分",
          key: "score",
          minWidth: 70,
          sortable: false,
        },
        {
          title: "鱼种",
          key: "fishSpecies",
          minWidth: 130,
          sortable: false,
        },
        {
          title: "钓场类型",
          key: "fishingGroundType",
          minWidth: 50,
          sortable: false,
          render: (h, params) => {
            if (params.row.fishingGroundType == "1") {
              return h("span", "江河");
            } else if (params.row.fishingGroundType == "2") {
              return h("span", "鱼塘");
            } else if (params.row.fishingGroundType == "3") {
              return h("span", "湖库");
            } else if (params.row.fishingGroundType == "4") {
              return h("span", "黑坑");
            } else if (params.row.fishingGroundType == "5") {
              return h("span", "农家乐");
            }
          },
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 250,
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
                    type: "info",
                    size: "small",
                    icon: "ios-create-outline",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.delete(params.row);
                    },
                  },
                },
                // "添加鱼塘"
                "删除鱼塘"
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
    init() {
      this.getDataList();
      this.getAllInfo();
    },
      //删除塘主
    delete(v) {
      this.$confirm("此操作将永久删除该塘主, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          this.postRequest("/fishPond/delByIds", { ids: v.id }).then((res) => {
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
    changePage(v) {
      //点击吧页号赋值给pageNumber
      console.log(v);
      this.condition.pageNumber = v;
      this.getDataList();
      this.clearSelectAll();
    },
    changePageSize(v) {
      console.log(v);
      this.condition.pageSize = v;
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
      //搜索
      this.condition.pageNumber = 1;
      if (this.condition.fishingGroundTypes == undefined) {
        this.condition.fishingGroundTypes = "";
      }
      if (this.condition.fishSpecies == undefined) {
        this.condition.fishSpecies = "";
      }
      if (this.condition.province == undefined) {
        this.condition.province = "";
      }
      if (this.condition.city == undefined) {
        this.condition.city = "";
      }
      if (this.condition.area == undefined) {
        this.condition.area = "";
      }
      this.getDataList();
    },
    replacement() {
      this.condition.fishSpecies = "";
      this.condition.fishingGroundTypes = "";
      this.condition.title = "";
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
    searchCity(item) {
      console.log(item);
      console.log(this.$refs["searcherAddr"].getCheckedNodes()[0].pathLabels);
      this.condition.province = this.$refs[
        "searcherAddr"
      ].getCheckedNodes()[0].pathLabels[0];
      this.condition.city = this.$refs[
        "searcherAddr"
      ].getCheckedNodes()[0].pathLabels[1];
      this.condition.area = this.$refs[
        "searcherAddr"
      ].getCheckedNodes()[0].pathLabels[2];
      console.log(this.condition.province);
    },
    getAllInfo() {
      this.postRequest("/fingerlingInfo/getAll").then((res) => {
        if (res.success) {
          console.log(res, "获取所有鱼种");
          this.fishdatalist = res.result;
        }
      });
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
    details(v) {
      //详情按钮
      console.log(v);
      this.xiagnqing = true;
      this.postRequest(
        "/fishPondDetails/getFishPondDetails?fishPondId=" + v.id
      ).then((res) => {
        this.detail.perCapita = res.result.fishPondDetails.perCapita;
        this.detail.fishingPosition =
          res.result.fishPondDetails.fishingPosition;
        this.detail.recyclingPrice = res.result.fishPondDetails.recyclingPrice;
        this.detail.fishingRodRules =
          res.result.fishPondDetails.fishingRodRules;
        this.detail.timeRule = res.result.fishPondDetails.timeRule;
        this.detail.phoneNumber = res.result.fishPondDetails.phoneNumber;
        this.detail.whetherReturnRish =
          res.result.fishPondDetails.whetherReturnRish;
        this.detail.waterDepth = res.result.fishPondDetails.waterDepth;
        this.detail.waterQuality = res.result.fishPondDetails.waterQuality;
        this.detail.food = res.result.fishPondDetails.food;
        this.detail.introductionFishingGrounds =
          res.result.fishPondDetails.introductionFishingGrounds;
        this.detail.score = res.result.fishPondDetails.score;
        this.detail.title = res.result.fishPondDetails.title;
        this.detail.address = res.result.fishPondDetails.address;
        this.detail.allowedFishing = res.result.fishPondDetails.allowedFishing;
        this.detail.fishSpecies = res.result.fishPondDetails.fishSpecies;
        this.detail.acreage = res.result.fishPondDetails.acreage;
        this.detail.nightFishingAllowed =
          res.result.fishPondDetails.nightFishingAllowed;
        console.log(res);
      });
    },
    getDataList() {
      this.loading = true;
      if (this.condition.fishingGroundTypes == undefined) {
        this.condition.fishingGroundTypes = "";
      }
      if (this.condition.fishSpecies == undefined) {
        this.condition.fishSpecies = "";
      }
      if (this.condition.title == undefined) {
        this.condition.title = "";
      }
      if (this.condition.userNickName == undefined) {
        this.condition.userNickName = "";
      }
      this.postRequest("/fishPond/getByPage", this.condition).then((res) => {
        this.loading = false;
        if (res.success) {
          this.total = res.result.total;
          var dataList = res.result.records;
          this.data = dataList;
        }
        console.log(res);
      });
    },
    shuxin() {
      this.condition.title = "";
      this.condition.fishingGroundTypes = "";
      this.condition.fishSpecies = "";
      this.condition.userNickName = "";
      this.loading = true;
      this.postRequest("/fishPond/getByPage", this.searchfan).then((res) => {
        this.loading = false;
        if (res.success) {
          this.total = res.result.total;
          var dataList = res.result.records;
          this.data = dataList;
        }
        console.log(res);
      });
    },
    xqlist() {},
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
}
</style>