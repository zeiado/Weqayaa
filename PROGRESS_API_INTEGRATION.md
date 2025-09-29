# Progress Report API Integration Guide

This document provides a comprehensive guide for integrating the Progress Report API endpoints into the Weqaya Cafe Buddy application.

## 📋 API Endpoints Overview

### 1. Get Progress Report
**Endpoint:** `GET /api/Nutrition/progress-report?period={week|month|quarter}`

**Description:** Get comprehensive progress report with charts, daily needs, and recommendations.

**Query Parameters:**
- `period` (optional): `week` | `month` | `quarter` (default: `week`)

**Response Status Codes:**
- `200 OK` - Success
- `404 Not Found` - User profile not found
- `500 Internal Server Error` - Server error

**Usage Example:**
```typescript
import { progressApi } from '@/services/progressApi';

// Get weekly progress report
const weeklyReport = await progressApi.getProgressReport('week');

// Get monthly progress report
const monthlyReport = await progressApi.getProgressReport('month');

// Get quarterly progress report
const quarterlyReport = await progressApi.getProgressReport('quarter');
```

### 2. Get Daily Needs
**Endpoint:** `GET /api/Nutrition/daily-needs?date={YYYY-MM-DD}`

**Description:** Get daily nutritional and activity targets vs consumed for a specific date.

**Query Parameters:**
- `date` (optional): Date in YYYY-MM-DD format (default: today)

**Response Status Codes:**
- `200 OK` - Success
- `404 Not Found` - User profile not found
- `500 Internal Server Error` - Server error

**Usage Example:**
```typescript
// Get today's daily needs
const todayNeeds = await progressApi.getDailyNeeds();

// Get specific date's daily needs
const specificDateNeeds = await progressApi.getDailyNeeds('2024-01-15');
```

### 3. Get Recommended Activities
**Endpoint:** `GET /api/Nutrition/recommended-activities`

**Description:** Get personalized recommended activities for the user.

**Response Status Codes:**
- `200 OK` - Success
- `404 Not Found` - User profile not found
- `500 Internal Server Error` - Server error

**Usage Example:**
```typescript
const activities = await progressApi.getRecommendedActivities();
```

### 4. Update Progress Metrics
**Endpoint:** `POST /api/Nutrition/progress-metrics`

**Description:** Update or create progress metrics for a specific date.

**Request Body:**
```typescript
interface ProgressMetrics {
  date: string;           // Required: Date for the metrics
  weight?: number;        // Optional: Weight in kg
  bodyFat?: number;       // Optional: Body fat percentage
  muscleMass?: number;    // Optional: Muscle mass in kg
  waterIntake?: number;   // Optional: Water intake in ml
  steps?: number;         // Optional: Daily steps count
  caloriesBurned?: number; // Optional: Calories burned through exercise
  sleepHours?: number;    // Optional: Hours of sleep
  mood?: number;          // Optional: Mood rating 1-10
}
```

**Response Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Validation error
- `404 Not Found` - User profile not found
- `500 Internal Server Error` - Server error

**Usage Example:**
```typescript
const metrics = {
  date: '2024-01-15',
  weight: 70.5,
  steps: 8500,
  sleepHours: 7.5,
  mood: 8
};

await progressApi.updateProgressMetrics(metrics);
```

### 5. Complete Activity
**Endpoint:** `PUT /api/Nutrition/activities/{activityId}/complete`

**Description:** Mark a recommended activity as completed.

**Path Parameters:**
- `activityId` (required): ID of the activity to complete

**Response Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Activity not found
- `500 Internal Server Error` - Server error

**Usage Example:**
```typescript
await progressApi.markActivityCompleted(123);
```

### 6. Update Meal Plan Item
**Endpoint:** `PUT /api/Nutrition/meal-plan/{mealPlanId}/items/{mealPlanFoodItemId}?newMenuFoodItemId={menuFoodItemId}`

**Description:** Replace a specific food item in a meal plan with another item from the menu.

**Path Parameters:**
- `mealPlanId` (required): ID of the meal plan
- `mealPlanFoodItemId` (required): ID of the food item to replace

**Query Parameters:**
- `newMenuFoodItemId` (required): ID of the new menu food item

**Response Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Meal plan, item, or menu item not found
- `500 Internal Server Error` - Server error

**Usage Example:**
```typescript
await progressApi.updateMealPlanItem(456, 789, 101);
```

## 🎯 Frontend Integration Examples

