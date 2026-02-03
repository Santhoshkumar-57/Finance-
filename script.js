// Global state
let currentUserData = {
    user: {
        name: '',
        age: 0,
        monthly_salary: 0,
        total_expenses: 0
    },
    remaining_salary: 0,
    investments: [],
    savings_plans: {}
};

// Investment and Advertisement Data
const INVESTMENTS = {
    'loans': {
        'title': 'Personal Loans',
        'description': 'Get quick loans at competitive rates for your financial needs',
        'ads': [
            'Get ₹50,000 - ₹50 Lakhs instant loan approval',
            'Zero processing fee on personal loans',
            'Fastest loan approval - 24 hours'
        ]
    },
    'sic': {
        'title': 'Mutual Funds (SIC)',
        'description': 'Invest in Systematic Investment Plans with high returns',
        'ads': [
            'Grow your wealth with SIC plans',
            'Expert managed mutual funds',
            'Low-cost investment options'
        ]
    },
    'gold': {
        'title': 'Gold Investment',
        'description': 'Invest in physical gold and digital gold options',
        'ads': [
            'Buy gold at best prices today',
            'Safe and secure gold investments',
            'Free digital gold wallet'
        ]
    },
    'silver': {
        'title': 'Silver Investment',
        'description': 'Invest in silver for portfolio diversification',
        'ads': [
            'Silver rates updated daily',
            'Invest in precious metals',
            'Certified purity guaranteed'
        ]
    }
};

const SAVING_PRODUCTS = {
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
};

// Tab switching for expense categories
document.addEventListener('DOMContentLoaded', () => {
    setupTabSwitching();
    setupFormListeners();
});

function setupTabSwitching() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and sections
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.expense-section').forEach(s => s.classList.add('hidden'));

            // Add active class to clicked button and corresponding section
            btn.classList.add('active');
            const tabName = btn.dataset.tab;
            document.getElementById(tabName).classList.remove('hidden');
        });
    });
}

function setupFormListeners() {
    // Step 1: Basic Details
    const basicDetailsForm = document.getElementById('basicDetailsForm');
    if (basicDetailsForm) {
        basicDetailsForm.addEventListener('submit', submitBasicDetails);
    }

    // Step 2: Expenses
    const expensesForm = document.getElementById('expensesForm');
    if (expensesForm) {
        expensesForm.addEventListener('submit', submitExpenses);
    }

    // Setup remove buttons for expense items
    setupRemoveButtons();
}

function setupRemoveButtons() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remove')) {
            e.target.closest('.expense-item').remove();
        }
    });
}

function addExpenseField(category) {
    const list = document.getElementById(category + 'List');
    const newItem = document.createElement('div');
    newItem.className = 'expense-item';
    newItem.innerHTML = `
        <input type="text" class="expense-type" placeholder="Expense type" required>
        <input type="number" class="expense-amount" placeholder="Amount" min="0" step="100" required>
        <button type="button" class="btn-remove">✕</button>
    `;
    list.appendChild(newItem);
}

async function submitBasicDetails(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const salary = document.getElementById('salary').value;

    // Validate inputs
    if (!name || !age || !salary) {
        showError('Please fill in all fields');
        return;
    }

    currentUserData.user.name = name;
    currentUserData.user.age = parseInt(age);
    currentUserData.user.monthly_salary = parseFloat(salary);

    moveToStep(2);
    setupRemoveButtons();
}

async function submitExpenses(e) {
    e.preventDefault();

    let total_expenses = 0;

    // Collect accurate expenses
    document.querySelectorAll('#accurateList .expense-item').forEach(item => {
        const amount = item.querySelector('.expense-amount').value;
        if (amount) {
            total_expenses += parseFloat(amount);
        }
    });

    // Collect approximate expenses
    document.querySelectorAll('#approximateList .expense-item').forEach(item => {
        const amount = item.querySelector('.expense-amount').value;
        if (amount) {
            total_expenses += parseFloat(amount);
        }
    });

    if (total_expenses === 0) {
        showError('Please add at least one expense');
        return;
    }

    currentUserData.user.total_expenses = total_expenses;
    currentUserData.remaining_salary = currentUserData.user.monthly_salary - total_expenses;

    getRecommendations();
}

