function fixedNav(){
 var header = $("header"),
    stackOffset = $('#stack').offset().top,
    projectsOffset = $('#projects').offset().top,
    contactOffset = $('#contact').offset().top,
    thisScrollTop = $(this).scrollTop()
    ;

    if(thisScrollTop > stackOffset - ($(window).height()/2)){
        if(!header.hasClass('nav-fixed')){
            header.hide().toggleClass('nav-fixed',true).fadeIn();
        }
    }else if(header.hasClass('nav-fixed')){
		header.toggleClass('nav-fixed',false);
    }

	var x = (header.hasClass('nav-fixed')) ? header.outerHeight() + 50 : 0;

	if(thisScrollTop + x > contactOffset - 200 ){
        header.find(".active").removeClass("active");
        header.find("[data-nav='contact']").closest('li').toggleClass('active',true);
	}else
	if(thisScrollTop + x > projectsOffset){
		header.find(".active").removeClass("active");
        header.find("[data-nav='projects']").closest('li').toggleClass('active',true);
	}else
	if(thisScrollTop + x > stackOffset){
		header.find(".active").removeClass("active");
        header.find("[data-nav='stack']").closest('li').toggleClass('active',true);
	}else{
		header.find(".active").removeClass("active");
	    header.find("[data-nav='intro']").closest('li').toggleClass("active",true);
	}




}

$(document).ready(function(){
	//nav smooth scroll
    $('.nav.navbar-nav>li>a[href^="#"]').on('click',function (e) {
        e.preventDefault();
        var target = this.hash;
        var $target = $(target);
        var header = $("header");

        var s = (target === '#intro') ? 0 : ($target.offset().top - header.outerHeight());
        $('html, body').stop().animate({
            'scrollTop':  s
        },
        {
            duration : 900,
            complete : function () {
               window.location.hash = target;
            }
        });



    });

    //fixed nav
    $(window).scroll(function(){
        fixedNav()
    });

    //send message
    $('.submitMessage').on('click',function(){
        var n = $('.contact-name').val(),
            e = $('.contact-email').val(),
            p = $('.contact-phone').val(),
            m = $('.contact-message').val()
            ;

         if(!n.length || !e.length || !m.length){
            return false;
         }

         var x = "Hi Jobo, "+
         "I'm "+n+
         " "+m+
         " "+
         "You can contact me at : "+e+
         "   "+p
         ;

       window.location.href = "mailto:jobodanque@gmail.com?subject="+n+"&body="+x+"";
       return false;
    });
});