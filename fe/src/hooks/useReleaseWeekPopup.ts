import { useState, useEffect } from 'react';

export const useReleaseWeekPopup = (delayMs = 5000, releaseDate = '2025-06-20') => {
  const [showPopup, setShowPopup] = useState(false);
  const STORAGE_KEY = 'lastPopupShown';

  useEffect(() => {
    const checkAndShowPopup = () => {
      const today = new Date();
      const release = new Date(releaseDate);
      const oneWeekAfterRelease = new Date(release.getTime() + 7 * 24 * 60 * 60 * 1000);

      // Check if we're in the first week after release
      const isFirstWeek = today >= release && today <= oneWeekAfterRelease;

      if (isFirstWeek) {
        // First week: Show popup every visit after delay
        const timer = setTimeout(() => {
          setShowPopup(true);
        }, delayMs);

        return () => clearTimeout(timer);
      } else if (today > oneWeekAfterRelease) {
        // After first week: Show popup once per day
        const todayString = today.toDateString();
        const lastShown = localStorage.getItem(STORAGE_KEY);

        // Check if popup was already shown today
        if (lastShown === todayString) {
          return; // Don't show popup if already shown today
        }

        // Set timer to show popup after specified delay
        const timer = setTimeout(() => {
          setShowPopup(true);
          // Mark popup as shown for today
          localStorage.setItem(STORAGE_KEY, todayString);
        }, delayMs);

        return () => clearTimeout(timer);
      }
      // Before release date: don't show popup at all
    };

    checkAndShowPopup();
  }, [delayMs, releaseDate]);

  const closePopup = () => {
    setShowPopup(false);
  };

  const resetPopupForToday = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  // Helper function to check current phase
  const getCurrentPhase = () => {
    const today = new Date();
    const release = new Date(releaseDate);
    const oneWeekAfterRelease = new Date(release.getTime() + 7 * 24 * 60 * 60 * 1000);

    if (today < release) return 'before-release';
    if (today >= release && today <= oneWeekAfterRelease) return 'first-week';
    return 'after-first-week';
  };

  return {
    showPopup,
    closePopup,
    resetPopupForToday, // For testing purposes
    getCurrentPhase, // For debugging/testing
  };
};
