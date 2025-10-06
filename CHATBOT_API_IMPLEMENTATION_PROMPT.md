# 🤖 Chatbot API Implementation Prompt for Backend Developer

## 📋 Project Overview

**Weqaya Cafe Buddy** is an AI-powered nutrition companion for university students. The system currently has a frontend chatbot interface (`AIChat.tsx`) that simulates AI responses with hardcoded Arabic responses. We need to implement real backend APIs to power this chatbot with intelligent, personalized nutrition advice.

## 🎯 Current System Context

### **Frontend Chatbot Interface**
- **File**: `src/components/AIChat.tsx`
- **Current State**: Simulated responses with hardcoded Arabic text
- **Language**: Arabic (العربية)
- **Features**: 
  - Text input with send functionality
  - Quick action buttons
  - Camera and microphone buttons (for future features)
  - Message history with timestamps

### **Available User Data**
The system has rich user profile data that should be used for personalized responses:

```typescript
// User Authentication Data
{
  userId: number,
  email: string,
  firstName: string,
  lastName: string
}

// Nutrition Profile Data
{
  id: number,
  age: number,
  weight: number,           // in kg
  height: number,           // in cm
  activityLevel: ActivityLevel,  // 1-5 scale
  healthGoal: HealthGoal,   // LoseWeight=1, GainMuscle=2, MaintainWeight=3
  healthConditions: number[], // Array of health condition IDs
  bmi: number,
  dailyCalorieRequirement: number,
  createdAt: string,
  updatedAt: string
}

// Onboarding Data
{
  name: string,
  age: string,
  gender: string,
  university: string,
  goal: string,
  activityLevel: string,
  budget: string,
  height: string,
  weight: string,
  healthConditions: number[]
}
```

### **Existing API Infrastructure**
- **Base URL**: `https://weqaya-api-v1.runasp.net/api`
- **Authentication**: JWT Bearer tokens
- **Existing Services**: Auth, Dashboard, Nutrition Profile, Menu, Progress APIs

## 🚀 Required API Endpoints

### **1. Chat Message Processing**
```
POST /Chat/send-message
```

**Request Body:**
```json
{
  "message": "string",
  "conversationId": "string (optional)",
  "context": {
    "currentDate": "2024-01-15",
    "userLocation": "cafeteria" | "dashboard" | "mealplan" | "profile",
    "quickAction": "boolean (optional)"
  }
}
```

