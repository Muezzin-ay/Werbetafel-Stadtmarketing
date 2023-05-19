
/*
Button OnClick Functions
*/

// Swap Buttons from Presentation Element
//Maybe unsecure and bugged
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
// End bugged part


function deletePresentation(el) {
    let parent_el = $(el).parent().parent();
    let preID = parent_el.attr('id');
    $.post("/api/deletePresentation", { presentationInfo: {presentationID: parseInt(preID)} },
        (data, status) => {
            reloadPresentationItems();
        }
    )
}

function tooglePresentationPreview(el) {
    let parent_el = $(el).parent().parent().parent();
    let slidePreviewBox = $(parent_el).find('.slide-preview');
    $(slidePreviewBox).toggle();
}



function swapSlideLeft(el) {
    let parenEl = $(el).parent();
    let parentId = parenEl.attr('id');
    let nextId = parenEl.prev().attr('id');
    if (nextId) {
        $('#' + parentId).after($("#" + nextId));
    };
    uploadSlideSequence($(parenEl).parent().parent());
}

function swapSlideRight(el) {
    let parenEl = $(el).parent();
    let parentId = parenEl.attr('id');
    let nextId = parenEl.next().attr('id');
    if (nextId) {
        $('#' + parentId).before($("#" + nextId));
    };
    uploadSlideSequence($(parenEl).parent().parent());
}


function uploadSlideSequence(presentationPreviewElement) {
    let slideSequence = findSlideSequence(presentationPreviewElement);
    $.post('/api/changeSlideSequence', {slideSequence: slideSequence}, (data, status) => {
        if (status != 'success') {
            console.log("Something went wrong in uploading new slide sequence!")
        };
    });
}


function findSlideSequence(presentationElement) {
    let slideSequence = {
        presentationID: $(presentationElement).find('.presentation-item').attr('id'),
        slides : []
    };
    let slidePreviewElement = $(presentationElement).find('.slide-preview');
    $(slidePreviewElement).find('.slide-element').each((i, el) => {
        let slideID = $(el).attr('id');
        slideSequence.slides.push({ position: i, id: slideID });
    });
    return slideSequence
}



// Start executing...
$(document).ready( () => {

    var waitingForSaving = false;

    generatePresentationItems();

    // Make the Presentation List sortable via Drag and Drop
    $('.main').sortable({
        animation: 150, //animation duration
        handle: (el) => {
            let slidePreviewBox = $(el).find('.slide-preview');
            $(slidePreviewBox).hide();
        },
        update: () => {
            waitingForSaving = true;
            $('#save-sequence-button').css('visibility', 'visible'); //Show saving button
            $('#save-sequence-button').removeClass('disabled');
            $('#sequence-controls').attr('hidden', false);
        }
    });

    $('#save-sequence-button').click(() => {
        $('#save-sequence-button').addClass('disabled'); 

        //Send Presentation Order
        let orderData = [];
        $('.presentation-item').each((i, element) => {
            let preId = $(element).attr('id');
            orderData[i] = preId;
        });

        $.post("/api/changeOrder", { sequence: orderData },
            (data, status) => {
                $('#sequence-ack').attr('hidden', false);

                waitingForSaving = false;
                window.setTimeout(() => {
                    if (!waitingForSaving) {
                        $('#sequence-controls').attr('hidden', true);
                    };
                    $('#sequence-ack').attr('hidden', true);
                }, 3000); //feedback for 3s 
            }
        )
    })

})