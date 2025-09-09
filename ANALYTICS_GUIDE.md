# 📊 Analytics System Guide

## Overview
The analytics system provides comprehensive insights into user behavior, search patterns, booking conversions, and revenue metrics for your marketplace platform.

## Features Implemented

### ✅ Backend Analytics
- **Event Tracking**: Automatic tracking of key user actions
- **Data Aggregation**: Daily summaries for performance optimization
- **Real-time Metrics**: Live dashboard with auto-refresh
- **Batch Processing**: Efficient event processing system
- **Search Analytics**: Detailed search behavior and conversion tracking

### ✅ Frontend Dashboard
- **Analytics Tab**: New tab in AdminDashboard (`/admin` → Analytics tab)
- **Real-time Dashboard**: Live metrics updating every 30 seconds
- **Charts & Visualizations**: Using ApexCharts for data visualization
- **Advanced Filters**: Search, date range, and category filtering
- **Export Capabilities**: Data export for external analysis

## Key Metrics Tracked

### 📈 User Analytics
- User registrations (Customer vs Professional)
- Page views and navigation patterns
- Session duration and engagement
- User retention and activity

### 🔍 Search Analytics
- Search queries and terms
- Search result counts
- Click-through rates
- Conversion rates (search → contact → booking)
- Most popular search terms

### 👷 Professional Analytics
- Professional contacts via WhatsApp, phone, email
- Profile views and engagement
- Contact conversion rates
- Professional performance metrics

### 💼 Booking Analytics
- Booking creation and status changes
- Booking values and revenue impact
- Category performance
- Conversion funnels

### 💰 Revenue Analytics
- Payment processing metrics
- Commission tracking
- Revenue trends and growth
- Payment method distribution

## Database Schema

### Analytics Tables Created
```sql
- AnalyticsEvent: Individual event tracking
- AnalyticsDashboard: Daily aggregated metrics
- AnalyticsUserActivity: Per-user daily activity
- AnalyticsSearchMetrics: Search performance data
```

## API Endpoints

### Dashboard Analytics
- `GET /api/analytics/dashboard` - Main dashboard data
- `GET /api/analytics/dashboard/realtime` - Real-time metrics

### Detailed Analytics
- `GET /api/analytics/users` - User behavior analytics
- `GET /api/analytics/professionals` - Professional performance
- `GET /api/analytics/search` - Search analytics
- `GET /api/analytics/bookings` - Booking analytics
- `GET /api/analytics/revenue` - Revenue analytics

### Event Tracking
- `POST /api/analytics/events` - Track individual events
- `GET /api/analytics/events` - Retrieve events with filters

### Data Export
- `GET /api/analytics/export/{type}` - Export analytics data

## Frontend Usage

### Admin Dashboard Access
1. Go to `/admin` (requires admin login)
2. Click on "Analytics" tab
3. View real-time and historical data
4. Use filters to drill down into specific data

### Automatic Tracking
The system automatically tracks:
- User registrations (in auth controller)
- Search queries (in search controller)
- Booking creation (in booking service)
- Professional contacts (when implemented in frontend)
- Page views (via frontend analytics utility)

### Manual Tracking (Frontend)
```javascript
import { useAnalytics } from '../utils/analytics';

const { trackProfessionalContact, trackSearch, trackPageView } = useAnalytics();

// Track professional contact
trackProfessionalContact(professionalId, 'whatsapp', metadata);

// Track search
trackSearch(searchTerm, resultCount, category, metadata);

// Track page view
trackPageView(pagePath, metadata);
```

## Key Locations in Code

### Backend
- **Models**: `prisma/schema.prisma` (analytics tables)
- **Routes**: `src/routes/analytics.routes.js`
- **Controller**: `src/controllers/analytics.controller.js`
- **Service**: `src/services/analytics.service.js`
- **Tracking Integration**:
  - `src/controllers/auth.controller.js` (user registration)
  - `src/controllers/search.controller.js` (search queries)
  - `src/services/booking.service.js` (booking creation)

### Frontend
- **Analytics Tab**: `src/pages/AdminDashboard/components/AnalyticsTab.jsx`
- **React Hooks**: `src/hooks/api/analytics.js`
- **Utility**: `src/utils/analytics.js`
- **Admin Dashboard**: `src/pages/AdminDashboard/AdminDashboard.jsx`

## Production Setup

### 1. Database Migration
```bash
cd marketplace-backend
npx prisma db push
```

### 2. Authentication
The analytics endpoints are protected by admin authentication. Make sure to:
- Create an admin user in your database
- Login as admin to access the analytics dashboard

### 3. Environment Variables
Ensure your database connection is properly configured in `.env.development` or `.env.production`:
```
DATABASE_URL="postgresql://username@localhost:5432/marketplace?schema=public"
```

## Performance Considerations

- **Batch Processing**: Events are batched every 5-10 seconds for efficiency
- **Data Aggregation**: Daily summaries prevent slow queries
- **Indexing**: Database indexes on timestamp and user fields
- **Cleanup**: Built-in cleanup for old events (365 days retention)

## Security Notes

- All analytics API endpoints require admin authentication
- User data is anonymizable (userId is optional)
- IP addresses are stored for geolocation but can be anonymized
- Event data includes user agents but no personal information

## Testing

The system has been tested with:
- ✅ Event tracking endpoints
- ✅ Dashboard data retrieval
- ✅ Real-time metrics
- ✅ Database schema and connections
- ✅ Frontend components and hooks

## Next Steps

1. **Frontend Integration**: Add tracking calls throughout your React app
2. **Professional Contacts**: Implement contact tracking when users click WhatsApp/phone
3. **A/B Testing**: Use event metadata to track feature usage
4. **Alerts**: Set up alerts for significant metric changes
5. **Advanced Analytics**: Add cohort analysis, funnels, and segmentation

## Support

The analytics system is fully integrated and ready to use. Data will start accumulating as soon as users interact with the platform. The AdminDashboard analytics tab provides a comprehensive view of all metrics with real-time updates.