**Response:**
```json
{
  "isSuccess": true,
  "conversationId": "uuid-string",
  "messageId": "uuid-string",
  "response": {
    "text": "string (Arabic response)",
    "type": "text" | "meal_recommendation" | "nutrition_advice" | "progress_insight",
    "suggestions": [
      {
        "text": "string",
        "action": "string (optional)"
      }
    ],
    "quickActions": [
      {
        "text": "string",
        "action": "string"
      }
    ],
    "attachments": [
      {
        "type": "meal" | "chart" | "link",
        "data": "object"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### **2. Conversation Management**
```
GET /Chat/conversations
POST /Chat/conversations
DELETE /Chat/conversations/{conversationId}
```

### **3. Chat History**
```
GET /Chat/conversations/{conversationId}/messages
```

**Response:**
```json
{
  "isSuccess": true,
  "conversationId": "uuid-string",
  "messages": [
    {
      "id": "uuid-string",
      "text": "string",
      "isUser": true,
      "timestamp": "2024-01-15T10:30:00Z",
      "type": "text" | "quick_action"
    },
    {
      "id": "uuid-string",
      "text": "string",
      "isUser": false,
      "timestamp": "2024-01-15T10:30:05Z",
      "type": "text" | "meal_recommendation" | "nutrition_advice",
      "suggestions": ["array of strings"],
      "quickActions": ["array of objects"]
    }
  ]
}
```

## 🧠 AI Response Requirements

### **Response Types & Context**

1. **Nutrition Advice** (`nutrition_advice`)
   - Personalized based on user's health profile
   - Consider health conditions, goals, and activity level
   - Provide specific, actionable recommendations

2. **Meal Recommendations** (`meal_recommendation`)
   - Suggest meals from cafeteria menu
   - Consider user's calorie requirements and preferences
   - Include nutritional information and reasoning

3. **Progress Insights** (`progress_insight`)
   - Analyze user's progress data
   - Provide encouragement and suggestions
   - Compare with goals and previous performance

4. **General Chat** (`text`)
   - Friendly, supportive tone in Arabic
   - Health and nutrition focused
   - University student context

### **Personalization Factors**
- **Health Goal**: Weight loss, muscle gain, or maintenance
- **Activity Level**: Sedentary to extra active
- **Health Conditions**: Diabetes, hypertension, etc.
- **BMI and Calorie Requirements**: For portion and meal suggestions
- **Age and Gender**: For appropriate recommendations
- **Budget**: Consider user's budget constraints
- **University Context**: Campus dining, student lifestyle

### **Quick Actions to Support**
```typescript
const quickActions = [
  "اقترح لي وجبة صحية",           // "Suggest a healthy meal"
  "احسب احتياجاتي من السعرات",     // "Calculate my calorie needs"
  "كيف أتابع تقدمي؟",            // "How do I track my progress?"
  "ما هي أفضل الأوقات للأكل؟",     // "What are the best times to eat?"
  "نصائح لوجبة الإفطار",         // "Breakfast tips"
  "كيف أزيد من البروتين؟",        // "How to increase protein?"
  "وجبات مناسبة للدراسة",         // "Study-appropriate meals"
  "كيف أتجنب الأكل العاطفي؟"      // "How to avoid emotional eating?"
];
```

## 🔧 Technical Implementation Requirements

### **Database Schema Suggestions**

```sql
-- Conversations table
CREATE TABLE Conversations (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId INT NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    LastMessageAt DATETIME2,
    IsActive BIT DEFAULT 1,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- Messages table
CREATE TABLE Messages (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ConversationId UNIQUEIDENTIFIER NOT NULL,
    Text NVARCHAR(MAX) NOT NULL,
    IsUser BIT NOT NULL,
    MessageType NVARCHAR(50) DEFAULT 'text',
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    Metadata NVARCHAR(MAX), -- JSON for suggestions, quick actions, etc.
    FOREIGN KEY (ConversationId) REFERENCES Conversations(Id)
);

-- Chat preferences table
CREATE TABLE ChatPreferences (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    PreferredLanguage NVARCHAR(10) DEFAULT 'ar',
    ChatStyle NVARCHAR(50) DEFAULT 'friendly',
    NotificationEnabled BIT DEFAULT 1,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);
```

### **AI Integration Options**

1. **OpenAI GPT Integration**
   - Use GPT-4 with Arabic language support
   - Create system prompts with user context
   - Implement conversation memory

2. **Azure Cognitive Services**
   - Use Azure OpenAI Service
   - Implement conversation management
   - Add Arabic language understanding

3. **Custom NLP Pipeline**
   - Intent recognition for nutrition queries
   - Entity extraction for food items
   - Response generation with templates

### **Response Generation Logic**

```csharp
public class ChatResponseGenerator
{
    public async Task<ChatResponse> GenerateResponse(
        string userMessage, 
        UserProfile userProfile, 
        ConversationContext context)
    {
        // 1. Analyze user intent
        var intent = await AnalyzeIntent(userMessage);
        
        // 2. Get relevant user data
        var userContext = await GetUserContext(userProfile);
        
        // 3. Generate personalized response
        var response = await GeneratePersonalizedResponse(
            intent, userContext, userMessage);
        
        // 4. Add suggestions and quick actions
        response.Suggestions = await GetSuggestions(intent, userContext);
        response.QuickActions = await GetQuickActions(intent);
        
        return response;
    }
}
```

## 📱 Frontend Integration Points

### **API Service Implementation**
Create `src/services/chatApi.ts`:

```typescript
export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'meal_recommendation' | 'nutrition_advice' | 'progress_insight';
  suggestions?: string[];
  quickActions?: QuickAction[];
}

export interface QuickAction {
  text: string;
  action: string;
}

export interface SendMessageRequest {
  message: string;
  conversationId?: string;
  context?: {
    currentDate: string;
    userLocation: string;
    quickAction?: boolean;
  };
}

class ChatApiService {
  async sendMessage(request: SendMessageRequest): Promise<ChatMessage> {
    // Implementation
  }
  
