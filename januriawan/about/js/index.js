var buttons = $('.main-nav__item');
buttons.bind('click', function(){
   if(!$(this).hasClass('active')) {
       $('.main-nav__item.active').removeClass('active');
       $(this).addClass('active');
   }
});