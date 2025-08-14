document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".toggle-btn").forEach(function(btn) {
        btn.addEventListener("click", function() {
            let contentId = btn.getAttribute("data-toggle");
            let content = document.querySelector('ul[data-content="' + contentId + '"]');
            content.classList.toggle("md:hidden");
        });
    });    
})
 