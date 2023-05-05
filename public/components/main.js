
/*
Button OnClick Functions
*/

// Swap Buttons from Presentation Element
function swapItemDown(el) {
    parent_el = $(el).parent().parent();
    parent_id = parent_el.attr('id');
    next_id = parent_el.next().attr('id');

    if (next_id) {
        console.log(next_id);
        $("#" + parent_id).before($("#" + next_id));
    }
}
function swapItemUp(el) {
    parent_el = $(el).parent().parent();
    parent_id = parent_el.attr('id');
    before_id = parent_el.prev().attr('id');

    if (before_id) {
        console.log(before_id);
        $("#" + parent_id).after($("#" + before_id));
    }
}


// Start executing...
$(document).ready( () => {

    generatePresentationItems();

    // Make the Presentation List sortable via Drag and Drop
    $('.main').sortable({
        animation: 150, //animation duration
        update: () => {
            $('#sequence-controls').attr('hidden', false); //Show saving button
        }
    });

    $('#save-sequence-button').click(() => {
        $('#save-sequence-button').addClass('disabled');
        
        //Send Presentation Order
        let orderData = [];
        $('.presentation-item').each((i, element) => {
            let preId = $(element).attr('id');
            orderData[i] = preId;
            console.log(i + ": " + preId);
        });

        $.post("/api/changeOrder", { sequence: orderData },
            (data, status) => {
                $('#sequence-ack').attr('hidden', false)
                window.setTimeout(() => {
                    $('#sequence-controls').attr('hidden', true); //hide saving button again
                    $('#save-sequence-button').removeClass('disabled');
                    $('#sequence-ack').attr('hidden', true)
                }, 3000); //feedback for 3s 
            }
        )
    })

})