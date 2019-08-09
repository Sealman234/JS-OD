// 取回資料
const xhr = new XMLHttpRequest();
xhr.open('get', 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97', true);
xhr.send(null);

let dataOrigin; // 取回的資料
let data; // dataOrigin 當中的旅遊資料

xhr.onload = function(){
    dataOrigin = JSON.parse(xhr.responseText);
    data = dataOrigin.result.records;

    // 製作 select 選單
    let origin = [];
    for(let i=0; i<data.length; i++){
        origin.push(data[i].Zone);
    }
    let result = Array.from(new Set(origin)); // 篩選出不重複的區域
    for(let i=0; i<result.length; i++){
        let option = document.createElement("option");
        option.setAttribute("value", result[i]);
        option.textContent = result[i];
        selectZone.appendChild(option);
    }

    init(); // 預載入
}

// 取得 Dom 元素
let selectZone = document.querySelector('.select-zone');
let hotZone = document.querySelector('.hot-zone');
let list = document.querySelector('.list');
let zoneTitle = document.querySelector('.title');
let pageList = document.querySelector('.pages');

// 監聽 & 更新
hotZone.addEventListener('click', clickZone); // 點擊熱門行政區
selectZone.addEventListener('change', setPage); // 選取地區後，計算該地區資料筆數
pageList.addEventListener('click', changePage); // 點擊頁碼

// 點擊熱門行政區按鈕，相當於選取該行政區的 option
function clickZone(e){
    if(e.target.nodeName == "BUTTON"){
        let str = e.target.textContent;
        for(let i=0; i<selectZone.length; i++){
            // 點擊熱門行政區 = 選取 select 裡的 option
            if(str == selectZone[i].value){
                selectZone.options[i].selected = true;
            }
        }
        let item = {
            target: {
                value: str,
            }
        }
        setPage(item);
    }
}

// 選取地區後，計算該地區資料筆數
let zoneName;
let currentPage; // 目前頁數
let count; // 該行政區的資料筆數
function setPage(e){
    zoneName = e.target.value;
    count = 0;
    for(let i=0; i<data.length; i++){
        if(zoneName == data[i].Zone){
            count++;
        }
    }
    currentPage = 1; // 第一頁

    makePages(); // 產生頁碼
    updateList(currentPage); // show 出第一頁
}

// 產生頁碼
let totalPages; // 總頁數
function makePages(){
    pageList.innerHTML = ''; // 整個頁碼區塊
    // 上一頁
    let prevLink = document.createElement("a");
    prevLink.textContent = "<prev";
    prevLink.setAttribute("class","prevLink");
    // 下一頁
    let nextLink = document.createElement("a");
    nextLink.textContent = "next>";
    nextLink.setAttribute("class","nextLink");
    // 頁碼
    let pageLink = document.createElement("div");
    if(count%4 != 0){
        totalPages = parseInt(count/4) + 1;
    }else{
        totalPages = parseInt(count/4);
    }
    for(let i=1; i<=totalPages; i++){
        let pageNumber = document.createElement("a");
        pageNumber.textContent = i;
        if (i == currentPage) {
            pageNumber.setAttribute("class", "active");
        }
        pageLink.appendChild(pageNumber);
    }
    // 第一頁 & 最後一頁
    if(currentPage == 1){
        prevLink.setAttribute("class", "prevLink non-active");
    }
    if(currentPage == totalPages){
        nextLink.setAttribute("class", "nextLink non-active");
    }

    // totalPages 不是零才產生頁碼
    if(totalPages != 0){
        pageList.appendChild(prevLink);
        pageList.appendChild(pageLink);
        pageList.appendChild(nextLink);
    }
    
}

// show 出資料
function updateList(selectPage){
    let str = '';
    let str_title = ''; // h2
    let temp = 0;
    let start = (selectPage-1)*4;
    let end = (selectPage-1)*4+4;
    
    for (let i=0; i<data.length; i++) {
        if(zoneName == data[i].Zone){
            temp++;
            if(start<temp && temp<=end){
                str_title = data[i].Zone; 
                // str += '<li><img src="'+data[i].Picture1+'"><span class="name">'+data[i].Name+'</span><p class="zone">'+data[i].Zone+'</p><div class="info"><p class="openTime">'+data[i].Opentime+'</p><p class="add">'+data[i].Add+'</p><p class="tel">'+data[i].Tel+'</p>';
                str += `<li>
                    <img src="${data[i].Picture1}">
                    <span class="name">${data[i].Name}</span>
                    <p class="zone">${data[i].Zone}</p>
                    <div class="info">
                        <p class="openTime">${data[i].Opentime}</p>
                        <p class="add">${data[i].Add}</p>
                        <p class="tel">${data[i].Tel}</p>`;

                if(data[i].Ticketinfo == ''){
                    // str += '<p class="ticketInfo hasNoTicketInfo">'+data[i].Ticketinfo+'</p></li>';
                    str += `<p class="ticketInfo hasNoTicketInfo">${data[i].Ticketinfo}</p></li>`;
                }else{
                    // str += '<p class="ticketInfo">'+data[i].Ticketinfo+'</p></div></li>';
                    str += `<p class="ticketInfo">${data[i].Ticketinfo}</p></div></li>`;
                }
            }
        }else if(zoneName == '請選擇行政區'){
            alert('請選擇行政區');
            break;
            // temp++;
            // if(start<temp && temp<=end){
            //     str += '<li><img src="'+data[i].Picture1+'"><span class="name">'+data[i].Name+'</span><p class="zone">'+data[i].Zone+'</p><p class="openTime">'+data[i].Opentime+'</p><p class="add">'+data[i].Add+'</p><p class="tel">'+data[i].Tel+'</p>';
            //     if(data[i].Ticketinfo == ''){
            //         str += '<p class="ticketInfo hasNoTicketInfo">'+data[i].Ticketinfo+'</p></li>';
            //     }else{
            //         str += '<p class="ticketInfo">'+data[i].Ticketinfo+'</p></li>';
            //     }
            // }
        }
    }
    
    list.innerHTML = str;
    zoneTitle.innerHTML = str_title; // h2
}

function changePage(e){
    e.preventDefault();
    let num = e.target.nodeName;
    if(num == 'A'){
        let str = e.target.textContent;
        if(str == "<prev"){
            if(currentPage != 1){
                currentPage--;
            }
        }else if(str == "next>"){
            if(currentPage != totalPages){
                currentPage++;
            }
        }else{
            currentPage = str;
        }
    }else{
        return;
    }

    makePages(); // currentPage 改變
    updateList(currentPage);
}

// 網頁預載入三民區的資料
let init = function(){
    zoneName = '三民區';
    count = 0;
    for(let i=0; i<data.length; i++){
        if(zoneName == data[i].Zone){
            count++;
        }
    }
    currentPage = 1; // 第一頁

    makePages(); // 產生頁碼
    updateList(currentPage); // show 出第一頁
}

