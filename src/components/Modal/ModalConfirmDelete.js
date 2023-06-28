import React from "react";
import { useSelector } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const ModalConfirmDelete = ({ open, toggle, onSubmit, content }) => {
  const getProduct = useSelector((state) => state.modal.getProduct);

  const confirm = () => {
    const idDelete = getProduct.id || getProduct.uid;
    onSubmit(idDelete);
    setTimeout(() => {
      toggle();
    }, 500);
  };

  const closeBtn = (
    <Button color="secondary" className="btn__close" onClick={toggle}>
      <i className="ri-close-line"></i>
    </Button>
  );
  return (
    <Modal isOpen={open} toggle={toggle}>
      <ModalHeader toggle={toggle} close={closeBtn}></ModalHeader>
      <ModalBody toggle={toggle} close={closeBtn}>
        <h5>Bạn có chắc chắn muốn {content} này không?</h5>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={confirm}>
          Có
        </Button>
        <Button color="secondary" onClick={toggle}>
          Không
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalConfirmDelete;
