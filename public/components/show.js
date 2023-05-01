

$.holdReady( true );

$.get("/api/getSlides", (data, status) => {
    slides = JSON.parse(data);
    slides.forEach(element => {
        console.log(element);
        $('.slides').append(`<section data-background="/slides/Slide-Pr${element.PFk}-${element.ID}.png"></section>`);
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
