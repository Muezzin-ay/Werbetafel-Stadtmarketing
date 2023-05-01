

function generatePresentationItems() {
    $.get('/api/getPr', (data, status) => {
        slides = JSON.parse(data);
        slides.forEach(element => {

            let date = new Date(element.presentation.createdAt);


            $('.main').append(
                `
                <li class="presentation-item" id="${element.slide.ID}">
                <img src="/slides/pr${element.slide.PFk}/slide-${element.slide.ID}.png" height="216">
                    <div class="presentation-description">
                        <div>
                            <h2>${element.presentation.Name}</h2>
                        </div>
            
                        <div>
                            <p>Erstellungsdatum: ${date.toLocaleString()}</p>
                            <p>Firma: ${element.presentation.Creator}</p>
                        </div>
                    </div>
                    <div class="presentation-control">
                        <button class="btn btn-primary" onclick="swapItemUp(this)">UP</button>
                        <button class="btn btn-primary" onclick="swapItemDown(this)">DOWN</button>
                    </div>
                </li>
                `
            );
        });
    });
    //<img src="https://www.greenhero.de/media/image/fb/57/94/Shiba-Inu-hd_720x600.webp" height="216">
        
}