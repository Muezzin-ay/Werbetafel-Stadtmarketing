

$.holdReady( true );

$.get("/api/getSlides", (data, status) => {
    let presentations = JSON.parse(data);
    presentations.forEach(slides => {
        slides.forEach(slide => {
            $('.slides').append(`<section data-background="/slides/Slide-Pr${slide.PFk}-${slide.ID}.png"></section>`);
        });
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
