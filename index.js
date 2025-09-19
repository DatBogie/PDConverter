async function uploadAsset(API_KEY, rawFileContents, assetType, userId, assetName, mimeType) {
    const url = "https://apis.roblox.com/assets/v1/assets";
    const metadata = {
        assetType: assetType,
        creationContext: {
            creator: {
                userId: userId
            }
        },
        displayName: assetName,
        description: ""
    };
    const formData = new FormData();
    formData.append("request", JSON.stringify(metadata));
    formData.append("fileContent", new Blob([rawFileContents], { type: mimeType }), assetName);
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "x-api-key": API_KEY
        },
        body: formData
    });
    
    const result = await response.json();
    if (!result.operationId) {
        throw new Error("Upload failed: " + JSON.stringify(result));
    }
    console.log(result);
    console.log("Upload started, operationId:",result.operationId);

    const operationUrl = `https://apis.roblox.com/assets/v1/operations/${result.operationId}`;
    let status;
    let assetId;

    do {
        await new Promise(res=>setTimeout(res, 2000));
        const opResp = await fetch(operationUrl, {
            headers: {
                "x-api-key": API_KEY
            }
        });
        const opData = await opResp.json();
        status = opData.status;

        if (status === "Completed") {
            assetId = opData.assetId;
            console.log("Upload complete! Asset ID:",assetId);
        } else if (status === "Failed") {
            throw new Error("Upload failed: "+JSON.stringify(opData));
        } else {
            console.log("Upload pending...");
        }
    } while (status === "Pending");
}

var xVel = 0;
var lastX = 0;

const xOffset = 9;
const yOffset = 2;

var justLoaded = true

var selectedTab = "t-1";

const urlParams = new URLSearchParams(document.location.search);

if (urlParams.get("tab"))
    selectedTab=urlParams.get("tab");

function embedOpen(url) {
    const blur = document.querySelector(".blur-bg");
    blur.style.animationName = "blur-bg-open";
    blur.style.display = "block";

    const popup = document.querySelector(".if-popup");
    popup.style.animationName = "if-popup-open";
    popup.style.display = "block";
    const urlBar = document.getElementById("if-url");
    urlBar.textContent = url;
    const iframe = popup.querySelector("iframe");
    iframe.src = url;
}

function easeOutElastic(x) {
    const c4 = (2 * Math.PI) / 4;
    return x === 0
    ? 0
    : x === 1
    ? 1
    : Math.pow(2, -10 * x) * Math.sin((x * 10 - .75) * c4) + 1;
}

