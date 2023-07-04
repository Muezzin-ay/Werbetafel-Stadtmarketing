

function createMsgTemplate(msgLines) {
    let template = '';
    let lastSection = '';
    let autoSlideTime = 2000;

    msgLines.unshift(''); //First Entry is always empty

    msgLines.forEach((line, i, lines) => {
        lastSection += '<h1>' + line + '</h1>';
        if (i == lines.length - 1) autoSlideTime = 10000;
        template += `<section data-auto-animate data-autoslide="${autoSlideTime}">${lastSection}</section>`;
    })
    return template
}



$.holdReady( true );


let socket = io();

socket.on('letsgo', (msg) => {
    let msgLines = msg.text.split('\n');
    let template = createMsgTemplate(msgLines);

    $('.slides').prepend(template);

    Reveal.addEventListener('slidechanged', function (evt) {
        ind = Reveal.getIndices().h;
        if (ind == msgLines.length + 1) {
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
