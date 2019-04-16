import './index.css';
$(function() {
    setTimeout(function() {
        $("body").removeClass("ov");
    }, 300);
    htmlSize(750);
    //	移动端 点击 菜单按钮 展开/收起 导航层
    $('.x-header .menu-btn').on('click', function() {
        var hd = $('body');
        if (!hd.hasClass('menu-open')) {
            hd.addClass('menu-open');
        } else {
            hd.removeClass('menu-open');
        }
    });

    //	移动端 点击 导航链接 收起 弹出导航层（用于解决点击锚点导航在页面没刷新的情况下收起弹出的导航层）
    $('.navBg,.back a').on('click', function() {
        $('body').removeClass('menu-open');
    });

    //	移动端 点击 导航项的箭头 展开/收起 子级导航
    $('.nav-mod .arr').on('click', function() {
        var _this = $(this);
        var par = _this.closest('.nav-item');
        if (!par.hasClass('act')) {
            par.addClass('act').siblings('.nav-item').removeClass('act').children('.nav-lv').slideUp(0);
            _this.parent().siblings('.nav-lv').slideDown(200);
        } else {
            par.removeClass('act').children('.nav-lv').slideUp(200);
        }
    });

    if ($(".nav-mod.m-show .nav-lv2 .act").length >= 1) {
        $(".nav-mod.m-show .nav-lv2 .act").closest(".nav-lv2").show();
    }
});
/*	rem缩放函数	*/
function htmlSize(px) {
    foo();

    function foo() {
        var ww = $(window).width() < 320 ? 320 : $(window).width();
        if (ww > px) {
            $('html').css({
                'font-size': '.875rem'
            });
        } else {
            $('html').css({
                'font-size': (ww / px) * 100 + 'px'
            });
        }
    }
    $(window).on('resize', foo);
}