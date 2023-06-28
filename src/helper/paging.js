/* eslint-disable jsx-a11y/anchor-is-valid */
export const PrevButton = ({ currentPage, handlePrevClick }) => {
  return currentPage === 1 ? (
    <li className="disabled-click">
      <span>
        <i className="ri-arrow-left-s-line"></i>
      </span>
    </li>
  ) : (
    <li className="page__arrow">
      <a
        className="d-flex align-items-center justify-content-center"
        onClick={handlePrevClick}
      >
        <i className="ri-arrow-left-s-line"></i>
      </a>
    </li>
  );
};

export const NextButton = ({ currentPage, totalPages, handleNextClick }) => {
  return currentPage === totalPages ? (
    <li className="disabled-click">
      <span>
        <i className="ri-arrow-right-s-line"></i>
      </span>
    </li>
  ) : (
    <li className="page__arrow">
      <a
        className="d-flex align-items-center justify-content-center"
        onClick={handleNextClick}
      >
        <i className="ri-arrow-right-s-line"></i>
      </a>
    </li>
  );
};

export const PageNumbers = ({ totalPages, currentPage, handlePageClick }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(
      <li
        key={i}
        className={i === currentPage ? "active__number" : "page__number"}
      >
        <a onClick={handlePageClick} id={i}>
          {i}
        </a>
      </li>
    );
  }
  return pageNumbers;
};
