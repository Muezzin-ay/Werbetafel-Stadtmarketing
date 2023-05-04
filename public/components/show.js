

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
    $.get('/api/getSettings', (data, status) => {
        settings = JSON.parse(data);

        Reveal.initialize({
            autoSlide: settings.AutoSlideDuration,
            loop: true,
            controls: false, //standart is false, debug -> true
            progress: false,
            controlsTutorial: false,
        });
        
    }); 
});
