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
    console.log(i);
    console.log(elementList[i].tagName);
    console.log(elementList[i].classList.contains("gallery_item_image"));
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
    console.log(this.tagName);
    console.log(this.classList.contains("gallery_item_image"));
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
