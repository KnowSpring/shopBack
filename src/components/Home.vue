<template>
  <el-container class="box">
    <el-header>
      <el-row>
        <el-col :span="8">
          <div class="grid-content">
            <div class="title">欢迎，你好！</div>

          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ">
            <div class="middleTitle">电商后台管理系统</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ">
            <a
              href="javascript:;"
              @click="loginout"
            >退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container class="content">
      <el-aside width="200px">
        <el-row class="tac">
          <el-col>
            <!--
          el-menu 表示菜单组件

            default-active 当前激活菜单的 index 值
            @open 菜单展开事件
            @close 菜单收起事件

          el-sub-menu 表示一组菜单
            index 是唯一的，不能重复！！！
         -->
            <el-menu
              default-active="1"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b"
              :router="true"
            >
              <el-submenu index="1">
                <!-- template: 用来包裹一级菜单，内部指定菜单的图标和菜单名称
              如果要给菜单添加 小图标，应该使用 template 来包裹整个内容-->
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>用户管理</span>
                </template>

                <el-menu-item index="/home/user">
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>用户列表</span>
                  </template>
                </el-menu-item>
              </el-submenu>
              <el-submenu index="2">

                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>权限管理</span>
                </template>

                <el-menu-item index="/home/role">
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>角色列表</span>
                  </template>
                </el-menu-item>
                <el-menu-item index="/home/right">
                  <template slot="title">
                    <i class="el-icon-view"></i>
                    <span>权限列表</span>
                  </template>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-container>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
export default {
  methods: {
    loginout() {
      this.$confirm("您是否退出后台系统?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        localStorage.removeItem("token");
        this.$router.push("./login");
      });
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>
<style scoped lang="less">
.box {
  height: 100%;
}
.el-header {
  margin: 0;
  padding: 0;
  background-color: #b3c1cd;

  .el-col {
    .title {
      font-size: 30px;
      line-height: 60px;
      padding: 0 20px;
    }
    .middleTitle {
      line-height: 60px;
      font-size: 35px;
      font-weight: bold;
      color: #fff;
    }
    a {
      color: #b07a17;
      float: right;
      padding: 17px;
      text-decoration: none;
    }
  }
}
.content {
  height: 100%;
  .el-aside {
    background-color: #545c64;
    color: #333;
    height: 100%;
  }

  .el-main {
    background-color: #e9eef3;
    color: #333;
  }
}

.grid-content {
  border-radius: 4px;
  min-height: 30px;
}
</style>
