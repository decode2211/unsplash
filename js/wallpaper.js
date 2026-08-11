async function loadWallpaper() {
    try {
        if (!UNSPLASH_ACCESS_KEY) {
            throw new Error("Unsplash API key is missing.");
        }

        const response = await fetch(
            `https://api.unsplash.com/photos/random?orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
        );

        if (!response.ok) {
            throw new Error(
                `Unsplash API error: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();

        const imageUrl = data.urls.regular;

        // Preload image before applying it
        const image = new Image();

        image.onload = () => {
            document.body.style.backgroundImage = `url("${imageUrl}")`;
        };

        image.src = imageUrl;

        // Photographer + Unsplash attribution
        const credit = document.getElementById("credit");

        credit.innerHTML = "";

        const text = document.createTextNode("Photo by ");

        const photographerLink = document.createElement("a");

        photographerLink.href =
            `${data.user.links.html}?utm_source=auratab&utm_medium=referral`;

        photographerLink.target = "_blank";
        photographerLink.rel = "noopener noreferrer";
        photographerLink.textContent = data.user.name;

        const unsplashText = document.createTextNode(" on ");

        const unsplashLink = document.createElement("a");

        unsplashLink.href =
            "https://unsplash.com/?utm_source=auratab&utm_medium=referral";

        unsplashLink.target = "_blank";
        unsplashLink.rel = "noopener noreferrer";
        unsplashLink.textContent = "Unsplash";

        credit.appendChild(text);
        credit.appendChild(photographerLink);
        credit.appendChild(unsplashText);
        credit.appendChild(unsplashLink);

    } catch (error) {
        console.error("Failed to load Unsplash wallpaper:", error);
    }
}