// utils/date.js (or wherever your rtydate function is defined)

export default function rtydate(dateString, format = 'yyyy-MM-dd HH:mm:ss') {
    const date = new Date(dateString);
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    // Determine AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert hours to 12-hour format for AM/PM
    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, '0') : '12'; // Handle 12 o'clock case
  
    // Format date string based on the provided format
    let formattedDate = format
      .replace('yyyy', year)
      .replace('MM', month)
      .replace('dd', day)
      .replace('hh', hours) // 12-hour format
      .replace('HH', String(date.getHours()).padStart(2, '0')) // 24-hour format
      .replace('mm', minutes)
      .replace('ss', seconds)
      .replace('aa', ampm); // Add AM/PM
  
    return formattedDate;
  }
  