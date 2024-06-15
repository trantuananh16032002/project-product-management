module.exports = (objPagination,query,countProducts) => {
    if(query.page){
        objPagination.currentPage = parseInt(query.page) 
    }
    console.log(objPagination.currentPage)
    objPagination.skip = (objPagination.currentPage - 1)*objPagination.limitItems
    console.log(objPagination.skip)
    // const countProducts = await Product.countDocuments(find); // Sử dụng countDocuments thay vì count
    console.log(countProducts);

    const totalPage = Math.ceil(countProducts/objPagination.limitItems)
    objPagination.totalPage = totalPage
    console.log(totalPage);
    return objPagination
}