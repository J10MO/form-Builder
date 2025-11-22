# FormBuilder API - Postman Guide

This guide provides all available API endpoints for testing with Postman.

## Base URL
\`\`\`
http://localhost:3000
\`\`\`

## Authentication APIs

### 1. Register User
**POST** `/api/auth/register`
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
\`\`\`

### 2. Login
**POST** `/api/auth/login`
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

### 3. Logout
**POST** `/api/auth/logout`

### 4. Get Current User
**GET** `/api/auth/me`

## Users APIs

### 5. Get All Users
**GET** `/api/users`

### 6. Get User by ID
**GET** `/api/users/{id}`

## Forms APIs

### 7. Get All Forms (for logged-in user)
**GET** `/api/forms`

### 8. Create New Form
**POST** `/api/forms`
\`\`\`json
{
  "title": "Customer Feedback Form",
  "description": "Tell us about your experience",
  "fields": [
    {
      "id": "field_1",
      "type": "text",
      "label": "Full Name",
      "required": true
    },
    {
      "id": "field_2",
      "type": "email",
      "label": "Email Address",
      "required": true
    },
    {
      "id": "field_3",
      "type": "textarea",
      "label": "Your Feedback",
      "required": false
    },
    {
      "id": "field_4",
      "type": "radio",
      "label": "Rating",
      "options": ["Excellent", "Good", "Average", "Poor"],
      "required": true
    }
  ]
}
\`\`\`

### 9. Get Form by ID
**GET** `/api/forms/{id}`

### 10. Update Form
**PUT** `/api/forms/{id}`
\`\`\`json
{
  "title": "Updated Form Title",
  "description": "Updated description",
  "fields": []
}
\`\`\`

### 11. Delete Form
**DELETE** `/api/forms/{id}`

### 12. Get Form by Share Token
**GET** `/api/forms/share/{token}`

### 13. Get Form Details with Statistics
**GET** `/api/forms/{id}/details`

Returns detailed form information including:
- Form metadata
- All responses
- Field statistics
- Response count
- Share URL

## Responses APIs

### 14. Get All Responses
**GET** `/api/responses?formId={formId}`

### 15. Submit Form Response
**POST** `/api/responses`
\`\`\`json
{
  "formId": 1,
  "data": {
    "field_1": "John Doe",
    "field_2": "john@example.com",
    "field_3": "Great service!",
    "field_4": "Excellent"
  }
}
\`\`\`

## Analytics APIs

### 16. Get User Analytics
**GET** `/api/analytics`

Returns:
- Total forms count
- Total responses count
- All forms with response counts
- Recent activity

## Export APIs

### 17. Export Form Responses as CSV
**GET** `/api/export/forms/{id}`

Downloads a CSV file with all form responses.

## Testing Flow in Postman

1. **Initialize Database**: Visit `/setup` in browser first
2. **Register**: Create a user account
3. **Login**: Get authentication cookie
4. **Create Form**: Use POST `/api/forms`
5. **Get Forms**: Verify with GET `/api/forms`
6. **Submit Response**: Use POST `/api/responses`
7. **View Analytics**: Check GET `/api/analytics`
8. **Get Details**: Use GET `/api/forms/{id}/details`
9. **Export Data**: Download CSV with GET `/api/export/forms/{id}`

## Response Examples

### Success Response
\`\`\`json
{
  "success": true,
  "form": { ... },
  "message": "Operation successful"
}
\`\`\`

### Error Response
\`\`\`json
{
  "error": "Error message here",
  "success": false
}
\`\`\`

## Notes
- All authenticated endpoints require login first
- Cookies are automatically managed by Postman
- Form IDs and tokens are returned in responses
- Field IDs must match between form creation and response submission
