// 字符串
// import axios from "axios";
export default {
  created() {
    this.getUserList()
    this.getRoleList()
  },
  data() {
    return {
      userList: [],
      total: 0,
      pagesize: 2,
      curpage: 1,
      searchUser: '',
      // 添加用户对话框显示与隐藏
      addUserDialog: false,
      addUserForm: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ]
      },

      editUserDialog: false,
      editUserForm: {
        id: -1,
        mobile: '',
        email: '',
        // 没有username第一次编辑将不会显示用户名
        username: ''
      },
      editUserRules: {
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '手机格式不正确',
            trigger: 'change'
          }
        ]
      },

      assignRoleDialog: false,
      roleList: [],
      assignRoleForm: {
        roleId: -1,
        userId: -1,
        username: ''
      }
    }
  },
  methods: {
    // 获取用户列表
    async getUserList(pagenum) {
      // axios.get(url,{params:{}})
      const res = await this.$http.get(
        'http://localhost:8888/api/private/v1/users',
        {
          params: {
            pagenum: pagenum || 1,
            pagesize: this.pagesize,
            query: this.searchUser || ''
          }
          // headers: {
          //   Authorization: localStorage.getItem("token")
          // }
        }
      )

      const { data, meta } = res.data
      if (meta.status === 200) {
        this.userList = data.users
        this.total = data.total
        this.curpage = data.pagenum
      }
    },
    // 在搜索框查询的用户
    searchUserList() {
      console.log('search')
      this.getUserList()
      this.curpage = 1
    },
    // 改变用户状态
    changeUserStatus(id, curState) {
      this.$http.put(`/users/${id}/state/${curState}`).then(res => {
        const { meta, data } = res.data
        if (meta.status === 200) {
          this.$message({
            type: 'success',
            message: data.mg_state === 1 ? '已启动' : '已禁用'
          })
        } else {
          this.$message({
            type: 'error',
            message: meta.msg
          })
        }
      })
    },
    // 根据id删除用户
    async deleteUserById(id) {
      try {
        await this.$confirm('是否删除该用户', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const res = await this.$http.delete(`users/${id}`)
        const { meta } = res.data
        if (meta.status === 200) {
          this.$message({
            type: 'success',
            message: meta.msg,
            duration: 1000
          })
          // 挖个坑
          const index = this.userList.findIndex(item => item.id === id)
          this.userList.splice(index, 1)

          if (this.userList.length === 0) {
            --this.curpage
          }
          this.getUserList(this.curpage)
        }
      } catch (err) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    // 展示添加用户对话框
    showAddUserDialog() {
      this.addUserDialog = true
    },
    // 关闭添加用户对话框时重置
    closeAddUserDialog() {
      this.$refs.addUserForm.resetFields()
    },
    // 展示编辑用户对话框
    showEditUserDialog(currUser) {
      this.editUserDialog = true
      console.log(currUser)

      // 遍历编辑对象，将请求到的该用户数据赋值给编辑对象
      for (const key in this.editUserForm) {
        this.editUserForm[key] = currUser[key]
      }
    },
    // 关闭编辑户对话框时重置
    closeEditUserDialog() {
      this.$refs.editUserForm.resetFields()
    },
    // 添加用户
    async addUser() {
      const res = await this.$http.post('/users', this.addUserForm)
      this.$refs.addUserForm.validate(validate => {
        if (validate) {
          const { meta } = res.data
          if (meta.status === 201) {
            this.getUserList()
            this.addUserDialog = false
          }
        } else {
          return false
        }
      }) // validate end
    },
    // 编辑用户
    editUser() {
      const { id, mobile, email } = this.editUserForm
      this.$http
        .put(`/users/${id}`, {
          mobile,
          email
        })
        .then(res => {
          this.$refs.editUserForm.validate(validate => {
            if (validate) {
              console.log(res)
              const { meta, data } = res.data
              if (meta.status === 200) {
                // 数据改了，为了减少请求，更改用户数据
                let editUser = this.userList.find(item => item.id === id)
                // editUSer对象指向用户列表中该被编辑用户，赋值则页面不会更改
                editUser.mobile = data.mobile
                editUser.email = data.email

                this.editUserDialog = false
              }
            } else {
              return false
            }
          }) // validate end
        })
    },
    // 得到所有角色
    async getRoleList() {
      const res = await this.$http.get('/roles')
      const { meta, data } = res.data
      if (meta.status === 200) {
        this.roleList = data
      }
    },
    // 打开分配角色对话框
    async showAssignRoleDiglog(curUser) {
      this.assignRoleDialog = true
      this.assignRoleForm.userId = curUser.id
      this.assignRoleForm.username = curUser.username
      // 选中默认角色
      // 根据当前用户的id，获取用的角色id
      const res = await this.$http.get(`users/${curUser.id}`)

      const { meta, data } = res.data
      if (meta.status === 200) {
        // 设置当前用户具有的角色id
        this.assignRoleForm.roleId = data.rid

        // 没有角色情况下，进行特殊处理，什么不选中
        if (data.rid === -1) {
          this.assignRoleForm.roleId = ''
        }
      }
    },
    closeAssignRoleDialog() {
      this.assignRoleDialog = false
    },
    async assignRoleConfirm() {
      const { userId, roleId } = this.assignRoleForm
      const res = await this.$http.put(`users/${userId}/role`, { rid: roleId })
      console.log(res)
      const { meta, data } = res.data
      if (meta.status === 200) {
        this.assignRoleDialog = false
        this.assignRoleForm.roleId = data.rid
      }
    }
  } // method end
}
