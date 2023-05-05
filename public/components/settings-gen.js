

var settings = undefined;


function loadSettings() {
    $.get('/api/getSettings', (data, status) => {
        settings = JSON.parse(data);
        $('#AutoSlideDuration').val(settings.AutoSlideDuration);
    });
}


$(document).ready( () => {

    loadSettings();
    let s = $('#checkbox-lol').attr('checked');

    $('#save-settings-button').click( () => {

        $('#save-settings-button').addClass("disabled");

        $.post("/api/changeSettings", { settings: settings },
            (data, status) => {
                $('#settings-ack').css('visibility', 'visible');
                window.setTimeout(() => {
                    $('#settings-ack').css('visibility', 'hidden');
                }, 3000); //feedback for 3s 
            }

        ).fail( (status, data) => { // Datatype is not allowed
            loadSettings(); //Load in the old settings with new request
        });
    });

    $('.setting').each((i, element) => {
        $(element).change(() => {
            let element_id = $(element).attr('id');
            settings[element_id] = $(element).val();
            $('#save-settings-button').removeClass('disabled');
        })
    });

    


});