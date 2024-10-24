const form = document.getElementById('transaction-form');
const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const monthlySavingsEl = document.getElementById('monthly-savings');
const savingsMessageEl = document.getElementById('savings-message');
const expenseChartEl = document.getElementById('expense-chart').getContext('2d');

let transactions = [];
let totalIncome = 0;
let totalExpenses = 0;
let chart;

function clearFormFields() {
    document.getElementById('amount').value = '';
    document.getElementById('date').value = '';
    document.getElementById('category').selectedIndex = 0; 
}

function resetUIOnLoad() {
    totalIncomeEl.textContent = 0;
    totalExpensesEl.textContent = 0;
    monthlySavingsEl.textContent = 0;
    savingsMessageEl.textContent = '';
    
    if (chart) {
        chart.destroy();
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    const category = document.getElementById('category').value;
    
    if (!amount || !date || !category) {
        alert('Please fill in all fields.');
        return;
    }
    
    const transaction = { amount, date, category };
    transactions.push(transaction);

    console.log(`Transaction Added: Amount: ${amount}, Date: ${date}, Category: ${category}`);
    
    clearFormFields();
    updateBudget();
});

function updateBudget() {
    totalIncome = transactions.filter(t => t.category === 'income').reduce((acc, t) => acc + t.amount, 0);
    totalExpenses = transactions.filter(t => t.category !== 'income').reduce((acc, t) => acc + t.amount, 0);
    
    const savings = totalIncome - totalExpenses;
    
    totalIncomeEl.textContent = totalIncome;
    totalExpensesEl.textContent = totalExpenses;
    monthlySavingsEl.textContent = savings;


    console.log(`Total Income: ${totalIncome}, Total Expenses: ${totalExpenses}, Monthly Savings: ${savings}`);
    
    if (savings < 0) {
        savingsMessageEl.textContent = `Warning: You have negative savings of ${Math.abs(savings)} this month.`;
        savingsMessageEl.style.color = 'red';
        savingsMessageEl.style.fontWeight = 'bold';
    } else {
        savingsMessageEl.textContent = '';
    }
}

function updateChart() {
    const expenseCategories = ['income', 'food', 'rent', 'entertainment', 'others'];
    const chartData = expenseCategories.map(category => 
        transactions.filter(t => t.category === category).reduce((acc, t) => acc + t.amount, 0)
    );

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(expenseChartEl, {
        type: 'pie',
        data: {
            labels: ['Income', 'Food', 'Rent', 'Entertainment', 'Others'],
            datasets: [{
                label: 'Income vs Expenses',
                data: chartData,
                backgroundColor: ['#ffb6c1', '#dda0dd', '#90ee90', '#ffd700', '#d08073'],
            }]
        },
        options: {
            responsive: true
        }
    });
}

document.getElementById('show-chart-btn').addEventListener('click', () => {
    if (transactions.length === 0) {
        alert("No transactions to display in the chart.");
        return;
    }
    updateChart(); 

    function updateSavings(savings) {
        const savingsMessage = document.getElementById('savingsMessage');
        if (savings > 0) {
            savingsMessage.textContent = `Savings: $${savings.toFixed(2)}`;
            savingsMessage.style.color = '#28a745'; 
        } else {
            savingsMessage.textContent = `Warning: Savings are -$${Math.abs(savings).toFixed(2)}`;
            savingsMessage.style.color = '#dc3545'; 
        }
    }
    
    const savings = totalIncome - totalExpenses; 
    updateSavings(savings);
});

resetUIOnLoad();
