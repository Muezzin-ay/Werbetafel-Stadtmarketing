

function generatePresentationItems() {
    $.get('/api/getPr', (data, status) => {
        slides = JSON.parse(data);
        slides.forEach(element => {
            id = element.ID;
            $('.main').append(
                `
                <li class="presentation-item" id="${id}">
                <img src="/slides/pr${element.PFk}/Slide${id}.JPG" height="216">
                    <div class="presentation-description">
                        <div>
                            <h2>Presentation Überschrift ${id}</h2>
                        </div>
            
                        <div>
                            <p>Erstellungsdatum: </p>
                            <p>Firma: </p>
                        </div>
                    </div>
                    <div class="presentation-control">
                        <button onclick="swapItemUp(this)">UP</button>
                        <button onclick="swapItemDown(this)">DOWN</button>
                    </div>
                </li>
                `
            );
        });
    });
    //<img src="https://www.greenhero.de/media/image/fb/57/94/Shiba-Inu-hd_720x600.webp" height="216">
        
}