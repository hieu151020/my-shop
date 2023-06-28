
const useFomatDate = () => {
    const date = new Date();

    const day = date.getDate().toString().padStart(2, "0"); // Lấy ngày và định dạng lại thành chuỗi 2 ký tự, bằng cách thêm số 0 vào đầu nếu cần thiết
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Lấy tháng và định dạng lại thành chuỗi 2 ký tự, bằng cách thêm số 0 vào đầu nếu cần thiết
    const year = date.getFullYear().toString(); // Lấy năm
    
    const formattedDate = `${day}/${month}/${year}`; // Ghép các giá tr
    return formattedDate
}

export default useFomatDate
