var transitionMode = 0
var transitionType = "None"

var image_trans = {};
var audio_ins = [];
var audio_ls = [];

var audio_number = 1;

function media_toggle() {
    var transitionContent = document.getElementById('media_content');
    var icon = document.getElementById('mediaArrow');
    if (transitionContent.style.display === 'flex' || transitionContent.style.display === '') {
        transitionContent.style.display = 'none';
        icon.src = "./icons/chevron-right.svg";
    } else {
        transitionContent.style.display = 'flex';
        icon.src = "./icons/chevron-down.svg";

    }
}

function transition_toggle() {
    var transitionContent = document.getElementById('transition_content');
    var icon = document.getElementById('transitionArrow');
    // console.log("bla");
    if (transitionContent.style.display === 'flex' || transitionContent.style.display === '') {
        transitionContent.style.display = 'none';
        console.log(icon);
        icon.classList.add('active');
    } else {
        transitionContent.style.display = 'flex';
        icon.classList.remove('active');
    }
}

function music_toggle() {
    var transitionContent = document.getElementById('music_content');
    var icon = document.getElementById('musicArrow');
    if (transitionContent.style.display === 'flex' || transitionContent.style.display === '') {
        transitionContent.style.display = 'none';
        icon.src = "./icons/arrow-right-icon.svg";
    } else {
        transitionContent.style.display = 'flex';
        icon.src = "./icons/chevron-down.svg";
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
        document.getElementById('main_viewport').style.justifyContent = "center";
    } else {
        sidebar.style.display = 'flex';
        document.getElementById('main_viewport').style.justifyContent = "space-between";
    }
}

function toggle_timeline() {
    var timeline = document.getElementById('timeline');
    if (timeline.style.display === 'flex') {
        timeline.style.display = 'none';

    } else {
        timeline.style.display = 'flex';

    }
}

function media_toggle() {
    toggleContent('media_content');
    document.getElementById("mediaArrow").classList.toggle('active');
}

function transition_toggle() {
    toggleContent('transition_content');
    document.getElementById("transitionArrow").classList.toggle('active');
}

