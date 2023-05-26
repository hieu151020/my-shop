import React from 'react';

function ProductTable({currentItems,handleEditProduct,showModalDeleteProduct}) {
    return (
        currentItems.map((item) => {
            let price = item.price;
            price = +price;
            return (
              <>
                <tr key={item.id}>
                  <td>
                    <img src={item.imgUrl} alt="" />
                  </td>
                  <td>{item.productName}</td>
                  <td>{item.category}</td>
                  <td>{item.manufacture}</td>
                  <td>{price.toLocaleString("vi-VN")} đ</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEditProduct(item)}
                    >
                      Sửa
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        showModalDeleteProduct(item);
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>  
              </>
            );
          })
    );
}

export default ProductTable;