// 入口函数
$(function () {
    // alert('ok')
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
    // --------------------------------------------------------------

    /******** 让用户选择新的图片文件 ********/
    /******** 单击“上传”按钮，弹出选择文件的对话框 ********/
    // 给上传按钮绑定click事件
    $('#btnChooseImage').on('click', function () {
        // 触发文件选择框的click事件
        $('#file').click()
    })

    /******** 当用户选择了新文件，则更换裁剪区域的图片 ********/
    // 给文件选择框绑定change事件
    $('#file').on('change', function () {
        // 获取用户选中的文件列表（文件选择框dom对象.files）
        const fileList = this.files
        // 判断用户是否选择了文件
        if (fileList.length <= 0) {
            return layui.layer.msg('请选择图片文件', {
                icon: 5
            })
        }
        // 获取用户选中的文件
        const file = fileList[0]
        // console.log(file)
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options)
    })

    /******** 单击“确定”按钮，裁剪图片并上传到服务器 ********/
    $('#btnUpload').on('click', function () {
        // 裁剪图片
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // console.log(dataURL)
        // 上传到服务器
        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
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
                // 更新父页面中的头像
                window.parent.getUserInfo()
            }
        })
    })
})