function music_toggle() {
    toggleContent('music_content');
    document.getElementById("musicArrow").classList.toggle('active');
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
var airplayButton = document.getElementById("airplay");

const player = document.getElementById("current_vid");

// Function to toggle between play and pause
function togglePlayPause() {
    if (video.paused) {
        video.play();
        playPauseButton.src = "/static/icons/pause.svg"; // Change the src attribute to the pause icon
    } else {
        video.pause();
        playPauseButton.src = "/static/icons/play.svg"; // Change the src attribute to the play icon
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
let isAirPlayAvailable = false;

player.addEventListener("webkitplaybacktargetavailabilitychanged", event => {
    if (event.availability === "available") {
        isAirPlayAvailable = true;
    }
});

function airplayRun() {
    if (isAirPlayAvailable) {
        player.webkitShowPlaybackTargetPicker();
    }
    else {
        console.log("Airplay not available");
    }
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

// // Event listner for airplay button
airplayButton.addEventListener("click", airplayRun);


// Check if the browser prefers dark mode
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


// Example: make events draggable
const events = document.querySelectorAll('.event');

events.forEach(event => {
    event.addEventListener('mousedown', function (event) {
        const startX = event.clientX;
        const initialLeft = this.getBoundingClientRect().left;

        const onMouseMove = (event) => {
            const delta = event.clientX - startX;
            this.style.left = `${initialLeft + delta}px`;
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
});


// Function to show the custom right-click menu
function showCustomRightClickMenu(x, y) {
    var menu = document.getElementById("customRightClickMenu");
    menu.style.display = "block";
    menu.style.left = x + "px";
    menu.style.top = y + "px";

    // Depending on the location, add different menu items
    var menuItems = document.getElementById("menuItems");
    menuItems.innerHTML = ""; // Clear previous menu items
    if (x < window.innerWidth / 2) {
        // Left half of the screen
        menuItems.innerHTML += "<li onclick='handleAction(\"left\")'>Left Action</li>";
    } else {
        // Right half of the screen
        menuItems.innerHTML += "<li onclick='handleAction(\"right\")'>Right Action</li>";
    }
}

// Function to hide the custom right-click menu
function hideCustomRightClickMenu() {
    var menu = document.getElementById("customRightClickMenu");
    menu.style.display = "none";
}

// Event listener for the contextmenu event
document.addEventListener("contextmenu", function (event) {
    event.preventDefault(); // Prevent the default right-click menu from showing
    showCustomRightClickMenu(event.clientX, event.clientY); // Show the custom right-click menu
});

// Event listener to hide the custom right-click menu when clicking outside it
document.addEventListener("click", function (event) {
    var menu = document.getElementById("customRightClickMenu");
    if (menu.style.display === "block") {
        hideCustomRightClickMenu();
    }
});

// Function to handle menu actions
function handleAction(action) {
    hideCustomRightClickMenu();
    // Perform action based on the selected menu item
    alert("Performed action: " + action);
}

// Function to check if the end of the timeline is reached
function isTimelineEndReached() {
    const timeline = document.getElementById('timeline');
    return timeline.scrollLeft + timeline.clientWidth >= timeline.scrollWidth;
}

// Event listener for scroll events
document.getElementById('timeline').addEventListener('scroll', function () {
    if (isTimelineEndReached()) {
        loadMoreTimelineEvents(); // Load more events when the end is reached
    }
});

// Initial loading of timeline events
loadMoreTimelineEvents();


function resetTransitions() {
    const transitionIds = [
        "FadeTransition",
        "SlideTransition",
        "ColorTransition",
        "NoneTransition"
    ];

    transitionMode = 0;
    transitionIds.forEach(id => {
        const element = document.getElementById(id);
        element.style.backgroundColor = "";
    });

    var flashColor = document.getElementById('colorInput');
    flashColor.style.display = 'none';

    var slideDirection = document.getElementById('slideSelect');
    slideDirection.style.display = 'none';
}


function selectTransition(action) {
    resetTransitions();

    transitionMode = 1;
    transitionType = action;
    var selected = document.getElementById(action + 'Transition');
    // console.log(action + 'Transition');

    selected.style.backgroundColor = "rgb(0, 64, 124)";

    if (action == 'None') {
        resetTransitions();
    }
    else if(action=='Fade')
    {
        transitionType='';
    }
    else if (action == 'Slide') {
        transitionType = "Slide--up";
        var slideDirection = document.getElementById('slideSelect');
        slideDirection.style.display = 'block';
        slideDirection.addEventListener("change", function () {
            var selectedOption = this.value;
            console.log("selected option here--v");
            console.log(selectedOption);
            transitionType = action + "--" + selectedOption;
            console.log(action);
            // transitionType = action;
            // You can perform further actions here based on the selected option
            slideDirection.style.display = 'none';
        });

    }
    else if (action == 'Color') {
        var form = document.getElementById("colFTrans");

        var flashColor = document.getElementById('colorInput');
        flashColor.style.display = 'block';

        transitionType = "Color--white";

        // Add a submit event listener to the form
        form.addEventListener("submit", function (event) {
            // Prevent the default form submission
            event.preventDefault();

            // Get the input value
            var inputValue = document.getElementById("colorInput").value;

            // Further actions if needed
            var flashColor = document.getElementById('colorInput');
            flashColor.style.display = 'none';
            transitionType = action + "--" + inputValue;
            console.log(transitionType);
        });


        console.log("Input Value:", transitionType);
    }

    console.log(action)

}


function setTransition(id) {
    console.log(Object.isExtensible(image_trans));
    console.log(id);
    console.log(transitionType);
    if (transitionMode) {
        Object.defineProperty(image_trans, id, { value: transitionType, writable: true, enumerable: true, });
        console.log(image_trans)
        document.getElementById(id + "_transition").textContent = transitionType;
        document.getElementById(id + "_transition").style.backgroundColor = "white";
        if (transitionType == "None") {
            document.getElementById(id + "_transition").style.backgroundColor = "transparent";
        }
        resetTransitions();
        updateVid();
    }
    else {
        console.log("No transition selected");
    }
}

function updateVid() {
    console.log("inside update vid");
    var url = '/update_vid'
    var xhr = new XMLHttpRequest()
    var formData = new FormData()
    xhr.open('POST', url, true)
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

    let image_dur = {}

    img_order = [];
    tml_div = document.getElementById("visual");
    for (var i = 0; i < tml_div.children.length; i++) {
        if (tml_div.children[i].classList.contains("OImg")) {
            img_order.push(tml_div.children[i].id)
            image_dur[tml_div.children[i].id] = document.getElementById(tml_div.children[i].id + "_duration").value;
        }
    }
    console.log(img_order);
    console.log(image_trans);
    console.log(image_dur);
    console.log(audio_ins);
    console.log(audio_ls);

    ord_json = JSON.stringify(img_order);
    trans_json = JSON.stringify(image_trans);
    dur_json = JSON.stringify(image_dur);
    ains_json = JSON.stringify(audio_ins);
    als_json = JSON.stringify(audio_ls);

    console.log(ord_json);
    console.log(trans_json);
    console.log(dur_json);
    console.log(ains_json);
    console.log(als_json);

    formData.append("img_ord", ord_json);
    formData.append("img_trs", trans_json);
    formData.append("img_dur", dur_json);
    formData.append("aud_ins", ains_json);
    formData.append("aud_ls", als_json);

    xhr.addEventListener('readystatechange', function (e) {
        if (xhr.readyState == 4) {
            console.log("vid done!");
            let old_src = document.getElementById("current_vid").children[0].getAttribute('src');
            // console.log(old_src);
            // document.getElementById("current_vid").children[0].setAttribute('src', '');
            // document.getElementById("current_vid").load();
            // //document.getElementById("current_vid").play();
            // console.log(document.getElementById("current_vid").children[0].getAttribute('src'));
            // document.getElementById("current_vid").children[0].setAttribute('src', old_src);
            document.getElementById("current_vid").load();
            document.getElementById("current_vid").play()
        }
    })

    xhr.send(formData);
}


function delete_audio(id) {
    var audio_timeline = document.getElementById("audio_timeline");
    var audio_element = document.getElementById(id);
    audio_timeline.removeChild(audio_element);
    audio_number -= 1;
    updateVid();
}

function move_left_a(id) {

}

function move_right_a(id) {

}

function sendAudio(audio_id, list_number) {
    console.log(audio_id);
    audio_ins.push(audio_id);
    audio_ls.push(list_number);

    var audio_timeline = document.getElementById("audio");
    var ch5 = audio_id.slice(-5);

    var audio_element = `
        <div class="OAud">
        <p class="aud_caption">${ch5}</p>
        <button class="aud_btn" onclick="delete_audio(${audio_number})"><img src="./../static/icons/trash-2.svg" alt="delete"></button>
        <button class="aud_btn" onclick="move_left_a(${audio_number})"><img src="./../static/icons/chevron-right.svg" class="rotate" alt="left"></button>
        <button class="aud_btn" onclick="move_right_a(${audio_number})"><img src="./../static/icons/chevron-right.svg" alt="right"></button>
        </div>`;

    audio_timeline.innerHTML+=audio_element;

    audio_number += 1;
    updateVid();
    //audio_timeline = document.getElementById("audio");



    // var html = `<div class="OAud">
    // <p class="aud_caption">{{ audio_list[${audio_number}][1] }} </p>

    // <!-- < audio >
    //     <src>{{ audio_list[${audio_number}][1]}}</src>
    //     Audio not accessible
    // </audio > -->

    // <button class="aud_btn" onclick="delete_img(image_number)"><img
    //         src="./../static/icons/trash-2.svg" alt="delete"></button>
    // <button class="aud_btn" onclick="move_left(image_number)"><img
    //         src="./../static/icons/chevron-right.svg" class="rotate" alt="left"></button>
    // <button class="aud_btn" onclick="move_right(image_number)"><img
    //         src="./../static/icons/chevron-right.svg" alt="right"></button>

    // <select name="duration" class="modern-dropdown">
    //     <option value="1">1</option>
    //     <option value="2">2</option>
    //     <option value="3">3</option>
    //     <option value="4">4</option>
    //     <option selected value="5">5</option>
    //     <option value="6">6</option>
    //     <option value="7">7</option>
    //     <option value="8">8</option>
    //     <option value="9">9</option>
    //     <option value="10">10</option>
    // </select>
    // </div > `;

    // audio_timeline.appendChild(html);

}

function initExp() {
    let image_dur = {}

    img_order = [];
    tml_div = document.getElementById("visual");
    for (var i = 0; i < tml_div.children.length; i++) {
        if (tml_div.children[i].classList.contains("OImg")) {
            img_order.push(tml_div.children[i].id)
            image_dur[tml_div.children[i].id] = document.getElementById(tml_div.children[i].id + "_duration").value;
        }
    }
    console.log(img_order);
    console.log(image_trans);
    console.log(image_dur);
    console.log(audio_ins);
    console.log(audio_ls);

    ord_json = JSON.stringify(img_order);
    trans_json = JSON.stringify(image_trans);
    dur_json = JSON.stringify(image_dur);
    ains_json = JSON.stringify(audio_ins);
    als_json = JSON.stringify(audio_ls);

    console.log(ord_json);
    console.log(trans_json);
    console.log(dur_json);
    console.log(ains_json);
    console.log(als_json);

    createCookie("img_ord", ord_json, 0.1);
    createCookie("img_trs", trans_json, 0.1);
    createCookie("img_dur", dur_json, 0.1);
    createCookie("aud_ins", ains_json, 0.1);
    createCookie("aud_ls", als_json, 0.1);

    window.location.replace("/export");
}

function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}