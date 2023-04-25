
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
        change: () => {
            console.log("hello");
        }
    });

})