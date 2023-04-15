const leaderboardBtn = document.getElementById('leaderboard-btn');
const leaderboardDiv = document.getElementById('leaderboard');
const API_URL = 'http://localhost:8000';



const totalExpenseTable = document.getElementById('totalExpense');

const totalExpense = async () => {
    try {
        const usersExpense = await axios.get(`${API_URL}/alltransaction`);
        const users = usersExpense.data;
        users.forEach((user) => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td><b> ${user.username}</b></td>
        <td><b>$ ${user.totalExpense}</b></td>
        <td><b>$ ${user.totalIncome}</b></td>

      `;
            totalExpenseTable.appendChild(row);
        });
    } catch (error) {
        console.error(error);
    }
};



const addExpenseForm = document.querySelector('#add-expense-form');
const expensesTableBody = document.querySelector('#expenses-table-body');

const logoutBtn = document.getElementById('logout-btn');

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'signin.html';
});
const permiumUser = document.getElementById('permiumUser');
const premiumBtn = document.getElementById('rzp-button1');
if (localStorage.getItem('isPremium') === 'true') {
    premiumBtn.style.display = 'none';
    leaderboardBtn.addEventListener('click', function () {
        totalExpense();
        leaderboardDiv.classList.toggle('d-none');
    });
    permiumUser.textContent = 'You are peremium user';

} else {
    premiumBtn.innerHTML = ' Buy Premium';
}


const downloadBtn = document.getElementById("download-btn");
if(localStorage.getItem('isPremium')==='true'){
downloadBtn.addEventListener("click", async () => {
  try {
      let userID=localStorage.getItem('id');
      const id=parseInt(userID);
    
      window.location.href = `${API_URL}/download/${id}`;
  
    
  } catch (error) {
    console.error(error);
  }
});
}else{
  downloadBtn.style.display='none';
}



addExpenseForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const amount = parseInt(addExpenseForm.amount.value);
    const description = addExpenseForm.description.value;
    const date = addExpenseForm.date.value;
    const category = addExpenseForm.category.value;
    const type=addExpenseForm.type.value;
    console.log(amount,description,date,category,type);
    

    try {
        const response = await axios.post(
            `${API_URL}/transaction`,
            { amount, description, date, category,type },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            },
        );
        const expense = response.data;
        const row = document.createElement('tr');
        let str1=`
        <td>${expense.id}</td>
        
        <td>${expense.description}</td>
        <td>${expense.date}</td>
        <td>${expense.category}</td>`
        let str2='';
        if(expense.type==='income')
        {
            str2=`<td><b> $ ${expense.amount}</b></td><td></td>`
        }else{
            str2=`<td></td><td><b>$ ${expense.amount}</b></td>`
        }
        str1+=str2;
        row.innerHTML=str1+
        `
        <td>
          <button class="btn btn-danger btn-sm" id=${expense.id}>
            Delete
          </button>
        </td>
      `;
        expensesTableBody.appendChild(row);
  
    } catch (error) {
        console.error(error);
    }
});

async function getExpenses() {
    try {
        const response = await axios.get(`${API_URL}/transaction`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const expenses = response.data;
        expenses.forEach((expense) => {
            const row = document.createElement('tr');
            let str1=`
            <td>${expense.id}</td>
            
            <td>${expense.description}</td>
            <td>${expense.date}</td>
            <td>${expense.category}</td>`
            let str2='';
            if(expense.type==='income')
            {
                str2=`<td><b> $ ${expense.amount}</b></td><td></td>`
            }else{
                str2=`<td></td><td><b>$ ${expense.amount}</b></td>`
            }
            str1+=str2;
            row.innerHTML=str1+
            `
            <td>
              <button class="btn btn-danger btn-sm" id=${expense.id}>
                Delete
              </button>
            </td>
          `;
            expensesTableBody.appendChild(row);
        });
    } catch (error) {
        console.error(error);
    }
}

//getExpenses();

//// button in action
expensesTableBody.addEventListener('click',async(e)=>{
	try {
		e.preventDefault();
		if(e.target.tagName==='BUTTON'){
			const btn=e.target;
			console.log(btn);
			const tr=btn.parentNode.parentNode;
			
				const expenseId = btn.id;
				const response=await axios.delete(`${API_URL}/transaction/${expenseId}`,{
					headers: {
						'Authorization': `Bearer ${localStorage.getItem('token')}`
					}});
                    

					console.log(response.data);
				expensesTableBody.removeChild(tr);
				console.log(expenseId);
			

		}
	} catch (error) {
		console.error(error);
	}
})

const viewTransactionsForm = document.querySelector('#view-transactions-form');
// const viewTransactionsForm = document.querySelector('#view-transactions-form');
// const expensesTableBody = document.querySelector('#expenses-table tbody');

viewTransactionsForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const timePeriod = document.querySelector('#time-period').value;

  try {
    const response = await axios.get(`${API_URL}/${timePeriod}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const expenses = response.data;
    expensesTableBody.innerHTML="";
    expenses.forEach((expense) => {
      const row = document.createElement('tr');
      let str1 = `
        <td>${expense.id}</td>
        <td>${expense.description}</td>
        <td>${expense.date}</td>
        <td>${expense.category}</td>`;
      let str2 = '';
      if (expense.type === 'income') {
        str2 = `<td><b> $ ${expense.amount}</b></td><td></td>`;
      } else {
        str2 = `<td></td><td><b>$ ${expense.amount}</b></td>`;
      }
      str1 += str2;
      row.innerHTML = str1 +
        `<td>
          <button class="btn btn-danger btn-sm" id=${expense.id}>
            Delete
          </button>
        </td>`;
      expensesTableBody.appendChild(row);
    });

    // update the expenses and incomes displayed on the dashboard
    // based on the selected date range and time period
    // ...

  } catch (error) {
    console.error(error);
  }
});


