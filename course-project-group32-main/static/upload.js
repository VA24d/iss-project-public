if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  // Dark mode is enabled
  console.log("Dark mode is enabled in the browser.");
  document.body.classList.add("dark");
} else {
  // Dark mode is not enabled
  console.log("Dark mode is not enabled in the browser.");
  if (document.body.classList.contains("dark")) {
    document.body.classList.remove("dark");
  }
}

function toggleDarkMode() {
  var element = document.body;
  element.classList.toggle("dark");

  if (element.classList.contains("dark")) {
    darkModeButton.innerText = "Light Mode";
  } else {
    darkModeButton.innerText = "Dark Mode";
  }
}

let dropArea = document.getElementById("drop-area")

  // Prevent default drag behaviors
  ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
    document.body.addEventListener(eventName, preventDefaults, false)
  })

  // Highlight drop area when item is dragged over it
  ;['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
  })

  ;['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
  })

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false)

function preventDefaults(e) {
  e.preventDefault()
  e.stopPropagation()
}

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('highlight')
}

function handleDrop(e) {
  var dt = e.dataTransfer
  var files = dt.files

  handleFiles(files)
}

let uploadProgress = []
let progressBar = document.getElementById('progress-bar')

function initializeProgress(numFiles) {
  progressBar.value = 0
  uploadProgress = []

  for (let i = numFiles; i > 0; i--) {
    uploadProgress.push(0)
  }
}

function updateProgress(fileNumber, percent) {
  uploadProgress[fileNumber] = percent
  let total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length
  progressBar.value = total
}

function handleFiles(files) {
  files = [...files]
  //initializeProgress(files.length)
  //files.forEach(uploadFile)
  files.forEach(previewFile)
}

function uploadFiles() {
  console.log("called upload_files");
  files = document.getElementById("fileElem").files;
  files = [...files]
  console.log(typeof (files));
  console.log(files.length);
  initializeProgress(files.length);
  files.forEach(uploadFile);
  console.log('file upload completed');
  window.location.replace("/gallery");
  return false;
}

function previewFile(file) {
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = function () {
    let img = document.createElement('img')
    img.src = reader.result
    document.getElementById('gallery').appendChild(img)
  }
}

function uploadFile(file, i) {
  console.log("inside upload file")
  var url = '/image_upload'
  var xhr = new XMLHttpRequest()
  var formData = new FormData()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

  // Update progress (can be used to show progress indicator)
  xhr.upload.addEventListener("progress", function (e) {
    updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
  })

  xhr.addEventListener('readystatechange', function (e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      updateProgress(i, 100) // <- Add this
    }
    else if (xhr.readyState == 4 && xhr.status != 200) {
      // Error. Inform the user
    }
  })

  //formData.append('upload_preset', 'ujpu6gyk')
  formData.append('file', file)
  formData.append('extn', file.name.split('.').pop())
  formData.append('file_name', file.name.split(/(\\|\/)/g).pop())
  formData.append('file_type', file.type)
  xhr.send(formData)
}