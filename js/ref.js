let dataUrl = "https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97";
let dataOrigin; //取回的資料
let dataRecords; //dataOrigin 中的旅遊資料
let selZone = document.querySelector(".sel-zone");
let loading = document.querySelector(".lds-css");
let wrapper = document.querySelector(".wrapper");

let dataZone = ["- - 請選擇行政區 - -"]; //用來產生 select 的陣列

let xhr = new XMLHttpRequest();
xhr.open("get", dataUrl, true);
xhr.send();
xhr.onload = function () {
    dataOrigin = JSON.parse(xhr.responseText);
    dataRecords = dataOrigin.result.records
    //挑出旅遊資料中的行政區
    dataRecords.forEach(function (item, index, arr) {
        for (let i = 0; i < dataZone.length; i++) {
            if (item.Zone == dataZone[i]) {
                break;
            }
            //如果「旅遊資料中的行政區」不在陣列中，就放入陣列
            else if (item.Zone != dataZone[i] && i == dataZone.length - 1) {
                dataZone.push(item.Zone);
            }
        }
    });
    showOpts(dataZone); //產生 options in select
    loading.setAttribute("class", "lds-css ng-scope hide-loading");
    wrapper.setAttribute("class", "wrapper show-web");
};

function showOpts(data) {
    for (let i = 0; i < data.length; i++) {
        let opt = document.createElement("option");
        opt.setAttribute("value", data[i]);
        opt.textContent = data[i];
        selZone.appendChild(opt);
    }
}


// 點擊「熱門行政區」產生資料
let hotsZone = document.querySelector(".hots-zone");
hotsZone.addEventListener("click", checkZone);

function checkZone(e) {
    if (e.target.nodeName == "BUTTON") {
        let txt = e.target.textContent;
        // 讓「select的選項」=「點擊的熱門行政區」
        for (let i = 0; i < selZone.options.length; i++) {
            if (txt == selZone.options[i].text) {
                selZone.options[i].selected = true;
            }
        }
        let data = {
            target: {
                value: txt
            }
        };
        showSitePages(data);
    }
}

// 點擊「select中選項」或「頁碼」產生資料
let ctnTitle = document.querySelector(".content-title");
let ctnSites = document.querySelector(".content-sites ul");
let ctnPages = document.querySelector(".content-pages");
let zoneName;
let pages; // 產生的頁數
let currentPage; // 目前所在頁數
let hits; // 該區總共多少筆資料
selZone.addEventListener("change", showSitePages);
ctnPages.addEventListener("click", checkPage);

// 點擊「select中選項」
function showSitePages(e) {
    zoneName = e.target.value;
    if (zoneName == dataZone[0]) {
        ctnTitle.innerHTML = "請選擇行政區";
    } else {
        ctnTitle.innerHTML = zoneName;
    }
    hits = 0;
    //判斷該區共有多少筆資料
    for (let i = 0; i < dataRecords.length; i++) {
        if (zoneName == dataRecords[i].Zone) {
            hits += 1;
        }
    }
    currentPage = 1;
    makePages();
    showSite(currentPage);
}

// 點擊「頁碼」
function checkPage(e) {
    e.preventDefault();
    if (e.target.nodeName == "A") {
        let txt = e.target.textContent;
        if (txt == "<prev") {
            if (currentPage != 1) {
                currentPage--;
            }
        } else if (txt == "next>") {
            if (currentPage != pages) {
                currentPage++;
            }
        } else {
            currentPage = txt;
        }
        makePages();
        showSite(currentPage);
    }
}

// 製造「頁碼」
function makePages() {
    ctnPages.innerHTML = "";
    // 產生 <prev 連結
    let prevLink = document.createElement("a");
    //prevLink.setAttribute("href", "#");
    prevLink.textContent = "<prev";
    // 產生 next> 連結
    let nextLink = document.createElement("a");
    nextLink.textContent = "next>";
    // 產生中間頁碼
    let pagesIn = document.createElement("div");
    pagesIn.setAttribute("class", "pages-inner");
    pages = Math.ceil(hits / 4);
    for (let i = 0; i < pages; i++) {
        let aPage = document.createElement("a");
        aPage.textContent = i + 1;
        if (i == currentPage - 1) {
            aPage.setAttribute("class", "active");
        }

        pagesIn.appendChild(aPage);
    }

    if (pages > 1) {
        prevLink.setAttribute("class", "show-prev");
        nextLink.setAttribute("class", "show-next");
        if (currentPage == 1) {
            prevLink.setAttribute("class", "show-prev stop-action");
        } else if (currentPage == pages) {
            nextLink.setAttribute("class", "show-next stop-action");
        }
    }
    // 如果在第一頁或最後一頁，<prev 和 next> 不能點擊

    ctnPages.appendChild(prevLink);
    ctnPages.appendChild(pagesIn);
    ctnPages.appendChild(nextLink);
}

let goTop = document.querySelector(".icon-goTop");
// 產生資料
function showSite(selPage) {
    ctnSites.innerHTML = "";
    let count = 0;
    let start = (selPage - 1) * 4;
    let end = (selPage - 1) * 4 + 4;
    for (let i = 0; i < dataRecords.length; i++) {
        if (zoneName == dataRecords[i].Zone) {
            count++;
            if (start < count && count <= end) {
                //製造 site-outer div
                let divOut = document.createElement("li");
                divOut.setAttribute("class", "site-outer");

                //製造 site 上半部
                let divUp = document.createElement("div");
                divUp.setAttribute("class", "site-up");
                //放置 景點圖片
                divUp.style.backgroundImage = "url('" + dataRecords[i].Picture1 + "'";
                //製造 內部文字區塊
                let divUpIn = document.createElement("div");
                divUpIn.setAttribute("class", "site-up-inner");
                //製造 景點名稱
                let pName = document.createElement("h3");
                pName.setAttribute("class", "site-title");
                pName.textContent = dataRecords[i].Name;
                //製造 景點所在區
                let pZone = document.createElement("p");
                pZone.setAttribute("class", "site-zone");
                pZone.textContent = dataRecords[i].Zone;
                //景點名稱、所在區 放入內部文字區塊，文字區塊放入 site 上半部
                divUpIn.appendChild(pName);
                divUpIn.appendChild(pZone);
                divUp.appendChild(divUpIn);

                //製造 site 下半部
                let divDown = document.createElement("div");
                divDown.setAttribute("class", "site-down");
                //製造 開放時間
                let pTime = document.createElement("p");
                pTime.textContent = dataRecords[i].Opentime;
                //製造 地址
                let pAdd = document.createElement("p");
                pAdd.textContent = dataRecords[i].Add;
                //製造 電話
                let pTel = document.createElement("p");
                pTel.textContent = dataRecords[i].Tel;
                //製造 門票資訊
                let pTktInfo = document.createElement("p");
                pTktInfo.textContent = dataRecords[i].Ticketinfo;
                //開放時間、地址、電話、門票資訊放入 site 下半部
                divDown.appendChild(pTime);
                divDown.appendChild(pAdd);
                divDown.appendChild(pTel);
                divDown.appendChild(pTktInfo);

                //site 上半部和下半部放進 site-outer div 中
                divOut.appendChild(divUp);
                divOut.appendChild(divDown);

                //site-outer div 放進 html content-sites 中
                ctnSites.appendChild(divOut);
            }
        }
    }

    // 顯示 goTop 按鈕
    if (count >= 1) {
        goTop.style.display = "block";
    } else {
        goTop.style.display = "none";
    }
}
