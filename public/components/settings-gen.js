

var settings = undefined;


function uploadSettings() {
    $.post("/api/changeSettings",
        {
            settings: settings
        },
        (data, status) => {
            console.log(data);
    });
}


$(document).ready( () => {

    $('.setting').each((i, element) => {
        $(element).on('change', () => {
            let element_id = $(element).attr('id');
            settings[element_id] = $(element).val();
            uploadSettings();
        })
    });

    $.get('/api/getSettings', (data, status) => {
        settings = JSON.parse(data);
        $('#AutoSlideDuration').val(settings.AutoSlideDuration);
    });


});