# 📋 ALAPAY API Postman Collections

This repository contains comprehensive Postman collections for testing both ALAPAY Admin API and ALAPAY Individual User API.

## 📁 Collection Files

1. **`alapay-admin-api.postman_collection.json`** - Admin API collection
2. **`alapay-individual-user-api.postman_collection.json`** - Individual User API collection

## 🚀 Quick Start

### 1. Import Collections into Postman

1. Open Postman
2. Click **Import** button
3. Select the JSON collection files
4. Collections will be imported with all endpoints and test scripts

### 2. Configure Environment Variables

Both collections use environment variables for easy configuration:

#### Admin API Variables:
- `baseUrl`: `http://localhost:6526`
- `apiVersion`: `api/v1`
- `jwtToken`: Your JWT authentication token
- `adminId`: Admin user ID
- `hmoId`: HMO organization ID
- `roleId`: Role ID

#### Individual User API Variables:
- `baseUrl`: `http://localhost:6545`
- `apiVersion`: `api/v1`
- `jwtToken`: Your JWT authentication token
- `userId`: Individual user ID
- `hmoId`: HMO organization ID
- `planId`: Healthcare plan ID
- `paymentOptionId`: Payment option ID
- `transactionReference`: Payment transaction reference

## 🔧 Admin API Collection Features

### 📋 Endpoint Categories:

1. **Health Check**
   - Server health verification

2. **Authentication**
   - Admin login/logout
   - Password reset/change
   - JWT token management

3. **User Management**
   - Create/update admin users
   - Get admin by ID/role
   - Send onboarding links
   - Account verification/approval
   - Link admin to HMO

4. **HMO Management**
   - Verify HMO accounts
   - Update HMO profiles
   - Get HMO details/accounts

5. **Role Management**
   - Create roles
   - Get roles by ID
   - List all roles

6. **Audit Logs**
   - View audit logs
   - Filter by date range

### 🔄 Testing Workflow:

1. **Start with Health Check** - Verify server is running
2. **Admin Login** - Get JWT token (automatically stored)
3. **Create/Manage Users** - Test user operations
4. **HMO Operations** - Test HMO management
5. **Role Management** - Test role operations
6. **Audit Review** - Check audit logs

## 💳 Individual User API Collection Features

### 📋 Endpoint Categories:

1. **Health Check**
   - Server health verification

2. **Authentication**
   - User registration/login
   - Password management
   - JWT token handling

3. **Subscription Payments** ⭐
   - Generate payment links (Interswitch)
   - Verify payments
   - Payment status checks
   - Callback handling
   - Payment cancellation

4. **User Management**
   - Profile management
   - Subscription history
   - Payment history

5. **HMO & Plans**
   - Browse available HMOs
   - View plan details
   - Payment options

6. **Webhooks**
   - Interswitch webhook handling

7. **Notifications**
   - User notifications
   - Mark as read

### 🔄 Payment Testing Workflow:

1. **Health Check** - Verify server is running
2. **User Registration/Login** - Get JWT token
3. **Browse HMOs** - Get available HMOs
4. **Select Plan** - Choose healthcare plan
5. **Generate Payment Link** - Create Interswitch payment
6. **Verify Payment** - Check payment status
7. **Test Webhooks** - Simulate payment callbacks

## 🧪 Automated Testing Features

### Built-in Test Scripts:

Both collections include automated test scripts that:

- ✅ Verify response status codes (200, 201, 400)
- ✅ Check content-type headers
- ✅ Validate response times (< 5 seconds)
- ✅ Auto-store JWT tokens from login responses
- ✅ Auto-store IDs and references for subsequent requests
- ✅ Log all responses for debugging

### Variable Auto-Population:

The collections automatically store and reuse:
- JWT tokens from login responses
- User/Admin IDs
- HMO IDs
- Plan IDs
- Transaction references
- Payment option IDs

## 🔐 Authentication

### Bearer Token Setup:

