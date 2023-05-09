


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

            $('.main').append(
                `
                <li class="presentation-preview-item">
                <div id="${element.slide.PFk}" class="presentation-item">
                    <img src="/slides/Slide-Pr${element.slide.PFk}-${element.slide.ID}.png" height="216">
                    <div class="presentation-description">
                        <div>
                            <!--<h2>${element.presentation.Name}</h2>-->
                            <h2>${element.slide.PFk}</h2>
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
                <ul class="slide-preview">
                    <li>
                        <img src="https://www.greenhero.de/media/image/fb/57/94/Shiba-Inu-hd_720x600.webp">
                    </li>
                    <li>
                        <img src="https://www.greenhero.de/media/image/fb/57/94/Shiba-Inu-hd_720x600.webp">
                    </li>
                    <li>
                        <img src="https://www.greenhero.de/media/image/fb/57/94/Shiba-Inu-hd_720x600.webp">
                    </li>
                    <li>
                        <img src="https://www.greenhero.de/media/image/fb/57/94/Shiba-Inu-hd_720x600.webp">
                    </li>
                    <li>
                        <img src="https://www.greenhero.de/media/image/fb/57/94/Shiba-Inu-hd_720x600.webp">
                    </li>
                    <li>
                        <img src="https://www.greenhero.de/media/image/fb/57/94/Shiba-Inu-hd_720x600.webp">
                    </li>
                </ul>
                </li>
                `
            );

            $('.slide-preview').each((i, element) => {
                $(element).hide();
            });
        });
    });
    //<img src="https://www.greenhero.de/media/image/fb/57/94/Shiba-Inu-hd_720x600.webp" height="216">    
}