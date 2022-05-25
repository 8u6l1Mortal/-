    /******** ajax请求的预处理函数 ********/
    $.ajaxPrefilter(function (options) {
        // 给所有请求的url，拼接一个根地址
        options.url = 'http://www.liulongbin.top:3007' + options.url
    })