const redirect = (page) => {
    window.location.href = page;
}

document.getElementById("home-nav-btn").addEventListener('click', () => {
    redirect("index.html")
});

document.getElementById("about-nav-btn").addEventListener('click', () => {
    redirect("about.html")
});

document.getElementById("contact-nav-btn").addEventListener('click', () => {
    redirect("contact.html")
});