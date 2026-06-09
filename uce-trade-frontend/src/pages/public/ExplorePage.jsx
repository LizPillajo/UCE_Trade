// src/pages/public/ExplorePage.jsx
import { useState, useEffect } from 'react';
import { Container, Box, Typography, Pagination } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { fetchServices } from '../../services/api';
import { useDebounce } from '../../hooks/useDebounce';

import VentureFilter from '../../components/ventures/VentureFilter';
import VentureGrid from '../../components/ventures/VentureGrid';

const ExplorePage = () => {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1); 
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
      const urlSearch = searchParams.get('search');
      if(urlSearch !== null) setSearchTerm(urlSearch);
      const urlCat = searchParams.get('category');
      if(urlCat !== null) setCategory(urlCat);
  }, [searchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ['ventures', page, debouncedSearch, category, sort], 
    queryFn: () => fetchServices(page, debouncedSearch, category, sort),
    keepPreviousData: true,
  });

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  return (
    <Box sx={{ pt: 12, pb: 8, bgcolor: '#fcfcfc', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        
        {/* 1. FILTROS */}
        <VentureFilter 
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          category={category} setCategory={setCategory}
          sort={sort} setSort={setSort}
          viewMode={viewMode} setViewMode={setViewMode}
        />

        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {data?.totalElements || 0} Results found
          </Typography>

          {/* 2. LA GRILLA REFACTORIZADA */}
          <VentureGrid 
            isLoading={isLoading} 
            ventures={data?.content || []} 
            viewMode={viewMode} 
          />
        </Box>
        
        {/* 3. PAGINACIÓN (Mantenla aquí o crea un <AppPagination /> si se repite en el Admin) */}
        <Box display="flex" justifyContent="center" mt={6}>
          <Pagination 
            count={data?.totalPages || 1} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
            size="large"
            disabled={isLoading}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default ExplorePage;