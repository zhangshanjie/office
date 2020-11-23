<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <br />
          <div>
            <span>姓名：</span>
            <Input v-model="searchForm.fishingName" style="width: 15%" />
            <span style="margin-left: 20px">年份：</span>
            <Input v-model="searchForm.honorGloryYear" style="width: 15%" />
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
            <!-- <Button @click="release" type="primary">添加列表</Button> -->
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

          <!-- 添加信息 -->
          <Modal
            title="添加信息"
            v-model="modalAddVisible"
            :mask-closable="false"
            :width="800"
          >
            <Form :label-width="100">
              <FormItem label="年度">
                <Input
                  v-model="advertisings.honorGloryYear"
                  placeholder="请输入年份"
                />
              </FormItem>
              <FormItem label="上传照片">
                <el-image
                  :src="dialogImageUrls"
                  style="width: 20%"
                  v-if="showPic"
                ></el-image>
                <el-upload
                  :action="uploadFileUrls"
                  :headers="accessToken"
                  :limit="1"
                  list-type="picture-card"
                  :format="['jpg', 'jpeg', 'png', 'gif', 'bmp']"
                  accept=".jpg, .jpeg, .png, .gif, .bmp"
                  :max-size="5120"
                  :on-preview="handlePictureCardPreview"
                  :before-upload="upload"
                  :on-success="uploadSuccess"
                  :on-error="handleError"
                  :on-remove="handleRemove"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt />
                </el-dialog>
              </FormItem>
              <FormItem label="姓名:">
                <Input
                  v-model="advertisings.fishingName"
                  placeholder="请输入姓名"
                />
              </FormItem>
              <FormItem label="颁奖词:">
                <!-- <Input v-model="advertising.name" placeholder="请输入颁奖词" /> -->
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入颁奖词"
                  v-model="advertisings.awardSpeech"
                >
                </el-input>
              </FormItem>
            </Form>
            <div slot="footer">
              <Button type="primary" @click="Submit()">确定</Button>
            </div>
          </Modal>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import uploadPicInput from "@/views/my-components/xboot/upload-pic-input";
