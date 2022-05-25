// 入口函数
$(function () {
    /*
      --------------------需求分析------------------
         效果：限制后台首页的访问权限（用户未登录不能直接访问首页）
         方案：判断用户是否处于登录状态！--判断本地存储中是否有token--不行（token可以伪造）
         方案：判断ajax请求，返回的数据。
         步骤：
             1）
    */
    // if (localStorage.getItem('token') === null) {
    //     // 清除token
    //     localStorage.removeItem('token')
    //     // 强制跳转到后台登录页
    //     location.href = '/login.html'
    // }

    // alert('ok')
    /******** 获取用户信息 ********/
    getUserInfo()

    function getUserInfo() {
        // 调接口
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            // 携带请求头
            // headers: {
            //     Authorization: localStorage.getItem('token')
            // },
            success(res) {
                // 请求成功后，调用此函数
                console.log(res)
                // 判断是否获取用户信息成功
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, {
                        icon: 5
                    })
                }
                // 渲染
                renderAvatar(res.data)
            },
            // complete: function (xhr) {
            //     // 请求完成后，调用此函数
            //     // console.log('ok')
            //     // console.log(xhr) // ajax对象
            //     // console.log(xhr.responseText) // 服务器响应回来的数据（json字符串）
            //     // console.log(xhr.responseJSON) // 把响应的数据转成了对象
            //     /******** 判断响应的数据，来确定用户的登录状态 ********/
            //     if (xhr.responseJSON.status === 1 && xhr.responseJSON.message === '身份认证失败！') {
            //         // 清除token
            //         localStorage.removeItem('token')
            //         // 强制跳转到后台登录页
            //         location.href = '/login.html'
            //     }
            // }
        })
    }

    // 渲染头像和欢迎语的函数
    function renderAvatar(user) {
        console.log(user)
        // 渲染欢迎语（有nickname就用，没有nickname就用username）
        let name = user.nickname || user.username
        // console.log(name)
        $('#welcome').html('欢迎 ' + name)
        // 渲染头像（有图片头像则用，否则就用文字头像）
        if (user.user_pic) {
            // 有图片头像（文字头像隐藏，设置图片头像img的src）
            $('.text-avatar').hide()
            $('.layui-nav-img').prop('src', user.user_pic)
        } else {
            // 没有图片头像（图片头像img隐藏，设置文字头像）
            $('.layui-nav-img').hide()
            const first = name[0].toUpperCase()
            $('.text-avatar').html(first)
        }
    }

    /******** 退出登录 ********/
    $('#logout').on('click', function () {

        // 询问一下用户
        // const result = confirm('您确定要退出吗？')
        // // alert(result)
        // if (result) {
        //     // 清除token
        //     localStorage.removeItem('token')
        //     // 跳转到登录页
        //     location.href = '/login.html'
        // }
        // biu的询问框
        layui.layer.confirm('您确定要退出吗？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            // 清除token
            localStorage.removeItem('token')
            // 跳转到登录页
            location.href = '/login.html'

            layui.layer.close(index);
        });
    })

})