const observer = new MutationObserver(() => {
    if (window.innerWidth < 1000) {
      const swiperH = document.querySelector(".swiper-main").clientHeight;
      document.querySelector(".swiper-thumbnails").style.height = `${swiperH}px`;
    }
  });
  
  observer.observe(document, { childList: true, subtree: true });
  
  document.addEventListener("DOMContentLoaded", function () {
    const defaultCheckedInput = document.querySelector(
      'input[type="radio"][checked]'
    );
    document.querySelectorAll(".swiper-main video").forEach((el) => {
      el.play();
    });
    if (defaultCheckedInput) {
      handleVariant(defaultCheckedInput);
    }
  
    handleProductRecomendations();
    swiperProductWouldLike();
  });
  
  document.addEventListener("DOMContentLoaded", () => {
    if (window.innerWidth < 1000) {
      window.swiperThumbs = new Swiper(".swiper-thumbnails", {
        direction: "horizontal",
        slidesPerView: "auto",
        resistanceRatio: 0,
        resistance: false
      });
    } else {
      window.swiperThumbs = new Swiper(".swiper-thumbnails", {
        direction: "vertical",
        slidesPerView: "auto",
        freeMode: true,
        watchSlidesProgress: true,
        slideToClickedSlide: true,
      });
    }
  
    window.swiperMain = new Swiper(".swiper-main", {
      slidesPerView: 1,
      spaceBetween: 12,
      allowTouchMove : false,
      navigation: {
        nextEl: ".swiper-button-next-custom-main-product",
        prevEl: ".swiper-button-prev-custom-main-product",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      speed: 1,
      thumbs: {
        swiper: window.swiperThumbs,
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
        },
        1024: {
          slidesPerView: 1,
        },
      },
    });
  });

