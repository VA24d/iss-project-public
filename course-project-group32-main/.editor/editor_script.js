function media_toggle() {
    var transitionContent = document.getElementById('media_content');
    if (transitionContent.style.display === 'flex') {
        transitionContent.style.display = 'none';
    } else {
        transitionContent.style.display = 'flex';
    }
}

function transition_toggle() {
    var transitionContent = document.getElementById('transition_content');
    if (transitionContent.style.display === 'flex') {
        transitionContent.style.display = 'none';
    } else {
        transitionContent.style.display = 'flex';
    }
}
function music_toggle() {
    var transitionContent = document.getElementById('music_content');
    if (transitionContent.style.display === 'flex') {
        transitionContent.style.display = 'none';
    } else {
        transitionContent.style.display = 'flex';
    }
}

function toggleFileMenu() {
    toggleMenu('file_menu');
}

function toggleImportMenu() {
    toggleMenu('import_menu');
}

function toggleViewMenu() {
    toggleMenu('view_menu');
}

function toggleExportMenu() {
    toggleMenu('export_menu');
}

function toggleHelpMenu() {
    toggleMenu('help_menu');
}

function toggleProfileMenu() {
    toggleMenu('profile_menu');
}

function toggleMenu(menuId) {
    var menuIds = [
        "file_menu",
        "import_menu",
        "view_menu",
        "export_menu",
        "help_menu",
        "profile_menu"
    ];
    for (var i = 0; i < menuIds.length; i++) {
        if (menuIds[i] === menuId) {
            continue;
        }
        var menu = document.getElementById(menuIds[i]);
        menu.style.display = 'none';
    }

    var menu = document.getElementById(menuId);
    if (menu.style.display === 'flex') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'flex';
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen(); // Enter fullscreen mode
        document.getElementById("maximize_button").textContent = "Minimize"; // Change button text
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen(); // Exit fullscreen mode
            document.getElementById("maximize_button").textContent = "Full screen"; // Change button text
        }
    }
}

function toggle_sidebar() {
    var sidebar = document.getElementById('sidebar');
    if (sidebar.style.display === 'flex') {
        sidebar.style.display = 'none';
    } else {
        sidebar.style.display = 'flex';
    }
}

function toggle_timeline() {
    var timeline = document.getElementById('timeline');
    if (timeline.style.display === 'flex') {
        timeline.style.display = 'none';
        document.getElementById('main_viewport').style.justifyContent = "center";
    } else {
        timeline.style.display = 'flex';
        document.getElementById('main_viewport').style.justifyContent = "space-between";
    }
}

function media_toggle() {
    toggleContent('media_content');
}

function transition_toggle() {
    toggleContent('transition_content');
}

function music_toggle() {
    toggleContent('music_content');
}

function toggleContent(contentId) {
    var content = document.getElementById(contentId);

    if (content.style.display === 'flex') {
        content.style.display = 'none';
    } else {
        content.style.display = 'flex';
    }
}



// Video 
var video = document.getElementById("current_vid");
var playPauseButton = document.getElementById("play_pause");
var fastForwardButton = document.getElementById("fast_forward");
var rewindButton = document.getElementById("rewind");
var skipBackButton = document.getElementById("skip_back");
var skipForwardButton = document.getElementById("skip_forward");
var repeatButton = document.getElementById("repeat");

// Function to toggle between play and pause
function togglePlayPause() {
    if (video.paused) {
        video.play();
        playPauseButton.src = "./icons/pause.svg"; // Change the src attribute to the pause icon
    } else {
        video.pause();
        playPauseButton.src = "./icons/play.svg"; // Change the src attribute to the play icon
    }
}

// Function to fast forward the video by 5 seconds
function fastForward() {
    video.currentTime += 5;
}

// Function to rewind the video by 5 seconds
function rewind() {
    video.currentTime -= 5;
}

// Function to skip back the video by 10 seconds
function skipBack() {
    video.currentTime -= 10;
}

// Function to skip forward the video by 10 seconds
function skipForward() {
    video.currentTime += 10;
}

var maximizeButton = document.getElementById("maximize");

