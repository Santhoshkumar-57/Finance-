# FinancePro - Personal Finance Suggestion Web Application

A comprehensive web-based financial planning assistant that helps users analyze their income, expenses, and receive personalized investment recommendations.

## Features

✅ **Basic User Information Collection**
- Name, age, and monthly salary input
- Easy-to-use form interface

✅ **Dual Expense Tracking**
- **Accurate Expenses**: Fixed monthly bills (TV, Internet, Rent, Insurance, etc.)
- **Approximate Expenses**: Variable expenses (Groceries, Utilities, Fuel, Entertainment, etc.)

✅ **Smart Financial Analysis**
- Automatic calculation of remaining salary
- Total expense breakdown
- Visual summary of finances

✅ **Investment Recommendations**
- Personal Loans (with direct links to loan providers)
- Mutual Funds (SIC - Systematic Investment Plans)
- Gold Investment Options
- Silver Investment Options
- Suggested allocation amounts for each category

✅ **Savings Plans**
- 3-month, 5-month, and 12-month saving plans
- Products recommended based on savings amount:
  - **Small (₹5,000 - ₹15,000)**: High-yield savings, Fixed deposits, Gold ETF
  - **Medium (₹15,000 - ₹50,000)**: Mutual funds, Term insurance, Gold & Stock mix
  - **Large (₹50,000+)**: Diversified portfolio, REIT, Business fund, NPS

✅ **Dynamic Advertisement System**
- Context-aware ads based on investment suggestions
- Attractive promotional content to encourage financial products

✅ **Professional Finance-Style UI**
- Modern, responsive design
- Mobile-friendly interface
- Gradient backgrounds and professional color scheme
- Smooth animations and transitions

✅ **Data Persistence**
- SQLite database for user data storage
- Historical records of user profiles and recommendations
- Secure local data management

✅ **Report Download**
- Download financial report as HTML file
- Shareable format with all recommendations
- Print-friendly design

## Tech Stack

- **Backend**: Python Flask
- **Database**: SQLite3
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Server**: Flask development server

## Installation & Setup

### Prerequisites
- Python 3.7 or higher
- pip (Python package manager)

### Step 1: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 2: Run the Application

```bash
python app.py
```

The application will start on `http://localhost:5000`

### Step 3: Open in Browser

Navigate to `http://localhost:5000` in your web browser.

## Usage Guide

1. **Step 1 - Basic Details**
   - Enter your full name
   - Enter your age (18-65)
   - Enter your monthly salary in rupees
   - Click "Next: Add Expenses"

2. **Step 2 - Expense Tracking**
   - Switch between "Fixed Bills" and "Variable Expenses" tabs
   - Add expense types and amounts
   - Add multiple expenses per category
   - Click "Calculate & Get Recommendations"

3. **Step 3 - View Recommendations**
   - See your financial summary
   - Explore investment opportunities with suggested amounts
   - View contextual advertisements
   - Check savings plans for different durations
   - Download your financial report
   - Start over if needed

## Project Structure

```
d:/f1/
├── app.py                          # Flask application & API routes
├── requirements.txt                # Python dependencies
├── README.md                       # This file
├── templates/
│   └── index.html                 # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css              # Styling (responsive design)
│   └── js/
│       └── script.js              # Frontend logic & interactivity
└── finance_suggestion.db           # SQLite database (auto-created)
```

## API Endpoints

- `POST /api/submit-basic-details` - Save user basic information
- `POST /api/submit-expenses/<user_id>` - Save user expenses
- `GET /api/get-recommendations/<user_id>` - Get financial recommendations
- `POST /api/save-recommendation/<user_id>` - Save selected recommendation

## Database Schema

### User Table
- id (Primary Key)
- name (String)
- age (Integer)
- monthly_salary (Float)
- created_at (DateTime)

### Expense Table
- id (Primary Key)
- user_id (Foreign Key)
- category (accurate/approximate)
- expense_type (String)
- amount (Float)
- created_at (DateTime)

### Recommendation Table
- id (Primary Key)
- user_id (Foreign Key)
- remaining_salary (Float)
- investment_type (String)
- amount_suggested (Float)
- created_at (DateTime)

## Investment Links Included

- **Personal Loans**: MoneyControl Loans Portal
- **Mutual Funds**: MoneyControl Mutual Funds
- **Gold**: Gold Price India
- **Silver**: Silver Price Portal

## Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop browsers
- Tablets
- Mobile devices

All UI elements adapt to different screen sizes with proper breakpoints.

## Color Scheme

- **Primary Blue**: #1e40af (Headers, buttons)
- **Secondary Teal**: #0f766e (Secondary actions)
- **Accent Amber**: #f59e0b (Highlights, ads)
- **Success Green**: #10b981 (Savings, success states)
- **Danger Red**: #ef4444 (Remove buttons, errors)

## Security Considerations

- Input validation on both client and server side
- SQLite database for local data storage
- No external API calls for sensitive data
- CORS-friendly design

## Future Enhancements

- User authentication & login system
- Email notifications for savings milestones
- Integration with real investment APIs
- Monthly expense tracking charts
- Goal-based savings recommendations
- Multi-language support
- Mobile app version
- Tax optimization suggestions

## Troubleshooting

**Issue**: Port 5000 already in use
- Change port in app.py: `app.run(debug=True, port=5001)`

**Issue**: Database not creating
- Ensure write permissions in project directory
- Try deleting and recreating database

**Issue**: CSS/JS not loading
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for 404 errors

## License

This project is open source and available for personal and commercial use.

## Support

For issues or suggestions, please refer to the project documentation or contact support.

---

**FinancePro** - Making Personal Finance Management Simple & Accessible
