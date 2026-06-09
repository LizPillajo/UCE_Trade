import { TextField, MenuItem } from '@mui/material';

const periods = [
    { value: 'ALL', label: 'All Time' },
    { value: 'DAILY', label: 'Today' },
    { value: 'MONTHLY', label: 'This Month' },
    { value: 'ANNUAL', label: 'This Year' }
];

const PeriodSelector = ({ value, onChange, disabled = false }) => {
  return (
    <TextField 
        select 
        size="small" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        sx={{ bgcolor: 'white', borderRadius: 1, minWidth: 150 }}
    >
        {periods.map((p) => (
            <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
        ))}
    </TextField>
  );
};

export default PeriodSelector;