async function getRecommendations() {
    const remaining_salary = currentUserData.remaining_salary;

    // Calculate savings potential
    const months = [3, 5, 12];
    const savings_plans = {};
    for (const month of months) {
        const total_savings = remaining_salary * month;
        let category;
        if (total_savings <= 15000) {
            category = 'small';
        } else if (total_savings <= 50000) {
            category = 'medium';
        } else {
            category = 'large';
        }
        savings_plans[month] = {
            'total': total_savings,
            'category': category,
            'products': SAVING_PRODUCTS[category]['products']
        };
    }
    currentUserData.savings_plans = savings_plans;

    // Generate investment recommendations
    const investments = [];
    if (remaining_salary > 0) {
        for (const inv_type in INVESTMENTS) {
            const investment_data = INVESTMENTS[inv_type];
            investments.append ? null : null; // No-op
            investments.push({
                'type': inv_type,
                'title': investment_data['title'],
                'description': investment_data['description'],
                'suggested_amount': remaining_salary * 0.25,
                'ads': investment_data['ads']
            });
        }
    }
    currentUserData.investments = investments;

    displayRecommendations(currentUserData);
    moveToStep(3);
}

function displayRecommendations(data) {
    // Update summary
    document.getElementById('summaryName').textContent = data.user.name;
    document.getElementById('summarySalary').textContent = '₹' + formatCurrency(data.user.monthly_salary);
    document.getElementById('summaryExpenses').textContent = '₹' + formatCurrency(data.user.total_expenses);
    document.getElementById('summaryRemaining').textContent = '₹' + formatCurrency(data.remaining_salary);

    // Display investments
    const investmentsContainer = document.getElementById('investmentsContainer');
    investmentsContainer.innerHTML = '';

    data.investments.forEach(investment => {
        const card = document.createElement('div');
        card.className = 'investment-card';
        card.innerHTML = `
            <h4>${getInvestmentEmoji(investment.type)} ${investment.title}</h4>
            <p>${investment.description}</p>
            <div class="investment-amount">₹${formatCurrency(investment.suggested_amount)}/month</div>
        `;
        investmentsContainer.appendChild(card);
    });

    // Display advertisements
    const randomInvestment = data.investments[Math.floor(Math.random() * data.investments.length)];
    const randomAd = randomInvestment.ads[Math.floor(Math.random() * randomInvestment.ads.length)];
    document.getElementById('adContent').textContent = randomAd;

    // Display savings plans
    const savingsContainer = document.getElementById('savingsContainer');
    savingsContainer.innerHTML = '';

    Object.keys(data.savings_plans).forEach(months => {
        const plan = data.savings_plans[months];
        const card = document.createElement('div');
        card.className = 'savings-card';
        card.innerHTML = `
            <h4>Save for ${months} Months</h4>
            <div class="savings-total">₹${formatCurrency(plan.total)}</div>
            <ul class="savings-products">
                ${plan.products.map(product => `<li>✓ ${product}</li>`).join('')}
            </ul>
        `;
        savingsContainer.appendChild(card);
    });
}

function getInvestmentEmoji(type) {
    const emojis = {
        'loans': '💳',
        'sic': '📈',
        'gold': '🟡',
        'silver': '⚪'
    };
    return emojis[type] || '💰';
}

