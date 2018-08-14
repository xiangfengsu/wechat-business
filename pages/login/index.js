Page({
  data: {
    validate:false
  },
  handleInput(e) {
    const {
      detail: {
        value
      }
    } = e;
    if((/^1[3456789]\d{9}$/.test(value))){ 
      this.setData({
        validate:true
      })
    }else{
      this.setData({
        validate:false
      })
    }
  },
  formSubmit(e){
    if(this.data.validate){
      console.log(e);
      const iphone = e.detail.value.iphone;
      wx.navigateTo({
        url: `/pages/loginCode/index?iphone=${iphone}`
      })
    }
  },
  onShareAppMessage(res) {
    return {
      title: '迅羽商家版',
      path: '/pages/home/index'
    }
  }
})