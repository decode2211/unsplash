const ACCESS_KEY = "";

async function loadWallpaper(){

    try{

        const response = await fetch(
            `https://api.unsplash.com/photos/random?orientation=landscape&client_id=${ACCESS_KEY}`
        );

        const data = await response.json();

        document.body.style.backgroundImage =
            `url(${data.urls.full})`;

        document.getElementById("credit").innerHTML =
            `Photo by <a href="${data.user.links.html}" target="_blank" style="color:white;">
            ${data.user.name}
            </a>`;

    }

    catch(error){

        console.log(error);

    }

}

function updateClock(){

    const now = new Date();

    const time = now.toLocaleTimeString([],{

        hour:"2-digit",

        minute:"2-digit"

    });

    document.getElementById("clock").textContent = time;

}

loadWallpaper();

updateClock();

setInterval(updateClock,1000);