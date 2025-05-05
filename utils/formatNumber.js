/**
 * Format a number to a human-readable string (e.g., 1k, 1.2M)
 * @param {Number} num - The number to format
 * @returns {String} - The formatted number
 */
const formatNumber = (num) => {
    if (num === 0) return '0';
    
    const units = ['', 'k', 'M', 'B', 'T'];
    const floor = Math.floor(Math.log10(num) / 3);
    const value = num / Math.pow(1000, floor);
    
    // Format with 1 decimal place if value has decimal part and is less than 10
    // Otherwise, round to integer
    const formattedValue = value < 10 && !Number.isInteger(value) 
        ? value.toFixed(1).replace(/\.0$/, '') 
        : Math.round(value);
    
    return `${formattedValue}${units[floor]}`;
};

module.exports = formatNumber;