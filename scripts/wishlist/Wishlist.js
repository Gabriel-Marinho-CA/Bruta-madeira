
document.addEventListener("DOMContentLoaded", function () {
    const productsArray = localStorage.getItem("wishlist");
  
    if (productsArray && JSON.parse(productsArray).length > 0) {
      getData(JSON.parse(productsArray));
    } else {
      document.querySelector(".empty").style.display = "block";
    }
  });
  
  async function getData(array) {
    const formatter = Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        style: "decimal",
    });
  
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
  
      await fetch(window.Shopify.routes.root + `products/${element}.js`)
        .then((response) => response.json())
        .then((product) => {
          const { handle, title, price, media, url, compare_at_price_min, variants } =
            product;
          const priceFormatted = formatter.format(price / 100);
  
          const image = media.filter((type) => type.media_type === "image");
  
          const listPriceHTML =
            compare_at_price_min > price
              ? `<p class="list-price text-[#999999] line-through text-sm font-black">DE: R$${formatter.format(
                  compare_at_price_min / 100
                )}</p>`
              : "";
  
          const discountTag = Math.floor((((price / 100) * 100) / (compare_at_price_min / 100) - 100) * -1);
          const installments = formatter.format(price / 100 / 12);
          const variantId = variants[0]?.id
  
          const item = document.createElement("li");
          item.classList.add("relative", "max-w-[318px]", "rounded", "border", "border-white", "bg-white", "relative", "transition-shadow", "hover:shadow-[0_6px_20px_0px_#0000000F]")
          item.innerHTML = `
  <div class="wrapper-shelf relative">
    <div class="min-h-[26px]"></div>
    <div class="wishlist absolute right-4 top-[42px] z-[1]">
      <button
        class="flex items-center justify-center w-5 h-5 group data-[wishlist=true]:rounded-full"
        aria-label="Adicionar a Lista de desejos"
        onclick="handleStoreWishList('${handle}', this)"
        data-wishlist="true"
      >
      ${svg}
      </button>
    </div>
    <div class="pdp-img relative flex items-center justify-center px-4">
      <a class="image-wrapper [&>img]:max-w-[205px] [&>img]:max-h-[205px]" href="${url}">
         <img src="${
                    image[0].src
                  }" width="427" height="650" alt="${title}" class="rounded-tl-lg rounded-tr-lg w-full max-w-48 max-h-48 mx-auto">
      </a>
      
      </div>
    </div>
    <a class="px-4 pdp-info-box flex flex-col gap-0 tablet:mt-1 pt-3 sm:pt-2" href="${url}">
      <h3 class="title-product text-sm text-custom-black font-black mb-4">
      ${title}
      </h3>
      <div class="shelf-price flex flex-col items-center gap-2 flex-wrap min-h-[28px] sm:min-h-fit justify-center">
        <div class="min-h-[20px]">${listPriceHTML}</div>
        <p class="best-price text-[#BA1A1A] font-black text-[28px] flex items-center justify-center gap-1"><span class="text-sm mt-1.5">R$</span> ${priceFormatted}</p>
      </div>
      <p class="text-[#777777] text-center text-xs">à vista no <span class="font-black">Pix</span> ou <span class="font-black">R$${installments}</span> em até 12x</p>
    </a>




<div class="px-4 pb-4 buy-btn space-shelf mt-4">
    <input
      type="hidden"
      name="id"
      value="{{ product.variants.first.id }}"
    >
    <div class="flex items-center">
      <div class="quantity-buttons-wrapper flex items-center bg-[#35735A] max-w-[86px] rounded px-1.5 py-2.5">
        <button
          class="quantity-buttons minus flex items-center justify-center border border-white text-white rounded-full w-5 h-5 text-base font-black gap-[5px]"
          data-action="minus"
          aria-label="Diminuir quantidade"
          type="button"
            onclick="changeShelfQty(this, 'minus')"
        >
        ${minusIco}
        </button>

        <input
          type="number"
          name="quantity"
          aria-label="quantidade"
          min="1"
          class="quantity_shelf mx-[3px] w-6 text-center bg-transparent text-white font-black text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none "
          data-max="{{ product.variants.first.inventory_quantity }}"
          value="1"
        >

        <button
          class="quantity-buttons plus flex items-center justify-center border border-white text-white rounded-full w-5 h-5 text-base font-black"
          data-action="plus"
          aria-label="Aumentar quantidade"
          type="button"
            onclick="changeShelfQty(this, 'plus')"
        >
           ${plusIco}
        </button>

        <input type="hidden" name="product-quantity" value="{{ product.variants.first.inventory_quantity }}">
      </div>

      <div class="submit-btn-area w-full ml-[1px]">
        <button
          type="submit"
          class="w-full bg-[#35735A] text-white px-4 py-2 rounded hover:bg-[#2e5d4d] transition duration-200 ease-out flex items-center justify-center"
          onclick="addToCart(this)"
          data-id="${variantId}"
        >
          ${icoCartShelf}
          Adicionar
        </button>
      </div>
    </div>
</div>




  </div>
  
            `;
  
          document.querySelector(".wrapper-wishlist").appendChild(item);
        });
    }
  }
  
  const svg = `<svg class="group-data-[wishlist=true]:fill-red-500" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M10.4242 4.9785L9.99998 5.40926L9.57569 4.97843C8.80211 4.19255 7.74551 3.75 6.64277 3.75C5.54004 3.75 4.48343 4.19255 3.70985 4.97843V4.97843C2.09672 6.63614 2.09672 9.27687 3.70985 10.9346L8.20373 15.4976C8.67751 15.9789 9.32464 16.25 10 16.25C10.6754 16.25 11.3225 15.9789 11.7963 15.4976L16.2902 10.9347C17.9033 9.27695 17.9033 6.63622 16.2902 4.9785V4.9785C15.5166 4.1926 14.4599 3.75003 13.3572 3.75003C12.2544 3.75003 11.1978 4.19259 10.4242 4.9785Z" stroke="#919191" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
    `;

