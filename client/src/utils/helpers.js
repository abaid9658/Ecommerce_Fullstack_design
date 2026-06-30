// Format number as USD currency
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Truncate long text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Generate star symbols array (filled/empty/half) based on rating
export const getStarsArray = (rating) => {
  const stars = [];
  const floorRating = Math.floor(rating);
  
  for (let i = 1; i <= 5; i++) {
    if (i <= floorRating) {
      stars.push('full');
    } else if (i - 0.5 <= rating) {
      stars.push('half');
    } else {
      stars.push('empty');
    }
  }
  return stars;
};
