const createCollectionSwiper = (id) => {
    const element = `#${id} .swiper`;
  
    new Swiper(element, {
      loop: true,
      slidesPerView: 1.5,
      spaceBetween: 10,
      navigation: {
        nextEl: `#${id} .swiper-button-next-custom`,
        prevEl: `#${id} .swiper-button-prev-custom`,
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 12,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 12,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
      },
    });
  };
  