const icoCartShelf = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.40921 14.246L5.87421 7H18.5002C19.1512 7 19.6282 7.611 19.4702 8.243L18.1222 13.635C17.9172 14.454 17.2212 15.056 16.3812 15.14L9.56521 15.822C8.54921 15.923 7.62021 15.244 7.40921 14.246Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11 11.25H14.25" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.625 9.625V12.875" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.874 7L5.224 4H3.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17.1093 19.2671C16.9073 19.2671 16.7433 19.4311 16.7453 19.6331C16.7453 19.8351 16.9093 19.9991 17.1113 19.9991C17.3133 19.9991 17.4773 19.8351 17.4773 19.6331C17.4763 19.4311 17.3123 19.2671 17.1093 19.2671" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.69693 19.267C8.49493 19.267 8.33093 19.431 8.33293 19.633C8.33093 19.836 8.49593 20 8.69793 20C8.89993 20 9.06393 19.836 9.06393 19.634C9.06393 19.431 8.89993 19.267 8.69693 19.267" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`
const plusIco = `<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.33331 4.55553H4.55553V7.33331C4.55553 7.63886 4.30553 7.88886 3.99997 7.88886C3.69442 7.88886 3.44442 7.63886 3.44442 7.33331V4.55553H0.66664C0.361084 4.55553 0.111084 4.30553 0.111084 3.99997C0.111084 3.69442 0.361084 3.44442 0.66664 3.44442H3.44442V0.66664C3.44442 0.361084 3.69442 0.111084 3.99997 0.111084C4.30553 0.111084 4.55553 0.361084 4.55553 0.66664V3.44442H7.33331C7.63886 3.44442 7.88886 3.69442 7.88886 3.99997C7.88886 4.30553 7.63886 4.55553 7.33331 4.55553Z" fill="white"/>
</svg>
`
const minusIco = `<svg width="8" height="2" viewBox="0 0 8 2" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.33343 1.55557H0.666762C0.361206 1.55557 0.111206 1.30557 0.111206 1.00001C0.111206 0.694458 0.361206 0.444458 0.666762 0.444458H7.33343C7.63898 0.444458 7.88898 0.694458 7.88898 1.00001C7.88898 1.30557 7.63898 1.55557 7.33343 1.55557Z" fill="white"/>
</svg>
`