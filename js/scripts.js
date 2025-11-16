let story1Loaded = false;
let story2Loaded = false;
let story3Loaded = false;


const storyButtons = document.querySelectorAll('.story-btn');
const storyPages = document.querySelectorAll('.story-page');
const infoSection = document.querySelector('.dashboard-info');

storyButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    storyButtons.forEach(b => b.classList.remove('active'));

    btn.classList.add('active');

    const storyId = btn.dataset.story;

    storyPages.forEach(page => {
      page.classList.remove("active");
    });

    document.querySelector(`.story-${storyId}`).classList.add("active");

    if (storyId === "1" && !story1Loaded) {
        loadStory1();
        story1Loaded = true;
    }

    if (storyId === "2" && !story2Loaded) {
        loadStory2();
        story2Loaded = true;
    }

    if (storyId === "3" && !story3Loaded) {
        loadStory3();
        story3Loaded = true;
    }

    if (storyId === "overview") {
      infoSection.classList.remove('active');
    } else {
      infoSection.classList.add('active');
    }
  });
});