

$.holdReady( true );

$.get("/api/getSlides", (data, status) => {
    slides = JSON.parse(data);
    slides.forEach(element => {
        console.log(element);
        $('.slides').append(`<section data-background="/slides/pr${element.PFk}/Slide${element.ID}.JPG"></section>`);
    });
    $.holdReady( false );
    
});



$(document).ready( () => {
    Reveal.initialize({
        autoSlide: 10000,
        loop: true,
        controls: false, //standart is false, debug -> true
        progress: false,
        controlsTutorial: false,
    });
});
