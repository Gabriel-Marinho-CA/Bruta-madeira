document.addEventListener("DOMContentLoaded", function () {
  const elements = {
    menu_mob: document.getElementById("menu-mobile"),
    toggle_btn: document.querySelectorAll(".toggle-mob"),
    close_menu_mob: document.getElementById("close-menu-mobile"),
    overlay: document.querySelector(".overlay-bg"),
    menu_item: document.querySelectorAll(".menu--item"),
    menu_wrapper: document.querySelectorAll(".menu-wrapper"),
  };

  elements.toggle_btn.forEach((btn) => {
    btn.addEventListener("click", function () {
      elements.menu_mob.classList.add("active");
      elements.overlay.classList.add("active");
    });
  });

  [elements.close_menu_mob, elements.overlay].forEach((el) => {
    el.addEventListener("click", function () {
      elements.menu_mob.classList.remove("active");
      elements.overlay.classList.remove("active");
    });
  });

  function removeIfNotHovered(menu_id) {
    const item = document.querySelector(
      `.menu--item[data-bind-menu="${menu_id}"]`
    );
    const wrapper = document.querySelector(
      `.menu-wrapper[data-bind-menu="${menu_id}"]`
    );

    if (!item.matches(":hover") && !wrapper.matches(":hover")) {
      item?.classList.remove("active");
      wrapper?.classList.remove("active");
    }
  }

  elements.menu_item.forEach((item) => {
    item.addEventListener("click", function (e) {
      const menu_id = e.currentTarget.getAttribute("data-bind-menu");
      const target_items = document.querySelectorAll(
        `[data-bind-menu="${menu_id}"]`
      );

      elements.menu_item.forEach((i) => i.classList.remove("active"));
      elements.menu_wrapper.forEach((w) => w.classList.remove("active"));

      target_items.forEach((el) => el.classList.add("active"));
    });

    item.addEventListener("mouseleave", function (e) {
      const menu_id = e.currentTarget.getAttribute("data-bind-menu");
      setTimeout(() => removeIfNotHovered(menu_id), 100);
    });
  });

  elements.menu_wrapper.forEach((wrapper) => {
    wrapper.addEventListener("mouseenter", function (e) {
      const menu_id = e.currentTarget.getAttribute("data-bind-menu");
      const relatedItem = document.querySelector(
        `.menu--item[data-bind-menu="${menu_id}"]`
      );

      relatedItem?.classList.add("active");
      e.currentTarget.classList.add("active");
    });

    wrapper.addEventListener("mouseleave", function (e) {
      const menu_id = e.currentTarget.getAttribute("data-bind-menu");
      setTimeout(() => removeIfNotHovered(menu_id), 100);
    });
  });

  const timers = document.querySelectorAll(".countdown-timer");

  timers.forEach((timer) => {
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

  document.querySelectorAll("#menu-mobile .toggle-menu").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const li = e.currentTarget.closest("li");
      li.classList.toggle("active");
    });
  });
});

async function getSearchResultItems(value) {
  try {
    const request = await fetch(
      window.Shopify.routes.root +
        `search/suggest.json?q=${value}&resources[limit]=5&resources[type]=product&resources[options][unavailable_products]=show&resources[options][fields]=title,product_type,variants.sku`
    );

    const response = await request.json();

    const container = document.querySelector(".wrapper-search-result");

    document
      .querySelectorAll(".wrapper-search-result li")
      .forEach((element) => element.remove());

    response?.resources?.results?.products.forEach(({ title, url, image }) => {
      const resultItem = document.createElement("li");
      resultItem.innerHTML = `
        <a href="${url}" title="${title}" class="flex items-center gap-3">
          <div class="result-search-image" style="width:80px;height:80px; min-width:80px">
            <img style="object-fit: contain;" class="w-full h-full" src="${image}" alt="${title}"/>                        
          </div>
          <div class="result-search-right">
            <h3>${title}</h3>                                                    
          </div>
        </a>
      `;
      container.appendChild(resultItem);
    });
    document.querySelector(".search-result").classList.add("active");
  } catch (error) {
    console.error(error);
  }
}

const closeSearchResult = () => {
  document.querySelector(".search-result").classList.remove("active");
};

function startCountdown(timer, endDateTime) {
  const timeDisplay = timer.querySelector(".time");
  timer.classList.remove("hidden");

  const interval = setInterval(() => {
    const now = new Date();
    const diff = endDateTime.getTime() - now.getTime();

    if (diff <= 0) {
      clearInterval(interval);
      timeDisplay.textContent = "00:00:00";
    } else {
      formatTime(diff, timeDisplay);
    }
  }, 1000);
}

function formatTime(milliseconds, displayElement) {
  let totalSeconds = Math.floor(milliseconds / 1000);
  let seconds = totalSeconds % 60;
  let minutes = Math.floor(totalSeconds / 60) % 60;
  let hours = Math.floor(totalSeconds / 3600);

  displayElement.textContent = [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
}

function showChildren(handle) {
  document.querySelectorAll("#menu-children ul").forEach((el) => {
    el.classList.add("hidden");
  });

  document.querySelectorAll(".menu-parent").forEach((el) => {
    el.classList.remove("active");
  });

  const target = document.getElementById(`children-${handle}`);
  if (target) {
    target.classList.remove("hidden");
  }

  const parent = document.getElementById(`parent-${handle}`);
  if (parent) {
    parent.classList.add("active");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const firstHandle =
    document.querySelector("#menu-parents li")?.dataset.handle;
  if (firstHandle) showChildren(firstHandle);
});
