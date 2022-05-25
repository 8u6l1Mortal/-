    /******** ajax请求的预处理函数 ********/
    $.ajaxPrefilter(function (options) {

        // 给有权限限制的接口，设置请求头
        // 判断当前请求的url是否有权限限制
        // 方案1：判断url是否以/my/开头）
        // if (options.url.startsWith('/my/')) {
        //     options.headers = {
        //         Authorization: localStorage.getItem('token')
        //     }
        // }
        // 方案2：判断url是否包含'/my/'
        // 如果结果不是-1，那么肯定包含了'/my/'
        if (options.url.indexOf('/my/') !== -1) {
            options.headers = {
                Authorization: localStorage.getItem('token')
            }
        }

        // 给所有请求的url，拼接一个根地址
        options.url = 'http://www.liulongbin.top:3007' + options.url


        // 限制用户的访问权限
        options.complete = function (xhr) {
            /******** 判断响应的数据，来确定用户的登录状态 ********/
            if (xhr.responseJSON.status === 1 && xhr.responseJSON.message === '身份认证失败！') {
                // 清除token
                localStorage.removeItem('token')
                // 强制跳转到后台登录页
                location.href = '/login.html'
            }
        }



    })