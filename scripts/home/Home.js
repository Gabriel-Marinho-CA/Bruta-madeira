document.addEventListener("DOMContentLoaded", function () {
    initializeSwiper();
    initSwiperDeals();
    initSwiperCategories();
    initSwiperBrand();
    
  });
  
  function initializeSwiper() {
    new Swiper("#main-banner .swiper", {
      loop: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
      },
    });
  }

  function initSwiperDeals() {
    new Swiper("#deals .swiper", {
      loop: true,
      slidesPerView: 1,
      breakpoints: {
        320: {
          slidesPerView: 1,
        },
        1024: {
          slidesPerView: 5,
        },
      },
    });
  }

  function initSwiperCategories() {
    new Swiper("#categoriesNav .swiper", {
      loop: true,
      slidesPerView: 6.2,
      infinite: true,
      breakpoints: {
        320: {
          slidesPerView: 2.2,
          spaceBetween: 10,
        },
        640: {
          slidesPerView: 2.2,
          spaceBetween: 10,
        },
        1024: {
          slidesPerView: 6.2,
        },
      },
      navigation: {
        nextEl: "#categoriesNav .next",
        prevEl: "#categoriesNav .prev",
      },
    });
  }

  function initSwiperBrand() {
    new Swiper("#brandNav .swiper", {
      loop: true,
      slidesPerView: 6.2,
      infinite: true,
      breakpoints: {
        320: {
          slidesPerView: 2.5,
          spaceBetween: 16,
        },
        640: {
          slidesPerView: 2.5,
          spaceBetween: 16,
        },
        1024: {
          slidesPerView: 6.2,
        },
      },
      navigation: {
        nextEl: "#brandNav .next",
        prevEl: "#brandNav .prev",
      },
    });
  }