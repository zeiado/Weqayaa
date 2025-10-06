// Debug utility for API testing
export const debugApiConnection = async () => {
  const API_BASE_URL = 'https://weqaya-api-v1.runasp.net/api';
  const token = localStorage.getItem('authToken');
  
  console.log('🔍 API Debug Information:');
  console.log('Base URL:', API_BASE_URL);
  console.log('Auth Token:', token ? 'Present' : 'Missing');
  
  if (token) {
    try {
      // Decode JWT token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const isExpired = payload.exp < currentTime;
      console.log('Token Expired:', isExpired);
      console.log('Token Expires At:', new Date(payload.exp * 1000));
    } catch (error) {
      console.log('Token Decode Error:', error);
    }
  }
  
  // Test basic connectivity
  try {
    const response = await fetch(`${API_BASE_URL}/Nutrition/dashboard/summary?date=${new Date().toISOString().split('T')[0]}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    
    console.log('API Response Status:', response.status);
    console.log('API Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('API Error Response:', errorText);
    } else {
      const data = await response.json();
      console.log('API Success Response:', data);
    }
  } catch (error) {
    console.log('API Connection Error:', error);
  }
};

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).debugApiConnection = debugApiConnection;
}