// viewTransactionsForm.addEventListener('submit', async (e) => {
//   e.preventDefault();

  
//   const timePeriod = document.querySelector('#time-period').value;

//   try {
//     // const response = await axios.get(`${API_URL}/${timePeriod}`, {
//     //   params: {
//     //     start_date: startDate,
//     //     end_date: endDate,
//     //     time_period: timePeriod
//     //   }
//     // });

//     const response = await axios.get(`${API_URL}/${timePeriod}`, {
//         headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//     });

//     const transactions = response.data;
//     const expense=transactions;
//     expenses.forEach((expense) => {
//         const row = document.createElement('tr');
//         let str1=`
//         <td>${expense.id}</td>
        
//         <td>${expense.description}</td>
//         <td>${expense.date}</td>
//         <td>${expense.category}</td>`
//         let str2='';
//         if(expense.type==='income')
//         {
//             str2=`<td><b> $ ${expense.amount}</b></td><td></td>`
//         }else{
//             str2=`<td></td><td><b>$ ${expense.amount}</b></td>`
//         }
//         str1+=str2;
//         row.innerHTML=str1+
//         `
//         <td>
//           <button class="btn btn-danger btn-sm" id=${expense.id}>
//             Delete
//           </button>
//         </td>
//       `;
//         expensesTableBody.appendChild(row);

//     // update the expenses and incomes displayed on the dashboard
//     // based on the selected date range and time period
//     // ...

//   } catch (error) {
    
//     console.error(error);
//   }

// });


document.getElementById('rzp-button1').onclick = async function (event) {
    event.preventDefault();

    try {
        const response = await fetch(`${API_URL}/payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                amount: 50000
            })
        });

        const orderData = await response.json();
        console.log(orderData.data);

        const options = {
            key: 'rzp_test_aWdxj6Sk7LSDCl',
            amount: '50000',
            currency: 'INR',
            order_id: orderData.id,
            handler: handlePaymentSuccess
        };

        const rzp = new Razorpay(options);
        rzp.open();
    } catch (error) {
        console.error(error);
    }
};

// Handle successful payment
function handlePaymentSuccess(response) {
    alert(response.razorpay_payment_id);
    alert(response.razorpay_order_id);
    alert('Your payment is successful');

    localStorage.setItem('isPremium', true);

    if (localStorage.getItem('isPremium') === true) {
        premiumBtn.style.display = 'none';
    } else {
        premiumBtn.innerHTML = 'Premium';
    }
}

