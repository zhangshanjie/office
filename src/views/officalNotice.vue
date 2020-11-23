<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <br />
          <div>
            <span>通知标题：</span>
            <Input v-model="searchForm.title" style="width: 15%" />
            <span style="margin-left: 20px">发起人：</span>
            <Input v-model="searchForm.nickName" style="width: 15%" />
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
            <Button @click="release" type="primary">发布官方通知</Button>
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
            :title="title"
            v-model="modalVisible"
            :mask-closable="false"
            :width="800"
          >
            <Form :label-width="100">
              <FormItem label="标题:">
                <Input
                  v-model="advertising.title"
                  placeholder="请输入标题名称"
                />
              </FormItem>
              <FormItem label="发布日期:">
                <Date-picker
                  type="date"
                  :value="advertising.publishDateStr"
                  format="yyyy年MM月dd日"
                  @on-change="timeChange"
                  placeholder="选择日期"
                  style="width: 200px"
                ></Date-picker>
              </FormItem>
              <FormItem label="标签:">
                <el-radio-group v-model="advertising.noticeLabel">
                  <el-radio :label="1">最新</el-radio>
                  <el-radio :label="2">最热</el-radio>
                  <el-radio :label="3">无</el-radio>
                </el-radio-group>
              </FormItem>
              <FormItem label="封面图">
                <el-image
                  :src="dialogImageUrls"
                  style="width: 20%"
                  v-if="showPic"
                ></el-image>
                <el-upload
                  :action="uploadFileUrl"
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
              <FormItem>
                <!-- <mavon-editor v-model="advertising.value" /> -->
                <div id="editor"></div>
              </FormItem>
            </Form>
            <div slot="footer">
              <Button type="primary" @click="handleSubmit(title)">确定</Button>
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
  inject: ["reload"],

  components: {
    uploadPicInput,
  },
  data() {
    return {
      showPic: false,
      uploadFileUrl: "/xboot/upload/uploadGameImage",
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
        noticeLabel: 1,
        title: "",
        content: "",
      },
      searchForm: {
        // 搜索框初始化对象
        pageNumber: 1, //页号
        pageSize: 10,
        nickName: "",
        title: "",
        noticeType: 3,
        sort: "rank",
        order: "desc",
      },
      searchfan: {
        pageNumber: 1, //页号
        pageSize: 10,

        noticeType: 3,
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
          title: "攻略标题",
          key: "title",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "发起人",
          key: "nickName",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "封面图",
          key: "coverImage",
          minWidth: 120,
          sortable: false,
          render: (h, params) => {
            if (
              params.row.coverImage != null &&
              params.row.coverImage != "" &&
              params.row.coverImage != undefined
            ) {
              return h("div", [
                h("img", {
                  props: {
                    type: "primary",
                    size: "small",
                    display:
                      params.row.coverImage == "" ? "none" : "inline-block",
                  },
                  attrs: {
                    src:
                      "https://fishingcircles.oss-cn-beijing.aliyuncs.com" +
                      params.row.coverImage,
                    style: "width: 100px;height: 100px;",
                  },
                  style: {},
                  on: {
                    click: () => {
                      this.viewImage = true;
                      this.currentValue = params.row.coverImage;
                    },
                  },
                }),
              ]);
            }
          },
        },
        {
          title: "发布日期",
          key: "publishDateStr",
          minWidth: 90,
          sortable: false,
        },
        {
          title: "创建时间",
          key: "createTime",
          minWidth: 120,
          sortable: false,
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 310,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                    icon: "ios-arrow-round-up",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.toTop(params.row);
                    },
                  },
                },
                "置顶"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.cancleToTop(params.row);
                    },
                  },
                },
                "取消置顶"
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
                      this.approve(params.row);
                    },
                  },
                },
                "编辑"
              ),
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
    };
  },
  methods: {
    //置顶
    toTop(rows) {
      let params = {
        id: rows.id,
        flag: "1",
        noticeType: "3",
      };
      this.$http("/angleGame/operateNotice", params).then((res) => {
        if (res.success) {
          this.getDataList();
          this.$message({
            message: "该攻略置顶成功！",
            type: "success",
          });
        }
      });
    },
    //取消置顶
    cancleToTop(rows) {
      let params = {
        id: rows.id,
        flag: "2",
        noticeType: "3",
      };
      this.$http("/angleGame/operateNotice", params).then((res) => {
        if (res.success) {
          this.getDataList();
          this.$message({
            message: "该攻略取消置顶成功！",
            type: "success",
          });
        }
      });
    },
    init() {
      this.getDataList();
    },
    timeChange(e) {
      this.advertising.publishDateStr = e;
    },
    getCaption(url, parameter) {
      var index = url.lastIndexOf(parameter);
      url = url.substring(index - 1, url.length);
      return url;
    },
    //上传主题图片
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

    //发布攻略
    release() {
      this.advertising = {
        title: "",
        publishDateStr: "",
        noticeType: 3,
      };
      this.showPic = false;
      this.editor.txt.html("");
      this.title = "添加官方通知";
      this.modalVisible = true;
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
      this.$refust("/angleGame/getNoticeList", this.searchfan).then((res) => {
        this.loading = false;
        if (res.success) {
          this.total = res.result.total;
          var dataList = res.result.list;
          this.data = dataList;
        }
        console.log(res);
      });
    },
    getDataList() {
      this.loading = true;
      this.$refust("/angleGame/getNoticeList", this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.total = res.result.total;
          var dataList = res.result.list;
          this.data = dataList;
        }
        console.log(res);
      });
    },
    approve(v) {
      //控制编辑弹出按钮
      //   this.zhuang = v.reviewStatus;
      this.advertising.id = v.id;
      this.title = "编辑官方通知";
      this.modalVisible = true;
      this.showPic = true;
      //   this.dialogVisible = true;
      let params = {
        id: v.id,
      };
      this.$http("/angleGame/getAppNoticeById", params).then((res) => {
        if (res.success) {
          this.dialogImageUrls =
            "https://fishingcircles.oss-cn-beijing.aliyuncs.com" +
            res.result.coverImage;
          this.advertising.coverImage = res.result.coverImage;
          this.advertising.title = res.result.title;
          this.advertising.publishDateStr = res.result.publishDateStr;
          this.advertising.noticeLabel = parseInt(res.result.noticeLabel);
          this.advertising.noticeType = 2;
          this.editor.txt.html(res.result.content);
          this.advertising.content = res.result.content;
        }
      });
    },
    //删除公告
    del(id) {
      this.$confirm("此操作将永久删除该官方通知, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            id: id,
          };
          this.$http("/angleGame/deleteNotice", params).then((res) => {
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
      if (this.title == "添加官方通知") {
        this.advertising.userId = sessionStorage.getItem("userId");
        this.advertising.coverImage = this.fileLists.join("");
        this.advertising.noticeType = 3;
        this.advertising.content = this.editor.txt.html();
        console.log( this.advertising.noticeLabel,this.advertising.coverImage)
        if (
          this.advertising.noticeLabel !== "" &&
          this.advertising.coverImage !== ""
        ) {
            
          this.$http("/angleGame/insertNotice", this.advertising).then(
            (res) => {
              if (res.success) {
                this.modalVisible = false;

                this.$Message.success("审核成功");
                this.getDataList();
                this.reload();

                this.advertising = {};
              }
            }
          );
        } else {
          this.$message({
            message: "主题图片和赛事标签必填",
            type: "warning",
          });
        }
      } else if (this.title == "编辑官方通知") {
        this.advertising.userId = sessionStorage.getItem("userId");
        this.advertising.coverImage = this.fileLists.join("");
        this.advertising.noticeType = 3;
        this.advertising.content = this.editor.txt.html();
        // this.advertising.noticeLabel = this.advertising.noticeLabel;
        // console.log(this.advertising, "rrrrrrr");
        this.$http("/angleGame/updateNotice", this.advertising).then((res) => {
          if (res.success) {
            this.modalVisible = false;

            this.$Message.success("修改成功");
            this.getDataList();
            this.reload();
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
    var that = this;
    this.editor = new E("#editor");

    this.editor.customConfig.uploadImgMaxLength = 5;

    this.editor.customConfig.uploadImgServer = "/xboot/upload/uploadGameImage";
    this.editor.customConfig.customUploadImg = function (files, insert) {
      let formData = new FormData();
      formData.append("file", files[0]);

      that.$fetch("/upload/uploadGameImage", formData).then((res) => {
        console.log(res, "======");
        insert(res.result);
      });
    };
    this.editor.create();
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