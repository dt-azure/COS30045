function redirect(page) {
    window.location.href = page;
}

document.getElementById("home-nav-btn").addEventListener('click', () => {
    redirect("index.html")
})
document.getElementById("tele-nav-btn").addEventListener('click', () => {
    redirect("television.html")
})
document.getElementById("about-nav-btn").addEventListener('click', () => {
    redirect("about.html")
})

