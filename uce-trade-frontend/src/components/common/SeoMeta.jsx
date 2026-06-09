import { Helmet } from 'react-helmet-async';

const SeoMeta = ({ title, description }) => {
  return (
    <Helmet>
      <title>{title} | UCE Trade</title>
      <meta name="description" content={description} />
      {/* Open Graph for sharing the link on WhatsApp/Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
    </Helmet>
  );
};

export default SeoMeta;