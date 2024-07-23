document.addEventListener("DOMContentLoaded", function () {
    const productBlocks = document.querySelectorAll(".product-block");

    const popup = document.createElement("div");
    popup.id = "product-popup";
    popup.style.display = "none";
    document.body.appendChild(popup);

    productBlocks.forEach(block => {
        const dot = block.querySelector(".product-dot");
        dot.addEventListener("click", function (event) {
            event.stopPropagation();
            const productHandle = block.dataset.productHandle;
            fetch(`/products/${productHandle}.js`)
                .then(response => response.json())
                .then(product => {
                    let variantsHtml = "";
                    product.variants.forEach(variant => {
                        variantsHtml += `<option value="${variant.id}">${variant.title} - ${variant.price / 100} ${Shopify.currency.active}</option>`;
                    });

                    popup.innerHTML = `
                        <div class="popup-content">
                            <img class="pop-up-featured-img" src="${product.featured_image}" alt="${product.title}" />
                            <div class="product-details">
                                <div>
                                    <h2>${product.title}</h2>
                                    <p class="product-price">${product.price / 100} ${Shopify.currency.active}</p>
                                    <p>${product.description}</p>
                                </div>
                            </div>
                            <div class="addCartPart">
                                <select id="product-variants">${variantsHtml}</select>
                                <button id="add-to-cart">Add to Cart</button>
                            </div>
                            <button id="close-popup">Close</button>
                        </div>
                    `;
                    popup.style.display = "block";

                    document.getElementById("close-popup").addEventListener("click", function () {
                        popup.style.display = "none";
                    });

                    document.getElementById("add-to-cart").addEventListener("click", function () {
                        const selectedVariantId = document.getElementById("product-variants").value;
                        fetch('/cart/add.js', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                id: selectedVariantId,
                                quantity: 1
                            })
                        }).then(response => response.json())
                            .then(() => {
                                alert("Product added to cart!");
                                updateCartDrawer();
                                updateCartCount();
                                popup.style.display = "none";
                            });
                    });
                });
        });
    });

    function updateCartDrawer() {
        fetch('/cart')
            .then(response => response.text())
            .then(html => {
                const cartDrawer = document.getElementById("cart-drawer");
                const newCartDrawer = new DOMParser().parseFromString(html, 'text/html').getElementById("cart-drawer");
                cartDrawer.innerHTML = newCartDrawer.innerHTML;
                cartDrawer.dispatchEvent(new CustomEvent('updated'));
            });
    }

    function updateCartCount() {
        fetch('/cart.js')
            .then(response => response.json())
            .then(cart => {
                let cartCountBubble = document.querySelector(".cart-count-bubble");
                const cartItemCount = cart.item_count;

                if (!cartCountBubble) {
                    cartCountBubble = document.createElement("div");
                    cartCountBubble.className = "cart-count-bubble";
                    cartCountBubble.innerHTML = `
                        <span aria-hidden="true">${cartItemCount}</span>
                        <span class="visually-hidden">${cartItemCount} item${cartItemCount !== 1 ? 's' : ''}</span>
                    `;
                    const cartIconContainer = document.querySelector(".header__icon--cart");
                    if (cartIconContainer) {
                        cartIconContainer.appendChild(cartCountBubble);
                    }
                } else {
                    cartCountBubble.querySelector("span[aria-hidden='true']").textContent = cartItemCount;
                    cartCountBubble.querySelector(".visually-hidden").textContent = `${cartItemCount} item${cartItemCount !== 1 ? 's' : ''}`;
                }
            });
    }

})

