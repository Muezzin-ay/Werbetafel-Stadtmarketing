

$.holdReady( true );


let socket = io();

socket.on('letsgo', (msg) => {
    console.log(msg.text);
})


$.get("/api/getSlides", (data, status) => {
    let presentations = JSON.parse(data);

    $('.slides').append(`
        <section data-auto-animate data-autoslide="2000">
            <h1>kinda cool</h1>
        </section>
        <section data-auto-animate data-autoslide="2000">
            <h1>kinda cool</h1>
            <h1>dating you, </h1>
        </section>
        <section data-auto-animate data-autoslide="2000">
            <h1>kinda cool</h1>
            <h1>dating you, </h1>
            <h1>${'[name]'}</h1>
        </section>
    `);

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
            // Settings for non pdf slides
            autoAnimateDuration: 0.8, //Maybe it is unnecessary
        });
        
    }); 
});
