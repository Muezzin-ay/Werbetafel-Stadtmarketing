
// FROM https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/


$(document).ready( () => {


    $('#upload-button').click(uploadFile); //Give Upload Button its function
    $('#green-ack').hide();

    // Global Var
    var FileToUpload = undefined;

    let dropArea = document.getElementById('drop-area')

    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false)
    })
    

    function preventDefaults (e) {
        e.preventDefault()
        e.stopPropagation()
    }

    ;['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false)
    })

    ;['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false)
    })

    function highlight(e) {
        dropArea.classList.add('highlight')
    }

    function unhighlight(e) {
        dropArea.classList.remove('highlight')
    }

    dropArea.addEventListener('drop', handleDrop, false)

    function handleDrop(e) {
        let dt = e.dataTransfer
        let files = dt.files

        handleFiles(files)
    }

    function handleFiles(files) {
        FileToUpload = files[0];
        $('#upload-button').removeClass('disabled');
    }


    function uploadFile() {
        $('#upload-button').addClass('disabled');

        let file = FileToUpload; //Secure, because button is disabled

        var formData = new FormData()
        formData.append('pdf-file', file)

        let prName = $('#presentation-name').val();
        if (prName == "") {
            prName = "Kampagne";
        };
        let prCompany = $('#presentation-company').val();
        if (prCompany == "") {
            prCompany = "Unbekannt";
        };
        formData.append('presentationInfo', JSON.stringify({name: prName, company: prCompany}));
        
        var last_response_len = false;
        $.ajax({
            url: '/api/upload',
            dataType: 'script',
            cache: false,
            contentType: false,
            processData: false,
            data: formData,                         
            type: 'post',
            xhrFields: {
                onprogress: function(e)
                {
                
                    // Completes streamed string
                    let this_response, response = e.currentTarget.response;
                    if(last_response_len === false)
                    {
                        this_response = response;
                        last_response_len = response.length;
                    }
                    else
                    {
                        this_response = response.substring(last_response_len);
                        last_response_len = response.length;
                    }
                    handleUploadFeedback(this_response);
                    // End
                }
            },
            success: () => {
                $('#upload-button').html('Abschicken');
                $('#upload-spinner').css('visibility', 'hidden');
                $('#green-ack').show();
                window.setTimeout(() => {
                    $('#green-ack').hide();
                }, 3000); //feedback for 3s 

                reloadPresentationItems()

            }
        });
    }



    function handleUploadFeedback(response) {
        const messages = ['Hochladen...', 'Konvertieren...', 'Aufräumen...']
        let statusInfo = messages[0];
        if (response.includes('data: {"done":false,"progress":1}')) {
            statusInfo = messages[1];
        } else if(response.includes('data: {"done":false,"progress":2}')) {
            statusInfo = messages[2];
        }
        $('#upload-button').html(statusInfo);
        $('#upload-spinner').css('visibility', 'visible');
    }
})


