//Cập nhật số lượng sản phẩm trong giỏ hàng
const inputQuantiy = document.querySelectorAll("input[name='quantity']")
if(inputQuantiy.length > 0){
    inputQuantiy.forEach(input => {
        input.addEventListener("change", (e) => {
            console.log(e.target.value)
            const productId = input.getAttribute("product-id")
            const quantity = parseInt(input.value) 
            if(quantity > 0 ){
                window.location.href = `/cart/update/${productId}/${quantity}`
            }
        })
    })
}
