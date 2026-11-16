export function generateRestaurantJsonLd(restaurant: any) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": restaurant?.name || "JD Restaurant",
    "description":
      restaurant?.metaDescription ||
      "Pure vegetarian restaurant serving authentic Punjabi, Chinese, South Indian, and Gujarati Thali in Surat.",
    "url": restaurant?.siteUrl || "https://menu.jdrestaurant.in",
    "telephone": restaurant?.phone || "0261-2556649",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Mini Bazar, Varachha Road",
      "addressLocality": "Surat",
      "addressRegion": "Gujarat",
      "postalCode": "395006",
      "addressCountry": "IN",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": restaurant?.geoLat || 21.2185,
      "longitude": restaurant?.geoLng || 72.8465,
    },
    "servesCuisine": ["Punjabi", "Chinese", "South Indian", "Gujarati"],
    "priceRange": restaurant?.priceRange || "₹₹",
    "currenciesAccepted": "INR",
    "paymentAccepted": "Cash, UPI",
    "hasMenu": `${restaurant?.siteUrl || "https://menu.jdrestaurant.in"}/menu`,
    "suitableForDiet": "https://schema.org/VegetarianDiet",
  };

  return JSON.stringify(jsonLd).replace(/</g, "\\u003c");
}

export function generateCategoryJsonLd(restaurant: any, category: any) {
  if (!category) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Menu",
    "name": `${restaurant?.name || "JD Restaurant"} - ${category.nameEn}`,
    "hasMenuSection": {
      "@type": "MenuSection",
      "name": category.nameEn,
      "description": category.note || `${category.nameEn} dishes at JD Restaurant`,
      "hasMenuItem": (category.items || []).map((item: any) => ({
        "@type": "MenuItem",
        "name": item.nameEn,
        "description": item.description || item.nameGu || undefined,
        "suitableForDiet": "https://schema.org/VegetarianDiet",
        "offers": {
          "@type": "Offer",
          "price": item.price,
          "priceCurrency": "INR",
        },
      })),
    },
  };

  return JSON.stringify(jsonLd).replace(/</g, "\\u003c");
}
