'use strict';

// Modal window

//selecting elements

const section1 = document.querySelector('#section--1');
const btnScrolTo = document.querySelector('.btn--scroll-to');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');
const navheight = nav.getBoundingClientRect().height;
const sections = document.querySelectorAll('.section');
const imgs = document.querySelectorAll(`img[data-src]`);
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const prevbtn = document.querySelector('.slider__btn--left');
const nextbtn = document.querySelector('.slider__btn--right');
const dotcontainer = document.querySelector('.dots');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// 1st btn smooth function
btnScrolTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');

    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// adding tab functions

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;

  tabs.forEach(t => {
    t.classList.remove('operations__tab--active');
  });
  clicked.classList.add('operations__tab--active');

  // adding tab content
  tabContent.forEach(con =>
    con.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//navbar animations
const hoverhandler = function (e) {
  const link = e.target;
  const sibilings = link.closest('.nav').querySelectorAll('.nav__link');

  if (e.target.classList.contains('nav__link')) {
    sibilings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
  }
};

nav.addEventListener('mouseover', hoverhandler.bind(0.5));
nav.addEventListener('mouseout', hoverhandler.bind(1));

// navigation animation setting up

// const hoverhandler = function (e) {
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     console.log(link);
//     const sibilings = link.closest('.nav').querySelectorAll('.nav__link');
//     console.log(sibilings);
//     const logo = link.closest('.nav').querySelector('img');
//     sibilings.forEach(el => {
//       if (el !== link) {
//         el.style.opacity = this;
//       }
//     });
//     logo.style.opacity = this;
//   }
// };

// nav.addEventListener('mouseover', hoverhandler.bind(0.5));
// nav.addEventListener('mouseout', hoverhandler.bind(1));

//navbar animations

const navanim = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};
const headerobs = new IntersectionObserver(navanim, {
  root: null,
  threshold: 0,
  rootMargin: `-${navheight}px`,
});
headerobs.observe(header);

//scrolling animation

const scrollanim = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const scrollobs = new IntersectionObserver(scrollanim, {
  root: null,
  threshold: 0.1,
});

sections.forEach(sec => {
  scrollobs.observe(sec);
  sec.classList.add('section--hidden');
});

// implementing the img lazy load system

const lazyload = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.classList.remove('lazy-img');
  observer.unobserve(entry.target);
};
const imgobs = new IntersectionObserver(lazyload, {
  root: null,
  threshold: 0.2,
  rootMargin: '200px',
});

imgs.forEach(img => {
  imgobs.observe(img);
});

// implementing the slider

let currs = 0;
const maxs = slides.length - 1;

const createdots = function () {
  slides.forEach((s, i) => {
    dotcontainer.insertAdjacentHTML(
      'beforeend',
      `
      <button class="dots__dot dots__dot--active" data-slide="${i}"></button>`
    );
  });
};
createdots(currs);
const activedot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(el => el.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
activedot(0);
const gotoSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};
gotoSlide(0);
const nextslide = function () {
  if (currs === maxs) {
    currs = 0;
  } else {
    currs++;
  }
  gotoSlide(currs);
  activedot(currs);
};
nextbtn.addEventListener('click', nextslide);

const prevslide = function () {
  if (currs === 0) {
    currs = maxs;
  } else {
    currs--;
  }
  gotoSlide(currs);
  activedot(currs);
};
prevbtn.addEventListener('click', prevslide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') {
    nextslide();
  } else if (e.key === 'ArrowLeft') {
    prevslide();
  }
});

dotcontainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    gotoSlide(slide);
    activedot(slide);
  }
});
