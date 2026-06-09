import { useState, useEffect } from 'react';
import { Autocomplete, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { fetchSuggestions } from "../../services/api";
import { useDebounce } from "../../hooks/useDebounce";

const SearchAutocomplete = ({ 
  onSearch, 
  initialValue = "", 
  placeholder = "Search...",
  sx = {} 
}) => {
  const [inputValue, setInputValue] = useState(initialValue || "");
  const [options, setOptions] = useState([]);
  
  const debouncedTerm = useDebounce(inputValue, 300);

  useEffect(() => {
    setInputValue(initialValue || "");
  }, [initialValue]);

  useEffect(() => {
    let active = true;
    
    if (!debouncedTerm || debouncedTerm.trim() === "") {
      setOptions([]);
      return undefined;
    }

    fetchSuggestions(debouncedTerm).then((results) => {
      if (active && results) {
          const cleanResults = results.filter(item => item !== null && item !== undefined);
          setOptions(cleanResults);
      }
    }).catch(() => {
        if(active) setOptions([]);
    });

    return () => { active = false; };
  }, [debouncedTerm]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); 
        onSearch(inputValue);
    }
  };

  return (
    <Autocomplete
      freeSolo
      fullWidth
      options={options}
      inputValue={inputValue || ""} 
      
      onInputChange={(_, newValue) => {
          setInputValue(newValue || ""); 
      }}
      
      onChange={(_, newValue) => {
          onSearch(newValue || "");
      }} 
      
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          variant="standard"
          onKeyDown={handleKeyDown}
          InputProps={{
            ...params.InputProps,
            disableUnderline: true, 
            startAdornment: (
                <InputAdornment position="start" sx={{ pl: 1, mr: 1 }}>
                  <SearchIcon color="action" />
                </InputAdornment>
            ),
            style: { fontSize: '1.05rem', padding: '8px' }
          }}
          sx={{ 
            ...sx,
            '& .MuiInputBase-root': { py: 0.5 } 
          }}
        />
      )}
    />
  );
};

export default SearchAutocomplete;