const observer = new MutationObserver((mL)=>{
    mL.forEach((m)=>{
        if (m.type == "childList" && m.addedNodes.length > 0) {
            m.addedNodes.forEach((n)=>{
                if (n.nodeType == Node.ELEMENT_NODE) {
                    var links;
                    if (n.classList?.contains("functional-link")) {
                        links = [n];
                    } else {
                        let _links = n.querySelectorAll(".functional-link");
                        if (_links.length > 0) {
                            links = _links
                        }
                    }
                    if (!links) return;
                    links.forEach((link)=>{
                        if (link.dataset.disableclick != "true") {
                            link.addEventListener("click",()=>{
                                embedOpen(link.dataset.href);
                            });
                        }
                        var targetted = false;
                        link.addEventListener("mousedown",(e)=>{
                            if (e.button != 1) return;
                            targetted = true;
                        });
                        link.addEventListener("mouseup",(e)=>{
                            if (e.button != 1 || !targetted) return;
                            targetted = false;
                            open(link.dataset.href);
                        });
                    });
                }
            });
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});

const cur = document.querySelector(".cursor");
if (!isMobile()) {
    setInterval(function() {
        if (xVel < 0) {
            xVel+=700;
            if (xVel > 0) {
                xVel = 0;
            }
        } else {
            xVel-=700;
            if (xVel < 0) {
                xVel = 0
            }
        }
        cur.style.rotate = xVel+"deg";
    },100);
}

var iterNum = -1;
const loadingCircle = document.getElementById("loading-circle");
const dots = document.querySelectorAll(".loading-dot");
const intervalId = setInterval(()=>{
    iterNum++;
    if (iterNum % 500 == 0) {
        let circ = loadingCircle.cloneNode();
        circ.classList.add("pulse");
        loadingCircle.parentElement.appendChild(circ);
        circ.offsetHeight;
        circ.style.scale = "10";
        circ.style.opacity = "0";
        setTimeout(()=>{
            circ.remove();
        },650);
    }
});
function loadingDotJump(i) {
    dots[i].style.animation = "none";
    void dots[i].offsetHeight;
    dots[i].style.animation = "loading-dot-jump 1s linear";
}
const intervalId1 = setInterval(()=>{
    for (let i=0; i<3; i++) {
        setTimeout(()=>{
            loadingDotJump(i);
        },i*500);
    }
},3*500);

function isMobile() {
    let check = false;
    // http://detectmobilebrowsers.com, https://stackoverflow.com/a/11381730
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

if (isMobile()) {
    cur.remove();
}

const LEVEL_INFO = {
    levelNames: [], // ["main.adofai","level.adofai", etc.]
    levelData: {},
    levelImages: [],
    levelSong: "",
    files: {}
}

window.addEventListener("load",function() {
    clearInterval(intervalId);
    clearInterval(intervalId1);
    document.getElementById("loading").remove();
    document.body.style.opacity = "0";
    void document.body.offsetHeight;
    document.getElementById("tabbar-bg").style.opacity = "100%";
    const links = document.querySelectorAll(".link, .functional-link");
    links.forEach((link)=>{
        link.addEventListener("click",()=>{
            embedOpen(link.dataset.href);
        });
        var targetted = false;
        link.addEventListener("mousedown",(e)=>{
            if (e.button != 1) return;
            targetted = true;
        });
        link.addEventListener("mouseup",(e)=>{
            if (e.button != 1 || !targetted) return;
            targetted = false;
            open(link.dataset.href);
        });
    });
    document.querySelectorAll(".tabpage").forEach((tab)=>{
        tab.querySelectorAll("div:has(input)").forEach((div)=>{
            div.firstElementChild.classList.add("first-el");
            div.lastElementChild.classList.add("last-el");
        });
    });
    document.getElementById("if-open").addEventListener("click",() => {
        const url = document.querySelector(".if-popup").querySelector("#if-url").textContent;
        open(url);
        document.getElementById("if-close").click();
    });
    document.getElementById("if-close").addEventListener("click",() => {
        const blur = document.querySelector(".blur-bg");
        blur.style.animationName = "blur-bg-close";
        blur.classList.add("blur-bg-closing");
        setTimeout(() => {
            blur.style.display = "none";
            blur.classList.remove("blur-bg-closing");
        },Number(getComputedStyle(blur).animationDuration.slice(0,-1))*1000);

        const popup = document.querySelector(".if-popup");
        popup.style.animationName = "if-popup-close";
        popup.classList.add("if-closing");
        setTimeout(() => {
            popup.style.display = "none";
            popup.classList.remove("if-closing");
            popup.querySelector("iframe").src = "";
            document.getElementById("if-url").textContent = "";
        },Number(getComputedStyle(popup).animationDuration.slice(0,-1))*1000);
    });
    document.querySelectorAll(".expanding-hr").forEach((el)=>{
        el.style.animationName = "hr-expand";
    });
    if (!isMobile()) {
        document.querySelector(".if-popup").addEventListener("mouseenter",() => {
            cur.style.display = "none";
        });
        document.querySelector(".if-popup").addEventListener("mouseleave",() => {
            cur.style.display = "block";
        });
    }
    document.body.style.transition = "margin-top 1s ease, opacity 1s ease-out";
    document.body.style.marginTop = "8px";
    document.body.style.opacity = "100%";

    const tabbtns = this.document.querySelectorAll(".tabbtn");
    tabbtns.forEach((el)=>{
        if (el.id == selectedTab) {
            el.classList.add("selected");
            document.getElementById("tab."+selectedTab).style.display = "block";
        }
        el.addEventListener("click",function() {
            document.getElementById("tab."+selectedTab).style.display = "none";
            document.getElementById(selectedTab).classList.remove("selected");
            selectedTab = el.id;
            el.classList.add("selected");
            document.getElementById("tab."+selectedTab).style.display = "block";
            document.getElementById("tab."+selectedTab).style.animationName = "tabpage";
        });
    });

    function dropdownOptClicked(opt, dropdown) {
        dropdown.querySelector("#text").textContent = opt.id;
    }

    function createOpt(optN, dropdown, menu) {
        const opt = document.createElement("button");
        if (optN !== "") {
            opt.id = optN;
            opt.textContent = optN;
            opt.classList.add("standard-button");
            opt.addEventListener("click",()=>{
                dropdownOptClicked(opt,dropdown);
            });
        } else {
            opt.style.display = "none";
        }
        menu.appendChild(opt);
        return opt;
    }

    const dropdowns = document.querySelectorAll(".dropdown");
    dropdowns.forEach(dropdown=>{
        const menu = dropdown.querySelector("#box");
        const options = JSON.parse(dropdown.dataset.options);
        console.log(options);
        dropdown.addEventListener("click",()=>{
            if (menu.childElementCount < 2) return;
            if (menu.style.display != "flex") {
                menu.style.display = "flex";
                dropdown.classList.add("active");
            } else {
                menu.style.display = "none";
                dropdown.classList.remove("active");
            }
        });
        options.forEach(optN=>{
            createOpt(optN,dropdown,menu);
        });
        createOpt("",dropdown,menu);
    });
    document.body.addEventListener("click",(x)=>{
        dropdowns.forEach(dropdown=>{
            if (x.target != dropdown) {
                const menu = dropdown.querySelector("#box");
                menu.style.display = "none";
                dropdown.classList.remove("active");
            }
        });
    });

    document.getElementById("folder").addEventListener("change",(event)=>{
        const dropdown = document.getElementById("level-name");
        const menu = dropdown.querySelector("#box");
        menu.innerHTML = "";
        dropdown.querySelector("#text").textContent = "";
        const files = event.target.files;
        Array.from(files).forEach(file=>{
            if (file.name.toLowerCase().endsWith(".adofai")) {
                const opt = createOpt(file.name,dropdown,menu);
                opt.addEventListener("click",()=>{
                    dropdownOptClicked(opt,dropdown);
                });
            }
            const reader = new FileReader();
            reader.onload = ()=>{
                LEVEL_INFO.files[file.name] = reader.result;
            }
            if (!file.name.toLowerCase().endsWith(".adofai"))
                reader.readAsArrayBuffer(file);
            else
                reader.readAsText(file);
        });
    });

    const chooseLevelFile = document.getElementById("level-name");

    document.getElementById("convert").addEventListener("click",()=>{
        const levelFileName = chooseLevelFile.querySelector("#text").textContent;
        const levelData = LEVEL_INFO.files[levelFileName];
        if (!levelData) { alert("Invalid level!"); return };
        navigator.clipboard.writeText(levelData);
        alert("Copied ADOFAI level data to clipboard!");
        const levelJSON = JSON.parse(levelData);
        const songName = levelJSON.settings.songFilename;
        const songData = LEVEL_INFO.files[songName];
        const apiKey = document.getElementById("api-key").value;
        const userid = document.getElementById("userid").value;
        uploadAsset(apiKey,songData,"Audio",userid,songName,"audio/ogg");
    });

    document.querySelectorAll(".copy-code").forEach((btn)=>{
        const code = btn.parentElement.querySelector("code");
        btn.addEventListener("click",()=>{
            navigator.clipboard.writeText(code.textContent).then(()=>{
                btn.textContent = "Copied!";
                setTimeout(()=>{
                    btn.textContent = "Copy";
                },500);
            });
        });
    });
});

if (!isMobile()) {
    window.addEventListener("mousemove",function(m) {
        let cur = document.querySelector(".cursor");
        cur.style.left = m.x-xOffset + "px";
        cur.style.top = m.y-yOffset + "px";
        cur.style.display = "block";

        xVel += (m.x-lastX)/12;
        if (xVel > 90) {
            xVel = 90;
        } else if (xVel < -90) {
            xVel = -90;
        }

        if (justLoaded) {
            xVel = 0;
        }

        cur.style.rotate = xVel+"deg";

        lastX = m.x;

        justLoaded = false;
    });
    window.addEventListener("mousedown",function() {
        let cur = document.querySelector(".cursor");
        cur.style.scale = .85;
    });

    window.addEventListener("mouseup",function() {
        let cur = document.querySelector(".cursor");
        cur.style.scale = 1;
    });
}