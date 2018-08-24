//code for navbar text effect
$(window).on('load',()=>{
    if(window.innerWidth<=600){
        $('.nav-text').text('CodePark');
        $('.nav-codepark-logo').removeClass('pt-3').addClass('pt-2');
        $('.codepark-logo').removeClass('codepark-logo-md').addClass('codepark-logo-sm');
        $('.nav-text').removeClass('pt-3').addClass('pt-2');
        $('.nav-user-image').removeClass('pt-2').addClass('pt-1','pb-1');
        $('.user-image').removeClass('avatar-small').addClass('avatar-v-small');
        // console.log(window.innerWidth);
    }else if(window.innerWidth>600 && window.innerWidth<700){
        $('.nav-text').addClass('text-truncate');
        console.log(window.innerWidth);
    }else if(window.innerWidth>=700){
        $('.nav-text').removeClass('text-truncate');
        console.log(window.innerWidth);
    }

    function linkify(text){
        if (text) {
            text = text.replace(/((https|http?\:\/\/)|(www\.))(\S+)(\w{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi,
                function(url){
                    var full_url = url;
                    if (!full_url.match('^https?:\/\/')) {
                        full_url = 'http://' + full_url;
                    }
                    return '<a href="' + full_url + '" target="_blank">' + url + '</a>';
                }
            );
        }
        return text;
    }
    //make text link
    $('.question-title').html(linkify($('.question-title').text()));
    $('.sub-question').html(linkify($('.sub-question').text()));
})

