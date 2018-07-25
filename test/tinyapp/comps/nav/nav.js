Component.C({
  data: {},
  created: function() {
    this.$id = 1
    console.log('[Component/Nav] created', this.properties, this.is)
  },
  attached: function() {
    console.log('[Component/Nav] attached', this.properties, this.is, this.$root, this.$parent)
  },
  ready: function() {
    // 调用父组件方法
    this.$call('callFromComponent', 'nav')
    console.log('[Component/Nav] ready', this.properties, this.is)
  }
})
