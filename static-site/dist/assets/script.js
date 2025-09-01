
// Ranganmag Static Site JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Add smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Add loading animation for PDF viewers
  const pdfViewers = document.querySelectorAll('.pdf-viewer');
  pdfViewers.forEach(viewer => {
    viewer.addEventListener('load', function() {
      this.style.opacity = '1';
    });
  });

  // Add article view tracking (if needed)
  if (window.location.pathname.includes('/articles/')) {
    console.log('Article viewed:', document.title);
  }
});
    