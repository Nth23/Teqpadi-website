// Optional: Adds scrolling control between sections
// const sections = document.querySelectorAll('section');
// let currentSectionIndex = 0;

// function scrollToSection(index) {
//   sections[index].scrollIntoView({ behavior: 'smooth' });
// }

// window.addEventListener('wheel', (event) => {
//   if (event.deltaY > 0) {
//     // Scrolling down
//     if (currentSectionIndex < sections.length - 1) {
//       currentSectionIndex++;
//       scrollToSection(currentSectionIndex);
//     }
//   } else {
//     // Scrolling up
//     if (currentSectionIndex > 0) {
//       currentSectionIndex--;
//       scrollToSection(currentSectionIndex);
//     }
//   }
// });

// JavaScript for Hamburger Menu
function showSideNav() {
    const sidenav = document.querySelector(".side-nav");
    sidenav.classList.toggle("visible");
  }
function hideSideNav() {
    const sidenav = document.querySelector(".side-nav");
    sidenav.classList.remove("visible");
  }
  
document.getElementById('bookNowBtn').onclick = function() {
  document.getElementById('authModal').style.display = 'flex';
};
document.getElementById('closeModal').onclick = function() {
  document.getElementById('authModal').style.display = 'none';
};
window.onclick = function(event) {
  if (event.target == document.getElementById('authModal')) {
    document.getElementById('authModal').style.display = 'none';
  }
};
document.getElementById('loginTab').onclick = function() {
  this.classList.add('active');
  document.getElementById('signupTab').classList.remove('active');
  document.getElementById('loginForm').style.display = 'flex';
  document.getElementById('signupForm').style.display = 'none';
};
document.getElementById('signupTab').onclick = function() {
  this.classList.add('active');
  document.getElementById('loginTab').classList.remove('active');
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('signupForm').style.display = 'flex';
};