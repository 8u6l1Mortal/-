// 入口函数
$(function () {
    // alert('ok')
    layui.form.verify({
        pwd: [
            /^\S{6,12}$/,
            '密码必须是6-12位的非空字符！'
        ],
        // 新旧密码不能一致
        samePwd: function (value, item) {
            // value 新密码的值
            // 获取旧密码
            const oldPwd = $('[name=oldPwd]').val()
            // 新旧密码比较
            if (value === oldPwd) {
                return '新旧密码不能一致！'
            }
        },
        // 两次新密码必须一致
        rePwd: function (value, item) {
            // value 确认新密码的值
            // 获取新密码的值
            const newPwd = $('[name=newPwd]').val()
            // 比较两次密码
            if (value !== newPwd) {
                return '两次密码不一致！'
            }
        }
    })

    // 老一套
    $('form').on('submit', function (e) {
        e.preventDefault()
        const data = $(this).serialize()
        // console.log(data)
        // 校验数据（layui中的表单验证）
        // 发送ajax请求
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            data,
            success(res) {
                // console.log(res)
                // 判断重置密码是否成功
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, {
                        icon: 5
                    })
                }
                layui.layer.msg(res.message, {
                    icon: 6
                })
            }
        })
    })
})