let expenses = [];
let totalAmount = 0;

const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');

function loadExpenses() {
    const storedExpenses = JSON.parse(localStorage.getItem('expenses'));
    if (storedExpenses) {
        expenses = storedExpenses;
        expenses.forEach(expense => {
            totalAmount += expense.amount;
            addExpenseToTable(expense);
        });
        totalAmountCell.textContent = totalAmount;
    }
}

function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function addExpenseToTable(expense) {
    const newRow = expenseTableBody.insertRow();
    const categoryCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const actionCell = newRow.insertCell();

    categoryCell.textContent = expense.category;
    amountCell.textContent = expense.amount;
    dateCell.textContent = expense.date;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-btn');

    actionCell.appendChild(editBtn);
    actionCell.appendChild(deleteBtn);

    deleteBtn.addEventListener('click', function () {
        const index = expenses.indexOf(expense);
        if (index > -1) {
            expenses.splice(index, 1);
            totalAmount -= expense.amount;
            totalAmountCell.textContent = totalAmount;
            expenseTableBody.removeChild(newRow);
            saveExpenses(); 
        }
    });

    editBtn.addEventListener('click', function () {
        if (editBtn.textContent === 'Edit') {
            categoryCell.innerHTML = `<select>
                <option value="College Fee">College Fee</option>
                <option value="Rent">Rent</option>
                <option value="Transport">Transport</option>
                <option value="Food">Food</option>
                <option value="Shopping">Shopping</option>
                <option value="Other fee">Other fee</option>
            </select>`;
            amountCell.innerHTML = `<input type="number" value="${expense.amount}" />`;
            dateCell.innerHTML = `<input type="date" value="${expense.date}" />`;

            editBtn.textContent = 'Save';
        } else if (editBtn.textContent === 'Save') {
            const updatedCategory = categoryCell.querySelector('select').value;
            const updatedAmount = parseFloat(amountCell.querySelector('input').value);
            const updatedDate = dateCell.querySelector('input').value;

            if (isNaN(updatedAmount) || updatedAmount <= 0 || updatedDate === '') {
                alert('Please fill out all fields correctly');
                return;
            }

            totalAmount = totalAmount - expense.amount + updatedAmount;
            totalAmountCell.textContent = totalAmount;

            categoryCell.textContent = updatedCategory;
            amountCell.textContent = updatedAmount;
            dateCell.textContent = updatedDate;

            expense.category = updatedCategory;
            expense.amount = updatedAmount;
            expense.date = updatedDate;

            editBtn.textContent = 'Edit';
            saveExpenses(); 
        }
    });
}

addBtn.addEventListener('click', function () {
    const category = categorySelect.value;
    const amount = parseFloat(amountInput.value);
    const date = dateInput.value;

    if (category === '' || isNaN(amount) || amount <= 0 || date === '') {
        alert('Please fill out all fields correctly');
        return;
    }

    const expense = { category, amount, date };
    expenses.push(expense);
    totalAmount += amount;
    totalAmountCell.textContent = totalAmount;

    addExpenseToTable(expense); 
    saveExpenses(); 

    amountInput.value = '';
    dateInput.value = '';
});

window.onload = loadExpenses;
