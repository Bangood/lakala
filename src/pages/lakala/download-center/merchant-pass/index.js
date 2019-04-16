import './index.css';
import '../../../shared/component/nav/index';
import '../../../shared/component/footer/index';
$(function(){
    $('.timeline-icon').hover(function(){
        $(this).find('i:first').hide();
        $(this).find('img:first').removeClass('hide');

    },function(){
        $(this).find('i:first').show();
        $(this).find('img:first').addClass('hide');
    });
});