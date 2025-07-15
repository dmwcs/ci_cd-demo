import React from 'react';
import { Button } from 'react-bootstrap';
import { TbSearch } from 'react-icons/tb';
import './SearchButton.css';

interface SearchButtonProps {
  onClick?: () => void;
}

const SearchButton: React.FC<SearchButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant='outline-light'
      className='search-button'
      size='lg'
      onClick={onClick}
    >
      <TbSearch size={22} />
    </Button>
  );
};

export default SearchButton;
