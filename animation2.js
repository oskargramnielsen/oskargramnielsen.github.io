const animateUpItems = document.querySelectorAll('.animate-up');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-up-active');
    }
  });
});

animateUpItems.forEach(item => {
  observer.observe(item);
});
