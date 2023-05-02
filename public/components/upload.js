
// FROM https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/


$(document).ready( () => {
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
        ([...files]).forEach(uploadFile)
    }

    /* //Old Code
    function uploadFile(file) {
        console.log("uploading!");
        var url = '/api/upload'
        var xhr = new XMLHttpRequest()
        var formData = new FormData()
        xhr.open('POST', url, true)
      
        xhr.addEventListener('readystatechange', function(e) {
          if (xhr.readyState == 4 && xhr.status == 200) {
            // Done. Inform the user
          }
          else if (xhr.readyState == 4 && xhr.status != 200) {
            // Error. Inform the user
          }
        })
      
        formData.append('pdf-file', file)
        xhr.send(formData)
    }
    */


    function uploadFile(file) {
        var formData = new FormData()
        formData.append('pdf-file', file)

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
                    var this_response, response = e.currentTarget.response;
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
                    console.log(this_response);
                    handleUploadFeedback(this_response);
                    // End
                }
            }
        });
    }



    function handleUploadFeedback(response) {
        let statusInfo = response;
        $('#status-text').text(statusInfo);
    }
})


