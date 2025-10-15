//changes date to be more readable
export const isoToReadable = (isoDate) => {
  if (!isoDate) return '';
  return new Date(isoDate).toLocaleDateString(); 
}

//changes number to be formatted as currency
export const formatToCurrency = (number) => {
  if (typeof number !== 'number') return '';
  return `$${number.toFixed(2)}`; 
} 