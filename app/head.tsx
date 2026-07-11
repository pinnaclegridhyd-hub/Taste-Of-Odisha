const SITE_URL = 'https://www.tasteofodisha1996.com';

export default function Head() {
  return (
    <>
      <title>Taste Of Odisha | Authentic Odisha Food & Heritage Products</title>
      <meta name="description" content="Shop authentic Odisha snacks, pickles, sweets and heritage foods made by local women-led communities." />
      <meta name="keywords" content="Taste of Odisha, Odisha food, Odisha snacks, authentic pickles, muruku, papad, Indian sweets" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Taste Of Odisha" />
      <meta property="og:title" content="Taste Of Odisha | Authentic Odisha Food & Heritage Products" />
      <meta property="og:description" content="Authentic Odisha products prepared by local women-led communities." />
      <meta property="og:url" content={SITE_URL} />
      <meta property="og:image" content={`${SITE_URL}/images/logo-too.jpeg`} />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
}
