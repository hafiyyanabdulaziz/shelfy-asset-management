import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';

const Header = ({ onSearch }) => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <TextField
        size="small"
        placeholder="Search items..."
        variant="outlined"
        className="w-1/3"
        onChange={(e) => onSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
      <div>
        {/* Profile or other actions */}
      </div>
    </header>
  );
};

export default Header;
