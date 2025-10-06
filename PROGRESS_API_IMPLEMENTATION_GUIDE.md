# Progress API Implementation Guide

This guide covers the implementation of the Progress Metrics and Activities APIs in the Weqaya nutrition application, following the provided API specification.

## 📋 Overview

The implementation includes:
- **Progress Metrics API**: Update user progress metrics with partial data support
- **Activities API**: Mark recommended activities as completed
- **Error Handling**: Comprehensive error handling for all API responses
- **TypeScript Types**: Full type safety for all API interactions
- **UI Components**: Ready-to-use React components

## 🔧 API Endpoints

### Base URL
All endpoints are prefixed with: `/api/nutrition/`

### 1. Update Progress Metrics
```
POST /api/nutrition/progress-metrics
```

### 2. Complete Activity
```
PUT /api/nutrition/activities/{activityId}/complete
```

## 📁 File Structure

```
src/
├── services/
│   └── progressApi.ts          # API service implementation
├── types/
│   └── progress.ts             # TypeScript type definitions
├── components/
│   ├── ProgressMetricsForm.tsx # Progress metrics form component
│   ├── RecommendedActivities.tsx # Activities list component
│   └── ProgressApiExample.tsx  # Complete usage example
```

## 🚀 Quick Start

### 1. Import the API Service

```typescript
import { progressApi } from '@/services/progressApi';
import { ProgressMetrics } from '@/types/progress';
```

### 2. Update Progress Metrics

```typescript
const updateMetrics = async () => {
  try {
    const metrics: ProgressMetrics = {
      date: "2024-01-15T00:00:00Z", // ISO 8601 format
      weight: 75.5,
      steps: 8500,
      sleepHours: 7.5,
      mood: 8
    };
    
    const response = await progressApi.updateProgressMetrics(metrics);
    console.log(response.message); // "Metrics updated"
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### 3. Complete an Activity

```typescript
const completeActivity = async (activityId: number) => {
  try {
    const response = await progressApi.markActivityCompleted(activityId);
    console.log(response.message); // "Activity completed"
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

## 🎯 Key Features

### Partial Updates
The progress metrics API supports partial updates - you only need to send the fields you want to update:

```typescript
// Update only weight and steps
const partialMetrics = {
  date: "2024-01-15T00:00:00Z",
  weight: 75.5,
  steps: 8500
  // Other fields will be preserved
};
```

### Date Format
Always use ISO 8601 format for dates:
```typescript
const date = new Date().toISOString(); // "2024-01-15T10:30:00.000Z"
```

### Error Handling
The implementation includes comprehensive error handling:

```typescript
try {
  await progressApi.updateProgressMetrics(metrics);
} catch (error: any) {
  if (error.message.includes('400')) {
    // Validation error - check your data
  } else if (error.message.includes('404')) {
    // User profile not found - redirect to profile creation
  } else if (error.message.includes('500')) {
    // Server error - show generic error message
  }
}
```

## 🧩 Components Usage

### ProgressMetricsForm Component

```tsx
import { ProgressMetricsForm } from '@/components/ProgressMetricsForm';

<ProgressMetricsForm 
  onMetricsUpdated={() => {
    // Refresh data or show success message
  }}
  initialDate="2024-01-15" // Optional
/>
```

### RecommendedActivities Component

```tsx
import { RecommendedActivities } from '@/components/RecommendedActivities';

<RecommendedActivities 
  activities={activitiesList}
  onActivityComplete={(activityId) => {
    // Handle activity completion
  }}
/>
```

### Complete Example Component

```tsx
import { ProgressApiExample } from '@/components/ProgressApiExample';

// This component demonstrates both APIs working together
<ProgressApiExample />
```

## 📊 TypeScript Types

### ProgressMetrics Interface

```typescript
interface ProgressMetrics {
  date: string; // ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
  weight?: number; // Weight in kg
  bodyFat?: number; // Body fat percentage
  muscleMass?: number; // Muscle mass in kg
  waterIntake?: number; // Water intake in ml
  steps?: number; // Number of steps taken
  caloriesBurned?: number; // Calories burned
  sleepHours?: number; // Hours of sleep
  mood?: number; // Mood rating (1-10 scale)
}
```

### API Response Types

```typescript
interface ProgressMetricsResponse {
  message: string;
}

interface ActivityCompletionResponse {
  message: string;
}

interface ApiErrorResponse {
  type?: string;
  title?: string;
  status: number;
  errors?: Record<string, string[]>;
  message?: string;
}
```

## 🔄 API Response Examples

### Success Responses

#### Progress Metrics Update
```json
{
  "message": "Metrics updated"
}
```

#### Activity Completion
```json
{
  "message": "Activity completed"
}
```

### Error Responses

#### Validation Error (400)
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Date": ["The Date field is required."]
  }
}
```

#### User Not Found (404)
```json
{
  "message": "User profile not found"
}
```

#### Activity Not Found (404)
```json
{
  "message": "Activity not found"
}
```

#### Server Error (500)
```json
{
  "message": "An internal server error occurred"
}
```

## 🎨 UI Integration

### Form Validation
The components include built-in validation:
- Required date field
- Numeric input validation
- Range validation for mood (1-10)
- Real-time error feedback

### Loading States
All components show loading states during API calls:
- Spinner animations
- Disabled buttons
- Loading text

### Success/Error Feedback
Toast notifications provide immediate feedback:
- Success messages with checkmarks
- Error messages with specific details
- Arabic language support

## 🔧 Configuration

### API Base URL
The API base URL is configured in `src/services/progressApi.ts`:

```typescript
const API_BASE_URL = 'https://weqaya-api-v1.runasp.net/api';
```

### Authentication
The service automatically includes the auth token from localStorage:

```typescript
const token = localStorage.getItem('authToken');
if (token) {
  defaultHeaders['Authorization'] = `Bearer ${token}`;
}
```

## 🧪 Testing

### Manual Testing
Use the `ProgressApiExample` component to test both APIs:

1. Navigate to the component in your app
2. Fill in the progress metrics form
3. Click "حفظ المقاييس" to test the metrics API
4. Click "إكمال" on activities to test the activities API
5. Check the browser console for API logs

### Error Testing
Test error scenarios:
- Submit form without required fields (400 error)
- Use invalid activity ID (404 error)
- Test with invalid auth token (401 error)

## 📱 Mobile Considerations

The components are fully responsive and work on mobile devices:
- Touch-friendly form inputs
- Responsive grid layouts
- Mobile-optimized button sizes
- Arabic RTL support

## 🔒 Security Notes

- All API calls include authentication headers
- Input validation prevents malicious data
- Error messages don't expose sensitive information
- CORS is handled by the API server

## 🚀 Next Steps

1. **Integration**: Add the components to your existing dashboard
2. **Customization**: Modify the UI to match your design system
3. **Testing**: Add unit tests for the API service
4. **Monitoring**: Add error tracking and analytics
5. **Caching**: Implement client-side caching for better performance

## 📞 Support

For issues or questions:
1. Check the browser console for detailed error logs
2. Verify the API endpoint is accessible
3. Ensure authentication tokens are valid
4. Review the API specification for expected data formats

---

**Note**: This implementation follows the exact API specification provided and includes comprehensive error handling, TypeScript support, and ready-to-use React components.
