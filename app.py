from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///finance_suggestion.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    monthly_salary = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expenses = db.relationship('Expense', backref='user', lazy=True, cascade='all, delete-orphan')

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # 'accurate' or 'approximate'
    expense_type = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Recommendation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    remaining_salary = db.Column(db.Float, nullable=False)
    investment_type = db.Column(db.String(50), nullable=False)
    amount_suggested = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Investment and Advertisement Data
INVESTMENTS = {
    'loans': {
        'title': 'Personal Loans',
        'description': 'Get quick loans at competitive rates for your financial needs',
        'link': 'https://www.moneycontrol.com/personal-finance/loans/personal-loan/',
        'ads': [
            'Get ₹50,000 - ₹50 Lakhs instant loan approval',
            'Zero processing fee on personal loans',
            'Fastest loan approval - 24 hours'
        ]
    },
    'sic': {
        'title': 'Mutual Funds (SIC)',
        'description': 'Invest in Systematic Investment Plans with high returns',
        'link': 'https://www.moneycontrol.com/mutual-funds/',
        'ads': [
            'Grow your wealth with SIC plans',
            'Expert managed mutual funds',
            'Low-cost investment options'
        ]
    },
    'gold': {
        'title': 'Gold Investment',
        'description': 'Invest in physical gold and digital gold options',
        'link': 'https://www.goldprice.org/gold-price-india.html',
        'ads': [
            'Buy gold at best prices today',
            'Safe and secure gold investments',
            'Free digital gold wallet'
        ]
    },
    'silver': {
        'title': 'Silver Investment',
        'description': 'Invest in silver for portfolio diversification',
        'link': 'https://www.silverprice.org/',
        'ads': [
            'Silver rates updated daily',
            'Invest in precious metals',
            'Certified purity guaranteed'
        ]
    }
}

SAVING_PRODUCTS = {
    'small': {
        'range': '₹5,000 - ₹15,000',
        'products': [
            'High-Yield Savings Account (6% p.a.)',
            'Fixed Deposits (6.5% p.a.)',
            'Gold ETF (Liquid option)'
        ]
    },
    'medium': {
        'range': '₹15,000 - ₹50,000',
        'products': [
            'Mutual Fund SIP (12% average p.a.)',
            'Term Insurance (Life protection)',
            'Mix of Gold & Stocks'
        ]
    },
    'large': {
        'range': '₹50,000+',
        'products': [
            'Diversified Portfolio (Stocks, Bonds, Gold)',
            'Real Estate Investment Trust (REIT)',
            'Business Expansion Fund',
            'Retirement Planning (NPS)'
        ]
    }
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/submit-basic-details', methods=['POST'])
def submit_basic_details():
    data = request.json
    try:
        user = User(
            name=data['name'],
            age=int(data['age']),
            monthly_salary=float(data['salary'])
        )
        db.session.add(user)
        db.session.commit()
        return jsonify({'success': True, 'user_id': user.id})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/submit-expenses/<int:user_id>', methods=['POST'])
def submit_expenses(user_id):
    data = request.json
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        # Clear previous expenses
        Expense.query.filter_by(user_id=user_id).delete()
        
        # Add accurate expenses
        for item in data.get('accurate', []):
            expense = Expense(
                user_id=user_id,
                category='accurate',
                expense_type=item['type'],
                amount=float(item['amount'])
            )
            db.session.add(expense)
        
        # Add approximate expenses
        for item in data.get('approximate', []):
            expense = Expense(
                user_id=user_id,
                category='approximate',
                expense_type=item['type'],
                amount=float(item['amount'])
            )
            db.session.add(expense)
        
        db.session.commit()
        
        # Calculate remaining salary
        total_expenses = sum(e.amount for e in user.expenses)
        remaining_salary = user.monthly_salary - total_expenses
        
        return jsonify({
            'success': True,
            'remaining_salary': remaining_salary,
            'total_expenses': total_expenses
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/get-recommendations/<int:user_id>', methods=['GET'])
def get_recommendations(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        total_expenses = sum(e.amount for e in user.expenses)
        remaining_salary = user.monthly_salary - total_expenses
        
        # Calculate savings potential
        months = [3, 5, 12]
        savings_plans = {}
        for month in months:
            total_savings = remaining_salary * month
            if total_savings <= 15000:
                category = 'small'
            elif total_savings <= 50000:
                category = 'medium'
            else:
                category = 'large'
            savings_plans[month] = {
                'total': total_savings,
                'category': category,
                'products': SAVING_PRODUCTS[category]['products']
            }
        
        # Generate investment recommendations
        investments = []
        if remaining_salary > 0:
            for inv_type in ['loans', 'sic', 'gold', 'silver']:
                investment_data = INVESTMENTS[inv_type]
                investments.append({
                    'type': inv_type,
                    'title': investment_data['title'],
                    'description': investment_data['description'],
                    'link': investment_data['link'],
                    'suggested_amount': remaining_salary * 0.25,
                    'ads': investment_data['ads']
                })
        
        return jsonify({
            'success': True,
            'user': {
                'name': user.name,
                'age': user.age,
                'monthly_salary': user.monthly_salary,
                'total_expenses': total_expenses
            },
            'remaining_salary': remaining_salary,
            'investments': investments,
            'savings_plans': savings_plans
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/save-recommendation/<int:user_id>', methods=['POST'])
def save_recommendation(user_id):
    data = request.json
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        total_expenses = sum(e.amount for e in user.expenses)
        remaining_salary = user.monthly_salary - total_expenses
        
        recommendation = Recommendation(
            user_id=user_id,
            remaining_salary=remaining_salary,
            investment_type=data['investment_type'],
            amount_suggested=float(data['amount_suggested'])
        )
        db.session.add(recommendation)
        db.session.commit()
        
        return jsonify({'success': True, 'recommendation_id': recommendation.id})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
