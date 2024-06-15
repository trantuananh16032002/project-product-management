//Change-status - thay đổi trạng thái sản phẩm active/inactive
const buttonChangeStatus = document.querySelectorAll("[button-change-status]") //các button thay đổi trạng thái 1 sản phẩm
if(buttonChangeStatus.length > 0){
    // console.log(buttonChangeStatus)
    buttonChangeStatus.forEach(button => { // duyet node
        const formChangeStatus = document.querySelector("#form-change-status")
        const path = formChangeStatus.getAttribute("data-path"); // `/admin/products/change-status`
        button.addEventListener("click", () => { //Event click button
            const statusCurent = button.getAttribute("data-status"); 
            const id = button.getAttribute("data-id"); 
            const statusChange = statusCurent == "active" ? "inactive" : "active";

            // console.log(statusCurent)
            // console.log(id)
            // console.log(statusChange)

            const action = path + `/${statusChange}/${id}?_method=PATCH`;
            formChangeStatus.action = action
            formChangeStatus.submit()

            // url.searchParams.set("page", page) 
            // window.location.href = url.href // load trang
        });
    });
}
//delete products
const buttonDelete = document.querySelectorAll("[button-delete]");
console.log(buttonDelete);

if (buttonDelete.length > 0) {
    const formDeleteItem = document.querySelector("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path");

    buttonDelete.forEach(button => { 
        button.addEventListener("click", () => { 
            const isConfirm = confirm("Bạn có chắc muốn xóa?");
            if (isConfirm) {
                const id = button.getAttribute("data-id");
                console.log(`ID to delete: ${id}`);
                const action = `${path}/${id}?_method=DELETE`;
                console.log(`Form action URL: ${action}`);
                formDeleteItem.action = action;
                formDeleteItem.submit(); // Gửi form sau khi thiết lập action
            }
        });
    });
}

