const url = new URL('https://glq7fjiy07.execute-api.us-east-1.amazonaws.com/api/gallery?page=');

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());


const pageSearch = /\?page=[1-5]/g

const gallery = document.getElementById('gallery');
const btnBack = document.getElementById('back');
const btnNext = document.getElementById('next');

let pageNumber = localStorage.getItem('page') ?? localStorage.setItem('page', 1);

if(location.search.match(pageSearch)){
    localStorage.setItem('page', params.page)
    pageNumber = localStorage.getItem('page')
}

createGalleryPage(pageNumber)


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

btnBack.addEventListener('click', function(){
    if(pageNumber === '1'){
        localStorage.setItem('page', '5')
        pageNumber = Number(localStorage.getItem('page'))
        console.log(localStorage.getItem('page'))
        return createGalleryPage(pageNumber)
    } else {
        pageNumber = Number(localStorage.getItem('page'))
        createGalleryPage(--pageNumber)
        localStorage.setItem('page', pageNumber)
    }
    
})

btnNext.addEventListener('click', function(){
    if(pageNumber === '5'){
        localStorage.setItem('page', '1')
        pageNumber = Number(localStorage.getItem('page'))
        console.log(localStorage.getItem('page'))
        return createGalleryPage(pageNumber)
    } else{
        pageNumber = Number(localStorage.getItem('page'))
        createGalleryPage(++pageNumber)
        localStorage.setItem('page', pageNumber)
    }
    
    
})

async function createGalleryPage(pageNumber){
    try{
        await displayPhotos(pageNumber)
        checkTime()
        updateLocation()
    }
    catch(err){
        alert(err.message)
    }
}

async function displayPhotos(pageNumber){
    try{
        let newUrl = 'https://glq7fjiy07.execute-api.us-east-1.amazonaws.com/api/gallery?page=' + pageNumber
        let fetchedPhotos = await(fetchPhotos(newUrl))
        
        gallery.innerHTML = "";
        
        fetchedPhotos.forEach(item => gallery.innerHTML += `<img src=${item} height='400'
        width='400' style="object-fit: cover">`)
    } catch(err) {
        alert("Page number must be in range from 1 to 5")
    }
    
}

function checkTime(){
    let timeNow = new Date()

    if(timeNow.getUTCMinutes() - localStorage.getItem('time') >= 1){
        localStorage.removeItem('token')
        localStorage.removeItem('time')
        document.location.replace('./index.html')
    }
}

function updateLocation(){
    if(location.search != `?page=${localStorage.getItem('page')}`){
        location.search = `?page=${localStorage.getItem('page')}`
    }
}
