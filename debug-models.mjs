const API_KEY = "AIzaSyCo7hnCeYeBZOMeJKo00uj0S4CDJA91n6U";

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("MODELS_LIST_START");
            data.models.forEach(m => console.log(m.name));
            console.log("MODELS_LIST_END");
        } else {
            console.log("ERROR or NO MODELS:", JSON.stringify(data));
        }
    } catch (err) {
        console.error("Network Error:", err);
    }
}

listModels();
