import { motion } from "framer-motion";

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
              <td>{item.price} đ</td>
              <td>
                <i
                  className="ri-arrow-left-s-line p-2"
                  onClick={() => HandleReduceQuanty(item.id)}
                ></i>
                {item.quantity}
                <i
                  className="ri-arrow-right-s-line p-2"
                  onClick={() => HandleIncreaseQuanty(item.id)}
                ></i>
              </td>
              <td>
                <motion.i
                  whileTap={{ scale: 1.2 }}
                  className="ri-delete-bin-line"
                  style={{ color: "red", fontSize: "20px" }}
                  onClick={() => handleShowModalDeleteProduct(item)}
                ></motion.i>
              </td>
            </tr>
          )
      )}
    </tbody>
  );
};

export default CartItem;
