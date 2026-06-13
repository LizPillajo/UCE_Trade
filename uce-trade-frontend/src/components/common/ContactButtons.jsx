import { Stack } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import Button from '../ui/Button';
import { toast } from 'react-toastify';

const ContactButtons = ({ phoneNumber, email, fullName, ventureTitle = "", variant = "vertical" }) => {
  
  const handleWhatsApp = () => {
    let phone = phoneNumber?.replace(/\D/g, '');
    if (!phone) {
        toast.warning("No phone number available for this user.");
        return;
    }
    if (phone.startsWith('09')) phone = '593' + phone.substring(1);
    else if (phone.startsWith('9')) phone = '593' + phone;
    const message = ventureTitle 
      ? `Hello ${fullName}, I'm interested in your service "${ventureTitle}" seen on UCE Trade.`
      : `Hello ${fullName}, I saw your profile on UCE Trade and would like to contact you.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const handleEmail = () => {
    if (!email) return;
    const subject = ventureTitle ? `Inquiry about ${ventureTitle}` : `Contact from UCE Trade`;
    const body = `Hello ${fullName},\n\nI am interesed in purchasing your service "${ventureTitle}" from UCE Trade.`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Stack spacing={1.5} direction={variant === "horizontal" ? "row" : "column"} width="100%">
      <Button 
        fullWidth variant="contained" startIcon={<WhatsAppIcon />} 
        onClick={handleWhatsApp} 
        sx={{ bgcolor: '#25D366', borderRadius: '12px', color: 'white', py: 0.8 }}
      >
        WhatsApp
      </Button>
      <Button 
        fullWidth variant="outlined" startIcon={<EmailIcon />} 
        onClick={handleEmail} 
        sx={{ borderColor: '#e5e7eb', color: '#374151', borderRadius: '12px', py: 0.8, bgcolor: 'white' }}
      >
        {variant === "horizontal" ? "Email" : (email || "Email")}
      </Button>
    </Stack>
  );
};

export default ContactButtons;