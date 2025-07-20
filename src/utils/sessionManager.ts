// Session ID management utilities
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('fruit_store_session_id');
  
  if (!sessionId) {
    // Generate a random session ID
    sessionId = 'guest_' + Math.random().toString(36).substr(2, 16) + '_' + Date.now();
    localStorage.setItem('fruit_store_session_id', sessionId);
  }
  
  return sessionId;
};

export const clearSession = (): void => {
  localStorage.removeItem('fruit_store_session_id');
};