function handleVariant(clickedInput) {
  const selectedOptions = {};
  document.querySelectorAll('input[type="radio"]:checked').forEach((input) => {
    selectedOptions[input.name] = input.value;
  });

  const allLabels = document.querySelectorAll(`label[for^="${clickedInput.name.toLowerCase()}-"]`);
  allLabels.forEach((label) => label.removeAttribute("data-selected-variant"));

  const selectedLabel = document.querySelector(`label[for="${clickedInput.id}"]`);
  selectedLabel?.setAttribute("data-selected-variant", "true");

  const matchedVariant = window.allVariants.find((variant) => {
    return Object.entries(selectedOptions).every(([key, value]) => {
      return variant.options[key] === value;
    });
  });

  if (matchedVariant) {
    const variantInput = document.querySelector('input[name="id"]');
    variantInput.value = matchedVariant.id;

    const acabamento = matchedVariant.options["acabamentos"]?.toLowerCase() || '';
    const tamanho = matchedVariant.options["tamanho"]?.toLowerCase() || '';

    const hasAcabamento = !!acabamento;
    const hasTamanho = !!tamanho;

    if (hasAcabamento && hasTamanho) {
      updateSlidesByVariant(acabamento, tamanho);
    } else {
      const selected = acabamento || tamanho;
      updateImagesByAcabamento(selected);
    }

    const priceVariant = document.querySelector(".list-price-discount-auto");
    const priceVariantSelected = clickedInput.getAttribute('data-spot-price');
    priceVariant.innerText = priceVariantSelected;

    const installmentVariant = document.querySelector('.installment-variant-value');
    const installmentVariantSelected = clickedInput.getAttribute('data-installment-price');
    installmentVariant.innerText = installmentVariantSelected;

    const variantName = document.querySelector('.variant-selected-name');
    const titleVariantSelected = clickedInput.getAttribute('data-variant-title');
    variantName.innerText = titleVariantSelected;


    const listPriceDiscountVariant = document.querySelector('.best-price-text');
    const listPriceDiscountVariantSelected = clickedInput.getAttribute('data-list-price-discount');
    listPriceDiscountVariant.innerText = listPriceDiscountVariantSelected;

    
    
    const buyButton = document.querySelector('#buy-button');
    buyButton.setAttribute('data-id', matchedVariant.id);
  }

  const allOptions = Array.from(document.querySelectorAll('input[type="radio"]'));

  allOptions.forEach((input) => {
    const optionGroup = input.name;
    const value = input.value;

    const testSelection = {
      ...selectedOptions,
      [optionGroup]: value
    };

    const possible = window.allVariants.some((variant) => {
      return Object.entries(testSelection).every(([key, val]) => variant.options[key] === val) &&
             variant.inventory_quantity > 0;
    });

    const label = document.querySelector(`label[for="${input.id}"]`);

    if (!possible) {
      input.disabled = true;
      label?.setAttribute("data-disabled", "true");
    } else {
      input.disabled = false;
      label?.removeAttribute("data-disabled");
    }
  });
}

  const removeOldSelectionVariant = (optionName) => {
    document.querySelectorAll(`input[name='${optionName}']`)
      .forEach((el) => {
        el.nextElementSibling.removeAttribute("data-selected-variant");
      });
  };
  

  async function createShippingRates(shippingData) {
    const url_prepare = `/cart/prepare_shipping_rates.json`;
    
  
    const requestData = {
      "shipping_address[zip]": shippingData.zip,
      "shipping_address[country]": shippingData.country,
      "shipping_address[province]": shippingData.province,
    };
  
    const request = await fetch(url_prepare, {
      method: "POST",
      body: requestData,
    });
    const response = await request.json(); 
  
    if (response.ok) {
      await getShippingRates(shippingData);
    } else {
      console.error("Erro na solicitação:", response.error);
    }
  }
  
  async function getShippingRates(shippingData) {
    if (shippingData) {
      const url_async = `/cart/shipping_rates.json?shipping_address%5Bzip%5D=${shippingData.zip}&shipping_address%5Bcountry%5D=Brazil&shipping_address%5Bprovince%5D=${shippingData.province}`;
  
      const request = await fetch(url_async, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const response = await request.json();
  
      if (response.ok) {
        if (response.shipping_rates) {
          createShippingTable(response.shipping_rates);
        }
      } else {
        console.error(response.error);
      }
    }
  }
  
  async function calculateShipping(skuId) {
    let productObj = {
      items: [
        {
          id: skuId,
          quantity: 1
        }
      ],
    };
  
    await addItemToCart(productObj);
  
    let cep = document.querySelector("#cep-calc").value.replace("-", "");
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((response) => response.json())
      .then((resProvince) => {
        if (resProvince.erro) {
          alert("CEP inválido");
          return;
        }

        document.querySelector(".shipping-area .spinner").classList.remove("hidden");
  
        const estados = {
          AC: "Acre",
          AL: "Alagoas",
          AP: "Amapá",
          AM: "Amazonas",
          BA: "Bahia",
          CE: "Ceará",
          DF: "Distrito Federal",
          ES: "Espírito Santo",
          GO: "Goiás",
          MA: "Maranhão",
          MT: "Mato Grosso",
          MS: "Mato Grosso do Sul",
          MG: "Minas Gerais",
          PA: "Pará",
          PB: "Paraíba",
          PR: "Paraná",
          PE: "Pernambuco",
          PI: "Piauí",
          RJ: "Rio de Janeiro",
          RN: "Rio Grande do Norte",
          RS: "Rio Grande do Sul",
          RO: "Rondônia",
          RR: "Roraima",
          SC: "Santa Catarina",
          SP: "São Paulo",
          SE: "Sergipe",
          TO: "Tocantins",
        };
  
        const shippingData = {
          zip: cep,
          country: "Brazil",
          province: estados[resProvince.uf],
        };
  
        createShippingRates(shippingData,skuId);
      })
      .catch((error) => console.error(error));
  }
  
  function createShippingRates(shippingData,skuId) {
    const urlPrepare = "/cart/prepare_shipping_rates.json";
    const requestData = new URLSearchParams({
      "shipping_address[zip]": shippingData.zip,
      "shipping_address[country]": shippingData.country,
      "shipping_address[province]": shippingData.province,
    });
  
    fetch(urlPrepare, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: requestData,
    })
      .then((response) => {
        if (response.ok) {
          getShippingRates(shippingData,skuId);
        } else {
          console.error(response.statusText);
        }
      })
      .catch((error) => console.error(error));
  }
  
  function getShippingRates(shippingData,skuId) {
    const urlAsync = `/cart/shipping_rates.json?shipping_address[zip]=${shippingData.zip}&shipping_address[country]=Brazil&shipping_address[province]=${shippingData.province}`;
  
    fetch(urlAsync)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
  
        if (result.shipping_rates) {
          createShippingTable(result.shipping_rates, skuId);
        }
      })
      .catch((error) => console.error(error));
  }
  
  async function createShippingTable(shippingRates, skuId) {
    const shippingArea = document.getElementById("shipping-area");
    shippingArea.innerHTML = "";

    document.querySelector(".shipping-area .spinner").classList.add("hidden");
  
    const cartData = await fetch("/cart.js", {
      headers: {
        Accept: "application/json",
      },
    }).then((response) => response.json());
    const cartTotal = cartData.total_price / 100;
  
    if (shippingRates && shippingRates.length > 0) {
      const element = document.createElement("div");
      element.className =
        "shipping-table mt-4 rounded w-full border border-[#cecece] px-4 py-[.3rem]";
        shippingRates.forEach((rate) => {        
          let nameShipping =
            rate.name === "Local Delivery" ? rate.description : rate.name;
          const isFree = rate.name === "Bruta Online";
          let priceShipping = isFree
            ? `<span class="text-[#35735A] font-bold">Frete Grátis</span>`
            : `R$${rate.price.replace(".", ",")}`;
        
          let deliveryDays = rate.delivery_days?.[0]
            ? `<p class="text-xs">Em até ${rate.delivery_days[0]} dias úteis</p>`
            : `<p class="text-xs">${rate.description}</p>`;
        
          const cell = document.createElement("div");
          cell.className = "shipping-line py-4 border-b border-[#cecece]";
          cell.innerHTML = `
            <div>
              <p class="font-bold mb-2">${nameShipping}</p>
              <div class="flex items-center justify-between">
                ${deliveryDays}
                <p class="text-xs">${priceShipping}</p>
              </div>
            </div>
          `;
          element.appendChild(cell);
        });
  
      shippingArea.appendChild(element);
  
      const deleteItem = {
        id: skuId,
        quantity: 0,
      }
  
      deleteItemFromCart(deleteItem)
      
    } else {
      const noShippingMessage = document.createElement("p");
      noShippingMessage.className = "no-shipping-message";
      noShippingMessage.textContent =
        "Nenhuma opção de frete disponível para o CEP informado.";
      shippingArea.appendChild(noShippingMessage);
    }
  }
  
  function handleProductRecomendations() {
    const productRecommendationsSection = document.querySelector(
      "#would_like_too .product-recommendations"
    );
  
    const url = productRecommendationsSection.dataset.url;
  
    try {
      fetch(url)
        .then((response) => response.text())
        .then((text) => {
          const html = document.createElement("div");
          html.innerHTML = text;
          const recommendations = html.querySelector(
            "#would_like_too .product-recommendations"
          );
  
          if (recommendations && recommendations.innerHTML.trim().length) {
            productRecommendationsSection.innerHTML = recommendations.innerHTML;
            swiperProductRecomendations();
            const timers = document.querySelectorAll(".countdown-timer");        
            timers.forEach(timer => {
              const endDateTimeStr = timer.dataset.endDatetime;
              if (!endDateTimeStr) return;
            
              const adjustedEndDateTime = new Date(endDateTimeStr);
              const now = new Date();
              if (adjustedEndDateTime > now) {        
                startCountdown(timer, adjustedEndDateTime);
              } else {
                timer.classList.add("invisible"); 
              }
            });
          }
        });
    } catch (error) {
      console.error(error);
    }
  }
  const swiperProductRecomendations = () => {
    new Swiper("#would_like_too .swiper", {
      loop: true,
      slidesPerView: 1.3,
      spaceBetween: 24,
      navigation: {
        nextEl: "#would_like_too .swiper-button-next-custom",
        prevEl: "#would_like_too .swiper-button-prev-custom",
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 24,
        },
      },
    });
  };
  
  const swiperProductWouldLike = () => {
    new Swiper("#would_like_pdp .swiper", {
      loop: true,
      slidesPerView: 1.3,
      spaceBetween: 24,
      navigation: {
        nextEl: "#would_like_pdp .swiper-button-next-custom",
        prevEl: "#would_like_pdp .swiper-button-prev-custom",
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 24,
        },
      },
    });
  };
  
  const addBuyTogether = async (button) => {    
    const variantIds = button.dataset.variants.split(",").filter((id) => id);
    const items = variantIds.map((id) => ({
      id: parseInt(id),
      quantity: 1,
    }));

    const payload = { items };

    const response = await addItemToCart(payload);
  
    if (response && response.ok) {
      await updateMiniCartInFront(true);
      openMinicart();
    }
  };

