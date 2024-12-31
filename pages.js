//This script handles light/dark mode and page changes

let mode = "light"

let lightCss = document.createElement("link");
lightCss.setAttribute("rel", "stylesheet");
lightCss.setAttribute("href", "light.css");

let darkCss = document.createElement("link");
darkCss.setAttribute("rel", "stylesheet");
darkCss.setAttribute("href", "dark.css");

function change_mode() {
    if (mode==="light") {
        mode = "dark"
        document.getElementsByTagName("head")[0].replaceChild(darkCss, document.getElementsByTagName("link")[0]);
    } else if (mode==="dark") {
        mode = "light"
        document.getElementsByTagName("head")[0].replaceChild(lightCss, document.getElementsByTagName("link")[0]);
    }
}

function change_page(pageName) {
	document.getElementById("walter_pitts").style.display = "none";
	document.getElementById("demo").style.display = "none";

    console.log(document.getElementById(pageName))

	document.getElementById(pageName).style.display = "inline";

    if(pageName==="walter_pitts") {
        document.getElementsByTagName("title")[0].innerText = "Walter Pitts";
    } else {
        document.getElementsByTagName("title")[0].innerText = "Neural Network Demo";
    }
}