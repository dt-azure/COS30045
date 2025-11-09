const storyButtons = document.querySelectorAll('.story-btn');

storyButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    storyButtons.forEach(b => b.classList.remove('active'));

    btn.classList.add('active');
  });
});
