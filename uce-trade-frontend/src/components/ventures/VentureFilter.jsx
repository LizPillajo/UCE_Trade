import { Box, IconButton, Divider, Typography, Button } from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import VentureSearchBar from "./VentureSearchBar";
import FilterSelect from "../ui/FilterSelect"; 

const categoryOptions = [
  { value: 'All', label: 'All categories' },
  { value: 'Tutorials', label: 'Tutorials' },
  { value: 'Food', label: 'Food' },
  { value: 'Design', label: 'Design' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Clothes', label: 'Clothes' },
  { value: 'Photography', label: 'Photography' },
  { value: 'Other', label: 'Others' }
];

const VentureFilter = ({
   searchTerm, setSearchTerm, category, setCategory, sort, setSort, 
   viewMode, setViewMode, showViewToggles = true, showTitle = true, isAdmin = false
}) => {
  
  const sortOptions = [
    { value: 'recent', label: 'Most recent' },
    { value: 'rating', label: 'Best Rated' },
    { value: 'price_low', label: 'Lowest Price' },
    ...(isAdmin ? [{ value: 'status', label: 'Status (A-Z)' }] : [])
  ];

  const handleClear = () => { setSearchTerm(''); setCategory('All'); setSort('recent'); };
  
  const hasFilters = category !== 'All' || sort !== 'recent' || searchTerm !== '';

  const ClearButton = () => (
    <Button 
        startIcon={<FilterAltOffIcon />} 
        onClick={handleClear} 
        color="error" 
        size="small"
        sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}
    >
        Clear Filters
    </Button>
  );

  return (
    <Box mb={4}>
      {showTitle && (
        <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" fontWeight="bold" color="#0d2149">Explore Business</Typography>
          {hasFilters && <ClearButton />}
        </Box>
      )}

      <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
        <VentureSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center" width={{ xs: '100%', md: 'auto' }}>
          <FilterSelect 
             value={category} onChange={(e) => setCategory(e.target.value)} 
             options={categoryOptions} activeColor="#e3f2fd" borderColor="#1565c0"
          />
          <FilterSelect 
             value={sort} onChange={(e) => setSort(e.target.value)} 
             options={sortOptions} activeColor="#fff8e1" borderColor="#e65100"
          />

          {!showTitle && hasFilters && (
             <ClearButton />
          )}

          {showViewToggles && (
            <>
                <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />
                <Box display="flex">
                    <IconButton color={viewMode === 'grid' ? "primary" : "default"} onClick={() => setViewMode('grid')}><GridViewIcon /></IconButton>
                    <IconButton color={viewMode === 'list' ? "primary" : "default"} onClick={() => setViewMode('list')}><ViewListIcon /></IconButton>
                </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default VentureFilter;