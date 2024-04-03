var btn = document.getElementsByClassName("btn");
        var picture = document.getElementById("picture");
        for(let i=0; i<btn.length; i++){
            btn[i].addEventListener('click', function() {
                let current = document.getElementsByClassName("active");
                current[0].className = current[0].className.replace("active" , "");
                this.className += " active"
            })
        }
        btn[0].onclick = function () {
            picture.src = "pic1.png";
        }
        btn[1].onclick = function () {
            picture.src = "pic2.png";
        }
        btn[2].onclick = function () {
            picture.src = "pic3.png";
        }
        btn[3].onclick = function () {
            picture.src = "pic4.png";
        }