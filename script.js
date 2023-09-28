class Chrono {

    constructor() {
        this.timeBegan = null;
        this.timeStopped = null;
        this.stoppedDuration = 0;
        this.started = null;
    }

    start(id) {
        if (this.timeBegan === null) {
            this.timeBegan = new Date();
        }

        if (this.timeStopped !== null) {
            this.stoppedDuration += (new Date() - this.timeStopped);
        }

        this.started = setInterval(() => this.clockRunning(id), 10);
    }

    stop() {
        this.timeStopped = new Date();
        clearInterval(this.started);
    }

    reset(id) {
        clearInterval(this.started);
        this.stoppedDuration = 0;
        this.timeBegan = null;
        this.timeStopped = null;
        if (id !== undefined){
            this.updateDisplay(id, "00:00:00.000");
        }
    }

    clockRunning(id) {
    var currentTime = new Date()
        , timeElapsed = new Date(currentTime - this.timeBegan - this.stoppedDuration)
        , hour = timeElapsed.getUTCHours()
        , min = timeElapsed.getUTCMinutes()
        , sec = timeElapsed.getUTCSeconds()
        , ms = timeElapsed.getUTCMilliseconds();

    let displayText = "";

    // Afficher les heures uniquement si elles sont supérieures à zéro
    if (hour > 0) {
        displayText += (hour > 9 ? hour : "0" + hour) + ":";
    }

    // Afficher les minutes uniquement si elles sont supérieures à zéro ou si les heures sont supérieures à zéro
    if (min > 0 || hour > 0) {
        displayText += (min > 9 ? min : "0" + min) + ":";
    }

    // Toujours afficher les secondes et les millisecondes
    displayText += (sec > 9 ? sec : "0" + sec) + "." + (ms > 99 ? ms : ms > 9 ? "0" + ms : "00" + ms);

    this.updateDisplay(id, displayText);
}

    updateDisplay(id, value) {
        document.getElementById(id).innerHTML = value;
    }
}


const globalTimer = new Chrono();
const levelTimer = new Chrono();
const levelMax = 8;
var level = -1;

if (getCookie('pb-global') != null) {
    let tmin = 0; // Initialisez tmin à 0 pour l'addition
    for (let i = 0; i <= levelMax; i++) {
        // Utilisez parseFloat ou parseInt pour convertir la valeur de cookie en nombre
        const cookieValue = parseFloat(getCookie("pb-" + i));
        // Assurez-vous que la valeur n'est pas NaN avant de l'ajouter
        if (!isNaN(cookieValue)) {
            tmin += cookieValue;
        }
    }
    document.querySelector("#pb").innerHTML = "Meilleur temps : "+getCookie('pb-global');
    document.querySelector("#tmin").innerHTML = "<em>Meilleur temps théorique : "+tmin.toFixed(3)+"</em>";
}

    // globalTimer.start("display-area");
    // levelUp();    

function levelUp() {
    if(level >= 0 && getCookie('pb-global') != null && document.querySelector("#t-sec-"+level).innerHTML < getCookie("run-pb-"+level)) {
        document.querySelector("#d-sec-"+level).innerHTML = "-"+(getCookie("run-pb-"+level)-document.querySelector("#t-sec-"+level).innerHTML).toFixed(3);
        if(document.querySelector("#t-sec-"+level).innerHTML < getCookie("pb-"+level)) {
            document.querySelector("#d-sec-"+level).style.color = "#E102FF";
        } else {
            document.querySelector("#d-sec-"+level).style.color = "#32C759";
        }
    } else if(level >= 0 && getCookie('pb-global') != null && document.querySelector("#t-sec-"+level).innerHTML > getCookie("run-pb-"+level)) {
        document.querySelector("#d-sec-"+level).innerHTML = "+"+(document.querySelector("#t-sec-"+level).innerHTML-getCookie("pb-"+level)).toFixed(3);
        document.querySelector("#d-sec-"+level).style.color = "#FF3B30";
    }
    if(level >= levelMax) {
        
        levelTimer.stop();
        globalTimer.stop();
        let value;
        if(level >= 0) {value = document.getElementById("t-sec-"+level).innerHTML;}
        if((getCookie("pb-"+level) === null || getCookie("pb-"+level) > value) && level >= 0) {
            setCookie("pb-"+level, value);
        }
        if(getCookie("pb-global") === null) {
            value = document.getElementById("display-area").innerHTML;
            setCookie("pb-global", value);
            document.getElementById("display-area").style.color = "#32C759";
            for(let i=0; i<=levelMax; i++){
                setCookie("run-pb-"+i, document.querySelector("#t-sec-"+i).innerHTML);
            }
        }
        value = document.getElementById("display-area").innerHTML;
        if(getCookie("pb-global") > value) {
            document.getElementById("display-area").style.color = "#32C759";
            delta = getCookie("pb-global")-value;
            delta = delta.toFixed(3);
            document.querySelector("#delta").innerHTML = "-" + delta;
            document.querySelector("#delta").style.color = "#32C759";
            setCookie("pb-global", value);
            for(let i=0; i<=levelMax; i++){
                setCookie("run-pb-"+i, document.querySelector("#t-sec-"+i).innerHTML);
            }
        } else if (getCookie("pb-global") < value) {
            document.getElementById("display-area").style.color = "#FF3B30";
            delta = value-getCookie("pb-global");
            delta = delta.toFixed(3);
            document.querySelector("#delta").innerHTML = "+"+delta;
            document.querySelector("#delta").style.color = "#FF3B30";
        }
        tmin = 0; // Initialisez tmin à 0 pour l'addition
        for (let i = 0; i <= levelMax; i++) {
            // Utilisez parseFloat ou parseInt pour convertir la valeur de cookie en nombre
            const cookieValue = parseFloat(getCookie("pb-" + i));
            // Assurez-vous que la valeur n'est pas NaN avant de l'ajouter
            if (!isNaN(cookieValue)) {
                tmin += cookieValue;
            }
        }
        document.querySelector("#pb").innerHTML = "Meilleur temps : "+getCookie('pb-global');
        document.querySelector("#tmin").innerHTML = "<em>Meilleur temps théorique : "+tmin.toFixed(3)+"</em>";
        return;
    }
    if(level == -1) {
        globalTimer.start("display-area");
    }
    levelTimer.stop();
    levelTimer.reset();
    document.querySelector(".level-"+level).style.display = "none";
    if(level >= 0) {value = document.getElementById("t-sec-"+level).innerHTML;}
    if((getCookie("pb-"+level) === null || getCookie("pb-"+level) > value) && level >= 0) {
        setCookie("pb-"+level, value);
    }
    level++;
    document.querySelector(".level-"+level).style.display = "flex";
    levelTimer.start("t-sec-"+level);
}

function getCookie(value){
    let cookies = document.cookie.split(';');
    for(let cookie of cookies){
        let cookieArray = cookie.split('=');
        if(cookieArray[0].trim() === value){
            return cookieArray[1];
        }
    }
    return null;
}

function setCookie(name, value){
    document.cookie = name + "=" + value +";expires=01 jan 2030 12:00:00 UTC; path=/";
}

function deleteCookie(){
    for(let i=0; i<=levelMax; i++){
        document.cookie = "pb-"+i+"=;expires=01 jan 1970 12:00:00 UTC; path=/";
        document.cookie = "run-pb-"+i+"=;expires=01 jan 1970 12:00:00 UTC; path=/";
    }
    document.cookie = "pb-global=;expires=01 jan 1970 12:00:00 UTC; path=/";
}