function formatCurrency(value) {
    return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function moveToStep(step) {
    // Hide all steps
    document.querySelectorAll('.step').forEach(s => s.classList.add('hidden'));
    // Show the desired step
    document.getElementById(`step${step}`).classList.remove('hidden');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBackStep() {
    moveToStep(1);
    document.getElementById('basicDetailsForm').reset();
}

function startOver() {
    // Reset forms
    document.getElementById('basicDetailsForm').reset();
    document.getElementById('expensesForm').reset();

    // Reset state
    currentUserData = {
        user: { name: '', age: 0, monthly_salary: 0, total_expenses: 0 },
        remaining_salary: 0,
        investments: [],
        savings_plans: {}
    };

    // Reset expense lists to default
    document.getElementById('accurateList').innerHTML = `
        <div class="expense-item">
            <input type="text" class="expense-type" placeholder="Expense type (e.g., TV Bill)" required>
            <input type="number" class="expense-amount" placeholder="Amount" min="0" step="100" required>
            <button type="button" class="btn-remove">✕</button>
        </div>
    `;

    document.getElementById('approximateList').innerHTML = `
        <div class="expense-item">
            <input type="text" class="expense-type" placeholder="Expense type (e.g., Groceries)" required>
            <input type="number" class="expense-amount" placeholder="Amount" min="0" step="100" required>
            <button type="button" class="btn-remove">✕</button>
        </div>
    `;

    setupFormListeners();
    moveToStep(1);
}

function downloadReport() {
    if (!currentUserData) return;

    const reportContent = generateReportHTML();
    const blob = new Blob([reportContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `FinancePro_Report_${currentUserData.user.name}_${new Date().toISOString().split('T')[0]}.html`;
    link.click();
}

function generateReportHTML() {
    const user = currentUserData.user;
    const investments = currentUserData.investments;
    const savings = currentUserData.savings_plans;
    const remaining = currentUserData.remaining_salary;

    return `
<!DOCTYPE html>
<html>
<head>
    <title>FinancePro Report - ${user.name}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        h1 { color: #1e40af; border-bottom: 3px solid #1e40af; padding-bottom: 10px; }
        h2 { color: #0f766e; margin-top: 30px; }
        .summary { background: #f0f4ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .summary-item { margin: 10px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background: #1e40af; color: white; }
        .investment-box { border-left: 5px solid #1e40af; padding: 15px; margin: 15px 0; background: #f9f9f9; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; }
    </style>
</head>
<body>
    <h1>💰 FinancePro Financial Report</h1>
    
    <div class="summary">
        <h2>Your Profile</h2>
        <div class="summary-item"><strong>Name:</strong> ${user.name}</div>
        <div class="summary-item"><strong>Age:</strong> ${user.age} years</div>
        <div class="summary-item"><strong>Monthly Salary:</strong> ₹${formatCurrency(user.monthly_salary)}</div>
        <div class="summary-item"><strong>Total Monthly Expenses:</strong> ₹${formatCurrency(user.total_expenses)}</div>
        <div class="summary-item"><strong style="color: #10b981; font-size: 1.2em;">Remaining Salary:</strong> <strong style="color: #10b981; font-size: 1.2em;">₹${formatCurrency(remaining)}</strong></div>
    </div>

    <h2>📈 Investment Opportunities</h2>
    ${investments.map(inv => `
        <div class="investment-box">
            <h3>${inv.title}</h3>
            <p><strong>Description:</strong> ${inv.description}</p>
            <p><strong>Suggested Monthly Investment:</strong> ₹${formatCurrency(inv.suggested_amount)}</p>
        </div>
    `).join('')}

    <h2>💎 Savings & Investment Plans</h2>
    <table>
        <tr>
            <th>Duration</th>
            <th>Total Savings</th>
            <th>Recommended Products</th>
        </tr>
        ${Object.keys(savings).map(months => {
        const plan = savings[months];
        return `
            <tr>
                <td>${months} months</td>
                <td>₹${formatCurrency(plan.total)}</td>
                <td>${plan.products.join(', ')}</td>
            </tr>
            `;
    }).join('')}
    </table>

    <div class="footer">
        <p>This report was generated by FinancePro - Your Personal Financial Assistant</p>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
        <p>Disclaimer: This is a suggestion and not financial advice. Please consult with a financial advisor before making investment decisions.</p>
    </div>
</body>
</html>
    `;
}

function showError(message) {
    // Create error element
    const errorEl = document.createElement('div');
    errorEl.className = 'error';
    errorEl.textContent = message;

    // Insert at top of main content
    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(errorEl, mainContent.firstChild);

    // Remove after 5 seconds
    setTimeout(() => {
        errorEl.remove();
    }, 5000);
}
