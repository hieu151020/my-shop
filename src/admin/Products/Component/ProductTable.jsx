import React from 'react';
import useSortData from '../../../custom-hooks/useSortData';

function ProductTable({data,handleImportProduct,handleEditProduct,showModalDeleteProduct,currentPage,itemsPerPage}) {
  const dataSort = useSortData(data, "createAt");
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataSort.slice(indexOfFirstItem, indexOfLastItem);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    currentItems.map((item, index) => 
          <>
            <tr key={item.id}>
              <td>{data.slice(startIndex, endIndex).map((product, index) => startIndex + index + 1)[index]}</td>
              <td>{item.createAt}</td>
              <td>
                <img src={item.imgUrl} alt="" />
              </td>
              <td>{item.productName}</td>
              <td>{item.category.toUpperCase()}</td>
              <td>{item.manufacture.toUpperCase()}</td>
              <td>{Number(item.price).toLocaleString("vi-VN")}đ</td>
              <td>{item.stockNumber}</td>
              <td
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                title="Nhập hàng"
              >
                <button
                  className="btn-primary-admin"
                  onClick={() => handleImportProduct(item)}
                >
                  <i className="ri-download-line"></i>
                </button>
              </td>
              <td
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                title="Sửa"
              >
                <button
                  className="btn-primary-admin"
                  onClick={() => handleEditProduct(item)}
                >
                  <i className="ri-edit-line"></i>
                </button>
              </td>
              <td
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                title="Xóa"
              >
                <button
                  className="btn-danger-admin"
                  onClick={() => {
                    showModalDeleteProduct(item);
                  }}
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </td>
            </tr>
          </>
       )
    )
}

export default ProductTable;