document.addEventListener("DOMContentLoaded", () => {
    updateWishlistUI();
  });
  
  const handleStoreWishList = (handle, element) => {
    let wishListStorage = localStorage.getItem("wishlist");
  
    if (!wishListStorage || wishListStorage === "[]" || wishListStorage === "{}") {
      wishListStorage = "[]";
    }
    const currentArrayWishList = JSON.parse(wishListStorage);
  
    const index = currentArrayWishList.indexOf(handle);
    if (index === -1) {
      currentArrayWishList.push(handle);
      element.setAttribute("data-wishlist", "true");
    } else {
      currentArrayWishList.splice(index, 1);
      element.setAttribute("data-wishlist", "false");
    }
  
    localStorage.setItem("wishlist", JSON.stringify(currentArrayWishList));
  
    updateWishlistUI();
  };
  
  const updateWishlistUI = () => {
    let wishListStorage = localStorage.getItem("wishlist");    
    if (!wishListStorage) return;
    const wishlist = JSON.parse(wishListStorage);
    
    document.querySelectorAll("button[onclick^='handleStoreWishList']").forEach((element) => {        
      const productHandle = element.getAttribute("onclick").match(/'([^']+)'/)[1];
      if (wishlist.includes(productHandle)) {        
        element.setAttribute("data-wishlist", "true");
      } else {        
        element.setAttribute("data-wishlist", "false");
      }
    });
  };
  