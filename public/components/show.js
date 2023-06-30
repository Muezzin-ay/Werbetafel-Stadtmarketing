

$.holdReady( true );


let socket = io();

socket.on('letsgo', (msg) => {
    console.log(msg.text);

    $('.slides').prepend(`
        <section data-auto-animate data-autoslide="2000">
        </section>
        <section data-auto-animate data-autoslide="2000">
            <h1>it's kinda cool</h1>
        </section>
        <section data-auto-animate data-autoslide="2000">
            <h1>it's kinda cool</h1>
            <h1>dating you, </h1>
        </section>
        <section data-auto-animate data-autoslide="10000">
            <h1>it's kinda cool</h1>
            <h1>dating you, </h1>
            <h1>${'[name]'}</h1>
        </section>
    `);

    Reveal.addEventListener('slidechanged', function (evt) {
        ind = Reveal.getIndices().h;
        if (ind == 4) {
            location.reload();
        }
    });

    Reveal.sync();
    Reveal.slide(0);


})


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
            //autoSlide: settings.AutoSlideDuration,
            loop: true,
            controls: true, //standart is false, debug -> true
            progress: false,
            controlsTutorial: false,
            // Settings for non pdf slides
            autoAnimateDuration: 0.8, //Maybe it is unnecessary
        });
        
    }); 
});
