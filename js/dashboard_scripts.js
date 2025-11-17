const storyLoaded = {
    "overview": true,
    1: false,
    2: false,
    3: false
};

const storyButtons = document.querySelectorAll(".story-btn");
const storyPages = document.querySelectorAll(".story-page");
const infoPanels = document.querySelectorAll(".dashboard-info");
const overviewBlock = document.querySelector(".viz-summary");

function fadeInVisualizations() {
    const vizBlocks = document.querySelectorAll(".story-page.active .viz-content");
    const infoBlock = document.querySelector(".dashboard-info.active");

    vizBlocks.forEach((block, i) => {
        block.classList.remove("visible");

        setTimeout(() => {
            block.classList.add("visible");
        }, i * 120);
    });

    infoBlock.classList.remove("visible");
    setTimeout(() => {
      infoBlock.classList.add("visible");
    }, 120);
}


const showLoader = () => {
    document.getElementById("loading-screen").style.display = "flex";
}

const hideLoader = () => {
    document.getElementById("loading-screen").style.display = "none";
}

const loadStory = async (id) => {
    if (id === "1") {
      await loadStory1();
      // fadeInVisualizations();
    };

    if (id === "2") {
      await loadStory2();
      // fadeInVisualizations();
    };
     
    if (id === "3") {
      await loadStory3();
      // fadeInVisualizations();
    } 
};

hideLoader();

storyButtons.forEach(btn => {
    btn.addEventListener("click", async () => {

        const storyId = btn.dataset.story;

        storyButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        storyPages.forEach(page => page.classList.remove("active"));
        document.querySelector(`.story-${storyId}`).classList.add("active");

        infoPanels.forEach(p => p.classList.remove("active"));
        if (storyId !== "overview") {
          document.querySelector(`.info-story-${storyId}`).classList.add("active");
        }

        if (storyId === "overview") {
          overviewBlock.classList.remove("visible");
          setTimeout(() => {
            overviewBlock.classList.add("visible");
          }, 120);
          return;
        }

        if (!storyLoaded[storyId]) {
            showLoader();

            await loadStory(storyId);

            hideLoader();
            storyLoaded[storyId] = true;
        }

        fadeInVisualizations();
    });
});

overviewBlock.classList.remove("visible");
setTimeout(() => {
  overviewBlock.classList.add("visible");
}, 120);