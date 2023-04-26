
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
      
        formData.append('image', file)
        xhr.send(formData)
    }
})