  async getConversations(): Promise<Conversation[]> {
    // Implementation
  }
  
  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    // Implementation
  }
}
```

### **Component Updates Required**
- Update `AIChat.tsx` to use real API instead of simulated responses
- Add conversation management
- Implement message persistence
- Add loading states and error handling

## 🎨 Response Examples

### **Meal Recommendation Response**
```json
{
  "text": "بناءً على ملفك الشخصي وهدفك في فقدان الوزن، أنصحك بتناول سلطة الكينوا مع الدجاج المشوي. هذه الوجبة تحتوي على 450 سعرة حرارية و35 جرام بروتين، مما يساعدك على الشعور بالشبع لفترة أطول.",
  "type": "meal_recommendation",
  "suggestions": [
    "أضف المزيد من الخضروات الورقية",
    "استبدل الدجاج بالسمك المشوي",
    "احسب السعرات الحرارية الإجمالية"
  ],
  "quickActions": [
    {"text": "أضف للوجبة المفضلة", "action": "add_to_favorites"},
    {"text": "احجز هذه الوجبة", "action": "reserve_meal"}
  ],
  "attachments": [
    {
      "type": "meal",
      "data": {
        "mealId": 123,
        "name": "سلطة الكينوا مع الدجاج",
        "calories": 450,
        "protein": 35,
        "imageUrl": "/images/meals/quinoa-salad.jpg"
      }
    }
  ]
}
```

### **Progress Insight Response**
```json
{
  "text": "ممتاز! لقد حققت 85% من هدفك اليومي من البروتين. أرى أنك تتناول وجبات صحية ومتوازنة. لتحقيق الهدف الكامل، يمكنك إضافة وجبة خفيفة من المكسرات أو الزبادي اليوناني.",
  "type": "progress_insight",
  "suggestions": [
    "تناول حفنة من اللوز (15 حبة)",
    "كوب من الزبادي اليوناني مع التوت",
    "بيضة مسلوقة مع الخضروات"
  ],
  "quickActions": [
    {"text": "عرض تقرير التقدم", "action": "view_progress"},
    {"text": "تحديث الأهداف", "action": "update_goals"}
  ]
}
```

## 🔒 Security & Performance Requirements

### **Security**
- Validate all input messages (length, content, XSS protection)
- Rate limiting per user (max 30 messages per minute)
- Conversation isolation between users
- Input sanitization for Arabic text

### **Performance**
- Response time < 2 seconds for simple queries
- Response time < 5 seconds for complex recommendations
- Implement caching for common responses
- Database indexing on UserId and ConversationId

### **Monitoring**
- Log all chat interactions for analytics
- Track response times and error rates
- Monitor user satisfaction metrics
- A/B testing for response variations

## 📊 Success Metrics

### **Technical Metrics**
- API response time < 2 seconds (95th percentile)
- 99.9% uptime
- Zero data leaks or security incidents

### **User Experience Metrics**
- User engagement: Average session duration
- Message completion rate
- User satisfaction scores
- Quick action usage rates

### **Business Metrics**
- Increased meal recommendations leading to orders
- User retention improvement
- Daily active users growth

## 🚀 Implementation Timeline

### **Phase 1 (Week 1-2)**
- [ ] Database schema implementation
- [ ] Basic chat API endpoints
- [ ] Simple response generation
- [ ] Frontend integration

### **Phase 2 (Week 3-4)**
- [ ] AI integration (OpenAI/Azure)
- [ ] Personalized responses
- [ ] Conversation management
- [ ] Quick actions implementation

### **Phase 3 (Week 5-6)**
- [ ] Advanced features (meal recommendations, progress insights)
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Testing and deployment

## 📞 Support & Questions

For any questions about the implementation:
- **Frontend Integration**: Check existing API patterns in `src/services/`
- **User Data**: Reference `src/types/nutrition.ts` and `USER_DATA_FOR_PROGRESS_APIS.md`
- **UI Components**: See `src/components/AIChat.tsx` for current interface
- **Authentication**: Follow existing JWT pattern in `src/services/authApi.ts`

---

**Note**: This chatbot should feel like a knowledgeable, friendly nutrition advisor who understands the user's personal health journey and provides actionable, personalized advice in Arabic. The responses should be encouraging, educational, and directly tied to the user's specific goals and circumstances.
