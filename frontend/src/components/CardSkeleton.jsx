// src/components/CardSkeleton.jsx
import React from 'react';

const CardSkeleton = () => (
  <div className="m-2 w-full flex flex-col items-center">
    <div className="bg-gray-200 dark:bg-gray-700 rounded-xl w-full sm:w-[95%] h-16 sm:h-32 flex animate-pulse">
      <div className="w-20 sm:w-40 bg-gray-300 dark:bg-gray-600 rounded-r-full"></div>
      <div className="flex-1 flex flex-col justify-center p-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
      </div>
      <div className="w-16 flex items-center justify-center">
        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      </div>
    </div>
  </div>
);

export default CardSkeleton;