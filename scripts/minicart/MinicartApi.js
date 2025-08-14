

const addItemToCart = async (productObj) => {
    const urlAddToCart = "/cart/add.js";
  
    try {
      const response = await fetch(urlAddToCart, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(productObj),
      });
  
      if (response.ok) {
        return response;
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const deleteItemFromCart = async (data) => {
    const removeItemFromCartUrl = "/cart/change.js";
  
    try {
      const request = await fetch(removeItemFromCartUrl, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      });
  
      return request;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  const getMinicartToUpdateInFront = async () => {
    const getCartUrl = "/?section_id=main-minicart";
    try {
      const response = await fetch(getCartUrl, {
        method: "GET",
      });
      if (response.ok) {
        return response;
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const updateMinicartQuantity = async (data) => {
    const updateCartUrl = "/cart/change.js";
  
    try {
      const req = await fetch(updateCartUrl, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      });
      if (req.ok) {
        await updateMiniCartInFront(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  