document.addEventListener("DOMContentLoaded", function () {
  const initialVariant = window.allVariants?.[0];
  if (!initialVariant) return;

  const acabamento = initialVariant.options["acabamentos"]?.toLowerCase() || '';
  const tamanho = initialVariant.options["tamanho"]?.toLowerCase() || '';

  const hasAcabamento = !!acabamento;
  const hasTamanho = !!tamanho;

  if (hasAcabamento && hasTamanho) {
    updateSlidesByVariant(acabamento, tamanho);
  } else {
    const selected = acabamento || tamanho;
    updateImagesByAcabamento(selected);
  }
});

function updateImagesByAcabamento(selectedAcabamento) {
  const normalized = selectedAcabamento?.toLowerCase() || '';

  if (!normalized) {
    document.querySelectorAll('.swiper-slide[data-media]').forEach(slide => {
      slide.style.display = 'block';
    });

    document.querySelectorAll('.swiper.swiper-thumbnails .swiper-slide').forEach(thumb => {
      thumb.style.display = 'block';
    });

    return;
  }

  document.querySelectorAll('.swiper-slide[data-media]').forEach(slide => {
    const mediaTag = slide.getAttribute('data-media') || '';
    slide.style.display = mediaTag === normalized ? 'block' : 'none';
  });

  document.querySelectorAll('.swiper.swiper-thumbnails .swiper-slide').forEach(thumb => {
    const mediaTag = thumb.getAttribute('data-media')?.toLowerCase() || '';
    thumb.style.display = mediaTag === normalized ? 'block' : 'none';
  });

  setTimeout(() => {
    const thumbs = Array.from(document.querySelectorAll('.swiper.swiper-thumbnails .swiper-slide'))
      .filter(thumb => thumb.style.display !== 'none');

    if (thumbs.length > 0) {
      const firstVisibleThumb = thumbs[0];
      const allThumbs = Array.from(document.querySelectorAll('.swiper.swiper-thumbnails .swiper-slide'));
      const index = allThumbs.indexOf(firstVisibleThumb);

      if (window.swiperThumbs?.slideTo) {
        window.swiperThumbs.slideTo(index);
      }
      if (window.swiperMain?.slideTo) {
        window.swiperMain.slideTo(index);
      }
    }
  }, 50);
}

  function updateSlidesByVariant(acabamento, tamanho) {
    function normalize(str) {
      return str?.toLowerCase().replace(/\s+/g, '-').trim() || '';
    }

    const key = `${normalize(acabamento)}-${normalize(tamanho)}`;
    const variantImagesJSON = document.getElementById("variant-images-json");
    if (!variantImagesJSON) return;

    const variantImages = JSON.parse(variantImagesJSON.textContent);
    const images = variantImages[key] || [];
    
    const mainWrapper = document.querySelector('.swiper-main .swiper-wrapper');
    const thumbWrapper = document.querySelector('.swiper-thumbnails .swiper-wrapper');

    mainWrapper.innerHTML = '';
    thumbWrapper.innerHTML = '';

    images.forEach(url => {
      const mainSlide = document.createElement('li');
      mainSlide.className = 'swiper-slide';
      mainSlide.innerHTML = `<img src="${url}" class="mx-auto max-w-[547px] max-h-[547px]" alt="Imagem da variação">`;
      mainWrapper.appendChild(mainSlide);

      const thumbSlide = document.createElement('li');
      thumbSlide.className = 'swiper-slide w-20 max-w-20 cursor-pointer rounded !h-auto border-2 border-[#C6C6C6]';
      thumbSlide.innerHTML = `<img src="${url}" class="md:max-h-[75px] md:mx-auto" alt="Thumb da variação">`;
      thumbWrapper.appendChild(thumbSlide);
    });

    setTimeout(() => {
      if (window.swiperMain) {
        window.swiperMain.update();
        window.swiperMain.slideTo(0);
      }
      if (window.swiperThumbs) {
        window.swiperThumbs.update();
        window.swiperThumbs.slideTo(0);
      }
    }, 50);
}
