


async function reloadPresentationItems() {
    await $('.presentation-item').each((i, element) => {
        $(element).remove();
    });
    generatePresentationItems();
}


function generatePresentationItems() {
    $.get('/api/getPr', (data, status) => {
        slides = JSON.parse(data);
        slides.forEach(element => {

            let date = new Date(element.presentation.createdAt);
            let firstSlide = element.slides[0];

            let presentationElement = $(
            `
            <li class="presentation-preview-item">
            <div id="${firstSlide.PFk}" class="presentation-item">
                <img src="/slides/Slide-Pr${firstSlide.PFk}-${firstSlide.ID}.png" height="216">
                <div class="presentation-description">
                    <div>
                        <h2>${element.presentation.Name}</h2>
                        <!--<h2>${firstSlide.PFk}</h2>-->
                    </div>
        
                    <div>
                        <p>Erstellungsdatum: ${date.toLocaleString()}</p>
                        <p>Firma: ${element.presentation.Creator}</p>
                    </div>
                </div>
                <div class="presentation-control">
                    <button class="btn btn-primary" onclick="swapItemUp(this)">UP</button>
                    <button class="btn btn-primary" onclick="swapItemDown(this)">DOWN</button>
                    <button class="btn btn-danger" onclick="deletePresentation(this)">Delete</button>
                    <button class="btn btn-primary" onclick="extendPresentationPreview(this)">More</button>
                </div>
            </div>
            <ul class="slide-preview"></ul>
            </li>
            `
            );

            let slidePreview = $(presentationElement).find('.slide-preview');
            $(slidePreview).hide();
            for (let i = 0; i < element.slides.length; i++) {
                let slideElement = $(`<li id=slide-${element.slides[i].ID}><img src="/slides/Slide-Pr${element.slides[i].PFk}-${element.slides[i].ID}.png"></li>`);
                $(slidePreview).append(slideElement);

                $(slideElement).first().append('<button class="slide-sort-button-left" onclick="swapSlideLeft(this)"><img src="/media/arrow-left.svg"></button>');
                $(slideElement).first().append('<button class="slide-sort-button-right" onclick="swapSlideRight(this)"><img src="/media/arrow-right.svg"></button>');
            };

            $('.main').append(presentationElement);
        });
    });
    //<img src="https://www.greenhero.de/media/image/fb/57/94/Shiba-Inu-hd_720x600.webp" height="216">    
}