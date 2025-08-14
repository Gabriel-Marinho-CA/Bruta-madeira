let formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

Shopify.queryParams = {};

if (location.search.length) {
  var params = location.search.substr(1).split("&");

  for (var i = 0; i < params.length; i++) {
    var keyValue = params[i].split("=");
    var key = decodeURIComponent(keyValue[0]);
    var value = decodeURIComponent(keyValue[1]);

    if (keyValue.length) {
      if (Shopify.queryParams[key]) {
        Shopify.queryParams[key].push(value);
      } else {
        Shopify.queryParams[key] = [value];
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let isChecked = document.getElementById("Filter-filter.p.tag-1").checked;
  if(isChecked) document.querySelector(".sr-only.peer").click()
});

document.querySelectorAll(".wrapper-select-sort-by select").forEach((el) => {
  el.addEventListener("change", function (e) {
    const value = e.target.value;
    redirectUserOrderBy(value);
  });
});

function redirectUserOrderBy(value) {
  Shopify.queryParams.sort_by = value;
  location.search = decodeURIComponent(
    new URLSearchParams(Shopify.queryParams).toString()
  );
}

const sliderElements = {
    sliderOne: document.getElementById("slider-1"),
    sliderTwo: document.getElementById("slider-2"),
    displayValOne: document.getElementById("range1"),
    displayValTwo: document.getElementById("range2"),
    gray1: document.querySelector(".grey-1"),
    gray2: document.querySelector(".grey-2"),
  };

  const { sliderOne, sliderTwo, displayValOne, displayValTwo, gray1, gray2 } =
    sliderElements;

  document.querySelector("#slider-1").addEventListener("input", function () {
    slideOne(sliderOne, sliderTwo, displayValOne);
  });
  document.querySelector("#slider-2").addEventListener("input", function () {
    slideTwo(sliderOne, sliderTwo, displayValTwo);
  });

  definePriceValues(
    sliderOne,
    sliderTwo,
    displayValOne,
    displayValTwo,
    gray1,
    gray2
  );

  function slideOne(sliderOne, sliderTwo, displayValOne) {
    if (parseInt(sliderOne.value) >= parseInt(sliderTwo.value)) {
      sliderOne.value = sliderTwo.value;
    }
  
    let formattedValue = formatter
      .format(sliderOne.value / 100)
      .replace(/\s/g, "");
    displayValOne.textContent = "De " + formattedValue;
  }
  
  function slideTwo(sliderOne, sliderTwo, displayValTwo) {
    if (parseInt(sliderTwo.value) <= parseInt(sliderOne.value)) {
      sliderTwo.value = sliderOne.value;
    }
    let formattedValue = formatter
      .format(sliderTwo.value / 100)
      .replace(/\s/g, "");
    displayValTwo.textContent = "Ate " + formattedValue;
  }

  function definePriceValues(
    sliderOne,
    sliderTwo,
    displayValOne,
    displayValTwo,
    gray1,
    gray2
  ) {
    const storedPriceRange = JSON.parse(localStorage.getItem("price-range"));
    const maxPrice = sliderOne.getAttribute("max");
  
    if (storedPriceRange) {
      sliderOne.setAttribute("value", storedPriceRange.minPrice);
      sliderTwo.setAttribute("value", storedPriceRange.maxPrice);
  
      displayValOne.innerHTML =
        "De " +
        formatter.format(storedPriceRange.minPrice / 100).replace(/\s/g, "");
  
      displayValTwo.innerHTML =
        "Até " +
        formatter.format(storedPriceRange.maxPrice / 100).replace(/\s/g, "");
  
      const percentWidthLeft = Math.round(
        (storedPriceRange.minPrice * 100) / maxPrice
      );
      const percentWidthRight =
        100 - Math.round((storedPriceRange.maxPrice * 100) / maxPrice);
  
      gray1.style.width = `${percentWidthLeft}%`;
      gray2.style.width = `${percentWidthRight}%`;
    } else {
      return;
    }
  
    localStorage.removeItem("price-range");
  }

  const form = document.getElementById("formFilter");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const minPrice = formData.get("filter.v.price.gte");
    const maxPrice = formData.get("filter.v.price.lte");

    const priceRangeSlider = {
      maxPrice,
      minPrice,
    };

    const min_price = formatter
      .format(parseFloat(minPrice / 100))
      .replace(/\s/g, "")
      .replace(",", ".");

    const max_price = formatter
      .format(parseFloat(maxPrice / 100))
      .replace(/\s/g, "")
      .replace(",", ".");

    formData.set("filter.v.price.gte", min_price);
    formData.set("filter.v.price.lte", max_price);

    const newFormedUrl = decodeURIComponent(
      new URLSearchParams(formData).toString()
    );

    localStorage.setItem("price-range", JSON.stringify(priceRangeSlider));

    const body = document.body;

    if (body.classList.contains("template-collection")) {
      window.location.search = "?" + newFormedUrl;
    } else if (body.classList.contains("template-search")) {
      const searchTerm = window.location.search;
      const idx = searchTerm.indexOf("products");
      const searchTermFilteredInUrl = searchTerm.substring(0, idx + 8);

      if (searchTerm.indexOf("filter") > 0) {
        window.location.search = searchTermFilteredInUrl + "&" + newFormedUrl;
      } else {
        window.location.search = searchTerm + "&" + newFormedUrl;
      }
    }
  });

  if (window.innerWidth > 1024) {
    const inputs = form.querySelectorAll("input");
    inputs.forEach((input) => {
      input.addEventListener("change", () => {
        form.requestSubmit();
      });
    });
  }

  function submitForm() {
    form.requestSubmit();
  }

  function activeFilter() {
    document.querySelector("#filters-aside").classList.add("filterActive");
  }
  function closeFilter() {
    document.querySelector("#filters-aside").classList.remove("filterActive");
  }

  function handleOffer() {
    document.getElementById("Filter-filter.p.tag-1").click();
  }