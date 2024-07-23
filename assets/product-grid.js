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
            fetch(/product/${ productHandle }.js)
                .then(response => response.json())
                .then(product => {
                    let variantHtml = "";
                    product.variants.forEach(variant => {
                        variantHtml += <option value="${variant.id}">${ variant.title } - ${ variant.price / 100 } ${ shopify.currency.active }</option>;
                    });



                    popup.innerHTML = `
                <div class="popup-content">
                <img  class="pop-up-featured-img" src="${product.featured_image}" />

                <div class="product-details">
                <div>
                <h2>${product.titles}</h2>
                <p class="product-price">${product.price / 100} ${shopify.currency.active}</p>
                <p>${product.description}</p>
                
                </div>
                
                </div>
                <div class="addCartPage">
                 <select id="product-variants">${variantsHTML}</select>
                 <button id="add-to-cart">Add to Cart</button>
                </div>
                </div>
                `;

                    popup.style.display = "block";
                    document.getElementById("close-popup").addEventListener("click", function () {
                        popup.style.display = "none";
                    });

                    document.getElementById("add-to-cart").addEventListener("click", function () {
                        const selectVariantId = document.getElementById("product-variants").value;
                        fetch('/cart/add.js', {
                            method: "POST",
                            headers: {
                                "Content-Type": 'application/json'
                            },
                            body: JSON.stringify({
                                id: selectedVariantId,
                                quantity: 1
                            })

                        }).then(response => response.json())
                            .then(() => {
                                alert("Product Added To Cart!");
                                updateCartCount();
                                popup.style.display = "none";
                            })
                    })
                })
        })
    })


    function updateCartCount() {
        fetch('/cart.js')
            .then(response => response.json())
            .then(cart => {
                const cartCountBubble = document.querySelector(".cart-count-bubble");
                const cartItemCount = cart.item_count;

                if (startCountBubble) {
                    cartCountBubble.querySelector("span[aria-hidden='true']").textContent = cartItemCount;
                    cartCountBubble.querySelector(".visually-hidden").textContent = ${ cartItemCount } item${ cartItemCount !== 1 ? 's' : '' };
                }
            });


    }

});