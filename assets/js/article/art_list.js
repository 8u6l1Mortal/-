// 入口函数
$(function () {
    // alert('ok')
    /******** 模板引擎的过滤器函数，处理日期时间 ********/
    template.defaults.imports.dateFormat = function (val) {
        const dt = new Date(val)

        const y = dt.getFullYear()
        const m = padZero(dt.getMonth() + 1)
        const d = padZero(dt.getDate())

        const hh = padZero(dt.getHours())
        const mm = padZero(dt.getMinutes())
        const ss = padZero(dt.getSeconds())

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
    // 补零的函数
    function padZero(n) {
        return n < 10 ? '0' + n : n
    }

    /******** 定义一个变量，保存参数 ********/
    const q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: '',
    }

    /******** 获取文章数据，渲染到页面 ********/
    getArticleList()

    function getArticleList() {
        $.ajax({
            url: '/my/article/list',
            // data: {
            //     pagenum: 1,
            //     pagesize: 2,
            //     cate_id: '',
            //     state: '',
            // },
            data: q,
            success(res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, {
                        icon: 5
                    })
                }
                // 渲染数据（模板引擎）
                const htmlStr = template('tpl-list', res)
                // console.log(htmlStr)
                $('tbody').html(htmlStr)
                /******** 渲染分页按钮 ********/
                renderPage(res.total)
            }
        })
    }
    // --------------------------------------------------------------
    /******** 分页功能 ********/
    /*
      --------------------需求分析------------------
         效果：
         步骤：
             1）展示分页按钮。（总条数和每页显示条数）
             2）单击分页按钮，切换文章数据。
    */
    // 渲染分页按钮的函数
    function renderPage(total) {
        layui.laypage.render({
            // 存放分页按钮的盒子的id，没有#
            elem: 'pageBox',
            // 数据的总数
            count: total,
            // 每页显示的条数
            limit: q.pagesize,
            // 当前的页码
            curr: q.pagenum,
            // 自定义分页按钮的排版
            layout: ['page', 'next', 'prev', 'count', 'skip', 'limit'],
            // 设置每页显示的条数（下拉列表）
            limits: [2, 4, 6, 8, 10],
            /* 
                切换分页的回调函数
                1）切换分页按钮时，会执行此函数
                2）在生成分页按钮时，也会执行此函数
            */
            jump: function (obj, first) {

                // obj 当前的最新分页配置选项
                // first，渲染分页按钮调用的jump值则为true，如果单击按钮调用的jump值则为undefined

                // console.log(obj)
                // console.log(first)
                // 只有切换按钮时，才让执行下面的代码，渲染按钮时，不执行下面的代码。
                // if (first !== true) {
                if (!first) {
                    /******** 切换文章数据 ********/
                    // 获取当前最新的页码
                    // console.log(obj.curr)
                    // 修改查询参数q
                    q.pagenum = obj.curr

                    // 获取当前每页显示的条数，修改查询参数q
                    q.pagesize = obj.limit
                    // 重新获取并渲染文章数据
                    getArticleList()
                }
            }
        })
    }

    /******** 根据文章的分类和所属状态，进行文章筛选 ********/
    /*
      --------------------需求分析------------------
         效果： 根据文章的分类和所属状态， 进行文章筛选
         步骤：
             1）获取所有的分类数据，展示到下拉列表中。
             2）单击筛选按钮，根据选中的分类和状态，重新获取并渲染文章数据
    */
    initCate()

    function initCate() {
        // 获取所有的分类数据
        $.ajax({
            url: '/my/article/cates',
            success(res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, {
                        icon: 5
                    })
                }
                // 渲染
                const htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 重新渲染下拉列表
                layui.form.render()
            }
        })
    }

    // 筛选（老一套）
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取选中的分类id，修改查询参数q
        const cate_id = $('[name=cate_id]').val()
        // 获取选中的状态，修改查询参数q
        const state = $('[name=state]').val()

        q.cate_id = cate_id
        q.state = state

        // 重新获取文章并渲染
        getArticleList()
    })

    /*
      --------------------需求分析------------------
         效果：删除文章
         步骤：
             1）给删除按钮绑定点击事件（委托）
             2）获取当前文章的id
             3）询问
             4）调接口
             5）重新获取文章并渲染
    */
    $('tbody').on('click', '.btn-delete', function () {
        // 统计“删除按钮”的数量
        const len = $('.btn-delete').length

        // alert('ok')
        const id = $(this).attr('data-id')
        // console.log(id)
        // 询问
        layui.layer.confirm('您确定要删除此文章吗？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            // 调接口
            $.ajax({
                url: '/my/article/delete/' + id,
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
                    // 判断当前删除的文章是不是最后一个
                    if (len === 1) {
                        // 判断当前是不是第1页
                        // if (q.pagenum > 1) {
                        //     q.pagenum--
                        // }
                        // 短路运算
                        q.pagenum > 1 && q.pagenum--
                    }

                    // 重新获取和渲染文章数据
                    getArticleList()
                }
            })

            layui.layer.close(index)
        })

    })


})