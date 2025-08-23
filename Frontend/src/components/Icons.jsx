import React from 'react';

export const HeartIcon = ({ className = "w-6 h-6", isFilled = false }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFilled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

export const BookmarkIcon = ({ className = "w-6 h-6", isFilled = false }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFilled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    </svg>
);
  
export const ShareIcon = ({ className = "w-6 h-6" }) => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 4.186m0-4.186c.206.39.435.75.692 1.082m-1.384 3.104c-.258.332-.52.68-.828 1.018M12.975 10.907a2.25 2.25 0 100 4.186m0-4.186c-.206.39-.435.75-.692 1.082m1.384 3.104c.258.332.52.68.828 1.018m-5.142 0c-1.31-.435-2.25-1.67-2.25-3.093s.94-2.658 2.25-3.093m5.142 0c1.31.435 2.25 1.67 2.25 3.093s-.94-2.658-2.25-3.093" />
      </svg>
);


  export const ShoppingCartIcon = ({ className = "w-6 h-6" }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="currentColor" 
      viewBox="0 0 24 24" 
      className={className}
    >
      <path d="M7 18c-1.104 0-2 .896-2 2s.896 2 2 2 
               2-.896 2-2-.896-2-2-2zm10 0c-1.104 
               0-2 .896-2 2s.896 2 2 2 2-.896 
               2-2-.896-2-2-2zM7.333 13h9.334c.828 
               0 1.553-.502 1.847-1.268l2.609-6.956A1 
               1 0 0019.167 4H6.21l-.937-2.445A1 
               1 0 004.333 1H1v2h2.333l3.6 
               9.4-1.35 2.45C4.986 15.737 6.128 
               17 7.667 17h11.666v-2H7.333l1-2z"/>
    </svg>
  );
  