export default {
  created() {
    this.getRoleList()
    this.getRightTree()
  },
  data() {
    return {
      roleList: [],
      editRoleForm: {
        id: -1,
        roleName: '',
        roleDesc: ''
      },
      // 权限tree
      rightTree: [],
      curRoleId: -1,
      editRoleDialog: false,
      assignRightDialog: false,
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const res = await this.$http.get('/roles')
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.roleList = data
      }
    },
    // 获取权限tree数据
    async getRightTree() {
      const res = await this.$http.get('/rights/tree')
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.rightTree = data
      }
    },
    // 关闭展开行中的标签
    async handleTagClose(roleId, rightId) {
      const res = await this.$http.delete(`roles/${roleId}/rights/${rightId}`)
      const { data, meta } = res.data
      if (meta.status === 200) {
        const curRole = this.roleList.find(item => item.id === roleId)
        curRole.children = data
      }
    },
    // 删除角色
    async deleteRoleById(id) {
      try {
        // 这里如果没有加上await，不管有没有确定都会执行下面删除
        await this.$confirm('确认删除该角色吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const res = await this.$http.delete(`/roles/${id}`)
        const { meta } = res.data
        if (meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          const index = this.roleList.findIndex(item => item.id === id)
          this.roleList.splice(index, 1)
        }
      } catch (err) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    // 关闭编辑角色对话框
    closeEditRoleDialog() {
      this.editRoleDialog = false
    },
    // 点击编辑按钮，进行展示对话框等
    showEditRolerDialog(curRole) {
      this.editRoleDialog = true
      for (const key in this.editRoleForm) {
        this.editRoleForm[key] = curRole[key]
      }
      // this.editRoleForm = curRole
    },
    // 点击对话框，确定按钮进行发请求
    async editRoleConfirm() {
      this.editRoleDialog = false
      const { id, roleName, roleDesc } = this.editRoleForm
      const res = await this.$http.put(`/roles/${id}`, {
        roleName,
        roleDesc
      })
      const { meta, data } = res.data
      if (meta.status === 200) {
        let curRole = this.roleList.find(item => item.id === id)
        curRole.roleName = data.roleName
        curRole.roleDesc = data.roleDesc
      }
    },
    // 点击分配权限按钮，展示对话框等
    showAssignRight(curRoleRight, id) {
      this.assignRightDialog = true
      const level2Id = []
      // 保存当前用户ID
      this.curRoleId = id
      curRoleRight.forEach(level0 => {
        level0.children.forEach(level1 => {
          level1.children.forEach(level2 => {
            level2Id.push(level2.id)
          })
        })
      })
      // console.log(level2Id)
      // 因为tree是包裹在 dialog 中的，而 dialog 一开始是隐藏的
      // 并且，dialog 隐藏的时候， Vue 是不会渲染这个 dialog 组件
      // 因此，无法直接通过 $refs 来获取到tree
      this.$nextTick(() => {
        this.$refs.assignRight.setCheckedKeys(level2Id)
      })
    },
    // 关闭分配权限对话框触发事件
    closeAssignRightDialog() {
      this.assignRightDialog = false
    },
    // 点击分配权限弹出框的确定按钮
    async assignRightConfirm() {
      // 叶子节点以外半选中的节点
      const halfCheckedNodes = this.$refs.assignRight.getHalfCheckedKeys()
      // 选中的叶子节点
      const checkedNodes = this.$refs.assignRight.getCheckedKeys()
      const allCheckedNodes = [...halfCheckedNodes, ...checkedNodes]
      console.log(allCheckedNodes)
      const res = await this.$http.post(`/roles/${this.curRoleId}/rights`, {
        rids: allCheckedNodes.join(',')
      })
      console.log(res)
      if (res.data.meta.status === 200) {
        this.assignRightDialog = false
        // 更新角色数据
        this.getRoleList()
      }
    }
  }
}
