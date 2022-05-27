// 入口函数
$(function () {
    // alert('ok')
    /******** 1-获取分类的数据，渲染到下拉列表 ********/
    initCate()

    function initCate() {
        // 获取分类数据
        $.ajax({
            url: '/my/article/cates',
            success(res) {
                console.log(res)
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, {
                        icon: 5
                    })
                }
                // 渲染数据到下拉列表
                const htmlStr = template('tpl-cate', res)
                // console.log(htmlStr)
                $('[name=cate_id]').html(htmlStr)
                // 重新渲染一下下拉列表（option是动态插入的）
                layui.form.render()
            }
        })
    }

    /******** 初始化富文本编辑器 ********/
    // 初始化富文本编辑器
    initEditor()

    /******** 初始化裁剪区域 ********/
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    /******** 单击“选择封面”按钮，弹出文件选择的对话框 ********/
    $('#btnChooseImage').on('click', function () {
        // 触发文件选择框的click事件
        $('#coverFile').click()
    })

    /******** 选择新的图片文件，更换裁剪区域的图片 ********/
    $('#coverFile').on('change', function () {
        // 获取用户选中的文件列表
        const fileList = this.files
        // 判断用户是否选择了文件
        if (fileList.length <= 0) {
            return layui.layer.msg('请选择文件', {
                icon: 5
            })
        }
        // 获取选中的文件
        const file = fileList[0]
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    /******** 准备文章状态数据 ********/
    let state = '已发布'
    $('#btnSave2').on("click", function () {
        state = '草稿'
    })

    /******** 发布文章（老一套） ********/
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 使用FormData收集表单数据
        const fd = new FormData(this)

        // 把文章状态数据，追加到fd中
        fd.append('state', state)

        // fd.forEach(function (value, key) {
        //     console.log(value, key)
        // })
        // 裁剪图片（异步操作），二进制文件，追加到fd中
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 裁剪图片成功后的回调函数
                // console.log(blob)
                fd.append('cover_img', blob)
                // fd.forEach(function (value, key) {
                //     console.log(value, key)
                // })
                // 调接口，发布文章
                publishArticle(fd)

            })
    })

    // 发布文章的函数
    function publishArticle(fd) {
        // 发送ajax请求
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            // 不设置请求头
            contentType: false,
            // 不把数据转成键值对字符串
            processData: false,
            success(res) {
                console.log(res)
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, {
                        icon: 5
                    })
                }
                layui.layer.msg(res.message, {
                    icon: 6
                }, function () {
                    // 跳转到文章列表页
                    // location.href = '/article/art_list.html'
                    // 获取到父页面index.html中“文章列表”按钮，触发其click事件
                    window.parent.document.querySelector('#article_list').click()
                    /* 
                        老年人知道的小经验：
                            触发a标签的点击事件，比较特殊。<a href="http://www.itheima.com">黑马程序员</a>

                            1）得用dom对象触发
                            2）jq代码不能直接触发a链接跳转（触发a链接的子元素）
                    
                    */
                })

            }
        })
    }

})