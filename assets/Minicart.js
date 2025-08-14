const addToCart = async (button) => {
    const productId = parseInt(button.getAttribute("data-id"));
  
    const wrapper = button.closest(".buy-btn");
  
    const quantityInput = wrapper.querySelector(".quantity_shelf");
    const quantity = parseInt(quantityInput?.value) || 1;
  
    const productObj = {
      items: [
        {
          id: productId,
          quantity,
        },
      ],
    };
  
    const response = await addItemToCart(productObj);
  
    if (response && response.ok) {
      await updateMiniCartInFront(true);
      openMinicart();
    }
  };
  
function changeShelfQty(button, action) {
  const wrapper = button.closest(".buy-btn");
  const input = wrapper.querySelector(".quantity_shelf");
  const plusBtn = wrapper.querySelector("button.plus");
  const max = parseInt(input.dataset.max) || 999;
  let value = parseInt(input.value) || 1;

  if (action === "plus" && value < max) {
    input.value = ++value;
  }

  if (action === "minus" && value > 1) {
    input.value = --value;
  }

  plusBtn.classList.toggle("border-[#808080]", value >= max);
  plusBtn.classList.toggle("[&>svg]:fill-[#808080]", value >= max);
}
  
  const removeItemFromCart = async (id) => {
    try {
      const res = await deleteItemFromCart({
        id: id,
        quantity: 0,
      });
      if (res.ok) {
        updateMiniCartInFront();
      }
    } catch (error) {
      console.error("Erro ao remover itens do carrinho:", error);
    }
  };
  
  const updateMinicartItems = async (id, quantity) => {
    const updateCartUrl = "/cart/update.js";
  
    const updates = {
      [id]: parseInt(quantity),
    };
  
    try {
      const response = await fetch(updateCartUrl, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ updates }),
      });
  
      if (response.ok) {
        updateMiniCartInFront();
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  
  const updateMiniCartInFront = async () => {
    try {
      const response = await getMinicartToUpdateInFront();
  
      if (response.ok) {
        response.text().then((res) => {
          const divHtml = document.createElement("div");
          divHtml.innerHTML = res;
  
          const box_items = divHtml.querySelector("#main-minicart").innerHTML;
          document.querySelector("#main-minicart").innerHTML = box_items;
          document.querySelectorAll("#main-minicart input[name='quantity']").forEach((input) => {
            togglePlusButtonState(input);
          });
            
          const items_count = divHtml.querySelector(
            ".minicart-items-count"
          ).innerText;
          document.querySelector(
            "#toggle-minicart .minicart-count-items"
          ).innerText = items_count;
        });
      }
    } catch (error) {
      console.error("Erro ao pegar minicart", error);
    }
  };
  const handleSelectedVariant = (input) => {
    const idVariant = input.value;
    
    input
      .closest(".buy-area")
      .querySelector("button")
      .setAttribute("data-id", idVariant);
  
    removeOldSelectionVariant();
  
    input.nextElementSibling.setAttribute("data-selected-variant", true);
  };
   
  // const removeOldSelectionVariant = () => {
  //   document
  //     .querySelectorAll("input[name='Tamanho']")
  //     .forEach((el) =>
  //       el.nextElementSibling.removeAttribute("data-selected-variant")
  //     );
  // }
  
  
  function openMinicart() {
    document.querySelector(".overlay-bg").classList.add("active");
    document.querySelector("#main-minicart").classList.add("active");
  }
  
  function closeMinicart() {
    document.querySelector(".overlay-bg").classList.remove("active");
    document.querySelector("#main-minicart").classList.remove("active");
  }
  

const stepUpInput = (button, id) => {
  const input = button.previousElementSibling;
  const max = parseInt(input.getAttribute("max"));
  let quantity = parseInt(input.value);

  if (quantity < max) {
    quantity++;
    input.value = quantity;
    updateMinicartItems(id, quantity);
  }
};

const stepDownInput = (button, id) => {
  const input = button.nextElementSibling;
  let quantity = parseInt(input.value);

  if (quantity > 1) {
    quantity--;
    input.value = quantity;
    updateMinicartItems(id, quantity);
  }
};

function updateMinicartInput(input, variantId) {
  const max = parseInt(input.getAttribute("max"));
  const min = parseInt(input.getAttribute("min")) || 1;
  let value = parseInt(input.value);

  if (isNaN(value) || value < min) {
    value = min;
  } else if (value > max) {
    value = max;
  }

  input.value = value;
  updateMinicartItems(variantId, value);
  togglePlusButtonState(input);
}

function togglePlusButtonState(input) {  
 const quantity = +input.value;
  const max = +input.max;
  const plusButton = input.nextElementSibling;
  const isDisabled = quantity >= max;

  plusButton.disabled = isDisabled;
  plusButton.classList.toggle("border-[#808080]", isDisabled);
  plusButton.classList.toggle("[&>svg]:fill-[#808080]", isDisabled);
}
