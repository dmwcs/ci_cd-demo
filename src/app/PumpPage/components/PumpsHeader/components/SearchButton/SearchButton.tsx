import React from 'react';
import { Button } from 'react-bootstrap';
import { TbSearch } from 'react-icons/tb';

interface SearchButtonProps {
  onClick?: () => void;
}

const SearchButton: React.FC<SearchButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant='outline-light'
      className='text-muted border-0'
      size='lg'
      onClick={onClick}
    >
      <TbSearch size={22} />
    </Button>
  );
};

export default SearchButton;