// Function to toggle between fullscreen mode and normal mode
function toggleMaximize() {
    if (!document.fullscreenElement) {
        // If no element is in fullscreen mode, maximize the video
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.mozRequestFullScreen) { /* Firefox */
            video.mozRequestFullScreen();
        } else if (video.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) { /* IE/Edge */
            video.msRequestFullscreen();
        }
    } else {
        // If an element is in fullscreen mode, exit fullscreen mode
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }
    }
}

function repeat() {
    video.currentTime = 0;
}

// Event listener for maximize button
maximizeButton.addEventListener("click", toggleMaximize);

// Event listener for play/pause button
playPauseButton.addEventListener("click", togglePlayPause);

// Event listener for fast forward button
fastForwardButton.addEventListener("click", fastForward);

// Event listener for rewind button
rewindButton.addEventListener("click", rewind);

// Event listener for skip back button
skipBackButton.addEventListener("click", skipBack);

// Event listener for skip forward button
skipForwardButton.addEventListener("click", skipForward);

// Event listener for repeat button
repeatButton.addEventListener("click", repeat);


var Darkmode = document.getElementById("dark_mode");

Darkmode.addEventListener("click", darkmode);

function darkmode() {
    var element = document.body;
    element.classList.toggle("dark");
    if (element.classList.contains("dark")) {
        Darkmode.innerText = "Light Mode";
    }
    else {
        Darkmode.innerHTML = "Dark Mode";
    }
}


async function loadJSONFromFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error('Failed to fetch JSON');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading JSON:', error);
    }
}

// Function to create media elements
function createMediaElements(data) {
    const mediaContainer = document.getElementById("media_content");
    for (const key in data.media) {
        const item = data.media[key];
        let mediaElement;
        if (item.type === "image") {
            mediaElement = document.createElement("img");
            mediaElement.src = item.location;
        } else if (item.type === "video") {
            mediaElement = document.createElement("video");
            mediaElement.src = item.location;
            mediaElement.controls = true;
        }
        mediaElement.classList.add("media_element");
        mediaContainer.appendChild(mediaElement);
    }
}

// Function to create music elements
function createMusicElements(data) {
    const musicContainer = document.getElementById("music_content");
    for (const key in data.music) {
        const item = data.music[key];
        const audioElement = document.createElement("audio");
        audioElement.src = item.location;
        audioElement.type = "audio/mpeg";
        audioElement.preload = "auto";
        audioElement.autoplay = false;
        audioElement.loop = true;
        audioElement.muted = false;
        audioElement.volume = 1;
        audioElement.alt = "Audio element"; /* text */
        audioElement.draggable = true;
        audioElement.ondragstart = "handleDragStart(event)";
        audioElement.ondragend = "handleDragEnd(event)";
        audioElement.controls = true;
        audioElement.classList.add("audio_element");
        musicContainer.appendChild(audioElement);
    }
}

// Function to create transition element
function createTransitionElement(data) {
    const transitionContainer = document.getElementById("transition_content");
    const transitionElement = document.createElement("div");
    transitionElement.classList.add("transition_element");
    transitionElement.textContent = `${data.transition.type}`;
    transitionContainer.appendChild(transitionElement);
}

function updateSidebar() {
    loadJSONFromFile("uploaded.json")
        .then(data => {
            createMediaElements(data);
            createMusicElements(data);
            createTransitionElement(data);
        });
}

updateSidebar();

function handleDragOver(event) {
    event.preventDefault();
}

// Function to handle drop event
function handleDrop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    for (const file of files) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const newItem = {
                type: getFileType(file),
                location: e.target.result
            };
            addItemToJSON(newItem);
            displayItem(newItem);
        };
        reader.readAsDataURL(file);
    }

    // updateSidebar();
}

// Function to get file type
function getFileType(file) {
    const type = file.type.split('/')[0];
    return type === 'image' ? 'image' : 'video'; // Adjust as needed
}

// Function to add item to JSON data
function addItemToJSON(newItem) {
    // Assume jsonData is your JSON data object
    const sidebarData = jsonData.media; // or any other appropriate property
    const newIndex = Object.keys(sidebarData).length + 1;
    sidebarData[newIndex] = newItem;
}