1. Run a login request
2. JWT token is automatically stored in `jwtToken` variable
3. All subsequent requests use the stored token
4. Token is included in Authorization header

### Example Login Flow:

```bash
# 1. Admin Login
POST {{baseUrl}}/{{apiVersion}}/sysadmins/login
{
  "email": "admin@alapay.com",
  "password": "admin123"
}

# 2. Token automatically stored and used for all requests
Authorization: Bearer {{jwtToken}}
```

## 💰 Payment Testing (Individual User API)

### Interswitch Integration Testing:

1. **Generate Payment Link**
   ```json
   {
     "hmoId": "{{hmoId}}",
     "planId": "{{planId}}",
     "paymentOptionId": "{{paymentOptionId}}",
     "amount": 5000000,
     "customerEmail": "customer@example.com",
     "customerPhone": "+2348012345678",
     "customerName": "John Doe"
   }
   ```

2. **Verify Payment**
   ```json
   {
     "transactionReference": "{{transactionReference}}"
   }
   ```

3. **Test Webhooks**
   - Simulate Interswitch webhook calls
   - Test payment status updates

## 🛠️ Environment Setup

### Required Environment Variables:

#### Admin API (.env):
```bash
APP_PORT=6526
DATABASE_URL=your_database_url
REDIS_URL=your_redis_url
JWT_SECRET=your_jwt_secret
```

#### Individual User API (.env):
```bash
APP_PORT=6545
DATABASE_URL=your_database_url
REDIS_URL=your_redis_url
JWT_SECRET=your_jwt_secret

# Interswitch Configuration
INTERSWITCH_MERCHANT_ID=2547916
INTERSWITCH_MERCHANT_CODE=MX149785
INTERSWITCH_TERMINAL_ID=3F000012345
INTERSWITCH_SECRET_KEY=abracadabra
INTERSWITCH_ENVIRONMENT=test
INTERSWITCH_CURRENCY=NGN
INTERSWITCH_COUNTRY_CODE=NG
```

## 📊 Sample Test Data

### Admin API Test Credentials:
- Email: `admin@alapay.com`
- Password: `admin123`

### Individual User API Test Credentials:
- Email: `user@alapay.com`
- Password: `user123`

### Sample UUIDs:
- Admin ID: `123e4567-e89b-12d3-a456-426614174000`
- HMO ID: `123e4567-e89b-12d3-a456-426614174001`
- Plan ID: `123e4567-e89b-12d3-a456-426614174002`

## 🔍 Troubleshooting

### Common Issues:

1. **Connection Refused**
   - Check if servers are running on correct ports
   - Verify firewall settings

2. **Authentication Errors**
   - Ensure JWT token is valid
   - Check token expiration

3. **Payment Errors**
   - Verify Interswitch configuration
   - Check test credentials

4. **Database Errors**
   - Ensure database is running
   - Check connection strings

### Debug Tips:

1. **Check Console Logs** - All requests/responses are logged
2. **Verify Variables** - Check if IDs are properly stored
3. **Test Health Endpoints** - Start with basic connectivity
4. **Review Response Bodies** - Look for error messages

## 📈 Performance Testing

### Load Testing Setup:

1. **Use Postman Runner** for bulk testing
2. **Set Iterations** for multiple requests
3. **Monitor Response Times** (target: < 5 seconds)
4. **Check Error Rates** during load

### Recommended Test Scenarios:

1. **User Registration Flow** - 100 concurrent users
2. **Payment Processing** - 50 concurrent payments
3. **Admin Operations** - 10 concurrent admin actions

## 🔄 Continuous Integration

### Automated Testing:

These collections can be integrated with:
- **Newman** (Postman CLI)
- **Jenkins** pipelines
- **GitHub Actions**
- **CircleCI**

### Example Newman Command:
```bash
newman run alapay-admin-api.postman_collection.json \
  --environment local.postman_environment.json \
  --reporters cli,json \
  --reporter-json-export results.json
```

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review server logs
3. Verify environment configuration
4. Test with sample data first

---

**Happy Testing! 🚀** 