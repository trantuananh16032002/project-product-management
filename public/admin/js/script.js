//Insert trang thai san pham
//Đưa ra thông tin trạng thái sản phẩm hoạt động/ Ngưng hoạt động lên url ?status = ?
const buttonStatuses = document.querySelectorAll("[button-status]");//tim all button co attribute la [button-status]
//lọc ra 3 thẻ button có thuộc tính  [button-status]=""/"active"/"inactive"
if(buttonStatuses.length > 0) { //so luong node > 0  
    buttonStatuses.forEach(button => { // duyet node
        let url = new URL(window.location.href);   // lay ra url hien tai admin/products?
        button.addEventListener("click", () => {   //Event click button
            const status = button.getAttribute("button-status");  //in ra "", active / inactive
            if(status){// nếu tồn tại ?status="active/inactive"
                //setup admin/products?status="active/inactive"
                url.searchParams.set("status", status) // in ra `url + ?status = status`
            }else{
                url.searchParams.delete("status") // in ra `url` admin/products
            }
            window.location.href = url.href // load trang
        });
    });
}


//Form search - Đưa ra thông tin sản phẩm + trạng thái sản phẩm active/inactive
const formSearch = document.querySelector("#form-search") //tìm đến form-search
if(formSearch){ // nếu tồn tại form search
    let url = new URL(window.location.href);   // lay ra url hien tai
    formSearch.addEventListener("submit", (e)=>{ //tạo sự kiện cho formsearch khi ấn
        e.preventDefault();
        // console.log(e.target.elements.keyword.value);
        const keyword = e.target.elements.keyword.value; // lấy ra giá trị trong ô tìm kiếm
        if(keyword){
            url.searchParams.set("keyword", keyword) 
        }else{
            url.searchParams.delete("keyword") // in ra `url`
        }
        window.location.href = url.href // load trang
    });
}

//pagination- phân trang bằng đưa trang lên url
const buttonPagination = document.querySelectorAll("[button-pagination]") //tìm tất cả thẻ button phân trang
if(buttonPagination){
    buttonPagination.forEach(button => { // duyet node
        let url = new URL(window.location.href);   // lay ra url hien tai
        button.addEventListener("click", () => { //Event click button
            const page = button.getAttribute("button-pagination"); 
            console.log(page)
            url.searchParams.set("page", page) 
            window.location.href = url.href // load trang
        });
    });
}

//checkbox-multi- Đa checkbox
const checkboxMulti = document.querySelector("[checkbox-multi]") //lấy ra thẻ table với thuộc tính [checkbox-multi]
if(checkboxMulti){
    // console.log(checkboxMulti)
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']") // thẻ input của header có name = checkall

    const inputsId = checkboxMulti.querySelectorAll("input[name='id']") //danh sách các thẻ con

    inputCheckAll.addEventListener("click", () => { //tạo sự kiện khi click vào thẻ all
        if(inputCheckAll.checked){ //nếu thẻ all đã check
            inputsId.forEach((input) => { //duyệt các thẻ con
                input.checked = true        //set thuộc tính là checked
            });
        }else{
            inputsId.forEach((input) => {
                input.checked = false // ngược lại đặt thuộc tính là checked = false
            });
        }
    });
    //nếu kick tất cả nút con thì nút all sẽ kích và ngược lại
    inputsId.forEach((input) => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length
            if(countChecked == inputsId.length){// nếu số lượng nút checked = số thẻ con
                inputCheckAll.checked = true
            }else{
                inputCheckAll.checked = false
            }
        });
    });
}

//form change multi
const formChangeMulti = document.querySelector("[form-change-multi]")
if(formChangeMulti){
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        const checkboxMulti = document.querySelector("[checkbox-multi]")
        const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked")

        const typeChange = e.target.elements.type.value;
        if(typeChange == "delete-all"){
            const isConfirm = confirm("Delete all ???")
            if(!isConfirm){
                return;
            }
        }
        if(inputsChecked.length > 0){
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']")

            inputsChecked.forEach(input => {
                const id = input.value
                //thay đổi vị trí
                if(typeChange == "change-position"){
                    const position = input.closest("tr").querySelector("input[name='position']").value  
                    ids.push(`${id}-${position}`)
                }else{
                    ids.push(id)
                }
            })
            inputIds.value = ids.join(", ")
            formChangeMulti.submit();
        }
    });
}

//Show alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert){
    const time = parseInt(showAlert.getAttribute("data-time"))
    const closeAlert = showAlert.querySelector("[close-alert]");

    setTimeout(() => {
        showAlert.classList.add("alert-hidden")
    },time);
    closeAlert.addEventListener("click", ()=> {
        showAlert.classList.add("alert-hidden")
    });
}

//preview image
const uploadImang = document.querySelector("[upload-image]");
if(uploadImang){
    const uploadImangInput = document.querySelector("[upload-image-input]");
    const uploadImangPreview = document.querySelector("[upload-image-preview]");
    uploadImangInput.addEventListener("change", (e) => {
        const file = e.target.files[0]
        if(file){
            uploadImangPreview.src = URL.createObjectURL(file);
        }
    });
}
//Sort
const sort = document.querySelector("[sort]");
if(sort){
    let url = new URL(window.location.href);
    console.log(sort)
    const sortSelect = sort.querySelector("[sort-select]");
    console.log(sortSelect)

    const sortClear = sort.querySelector("[sort-clear]");
    console.log(sortClear)

    sortSelect.addEventListener("change", (e) => {
        const value = e.target.value
        console.log(value)
        const [sortKey, sortValue] = value.split("-")
        console.log(sortKey)

        url.searchParams.set("sortKey",sortKey)
        url.searchParams.set("sortValue",sortValue)
        window.location.href = url.href
    });
    //clear sort 
    sortClear.addEventListener("click", () =>{
        url.searchParams.delete("sortKey")
        url.searchParams.delete("sortValue")
        console.log(url)
        window.location.href = url.href
    });
    const sortKey = url.searchParams.get("sortKey")
    const sortValue = url.searchParams.get("sortValue")
    if(sortKey && sortValue){
        const stringSort = `${sortKey}-${sortValue}`
        const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`);
        optionSelected.selected=true
    }

}







