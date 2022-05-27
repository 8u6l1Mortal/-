// 入口函数
$(function () {
    // alert('ok')
    /******** 获取分类数据，渲染到页面 ********/
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success(res) {
                // console.log(res)
                // 判断
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, {
                        icon: 5
                    })
                }
                // 渲染数据到页面（模板引擎）
                const htmlStr = template('tpl-table', res)
                // console.log(htmlStr)
                $('tbody').html(htmlStr)
            }
        })
    }

    /******** 单击“添加类别”按钮，展示一个模态框 ********/
    // 声明一个变量，保存弹出层的索引
    let indexAdd
    $('#btnAddCate').on('click', function () {
        // 弹出一个模态框（让用户输入分类名和别名）
        indexAdd = layui.layer.open({
            // 弹出层的类型，1 页面层
            type: 1,
            // 标题
            title: '添加分类',
            // 宽高
            area: ['500px', '300px'],
            // 弹出层的内容
            // 把模板标签中的内容，作为弹出层的内容
            content: $('#dialog-add').html()
        })
    })

    /******** 添加分类（老一套） ********/
    // 模态框是动态渲染的，所以不能直接给添加分类的表单直接绑定事件（事件委托）
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        const data = $(this).serialize()
        // console.log(data)
        // 发送ajax请求，提交数据
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
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
                // 关闭模态框
                layui.layer.close(indexAdd)
                // 重新获取分类数据，重新渲染
                initArtCateList()
            }
        })
    })

    /******** 删除分类 ********/
    $('tbody').on('click', '.btn-delete', function () {
        // alert('ok')
        const id = $(this).attr('data-id')
        // console.log(id)
        // 询问
        layui.layer.confirm('您确定要删除此分类吗？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            // 调接口，完成分类的删除操作
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
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
                    // 重新渲染分类
                    initArtCateList()
                }
            })

            layui.layer.close(index);
        });
    })

    /******** 编辑分类 ********/
    let indexEdit
    // 单击编辑按钮，弹出编辑分类的模态框
    $('tbody').on('click', '.btn-edit', function () {
        // alert('kk')
        // 获取当前被编辑分类的id
        const id = $(this).attr('data-id')
        // alert(id)
        // 弹出模态框
        indexEdit = layui.layer.open({
            type: 1,
            title: '编辑分类',
            area: ['500px', '300px'],
            content: $('#dialog-edit').html()
        })
        // 获取分类数据，赋值到表单中
        $.ajax({
            url: '/my/article/cates/' + id,
            success(res) {
                // console.log(res)
                // 给表单赋值
                layui.form.val('form-edit', res.data)
            }
        })
    })
    // 老一套
    // 给编辑分类的表单，绑定submit提交事件（委托）
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        const data = $(this).serialize()
        // console.log(data)
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data,
            success(res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, {
                        icon: 5
                    })
                }
                layui.layer.msg(res.message, {
                    icon: 6
                })
                // 重新获取和渲染分类
                initArtCateList()
            }
        })
        // 关闭模态框
        layui.layer.close(indexEdit)
    })
})