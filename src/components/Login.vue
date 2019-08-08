<template>
  <div class="loginForm">
    <!-- 使用flex布局居中 -->
    <el-row
      type="flex"
      justify="center"
      align="middle"
      class="loginRow"
    >
      <el-col
        :xs="12"
        :sm="10"
        :md="8"
        :lg="6"
        class="loginCol"
      >
        <div>
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="rules"
            label-position="top"
          >
            <el-form-item
              label="账户"
              prop="username"
            >
              <el-input v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item
              label="密码"
              prop="password"
            >
              <el-input
                type="password"
                v-model="loginForm.password"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="onLoginSubmit"
              >登录</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入账户", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    login() {
      axios
        .post("http://localhost:8888/api/private/v1/login", this.loginForm)
        .then(res => {
          // ES6中的解构，意思就是从 res.data 中取出属性 data 和 meta
          const { data, meta } = res.data;
          if (meta.status === 200) {
            localStorage.setItem("token", data.token);
            this.$router.push("./home");
          } else {
            this.$message({
              type: "error",
              message: meta.msg,
              duration: 1000
            });
          }
        });
    },
    onLoginSubmit() {
      //是否校验成功
      this.$refs.loginForm.validate(valid => {
        console.log(valid);
        if (valid) {
          //校验成功后进行验证跳转
          this.login();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.loginForm.resetFields();
    }
  }
};
</script>
<style scoped>
.loginForm,
.loginRow {
  height: 100%;
}
.loginForm {
  background-color: #2d434c;
}
.loginCol {
  background-color: #fff;
  border-radius: 20px;
  padding: 10px 20px;
  min-width: 235px;
}
</style>
