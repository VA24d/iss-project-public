var slideIndex = 0;

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

function showSlides() {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("dot");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
    setTimeout(showSlides, 2000); // Change image every 2 seconds
}

function toSlide(n) {
    slideIndex = n;
    showSlides();
}

showSlides();