<style lang="less">
// @import ".";
</style>
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row class="operation">
            <Button @click="addRole" type="primary" icon="md-add"
              >添加模块</Button
            >
            <Button @click="delAll" icon="md-trash">批量删除</Button>
            <Button @click="init" icon="md-refresh">刷新</Button>
          </Row>
          <Row>
            <Alert show-icon>
              已选择
              <span class="select-count">{{ selectCount }}</span> 项
              <a class="select-clear" @click="clearSelectAll">清空</a>
            </Alert>
          </Row>
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
              :page-size-opts="[10, 20, 50]"
              size="small"
              show-total
              show-elevator
              show-sizer
            ></Page>
          </Row>
        </Card>
      </Col>
    </Row>
    <!-- 编辑 -->
    <Modal
      :title="modalTitle"
      v-model="roleModalVisible"
      :mask-closable="false"
      :width="500"
    >
      <Form
        ref="roleForm"
        :model="roleForm"
        :label-width="80"
        :rules="roleFormValidate"
      >
        <FormItem label="按钮名称">
          <Input v-model="roleForm.title" placeholder="请输入按钮名称" />
        </FormItem>
        <FormItem label="模块名称">
          <Input v-model="roleForm.configKey" placeholder="请输入模块名称" />
        </FormItem>
        <FormItem label="按钮状态">
          <Input v-model="roleForm.configType" placeholder="请输入按钮状态" />
        </FormItem>
        <FormItem label="按钮配置项">
          <Form ref="Form" :model="Form" :label-width="80">
            <FormItem label="状态码">
              <Input
                v-model="Form.code"
                placeholder="请输入状态码，纯数字"
                style="width: 150px"
              />
            </FormItem>
            <FormItem label="按钮功能（中文）" style="margin-top: 15px">
              <Input
                v-model="Form.btnName"
                placeholder="请输入状态，纯汉字"
                style="width: 150px"
              />
            </FormItem>
            <FormItem label="按钮颜色">
              <Input v-model="Form.btnColor" placeholder="0代表初始颜色，1代表蓝色" style="width:150px" />
              <!-- <ColorPicker v-model="Form.btnColor" /> -->
            </FormItem>
          </Form>
        </FormItem>
        <FormItem label="备注">
          <Input v-model="roleForm.remark" placeholder="请输入备注" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelRole">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitRole"
          >提交</Button
        >
      </div>
    </Modal>
    <!-- 菜单权限 -->
  </div>
</template>

