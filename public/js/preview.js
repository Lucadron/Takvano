document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.querySelector('input[name="profilFoto"]');
    const previewImg = document.getElementById("preview-img");

    if (fileInput && previewImg) {
        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    previewImg.src = event.target.result;
                    previewImg.classList.remove("d-none");
                };
                reader.readAsDataURL(file);
            }
        });
    }
});
