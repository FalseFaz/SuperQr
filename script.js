const { ipcRenderer } = require("electron");

const url = document.querySelector("#url");
const generateBtn = document.querySelector("#generateBtn");
const background = document.querySelector("#background");
const dots = document.querySelector("#dots");
const downloadBtn = document.querySelector("#downloadBtn");

const qrcode = document.querySelector("#qrcode");
const notificationBanner = document.querySelector("#notificationBanner");

const notificationBanner_text = "Image copied to clipboard!";
const notificationBanner_time = 2000;

let imageData = null;

function showCopiedBanner(text, time) {
    notificationBanner.textContent = text;
    notificationBanner.style.display = "block";
    setTimeout(() => (notificationBanner.style.display = "none"), time);
}

generateBtn.addEventListener("click", () => {
    const options = {
        color: {
            dark: dots.value, // dots
            light: background.value, // background
        },
    };

    if (url.value !== "") ipcRenderer.send("generateQRCode", url.value, options);
});

downloadBtn.addEventListener("click", () => {
    if (imageData) {
        const link = document.createElement("a");
        link.download = "qrcode.png";
        link.href = imageData;
        link.click();
    } else console.error("No QR code available to download");
});

ipcRenderer.on("showQRCode", (event, data) => {
    imageData = data;
    const img = document.createElement("img");
    img.id = "qrimg";
    img.src = imageData;
    img.alt = "QR Code";
    qrcode.innerHTML = "";
    qrcode.appendChild(img);
    downloadBtn.style.display = "flex";
});

qrcode.addEventListener("click", () => {
    if (imageData) {
        const img = new Image();
        img.src = imageData;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
                const item = new ClipboardItem({ "image/png": blob });
                navigator.clipboard
                    .write([item])
                    .then(() => showCopiedBanner(notificationBanner_text, notificationBanner_time))
                    .catch((error) => {
                        console.error("Unable to copy image to clipboard", error);
                    });
            });
        };
    }
});
