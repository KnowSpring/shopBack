<template>
  <div>
    <el-row>
      <el-col>
        <el-breadcrumb
          separator-class="el-icon-arrow-right"
          class="breadcrumb"
        >
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span=6>
        <el-input
          placeholder="请输入内容"
          v-model="searchUser"
          class="input-with-select"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            type="success"
            plain
            @click.stop="searchUserList"
          >
          </el-button>
        </el-input>
      </el-col>
      <el-col :span=3>
        <el-button
          type="success"
          plain
          @click="showAddUserDialog"
        >添加用户</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="userList"
      stripe
      style="width: 100%"
    >
      <el-table-column
        prop="username"
        label="姓名"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180"
      >
      </el-table-column>
      <el-table-column
        width="180"
        prop="mobile"
        label="电话"
      >
      </el-table-column>
      <el-table-column
        label="用户状态"
        width="150"
      >
        <!-- 数据放在template -->
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="changeUserStatus(scope.row.id,scope.row.mg_state)"
          >
          </el-switch>
        </template>

      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            plain
            @click="showEditUserDialog(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            plain
            @click="deleteUserById(scope.row.id)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            plain
          >分配角色</el-button>
        </template>

      </el-table-column>
    </el-table>
    <!-- 分页结构 -->
    <el-row>
      <el-col>
        <el-pagination
          class=pageination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pagesize"
          :current-page.sync="curpage"
          @current-change="getUserList"
        >
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 添加用户弹出框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialog"
      @close="closeAddUserDialog"
    >
      <el-form
        :model="addUserForm"
        ref="addUserForm"
        :rules="addUserRules"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            v-model="addUserForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model="addUserForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        </el-form-item>
        <!-- prop才会重置表单 -->
        <el-form-item
          label="手机号"
          prop="mobile"
        >
          <el-input
            v-model="addUserForm.mobile"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input
            v-model="addUserForm.email"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click.stop="addUser"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户弹出框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editUserDialog"
      @close="closeEditUserDialog"
    >
      <el-form
        :model="editUserForm"
        ref="editUserForm"
        :rules="editUserRules"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <!-- :value -->
          <el-input
            :value="editUserForm.username"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <!-- prop才会重置表单 -->
        <el-form-item
          label="手机号"
          prop="mobile"
        >
          <el-input
            v-model="editUserForm.mobile"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input
            v-model="editUserForm.email"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editUserDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editUser"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// 字符串
// import axios from "axios";
export default {
  created() {
    this.getUserList();
  },
  data() {
    return {
      userList: [],
      total: 0,
      pagesize: 2,
      curpage: 1,
      searchUser: "",
      addUserDialog: false,
      editUserDialog: false,
      addUserForm: {
        username: "",
        password: "",
        mobile: "",
        email: ""
      },
      editUserForm: {
        id: -1,
        mobile: "",
        email: "",
        // 没有username第一次编辑将不会显示用户名
        username: ""
      },
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" }
        ]
      },
      editUserRules: {
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机格式不正确",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    // 获取用户列表
    async getUserList(pagenum) {
      //axios.get(url,{params:{}})
      const res = await this.$http.get(
        "http://localhost:8888/api/private/v1/users",
        {
          params: {
            pagenum: pagenum || 1,
            pagesize: this.pagesize,
            query: this.searchUser || ""
          }
          // headers: {
          //   Authorization: localStorage.getItem("token")
          // }
        }
      );

      const { data, meta } = res.data;
      if (meta.status === 200) {
        this.userList = data.users;
        this.total = data.total;
        this.curpage = data.pagenum;
      }
    },
    //在搜索框查询的用户
    searchUserList() {
      console.log("search");
      this.getUserList();
      this.curpage = 1;
    },
    //改变用户状态
    changeUserStatus(id, curState) {
      this.$http.put(`/users/${id}/state/${curState}`).then(res => {
        const { meta, data } = res.data;
        if (meta.status === 200) {
          this.$message({
            type: "success",
            message: data.mg_state === 1 ? "已启动" : "已禁用"
          });
        } else {
          this.$message({
            type: "error",
            message: meta.msg
          });
        }
      });
    },
    //根据id删除用户
    deleteUserById(id) {
      this.$confirm("是否删除该用户", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.delete(`users/${id}`).then(res => {
          console.log(res);
          const { data, meta } = res.data;
          if (meta.status === 200) {
            this.$message({
              type: "success",
              message: meta.msg,
              duration: 1000
            });
            // 挖个坑
            const index = this.userList.findIndex(item => item.id === id);
            this.userList.splice(index, 1);

            if (this.userList.length === 0) {
              --this.curpage;
            }
            console.log(this.curpage);
            this.getUserList(this.curpage);
          }
        });
      });
    },
    //展示添加用户对话框
    showAddUserDialog() {
      this.addUserDialog = true;
    },
    // 关闭添加用户对话框时重置
    closeAddUserDialog() {
      this.$refs.addUserForm.resetFields();
    },
    //展示编辑用户对话框
    showEditUserDialog(currUser) {
      this.editUserDialog = true;
      console.log(currUser);

      // 遍历编辑对象，将请求到的该用户数据赋值给编辑对象
      for (const key in this.editUserForm) {
        this.editUserForm[key] = currUser[key];
      }
    },
    // 关闭编辑户对话框时重置
    closeEditUserDialog() {
      this.$refs.editUserForm.resetFields();
    },
    //添加用户
    async addUser() {
      const res = await this.$http.post(`/users`, this.addUserForm);
      this.$refs.addUserForm.validate(validate => {
        if (validate) {
          const { meta, data } = res.data;
          if (meta.status === 201) {
            this.getUserList();
            this.addUserDialog = false;
          }
        } else {
          return false;
        }
      }); //validate end
    },
    //编辑用户
    editUser() {
      const { id, mobile, email } = this.editUserForm;
      this.$http
        .put(`/users/${id}`, {
          mobile,
          email
        })
        .then(res => {
          this.$refs.editUserForm.validate(validate => {
            if (validate) {
              console.log(res);
              const { meta, data } = res.data;
              if (meta.status === 200) {
                // 数据改了，为了减少请求，更改用户数据
                let editUser = this.userList.find(item => item.id === id);
                //editUSer对象指向用户列表中该被编辑用户，赋值则页面不会更改
                editUser.mobile = data.mobile;
                editUser.email = data.email;

                this.editUserDialog = false;
              }
            } else {
              return false;
            }
          }); //validate end
        });
    }
  } //method end
};
</script>
<style>
.pageination {
  margin-top: 10px;
}
.breadcrumb {
  line-height: 40px;
  background-color: #d4dae0;
  font-size: 18px;
  padding-left: 10px;
  border-radius: 5px;
}
</style>
