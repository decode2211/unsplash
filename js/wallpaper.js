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

        // Photographer credit
        const credit = document.getElementById("credit");

        credit.innerHTML = "";

        const text = document.createTextNode("Photo by ");
        const link = document.createElement("a");

        link.href = data.user.links.html;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = data.user.name;

        credit.appendChild(text);
        credit.appendChild(link);

    } catch (error) {
        console.error("Failed to load Unsplash wallpaper:", error);
    }
}