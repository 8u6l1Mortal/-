// 入口函数
$(function () {
    // alert('ok')
    /*
      --------------------需求分析------------------
         效果：把用户信息先展示到表单中，让用户改，提交给服务器。
         步骤：
             1）获取用户信息
             2）把用户信息展示到表单中
             3）把用户修改后的内容，提交给服务器
                老一套！

    */
    initUserInfo()

    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success(res) {
                // console.log(res)
                // 判断是否获取成功
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, {
                        icon: 5
                    })
                }
                // 把用户信息展示到表单中（给表单项赋值）
                // $('input[name=username]').val(res.data.username)
                // $('input[name=nickname]').val(res.data.nickname)
                // $('input[name=email]').val(res.data.email)
                // 使用layui.form.val()进行表单赋值
                // layui.form.val('formUserInfo', {
                //     username: '二狗',
                //     nickname: 'ergou',
                //     email: 'abc@qq.com'
                // })
                layui.form.val('formUserInfo', res.data)
            }
        })
    }

    /******** 自定义表单校验规则 ********/
    layui.form.verify({
        // 规则名称: 规则定义
        nickname: function (value, item) {
            if (value.length > 6) {
                return '昵称必须是1-6个字符！'
            }
        }
    })

    // 老一套
    $('form').on('submit', function (e) {
        e.preventDefault()
        const data = $(this).serialize()
        console.log(data)
        // 校验表单数据
        // 发送ajax请求
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data,
            success(res) {
                // console.log(res)
                // 判断
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, {
                        icon: 5
                    })
                }
                layui.layer.msg(res.message, {
                    icon: 6
                })
                /******** 更新欢迎语 ********/
                // console.log(window) // 当前页面的窗口对象user_info.html
                // console.log(window.parent) // 父页面的窗口对象 index.html
                // 全局作用域的变量和函数，都是window对象的属性和方法
                // 调用父页面中的获取用户信息的函数
                window.parent.getUserInfo()
            }
        })
    })

    /*
      --------------------需求分析------------------
         效果：单击重置按钮，恢复表单用户信息。
         步骤：
             1）
    */
    $('#btnReset').on('click', function (e) {
        // 阻止重置按钮的默认行为
        e.preventDefault()
        // 重新获取用户信息，重新展示到表单中
        initUserInfo()
    })
})