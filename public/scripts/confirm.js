document.addEventListener("DOMContentLoaded", function () {
  const confirmables = document.querySelectorAll("[data-confirm]");

  confirmables.forEach(el => {
    const msg = el.getAttribute("data-confirm");

    if (el.tagName === "FORM") {
      el.addEventListener("submit", async function (e) {
        e.preventDefault();
        const result = await Swal.fire({
          title: msg,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Evet",
          cancelButtonText: "İptal",
          reverseButtons: true
        });

        if (result.isConfirmed) {
          el.submit();
        }
      });
    }

    if (el.tagName === "A" || el.tagName === "BUTTON") {
      el.addEventListener("click", async function (e) {
        const href = el.getAttribute("href");
        if (!href) return;

        e.preventDefault();
        const result = await Swal.fire({
          title: msg,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Evet",
          cancelButtonText: "Hayır",
          reverseButtons: true
        });

        if (result.isConfirmed) {
          window.location.href = href;
        }
      });
    }
  });
});
