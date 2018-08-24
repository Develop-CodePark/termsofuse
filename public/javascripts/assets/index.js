//code for navbar text effect
//nav effect
if(window.innerWidth<=700){
    $('.nav-text').text('');
    // console.log(window.innerWidth);
}else if(window.innerWidth>700 && window.innerWidth<900){
    $('.nav-text').addClass('text-truncate');
    console.log(window.innerWidth);
}else if(window.innerWidth>=900){
    $('.nav-text').removeClass('text-truncate');
    console.log(window.innerWidth);
}
//scroll effect
$(window).scroll(function() {
    var hT = $('section').offset().top,
        wS = $(this).scrollTop();
    // console.log(wS - hT)
    if (wS > 200){
        $('nav').height(70);
    }else{
        $('nav').height(80);
    }
    if(window.innerWidth>700){
        if (wS - hT>= 225){
            $('.nav-text').text('We are CodePark');
        }else{
            $('.nav-text').text('');
        }
    }
});
//bulger effect
$('#bulger').on('click mouseover',()=>{
    $('#side-bar').show();
})

//close login modal on click
$('#fp-link').on('click',()=>{
    $('#loginModal').modal('hide');
})

$('.nav-burger').on('click',()=>{
    var sidebar = $('.sidenav').width()=== '0px' ? '250px' : '0px';
    $('.sidenav').css({
        'width' : sidebar
    });
    $('body').css({
        'opacity' : '0.8'
    });
})

function openNav() {
    const sidebar = $('.sidenav').width() === 0 ? '250px' : '0px';
    const opacity = window.getComputedStyle(document.getElementsByClassName("render-pad")[0],null).getPropertyValue("opacity") == 1 ? 0.3 : 1;
    const blurValue = opacity == 1 ? 'blur(0px)' : 'blur(5px)';
    $('.sidenav').css({
        'width' : sidebar
    });
    $('.render-pad').css({
        'opacity' : opacity,
        'filter': blurValue,
        '-webkit-filter': blurValue /* Safari 6.0 - 9.0 */
    });
}

//to close the sidenav when any element is clicked
$('a').on('click',()=>{
    $('.sidenav').css({
        'width' : '0px'
    });
})
$(document.body).click( function() {
    $('.sidenav').css({
        'width' : '0px'
    });
});

function scrollTop(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}