### 1. Progress Report Component
```typescript
import React, { useState, useEffect } from 'react';
import { progressApi } from '@/services/progressApi';
import { ProgressReport as ProgressReportType } from '@/types/progress';

const ProgressReportComponent = () => {
  const [report, setReport] = useState<ProgressReportType | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('week');

  useEffect(() => {
    fetchProgressReport();
  }, [period]);

  const fetchProgressReport = async () => {
    try {
      const data = await progressApi.getProgressReport(period);
      setReport(data);
    } catch (error) {
      console.error('Error fetching progress report:', error);
    }
  };

  return (
    <div>
      {/* Render progress report data */}
    </div>
  );
};
```

### 2. Daily Metrics Form
```typescript
import React, { useState } from 'react';
import { progressApi } from '@/services/progressApi';
import { ProgressMetrics } from '@/types/progress';

const MetricsForm = () => {
  const [metrics, setMetrics] = useState<ProgressMetrics>({
    date: new Date().toISOString().split('T')[0],
    weight: undefined,
    steps: undefined,
    sleepHours: undefined,
    mood: undefined
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await progressApi.updateProgressMetrics(metrics);
      // Show success message
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

### 3. Activity Completion
```typescript
import React from 'react';
import { progressApi } from '@/services/progressApi';

const ActivityItem = ({ activity }) => {
  const handleComplete = async () => {
    try {
      await progressApi.markActivityCompleted(activity.id);
      // Update UI to show completed state
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div>
      <h3>{activity.title}</h3>
      <button onClick={handleComplete}>
        Mark as Complete
      </button>
    </div>
  );
};
```

## 🔧 Error Handling

All API endpoints follow a consistent error response format:

```typescript
interface ErrorResponse {
  message: string;
  errors?: string[];
  statusCode: number;
}
```

**Error Handling Example:**
```typescript
try {
  const data = await progressApi.getProgressReport('week');
  // Handle success
} catch (error) {
  if (error.message.includes('404')) {
    // Handle not found
  } else if (error.message.includes('500')) {
    // Handle server error
  } else {
    // Handle other errors
  }
}
```

## 📱 Key Features for Frontend Implementation

### Progress Charts
- Use `chartData` from progress report for weight tracking charts
- Support different chart types: line, bar, area
- Implement responsive design for mobile devices

### Daily Progress Bars
- Use `dailyNeeds` percentage values for progress bars
- Color-code based on completion percentage:
  - Green: 80%+ completion
  - Yellow: 60-79% completion
  - Red: <60% completion

### Activity Management
- Show activities with completion status and priority
- Implement real-time updates after completing activities
- Display activity benefits and difficulty levels

### Real-time Updates
- Refresh data after completing activities or updating metrics
- Implement optimistic UI updates for better user experience
- Show loading states during API calls

### Responsive Design
- Handle different screen sizes for charts and progress indicators
- Use mobile-first approach for touch interactions
- Implement proper spacing and typography scaling

### Arabic Support
- All text content supports Arabic RTL layout
- Use proper date formatting for Arabic locale
- Implement proper number formatting for Arabic users

## 🚀 Best Practices

1. **Caching**: Implement proper caching for progress data to reduce API calls
2. **Loading States**: Always show loading indicators during API calls
3. **Error Boundaries**: Implement error boundaries to handle API failures gracefully
4. **Optimistic Updates**: Update UI immediately and rollback on error
5. **Data Validation**: Validate data before sending to API
6. **Accessibility**: Ensure all components are accessible with proper ARIA labels
7. **Performance**: Use React.memo and useMemo for expensive calculations
8. **Testing**: Write unit tests for API integration functions

## 📊 Data Flow

```
User Action → Component → API Service → Backend → Response → Component Update → UI Refresh
```

1. User performs action (e.g., completes activity)
2. Component calls API service method
3. API service makes HTTP request to backend
4. Backend processes request and returns response
5. Component receives response and updates state
6. UI re-renders with new data

## 🔐 Authentication

All API requests include authentication headers:
```typescript
const token = localStorage.getItem('authToken');
if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}
```

Make sure to handle authentication errors (401 Unauthorized) by redirecting to login page.

## 📝 TypeScript Types

All API responses are properly typed using TypeScript interfaces defined in `/src/types/progress.ts`. This ensures type safety and better development experience.

## 🧪 Testing

Use the mock data provided in `progressApi.getMockProgressReport()` for development and testing purposes. Replace with actual API calls when backend is ready.

## 📞 Support

For any issues or questions regarding the API integration, please refer to the backend API documentation or contact the development team.
