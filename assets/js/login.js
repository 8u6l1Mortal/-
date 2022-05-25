// 入口函数
$(function () {
    // /******** ajax请求的预处理函数 ********/
    // $.ajaxPrefilter(function (options) {
    //     // 给所有请求的url，拼接一个根地址
    //     options.url = 'http://www.liulongbin.top:3007' + options.url
    // })
    // alert('ok')
    /*
      --------------------需求分析------------------
         效果：单击“去注册”展示注册表单，单击“去登录”显示登录表单
         步骤：
             1）给”去注册“按钮绑定click事件
             2）把注册表单显示，把登录表单隐藏
             3）给”去登录“按钮绑定click事件
             4）把注册表单隐藏，把登录表单显示
    */
    $('#link_reg').on('click', function () {
        $('.reg-box').show()
        $('.login-box').hide()
    })

    $('#link_login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })
    // --------------------------------------------------------------
    // 自定义表单的校验规则
    layui.form.verify({
        // 规则名: 规则的定义
        pwd: [
            // 密码必须是6-12位的非空字符
            /^\S{6,12}$/,
            '密码必须是6-12位的非空字符！'
        ],
        repwd: function (value, item) {
            // value，使用该规则的表单项的value
            // item，使用该规则的表单项的dom对象
            // console.log(value)
            // console.log(item)
            // 校验密码和确认密码（value的值）必须一致
            // 获取密码框的值
            const pwd = $('#form_reg [name=password]').val().trim()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })
    /*
      --------------------需求分析------------------
         效果：注册用户（把用户信息提交给接口服务器）---form表单+ajax
         步骤：
             1）给表单注册submit提交事件
             2）阻止表单的默认提交行为
             3）收集表单数据
             4）发送ajax请求，提交数据
    */
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        // alert('ok')
        const username = $('#form_reg [name=username]').val().trim()
        const password = $('#form_reg [name=password]').val().trim()
        const repassword = $('#form_reg [name=repassword]').val().trim()

        // console.log(username, password, repassword)
        // 校验数据
        // if (username.length <= 0 || password.length <= 0 || repassword.length <= 0) {
        //     return alert('数据不完整！')
        // }
        // 发送ajax请求
        $.ajax({
            method: 'post',
            // url: 'http://www.liulongbin.top:3007/api/reguser',
            url: '/api/reguser',
            // data: {
            //     // username:username,
            //     // 属性的简写
            //     username,
            //     password
            // },
            data: $(this).serialize(),
            // success: function(){},
            success(res) {
                console.log(res)
                // 判断注册是否成功
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, {
                        icon: 5
                    })
                }
                layui.layer.msg(res.message, {
                    icon: 6
                })
                // 显示登录表单，隐藏注册表单
                $('#link_login').click()
            }
        })
    })

    /*
      --------------------需求分析------------------
         效果：登录功能
         步骤：
             1）老一套
    */
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        const data = $(this).serialize()
        // console.log(data)
        // 校验数据
        // ajax请求
        $.ajax({
            method: 'post',
            // url: 'http://www.liulongbin.top:3007/api/login',
            url: '/api/login',
            // data: data,
            // 简写
            data,
            success(res) {
                console.log(res)
                // 判断登录是否成功
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, {
                        icon: 5
                    })
                }
                layui.layer.msg(res.message, {
                    icon: 6
                }, function () {
                    // 消息框，关闭后的回调函数
                    // 把登录成功之后的token数据，保存到本地存储中
                    localStorage.setItem('token', res.token)
                    // 跳转到后台首页
                    location.href = '/index.html'
                })

            }
        })
    })
})