// import uploadInit from '../utils/uploadInit'
import E from "wangeditor";
import { getStore, setStore } from "../libs/storage";
export default {
  components: {
    uploadPicInput,
  },
  data() {
    return {
      advertisings: {
        honorGloryId: "",
        fishingName: "",
        awardSpeech: "",
        topicUrl: "",
        honorGloryYear: "",
      },
      showPic: false,
      uploadFileUrl: "/xboot/upload/uploadGameImage",
      uploadFileUrls: "/xboot/upload/uploadGameImage",
      accessToken: {},
      dialogVisible: false,
      aliyun: {},
      editorContent: "",
      title: "",
      loading: true, // 表单加载状态
      selectDate: [],
      chartType: "",
      zhuang: "",
      modalVisible: false,
      commodityTypeId: "",
      ivibe: "",
      advertising: {
        title: "",
      },
      searchForm: {
        // 搜索框初始化对象
        pageNumber: 1, //页号
        pageSize: 10,
        honorGloryYear: "",
       fishingName:""
      },
      searchfan: {
        pageNumber: 1, //页号
        pageSize: 10,
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
          title: "列表名称",
          key: "honorGloryName",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "姓名",
          key: "fishingName",
          minWidth: 90,
          sortable: false,
        },
         {
          title: "年份",
          key: "honorGloryYear",
          minWidth: 90,
          sortable: false,
        },
         {
          title: "颁奖词",
          key: "awardSpeech",
          minWidth: 90,
          sortable: false,
        },
         {
          title: "封面图",
          key: "topicUrl",
          minWidth: 120,
          sortable: false,
          render: (h, params) => {
            if (
              params.row.topicUrl != null &&
              params.row.topicUrl != "" &&
              params.row.topicUrl != undefined
            ) {
              return h("div", [
                h("img", {
                  props: {
                    type: "primary",
                    size: "small",
                    display:
                      params.row.topicUrl == "" ? "none" : "inline-block",
                  },
                  attrs: {
                    src:
                      "https://fishingcircles.oss-cn-beijing.aliyuncs.com" +
                      params.row.topicUrl,
                    style: "width: 100px;height: 100px;",
                  },
                  style: {},
                  on: {
                    click: () => {
                      this.viewImage = true;
                      this.currentValue = params.row.topicUrl;
                    },
                  },
                }),
              ]);
            }
          },
        },
        
        {
          title: "编辑",
          key: "createTime",
          minWidth: 90,
          sortable: false,
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
                      this.editList(params.row);
                    },
                  },
                },
                "编辑信息"
              ),
            ]);
          },
        },
        {
          title: "删除",
          key: "createTime",
          minWidth: 90,
          sortable: false,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small",
                    icon: "ios-create-outline",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.del(params.row.id);
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
      dialogImageUrl: "",
      fileLists: [],
      txt: "",
      editor: "",
      dialogImageUrls: "",
      modalAddVisible: false,
      honorId: "",
    };
  },
  methods: {
    init() {
      this.getDataList();
    },

    getCaption(url, parameter) {
      var index = url.lastIndexOf(parameter);
      url = url.substring(index - 1, url.length);
      return url;
    },
    //上传图片
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      console.log(file, "---------");
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    upload() {},
    uploadSuccess(res, file) {
      if (res.success) {
        this.showPic = false;
        var urlImg = this.getCaption(res.result, "com");
        this.fileLists.push(urlImg);
      }
    },
    handleError(err, file, fileList) {
      console.log(err, "---------");
    },

    //添加列表
    release() {
    //   this.title = "添加列表";
    //   this.modalVisible = true;
    },
    //编辑名称
    editList(rows) {
      this.title = "编辑信息";
      this.modalAddVisible = true;
        this.showPic = true
      let params = {
          id:rows.id
      }
      this.$http('/appgamehonor/getHonorGloryInfoById',params).then(res=>{
          if(res.success){
              console.log(res,'========')
            this.advertisings = res.result
             this.dialogImageUrls =
            "https://fishingcircles.oss-cn-beijing.aliyuncs.com" +
            res.result.topicUrl;
          }
      })
    //   this.advertising.title = rows.title;
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
    searcher() {
      //   this.searchfan = {};
      this.searchfan.nickName = "";
      this.searchfan.title = "";
      this.loading = true;
      this.$refust("/angleGame/getNoticeList", this.searchfan).then(
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
    getDataList() {
      this.loading = true;
      this.$refust(
        "/appgamehonor/getHonorGloryInfoList",
        this.searchForm
      ).then((res) => {
        this.loading = false;
        if (res.success) {
          this.total = res.result.total;
          var dataList = res.result.list;
          this.data = dataList;
        }
        console.log(res);
      });
    },
    //时间转换
    // timeChange(e){
    //   this.advertisings.honorGloryYear = e;
    // },
    //添加信息
    addList(row) {
      this.modalAddVisible = true;
      this.honorId = row.id;
    },
    //修改信息提交
    Submit() {
      this.advertisings.honorGloryId = this.honorId;
      this.advertisings.updateBy = sessionStorage.getItem("userId");
      this.advertisings.createBy = sessionStorage.getItem("userId");
      this.advertisings.topicUrl = this.fileLists.join("");
      this.$http("/appgamehonor/updateHonorGlory", this.advertisings).then(
        (res) => {
          if (res.success) {
            this.modalAddVisible = false;
            this.advertisings = {};
            this.getDataList();
          }
        }
      );
    },

    //删除列表
    del(id) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            id: id,
          };
          this.$http("/appgamehonor/delHonorGlory", params).then((res) => {
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
    handleSubmit(e) {
      if (this.title == "添加列表") {
        let params = {
          title: this.advertising.title,
        };
        this.$http("/appgamehonor/addHonorTopic", params).then((res) => {
          if (res.success) {
            this.modalVisible = false;
            this.advertising = {};
            this.getDataList();
          }
        });
      } else if (this.title == "编辑名称") {
        let params = {
          id: this.honorId,
          title: this.advertising.title,
        };
        this.$http("/appgamehonor/updateHonorTopicById", params).then((res) => {
          if (res.success) {
            this.modalVisible = false;
            this.advertising = {};
            this.getDataList();
          }
        });
      }
    },
    stateDateRange(v) {
      this.addfome.startTime = v;
    },
    endDateRange(v) {
      this.addfome.endTime = v;
    },
  },
  mounted() {
    this.accessToken = {
      accessToken: sessionStorage.getItem("token"),
    };
    this.init();
    // this.accessToken = getStore("accessToken");
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