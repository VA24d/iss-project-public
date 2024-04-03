function submitForm() {
    var resolution = document.getElementById('resolution').value;
    var fps = document.getElementById('fps').value;

    var url = '/export_vid'
    var xhr = new XMLHttpRequest()
    var formData = new FormData()
    xhr.open('POST', url, true)
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

    formData.append("res", resolution);
    formData.append("fps", fps);

    xhr.send(formData);

    // Here you can perform further actions like sending the selected data to the server for video generation
}

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

function closeTab() {
    window.close();
}

function confirmAndNavigate(url) {
    if (confirm('Video will be lost. Proceed?')) {
        window.location.href = url;
    }
}

function confirmAndGoBack() {
    if (confirm('Video will be lost. Proceed?')) {
        window.history.back();
    }
}