<script>
import {
  getRoleList,
  getAllPermissionList,
  addRole,
  editRole,
  deleteRole,
  setDefaultRole,
  editRolePerm,
  initDepartment,
  loadDepartment,
  editRoleDep,
} from "@/api/index";
import util from "@/libs/util.js";
export default {
  name: "appButton",
  data() {
    return {
      Form: {
        code: "",
        btnName: "",
        btnColor: "0",
      },
      openLevel: "0",
      loading: true,
      treeLoading: true,
      depTreeLoading: true,
      submitPermLoading: false,
      submitDepLoading: false,
      searchKey: "",
      sortColumn: "createTime",
      sortType: "desc",
      modalType: 0,
      roleModalVisible: false,
      permModalVisible: false,
      depModalVisible: false,
      modalTitle: "",
      roleForm: {
        title: "",
        configKey: "",
        configType: "",
        createBy: "",
        updateBy: "",
        configJson: [],
        remark:""
      },
      roleFormValidate: {
        name: [
          { required: true, message: "模块名称不能为空", trigger: "blur" },
        ],
      },
      submitLoading: false,
      selectList: [],
      selectCount: 0,
      columns: [
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
          title: "按钮名称",
          key: "title",
          sortable: true,
        },
        {
          title: "模块名称",
          key: "configKey",
          sortable: true,
        },
        {
          title: "按钮状态",
          key: "configType",
          sortable: true,
        },
        {
          title: "创建时间",
          key: "createTime",
          sortable: true,
          sortType: "desc",
        },
        {
          title: "备注",
          key: "remark",
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          fixed: "right",
          width: 300,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    size: "small",
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
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",
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
      data: [],
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      permData: [],
      editRolePermId: "",
      selectAllFlag: false,
      depData: [],
      dataType: 0,
      id:""
    };
  },
  methods: {
    init() {
      this.getRoleList();
      // 获取所有菜单权限树
      this.getPermList();
    },
    changePage(v) {
      this.pageNumber = v;
      this.getRoleList();
      this.clearSelectAll();
    },
    changePageSize(v) {
      this.pageSize = v;
      this.getRoleList();
    },
    changeSort(e) {
      this.sortColumn = e.key;
      this.sortType = e.order;
      if (e.order == "normal") {
        this.sortType = "";
      }
      this.getRoleList();
    },
    getRoleList() {
      this.loading = true;
      let params = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        order: "desc",
      };
      this.$refust("/menus/selectMenu", params).then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.list;
          this.total = res.result.total;
        }
      });
    },
    getPermList() {
      this.treeLoading = true;
      getAllPermissionList().then((res) => {
        this.treeLoading = false;
        if (res.success) {
          this.deleteDisableNode(res.result);
          this.permData = res.result;
        }
      });
    },
    // 递归标记禁用节点
    deleteDisableNode(permData) {
      let that = this;
      permData.forEach(function (e) {
        if (e.status == -1) {
          e.title = "[已禁用] " + e.title;
          e.disabled = true;
        }
        if (e.children && e.children.length > 0) {
          that.deleteDisableNode(e.children);
        }
      });
    },
    cancelRole() {
      this.roleModalVisible = false;
    },
    submitRole() {
      // this.$refs.roleForm.validate((valid) => {
      //   console.log(valid)
      //   if (valid) {
      if (this.modalType == 0) {
        // 添加
        this.submitLoading = true;
        var jsonArray = [];
        var newJSON = jsonArray.push(this.Form);
        this.roleForm.configJson = JSON.stringify(jsonArray);
        this.roleForm.createBy = sessionStorage.getItem("userId");
        this.roleForm.updateBy = sessionStorage.getItem("userId");
        this.$http("/menus/addMenu", this.roleForm).then((res) => {
          // this.submitLoading = false;
          if (res.success) {
            this.$Message.success("操作成功");
            this.getRoleList();
            this.roleForm = {};
            this.Form = {};
            this.roleModalVisible = false;
          }
        });
      } else {
        this.submitLoading = true;
        var jsonArray = [];
        var newJSON = jsonArray.push(this.Form);
        this.roleForm.configJson = JSON.stringify(jsonArray);
         this.roleForm.createBy = sessionStorage.getItem("userId");
        this.roleForm.updateBy = sessionStorage.getItem("userId");
        this.roleForm.id = this.id;
        this.$http("/menus/updateMenu", this.roleForm).then((res) => {
          // this.submitLoading = false;
          if (res.success) {
            this.$Message.success("操作成功");
            this.getRoleList();
            this.roleModalVisible = false;
          }
        });
      }
      // }
      //   });
    },
    addRole() {
      this.roleForm = {};
      this.Form = {}
      this.modalType = 0;
      this.modalTitle = "添加模块";
      this.$refs.roleForm.resetFields();
      delete this.roleForm.id;
      this.roleModalVisible = true;
    },
    edit(v) {
       this.roleForm = {};
      this.Form = {}
      this.modalType = 1;
      this.modalTitle = "编辑模块";
      // this.$refs.roleForm.resetFields();
      // // 转换null为""
      // for (let attr in v) {
      //   if (v[attr] == null) {
      //     v[attr] = "";
      //   }
      // }
      // let str = JSON.stringify(v);
      // let roleInfo = JSON.parse(str);
      this.roleForm.title = v.title;
      this.roleForm.configKey = v.configKey;
      this.roleForm.configType = v.configType;
      this.roleForm.remark = v.remark;
      this.id = v.id;
      this.roleForm.configJson = v.configJson
      if (this.roleForm.configJson) {
        JSON.parse(this.roleForm.configJson).map((e, v) => {
          this.Form = e;
        });
      } else {
        return false;
      }
      this.roleModalVisible = true;
    },
    remove(v) {
      let params = {
        id: v.id,
        updateBy: sessionStorage.getItem("userId"),
      };
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除模块?",
        loading: true,
        onOk: () => {
          this.$refust("/menus/deleteMenu", params).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("删除成功");
              this.getRoleList();
            }
          });
        },
      });
    },
    setDefault(v) {
      this.$Modal.confirm({
        title: "确认设置",
        content: "您确认要设置所选的 " + v.name + " 为注册用户默认角色?",
        loading: true,
        onOk: () => {
          let params = {
            id: v.id,
            isDefault: true,
          };
          setDefaultRole(params).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("操作成功");
              this.getRoleList();
            }
          });
        },
      });
    },
    cancelDefault(v) {
      this.$Modal.confirm({
        title: "确认取消",
        content: "您确认要取消所选的 " + v.name + " 角色为默认?",
        loading: true,
        onOk: () => {
          let params = {
            id: v.id,
            isDefault: false,
          };
          setDefaultRole(params).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("操作成功");
              this.getRoleList();
            }
          });
        },
      });
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
    changeSelect(e) {
      this.selectList = e;
      this.selectCount = e.length;
    },
    delAll() {
      if (this.selectCount <= 0) {
        this.$Message.warning("您还未选择要删除的数据");
        return;
      }
      console.log(this.selectList,'全选')
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除所选的 " + this.selectCount + " 条数据?",
        loading: true,
        onOk: () => {
          let ids = [];
          this.selectList.forEach(function (e) {
            ids.push(e.id);
          });
          // ids = ids.substring(0, ids.length - 1);
          let params = {
            listId:ids,
            updateBy:sessionStorage.getItem('userId')
          }
         this.$refust('/menus/deleteMenus',params).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("删除成功");
              this.clearSelectAll();
              this.getRoleList();
            }
          });
        },
      });
    },

    cancelPermEdit() {
      this.permModalVisible = false;
    },
    loadData(item, callback) {
      loadDepartment(item.id, { openDataFilter: false }).then((res) => {
        if (res.success) {
          res.result.forEach(function (e) {
            e.selected = false;
            if (e.isParent) {
              e.loading = false;
              e.children = [];
            }
            if (e.status == -1) {
              e.title = "[已禁用] " + e.title;
              e.disabled = true;
            }
          });
          callback(res.result);
        }
      });
    },
    expandCheckDep(v) {
      // 判断展开子节点
      this.checkDepTree(v.children, this.editDepartments);
    },
    // 判断子节点
    checkDepTree(depData, roleDepIds) {
      let that = this;
      depData.forEach(function (p) {
        if (that.hasDepPerm(p, roleDepIds)) {
          p.selected = true;
        } else {
          p.selected = false;
        }
      });
    },
    // 判断角色拥有的权限节点勾选
    hasDepPerm(p, roleDepIds) {
      let flag = false;
      for (let i = 0; i < roleDepIds.length; i++) {
        if (p.id == roleDepIds[i].departmentId) {
          flag = true;
          break;
        }
      }
      if (flag) {
        return true;
      }
      return false;
    },
    submitDepEdit() {
      let depIds = "";
      if (this.dataType != 0) {
        let selectedNodes = this.$refs.depTree.getSelectedNodes();
        if (selectedNodes.length < 1) {
          this.$Message.error("请至少选择一条数据");
          return;
        }
        selectedNodes.forEach(function (e) {
          depIds += e.id + ",";
        });
        depIds = depIds.substring(0, depIds.length - 1);
      }
      this.submitDepLoading = true;
      editRoleDep({
        roleId: this.editRolePermId,
        dataType: this.dataType,
        depIds: depIds,
      }).then((res) => {
        this.submitDepLoading = false;
        if (res.success) {
          this.$Message.success("操作成功");
          this.getRoleList();
          this.depModalVisible = false;
        }
      });
    },
    changeOpen(v) {
      if (v == "0") {
        this.permData.forEach((e) => {
          e.expand = true;
          if (e.children && e.children.length > 0) {
            e.children.forEach((c) => {
              c.expand = true;
              if (c.children && c.children.length > 0) {
                c.children.forEach(function (b) {
                  b.expand = true;
                });
              }
            });
          }
        });
      } else if (v == "1") {
        this.permData.forEach((e) => {
          e.expand = false;
          if (e.children && e.children.length > 0) {
            e.children.forEach((c) => {
              c.expand = false;
              if (c.children && c.children.length > 0) {
                c.children.forEach(function (b) {
                  b.expand = false;
                });
              }
            });
          }
        });
      } else if (v == "2") {
        this.permData.forEach((e) => {
          e.expand = true;
          if (e.children && e.children.length > 0) {
            e.children.forEach((c) => {
              c.expand = false;
              if (c.children && c.children.length > 0) {
                c.children.forEach(function (b) {
                  b.expand = false;
                });
              }
            });
          }
        });
      } else if (v == "3") {
        this.permData.forEach((e) => {
          e.expand = true;
          if (e.children && e.children.length > 0) {
            e.children.forEach((c) => {
              c.expand = true;
              if (c.children && c.children.length > 0) {
                c.children.forEach(function (b) {
                  b.expand = false;
                });
              }
            });
          }
        });
      }
    },
  },
  mounted() {
    this.init();
  },
};
</script>