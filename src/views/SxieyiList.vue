<style lang="less">
</style>
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row class="operation">
                <Button @click="getDataList" icon="md-refresh">刷新</Button>
          </Row>
          <br>
          <Row>
            <Table
              :loading="loading"
              border
              :columns="columns"
              :data="data"
              ref="table"
              sortable="custom"
              @on-sort-change="changeSort"
              @on-selection-change="changeSelect"
            ></Table>
          </Row>
          <Row type="flex" justify="end" class="page">
            <Page
              :current="pageNumber"
              :total="total"
              :page-size="pageSize"
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
           <Modal title="详情" v-model="xiagnqing" :mask-closable='false' :width="650">
                <Form  :label-width="100" >
                    <FormItem label="标题:">
                        <span>{{biaoti}}</span>
                    </FormItem>
                    <FormItem label="内容:">
                        <span v-html="content"></span>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary"  @click="xiagnqing=false">确定</Button>
                </div>

            </Modal>
            <!-- 编辑弹窗 -->
            <Modal title="编辑" v-model="compile" :mask-closable='false' :width="800">
                <Form  :label-width="50" >  
                    <FormItem label="标题:">
                        <i-input  v-model="compilecontent.title" ></i-input>
                    </FormItem>   
                    <!-- <FormItem label="内容:">
                        <i-input type="textarea" v-model="compilecontent.content" :autosize='true' ></i-input>
                    </FormItem> -->
                    <!-- <quill-editor
                      placeholder=""
                      v-model="compilecontent.content"
                      ref="myQuillEditor"
                      :options="editorOption"
                      @blur="onEditorBlur($event)"
                      @focus="onEditorFocus($event)"
                      @change="onEditorChange($event)"
                    ></quill-editor> -->
                    <wang-edit
                      v-model="compilecontent.content"
                      ref="myQuillEditor"
                    ></wang-edit>
                </Form>
                <div slot="footer">
                    <Button type="primary"  @click="compiles">确定</Button>
                </div>
            </Modal>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import "quill/dist/quill.core.css";
  import "quill/dist/quill.snow.css";
  import "quill/dist/quill.bubble.css";
  import {quillEditor} from "vue-quill-editor";
  import wangEdit from "../views/vendor/WangEdit"
export default {
  components: {
    quillEditor,
    wangEdit
  },
  data() {
    return {
      loading: true, // 表单加载状态
      sortColumn: "create_time", // 排序字段
      sortType: "desc", // 排序方式
      content:'',
      editorOption: {
        placeholder:"请输入..."
      },
      biaoti:'',
      compilecontent:{
          content:'',
          title:'',
          id:''
      },
      compile:false,
      xiagnqing:false,
      submitLoading: false, // 添加或编辑提交状态
      selectList: [], // 多选数据
      selectCount: 0, // 多选计数
      columns: [
        // 表头
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "标题",
          key: "title",
          sortable: true
        },
        {
          title: "类型",
          key: "type",
          sortable: true,
           render:(h, params) =>{
                    if(params.row.type == '1'){
                        return h("span","平台协议")
                    }else if(params.row.type == '2'){
                        return h("span", '关于我们')
                    }else if(params.row.type == '3'){
                        return h("span", '赛事协议')
                    }else if(params.row.type == '4'){
                        return h("span", '兑换协议')
                    }else if(params.row.type == '5'){
                        return h("span", '签约协议')
                    }else if(params.row.type == '6'){
                        return h("span", '充值协议')
                    }else if(params.row.type == '7'){
                        return h("span", '邀请规则')
                    }else if(params.row.type == '8'){
                        return h("span", '主办方操作教程')
                    }else if(params.row.type == '9'){
                        return h("span", '主裁判操作教程')
                    }else if(params.row.type == '10'){
                        return h("span", '裁判员操作教程')
                    }else if(params.row.type == '11'){
                        return h("span", '运动员操作教程')
                    }else if(params.row.type == '12'){
                        return h("span", '营销合作协议')
                    }else if(params.row.type == '13'){
                        return h("span", '联名卡兑换协议')
                    }else if(params.row.type == '14'){
                        return h("span", '用户注册协议')
                    }
                }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                    icon: "ios-create-outline"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.edit(params.row);
                    }
                  }
                },
                "编辑"
              ),
            //   h(
            //     "Button",
            //     {
            //         props: {
            //         type: "primary",
            //         size: "small",
            //         icon: "ios-create-outline"
            //         },
            //         style: {
            //         marginRight: "5px"
            //         },
            //         on: {
            //         click: () => {
            //             this.details(params.row);
            //         }
            //         }
            //     },
            //     "详情"
            // ), 
            ]);
          }
        }
      ],
      data: [], // 表单数据
      pageNumber: 1, // 当前页数
      pageSize: 10, // 页面大小
      total: 0 // 表单数据总数
    };
  },
  methods: {
    init() {
      this.getDataList();
    },
     onEditorBlur() {
        //失去焦点事件
      },
      onEditorFocus() {
        //获得焦点事件
      },
      onEditorChange() {
        //内容改变事件
      },
    changePage(v) {
      this.pageNumber = v;
      this.getDataList();
      this.clearSelectAll();
    },
    changePageSize(v) {
      this.pageSize = v;
      this.getDataList();
    },
    changeSort(e) {
      this.sortColumn = e.key;
      this.sortType = e.order;
      if (e.order == "normal") {
        this.sortType = "";
      }
      this.getDataList();
    },
    getDataList() {
      this.loading = true;
      let params = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
      };
      this.postRequest("/commonProblem/getByPage", params).then(res => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
        console.log(res)
      });
    },
    details(v){
        this.xiagnqing=true
        console.log(v)
        this.content=v.content
        this.biaoti=v.title
    },
    handleCancel() {
      this.modalVisible = false;
    },
    add() {
      let query = { backRoute: this.$route.name };
      this.$router.push({
        name: "newsadd",
        query: query
      });
    },
    edit(v) {
      console.log(v)
      this.compile=true
      this.compilecontent.content=v.content
      this.compilecontent.id=v.id
      this.compilecontent.title=v.title
    },
    compiles(){
        this.postRequest("/commonProblem/updateCommonProblem", this.compilecontent).then(res => {
             if (res.success) {
                this.$Message.success("操作成功");
                this.compile=false
                this.getDataList()
            }
            console.log(res)
        })
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
    changeSelect(e) {
      this.selectList = e;
      this.selectCount = e.length;
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style>

.ql-snow .ql-tooltip[data-mode=link]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: '保存';
    padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode=video]::before {
    content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: '14px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
  content: '10px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
  content: '18px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
  content: '32px';
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '文本';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: '标题1';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: '标题2';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: '标题3';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: '标题4';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: '标题5';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: '标题6';
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: '标准字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
  content: '衬线字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
  content: '等宽字体';
}
</style>