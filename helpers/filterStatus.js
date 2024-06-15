module.exports = (query) => {
    let filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Ngưng hoạt động",
            status: "inactive",
            class: ""
        }
    ]
    //neu trang thai doi tuong ton tai
    if(query.status){
        const index = filterStatus.findIndex(item => item.status == query.status)
        // console.log(index) in ra 0 / 1 / 2
        filterStatus[index].class = "active" //thay đổi class
        // find.status = req.query.status;
    }else{
        const index = filterStatus.findIndex(item => item.status == "")
        filterStatus[index].class = "active"
    }
    return filterStatus
}