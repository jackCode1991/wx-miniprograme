const App = getApp()

Page({
	data: {
		userInfo: {},
		hasUserInfo: false,
    	userInfo: null,
		items: [
			{
				icon: '../../assets/images/iconfont-order.png',
				text: '我的订单',
				path: '/pages/order/list/index'
			}, 
			{
				icon: '../../assets/images/iconfont-addr.png',
				text: '收货地址',
				path: '/pages/address/list/index'
			}, 
			{
				icon: '../../assets/images/iconfont-kefu.png',
				text: '联系客服',
				path: '18521708248',
			}, 
			{
				icon: '../../assets/images/iconfont-help.png',
				text: '常见问题',
				path: '/pages/help/list/index',
			},
		],
		settings: [
			{
				icon: '../../assets/images/iconfont-clear.png',
				text: '清除缓存',
				path: '0.0KB'
			}, 
			{
				icon: '../../assets/images/iconfont-about.png',
				text: '关于我们',
				path: '/pages/about/index'
			}, 
		]
	},
	onLoad() {
		//this.getUserInfo()
		//this.getStorageInfo()
		this.userAuthorized()
	},
	userAuthorized() {
	App.WxService.getSetting()
	.then(data =>{
		if (data.authSetting['scope.userInfo']) {
			App.WxService.getUserInfo()
			.then(data =>{
				this.setData({
                hasUserInfo: true,
                userInfo: data.userInfo
              })
			})
		}else{
			this.setData({
            hasUserInfo: false
          })
		}
	})
  },
	navigateTo(e) {
		const index = e.currentTarget.dataset.index
		const path = e.currentTarget.dataset.path

		switch(index) {
			case 2:
				App.WxService.makePhoneCall({
					phoneNumber: path
				})
				break
			default:
				App.WxService.navigateTo(path)
		}
    },
    getUserInfo() {
    	const userInfo = App.globalData.userInfo

		if (userInfo) {
			this.setData({
				userInfo: userInfo
			})
			return
		}

		App.getUserInfo()
		.then(data => {
            console.log(data)
			this.setData({
				userInfo: data
			})
		})
    },
    getStorageInfo() {
    	App.WxService.getStorageInfo()
    	.then(data => {
    		console.log(data)
    		this.setData({
    			'settings[0].path': `${data.currentSize}KB`
    		})
    	})
    },
    bindtap(e) {
    	const index = e.currentTarget.dataset.index
		const path = e.currentTarget.dataset.path

		switch(index) {
			case 0:
				App.WxService.showModal({
		            title: '友情提示', 
		            content: '确定要清除缓存吗？', 
		        })
		        .then(data => data.confirm == 1 && App.WxService.clearStorage())
				break
			default:
				App.WxService.navigateTo(path)
		}
    },
    logout() {
    	App.WxService.showModal({
            title: '友情提示', 
            content: '确定要登出吗？', 
        })
        .then(data => data.confirm == 1 && this.signOut())
    },
    signOut() {
    	// App.HttpService.signOut()
    	// .then(res => {
    	// 	const data = res.data
    	// 	console.log(data)
    	// 	if (data.meta.code == 0) {
    	// 		App.WxService.removeStorageSync('token')
    	// 		App.WxService.redirectTo('/pages/login/index')
			// 	}
			// 	App.WxService.removeStorageSync('token')
			// 	App.WxService.redirectTo('/pages/user/index')
			// })
			console.log('quit')
			console.log(App.WxService.getStorageSync('token'))
				App.WxService.removeStorageSync('token')
				//App.WxService.redirectTo('/pages/user/index')
    },
    onGetUserInfo(e) {
    const userInfo = e.detail.userInfo
    var code;
    if (userInfo) {
      // 1. 小程序通过wx.login()获取code
      App.WxService.login()
      .then(login_res =>{
      	 code=login_res.code
      	 return App.WxService.getUserInfo()
      })
      .then(info_res =>{
      	console.log(info_res)
      		var jsonData = {
              		code: code, //临时登录凭证
                  	rawData: info_res.rawData, //用户非敏感信息
                  	signature: info_res.signature, //签名
                  	encrypteData: info_res.encryptedData, //用户敏感信息
                  	iv: info_res.iv //解密算法的向量
				}
			return App.HttpService.wechatSignIn(jsonData)
      })
      .then(res =>{
      		console.log(res)
      		if (res.data.code == 200) {
	            // 7.小程序存储skey（自定义登录状态）到本地
	            App.WxService.setStorageSync('token', res.data.data.token)
							App.WxService.setStorageSync('userInfo', res.data.data.userInfo)
							App.globalData.userInfo=res.data.data.userInfo
          	} else{
            	console.log('服务器异常');
          	}
      })
      this.setData({
        hasUserInfo: true,
        userInfo: userInfo
      })
    }
  }
})