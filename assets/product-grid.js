document.addEventListener("DOMContentLoaded", function () {
    // Select all product blocks
    const productBlocks = document.querySelectorAll(".product-block");

    // Create a popup element for displaying product details
    const popup = document.createElement("div");
    popup.id = "product-popup";
    popup.style.display = "none";
    document.body.appendChild(popup);

    // Add event listeners to product dots
    productBlocks.forEach(block => {
        const dot = block.querySelector(".product-dot");
        dot.addEventListener("click", function (event) {
            event.stopPropagation(); // Prevent the click event from bubbling up to the product block

            const productHandle = block.dataset.productHandle;

            // Fetch product details using Shopify API
            fetch(`/products/${productHandle}.js`)
                .then(response => response.json())
                .then(product => {
                    // Generate HTML for product variants
                    let variantsHtml = "";
                    product.variants.forEach(variant => {
                        variantsHtml += `<option value="${variant.id}">${variant.title} - ${variant.price / 100} ${Shopify.currency.active}</option>`;
                    });

                    // Set popup content
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

                    // Display the popup
                    popup.style.display = "block";

                    // Close the popup
                    document.getElementById("close-popup").addEventListener("click", function () {
                        popup.style.display = "none";
                    });

                    // Add product to cart
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
                        })
                            .then(response => response.json())
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

    // Function to update the cart drawer
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

    // Function to update the cart count bubble
    function updateCartCount() {
        fetch('/cart.js')
            .then(response => response.json())
            .then(cart => {
                let cartCountBubble = document.querySelector(".cart-count-bubble");
                const cartItemCount = cart.item_count;

                if (!cartCountBubble) {
                    // Create cart count bubble if it doesn't exist
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
                    // Update existing cart count bubble
                    cartCountBubble.querySelector("span[aria-hidden='true']").textContent = cartItemCount;
                    cartCountBubble.querySelector(".visually-hidden").textContent = `${cartItemCount} item${cartItemCount !== 1 ? 's' : ''}`;
                }
            });
    }
});
