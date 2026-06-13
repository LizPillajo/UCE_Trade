// src/components/ventures/VentureSearchBar.jsx
import { Paper } from '@mui/material';
import SearchAutocomplete from '../common/SearchAutocomplete';

const VentureSearchBar = ({ searchTerm, setSearchTerm }) => {
  
  // Esta función actualiza el estado del padre (VentureFilter)
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        borderRadius: "10px",
        border: "1px solid #eaecf0",
        flexGrow: 1,
        minWidth: 280,
        bgcolor: "#f9fafb"
      }}
    >
      <SearchAutocomplete 
        onSearch={handleSearch}
        initialValue={searchTerm}
        placeholder="Search for businesses or services..."
      />
    </Paper>
  );
};

export default VentureSearchBar;