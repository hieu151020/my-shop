

const CartItem = ({
  cartItems,
  showModalDeleteProduct,
  HandleReduceQuanty,
  HandleIncreaseQuanty,
}) => {
  const handleShowModalDeleteProduct = (item) => {
    showModalDeleteProduct(item);
  };

  return (
    <tbody>
      {cartItems.map(
        (item, index) =>
          item.quantity > 0 && (
            <tr key={index}>
              <td>
                <img src={item.imgUrl} alt="" />
              </td>
              <td>{item.productName}</td>
              <td>{Number(item.price).toLocaleString("vi-VN")}đ</td>
              <td>
                <i
                  className="ri-subtract-line p-2 arrow"
                  onClick={() => HandleReduceQuanty(item.id)}
                ></i>
                {item.quantity}
                
                <i
                  className="ri-add-line p-2 arrow"
                  onClick={() => HandleIncreaseQuanty(item.id)}
                ></i>
              </td>
              <td>
              <button
                  className="btn-danger-admin"
                  onClick={() => {
                    handleShowModalDeleteProduct(item)
                  }}
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
                {/* <motion.i
                  whileTap={{ scale: 1.2 }}
                  className="ri-delete-bin-line"
                  style={{ color: "red", fontSize: "20px" }}
                  onClick={() => handleShowModalDeleteProduct(item)}
                ></motion.i> */}
              </td>
            </tr>
          )
      )}
    </tbody>
  );
};

export default CartItem;
