<style lang="less">
</style>
<template>
  <div class="search">
    <Row>
      <Card>
        <p slot="title">编辑</p>
        <Form
          ref="form"
          :model="form"
          :label-width="90"
          :rules="formValidate"
          style="position:relative"
        >
          <Form-item label="协议内容" prop="content">
            <editor id="editor" v-model="form.content" ref="editor"></editor>
          </Form-item>
          <Form-item>
            <Button
              @click="handleSubmit"
              :loading="submitLoading"
              type="primary"
              style="margin-right:5px"
            >提交并保存</Button>
            <Button @click="closeCurrentPage">返回</Button>
          </Form-item>
          <Spin size="large" fix v-if="loading"></Spin>
        </Form>
      </Card>
    </Row>
  </div>
</template>

<script>
import editor from "@/views/my-components/xboot/editor";
export default {
  name: "edit",
  components: {
    editor
  },
  data() {
    return {
      loading: true, // 表单加载状态
      submitLoading: false, // 表单提交状态
      form: {
        agreementId: "",
        content: ""
      },
      textCode:'',
      // 表单验证规则
      formValidate: {
        textContent: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      backRoute: ""
    };
  },
  methods: {
    init() {
      this.handleReset();
      this.code = this.$route.query.code;
      this.backRoute = this.$route.query.backRoute;
      this.getData();
    },
    handleReset() {
      this.$refs.form.resetFields();
    },
    //查询接口
    getData() {
      this.loading = true;
      var param={
        code:this.code
      }
      this.getRequest("/agreement/findByCode", param).then(res => {
        this.loading = false;
        if (res.success) {
          // 转换null为""
          this.form.agreementId = res.result.id
          this.form.content = res.result.textContent;
          this.$refs.editor.setData(res.result.textContent);
        }
      });
    },
    //保存提交接口
    handleSubmit() {
      this.submitLoading = true;
      this.$refs.form.validate(valid => {
        if (valid) {
          this.getRequest("/agreement/saveOne", this.form).then(res => {
            console.log(this.form)
            this.submitLoading = false;
            if (res.success) {
              this.$Message.success("编辑成功");
              this.closeCurrentPage();
            }
          });
        }
      });
    },
    // 关闭当前页面
    closeCurrentPage() {
      this.$store.commit("removeTag", "edit");
      localStorage.pageOpenedList = JSON.stringify(
        this.$store.state.app.pageOpenedList
      );
      this.$router.push({
        name: this.backRoute
      });
    }
  },
  watch: {
    // 监听路由变化通过id获取数据
    $route(to, from) {
      if (to.name == "agreementEdit") {
        this.handleReset();
        this.form.id = this.$route.query.id;
        this.code = this.$route.query.code
        this.getData();
      }
    }
  },
  mounted() {
    this.init();
  }
};
</script>