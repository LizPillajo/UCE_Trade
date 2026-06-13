import { Select, MenuItem } from "@mui/material";

const FilterSelect = ({ value, onChange, options, activeColor, borderColor }) => {
  const isActive = value !== 'All' && value !== 'recent';
  return (
    <Select
      value={value}
      onChange={onChange}
      displayEmpty
      sx={{ 
        height: 50, 
        borderRadius: "8px",
        minWidth: { xs: '100%', sm: 180 },
        bgcolor: isActive ? activeColor : 'white',
        border: isActive ? `1px solid ${borderColor}` : 'none',
        fontWeight: isActive ? 'bold' : 'normal',
        color: isActive ? borderColor : 'inherit'
      }}
    >
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
      ))}
    </Select>
  );
};

export default FilterSelect;