import { Box, Container, Typography, Paper } from "@mui/material";
import { useNavigate } from 'react-router-dom'; 
import Button from "../ui/Button";
import HeroStats from "./HeroStats"; 
import SearchAutocomplete from "../common/SearchAutocomplete"; 

const HeroSection = () => {
  const navigate = useNavigate();

  const handleSearch = (term) => {
    if (term) {
      navigate(`/explore?search=${encodeURIComponent(term)}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(110vh - 64px)",
        display: "flex",
        alignItems: "center",
        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
        color: "white",
        textAlign: "center",
        position: "relative",
        pt: 5,
        pb: 6,
      }}
    >
      <Container maxWidth="lg">
        {/* TITULAR */}
        <Typography
          variant="h2"
          component="h1"
          fontWeight="600"
          gutterBottom
          sx={{fontSize: { xs: "2.2rem", md: "4.6rem" }, mb: 2, lineHeight: 1.02,}}
        >
          <br /> Discover university <br />
          <Box component="span" sx={{ borderBottom: "6px solid #efb034", display: "inline-block", lineHeight: 1.5 }}>
            talent
          </Box>
        </Typography>

        <Typography variant="h6" sx={{ mb: 6, opacity: 0.9, fontWeight: 100, maxWidth: "550px", mx: "auto", fontSize: "1.2rem" }}>
          <br />
          Connect with services and ventures created by students at the Central University of Ecuador.
        </Typography>

        {/* BARRA DE BÚSQUEDA CENTRAL */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: { xs: "100%", md: 900 }, px: { xs: 2, md: 0 } }}>
            
            {/* Contenedor visual tipo "Pill"*/}
            <Paper
              elevation={6}
              sx={{
                p: "4px", 
                display: "flex",
                alignItems: "center",
                borderRadius: "50px",
                flex: 1,
                boxShadow: "0 12px 50px rgba(0,0,0,0.25)",
                bgcolor: 'white'
              }}
            >
              {/* Usamos el componente compartido */}
              <SearchAutocomplete 
                onSearch={handleSearch} 
                placeholder="Search for services, tutorials..."
              />
            </Paper>

            <Button
              variant="contained"
              color="secondary"          
              onClick={() => handleSearch('')} 
              sx={{
                borderRadius: "50px",
                px: 4,
                fontSize: "1.05rem",
                boxShadow: "0 6px 20px rgba(239,176,52,0.25)",
                minWidth: 150,
                height: 56,
                color: "white",
              }}
            >
              Search
            </Button>
          </Box>
        </Box>

        {/* ESTADÍSTICAS EXTRAÍDAS */}
        <HeroStats />

      </Container>
    </Box>
  );
};

export default HeroSection;