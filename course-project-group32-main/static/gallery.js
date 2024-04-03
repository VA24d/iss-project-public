document.onclick = hideMenu;

var menu_on = 0;

var selectMode = 0;

function hideMenu()
{
    if(menu_on == 1)
    {
        document.getElementById("context_menu").style.display = "none";
        menu_on = 0;
    }
}

var elementList = document.body.getElementsByTagName("*");
//var elementList = document.getElementsByClassName("gallery_item_image");

var last_right = 0;

for(let i=0; i<elementList.length; i++)
{
    //console.log(i);
    //console.log(elementList[i].tagName);
    //console.log(elementList[i].classList.contains("gallery_item_image"));
    elementList[i].addEventListener("contextmenu", showMenu, capture=false);
    if(elementList[i].classList.contains("gallery_item_image"))
    {
        elementList[i].addEventListener("click", select_image);
    }
}

document.body.addEventListener("contextmenu", showMenu);

function showMenu(clickEvent)
{
    clickEvent.preventDefault();
    if(selectMode==1)
    {
        endSelectMode();
        return;
    }
    //console.log(this.tagName);
    //console.log(this.classList.contains("gallery_item_image"));
    let ct = new Date().getTime();
    if(menu_on == 1 && ct-last_right>=100)
    {
        hideMenu();
        return;
    }
    if(this.classList.contains("gallery_item_image"))
    {
        console.log("inside");
        menu_on = 1;
        last_right = ct;
        let cm = document.getElementById("context_menu");
        cm.style.display = "flex";
        cm.style.left = clickEvent.pageX + "px";
        cm.style.top = clickEvent.pageY + "px";
    }
}

var selected_images = [];

function startSelectMode()
{
    if(selectMode==1)
    {
        endSelectMode();
        return;
    }
    selectMode = 1;
    document.body.classList.add("select_mode");
    selected_images = [];
}

function endSelectMode()
{
    selectMode = 0;
    for(let i=0; i<selected_images.length; i++)
    {
        selected_images[i].classList.remove("selected");
    }
    document.body.classList.remove("select_mode");
    document.body.classList.remove("select_valid");
    selected_images = [];
}

function select_image(clickEvent)
{
    if(selectMode==0) return;
    if(selected_images.includes(this)==true)
    {
        this.classList.remove("selected");
        for(let i=0; i<selected_images.length; i++)
        {
            if(selected_images[i]==this)
            {
                selected_images.splice(i, 1);
                break;
            }
        }
        if(selected_images.length<1)
        {
            document.body.classList.remove("select_valid");
        }
        return;
    }
    this.classList.add("selected");
    selected_images.push(this);
    if(selected_images.length==1)
    {
        document.body.classList.add("select_valid");
    }
}

function logout()
{
    console.log("called logout")
    createCookie("access-token", "", 30);
    var url = '/logout'
    var xhr = new XMLHttpRequest()
    xhr.open('POST', url, true)
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.send()
    window.location.href = "/"
}

function deleteSelected()
{
    for(let i=0; i<selected_images.length; i++)
    {
        deleteImage(selected_images[i])
    }
    endSelectMode();
    location.reload();
}

function deleteImage(image_element)
{
    var url = '/delete_images'
    var xhr = new XMLHttpRequest()
    xhr.open('POST', url, true)
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    var formData = new FormData()
    formData.append('image_id', image_element.id)
    xhr.send(formData)
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

function makeVideo()
{
    console.log("in make video");
    if(selected_images.length<1) return;
    let image_ids = [];
    for (let i=0; i<selected_images.length; i++)
    {
        image_ids.push(selected_images[i].id)
        console.log(selected_images[i].id)
    }
    // var url = '/goto_editor'
    // var xhr = new XMLHttpRequest();
    // xhr.open('POST', url, true);
    // xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    // var formData = new FormData();
    // formData.append('images_by_id', JSON.stringify(image_ids));
    // xhr.send(formData);
    console.log(JSON.stringify(image_ids));
    createCookie("video_images", JSON.stringify(image_ids), 1.0/24);
    window.location.href="/editor"
}
