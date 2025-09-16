import fs from "fs";
const API_KEY = "";
const url = "https://apis.roblox.com/assets/v1/assets";
const metadata = {
    assetType: "Decal",
    creationContext: {
        creator: {
            userId: -1,
        },
    },
    displayName: "Name",
    description: "Desc"
};
const fileBuffer = fs.readFileSync("image.png");
const formData = new FormData();
formData.append("request", JSON.stringify(metadata), {
    contentType: "application/json",
});
formData.append("fileContent", new Blob([fileBuffer]), "image.png");
const response = await fetch(url, {
    method: "POST",
    headers: {
        "x-api-key": API_KEY,
    },
    body: formData
});
const data = await response.json();
console.log(data);