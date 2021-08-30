const url = new URL('https://glq7fjiy07.execute-api.us-east-1.amazonaws.com/api/gallery?page=');

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

let gallery = document.getElementById('gallery');
const btnBack = document.getElementById('back');
const btnNext = document.getElementById('next');

let pageNumber = localStorage.getItem('page') ?? 1;
localStorage.setItem('page', pageNumber)

let pageSearch = /\?page=[0-9]/g
let str = location.search

if(str.match(pageSearch)){
    getParams()
} else {
    createGallery(pageNumber)
}

btnBack.addEventListener('click', function(){
    let pageNum = Number(localStorage.getItem('page'));

    if(pageNum == 1){
        localStorage.setItem('page', 5)
        createGallery(localStorage.getItem('page'));
    } else{
        pageNum--;
        localStorage.setItem('page', pageNum);
        createGallery(pageNum);
        console.log(pageNum)
    }
})

btnNext.addEventListener('click', function(){
    let pageNum = Number(localStorage.getItem('page'));

    if(pageNum == 5){
        localStorage.setItem('page', 1)
        createGallery(localStorage.getItem('page'));
    } else{
        pageNum++;
        localStorage.setItem('page', pageNum);
        createGallery(pageNum);
        console.log(pageNum)
    }
})


async function fetchPhotos(fetchurl){
    try{
        let response = await fetch(fetchurl, {
            method: 'GET',
            headers: {
                Authorization: localStorage.getItem('token'),
            }
        });
        let data = await response.json();
        return data.objects;
    } catch(err){
        console.log(err)
        
    }
}

async function createGallery(pageNumber){
    checkTime()

    gallery.innerHTML = "";

    let newUrl = url + pageNumber;
    const urlArr = await fetchPhotos(newUrl);
    
    for(let i = 0; i < 10; i++){
        gallery.innerHTML += `<img src=${urlArr[i]} height='400' width='400' style="object-fit: cover">`;
    }

    location.search = `?page=${pageNumber}`
}

async function getParams(){
    try{
        localStorage.setItem('page', params.page)
        let newUrl =  url + Number(localStorage.getItem('page'))
        gallery.innerHTML = "";

        let urlArr = await(fetchPhotos(newUrl))

        for(let i = 0; i < 10; i++){
        gallery.innerHTML += `<img src=${urlArr[i]} height='400' width='400' style="object-fit: cover">`;
    }
    checkTime()
    }
        catch(err){
            alert("Page should be greater than 0 and less than 6")
    }
}

function checkTime(){
    let timeNow = new Date()
    timeNow = timeNow.getUTCMinutes()
    let timeThen = localStorage.getItem('time')

    if(timeNow - timeThen >= 10){
        localStorage.removeItem('token')
        localStorage.removeItem('time')
        document.location.replace('./login.html')
    }
}
