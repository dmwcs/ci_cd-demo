import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

interface PumpsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PumpsPagination: React.FC<PumpsPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // If there's only one page or no data, don't show pagination
  if (totalPages <= 1) return null;

  // Generate page numbers to display (show current page ± 2 pages)
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => onPageChange(i)}
          >
            {i}
          </Pagination.Item>,
        );
      }
    } else {
      // Show smart pagination with ellipsis
      // Always show first page
      pages.push(
        <Pagination.Item
          key={1}
          active={1 === currentPage}
          onClick={() => onPageChange(1)}
        >
          1
        </Pagination.Item>,
      );

      // Add ellipsis if needed
      if (currentPage > 3) {
        pages.push(<Pagination.Ellipsis key='start-ellipsis' />);
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => onPageChange(i)}
          >
            {i}
          </Pagination.Item>,
        );
      }

      // Add ellipsis if needed
      if (currentPage < totalPages - 2) {
        pages.push(<Pagination.Ellipsis key='end-ellipsis' />);
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(
          <Pagination.Item
            key={totalPages}
            active={totalPages === currentPage}
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Pagination.Item>,
        );
      }
    }

    return pages;
  };

  return (
    <Pagination className='d-flex justify-content-center'>
      <Pagination.First
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
      />
      <Pagination.Prev
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      />

      {renderPageNumbers()}

      <Pagination.Next
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
      <Pagination.Last
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
      />
    </Pagination>
  );
};

export default PumpsPagination;
