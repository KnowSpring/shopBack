export default {
  created() {
    this.getRightList()
  },
  data() {
    return {
      rightList: []
    }
  },
  methods: {
    async getRightList() {
      const res = await this.$http.get('/rights/list')
      console.log(res)
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.rightList = data
      }
    }
  }
}
