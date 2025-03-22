import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

const NavBarSearch = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="relative rounded bg-white border-b bg-opacity-15 hover:bg-opacity-25 flex items-center w-[15vw]">
        <div className="p-1 pointer-events-none flex items-center justify-center">
          <SearchIcon />
        </div>
        <InputBase
          className="text-inherit w-full p-1"
          placeholder="Buscar…"
          inputProps={{ 'aria-label': 'search' }}
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
    </div>
  );
};

export default NavBarSearch;
