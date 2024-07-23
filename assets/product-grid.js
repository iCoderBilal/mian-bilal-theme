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


                    console.log("this is the popu")
                    popup.innerHTML = `
                <div class="popup-content">
                <h1> This is the Pop Up</h1>
                </div>
                `
                })
        })
    })

})