
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Tab switching functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });

    // Form submission handlers
    document.getElementById('cardForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const cardData = Object.fromEntries(formData.entries());
        try {
            const response = await fetch('/api/addCards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cardData),
            });
            if (response.ok) {
                const result = await response.json();
                alert(`${result.count} card(s) added successfully`);
                e.target.reset();
            } else {
                const errorData = await response.json();
                alert(`Error adding card(s): ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error adding card(s)');
        }
    });

    document.getElementById('queryForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const queryData = Object.fromEntries(formData.entries());
        try {
            const queryParams = new URLSearchParams(queryData).toString();
            const response = await fetch(`/api/queryCards?${queryParams}`);
            if (response.ok) {
                const results = await response.json();
                displayResults(results);
            } else {
                const errorData = await response.json();
                alert(`Error querying cards: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error querying cards');
        }
    });

    document.getElementById('modifyForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const modifyData = Object.fromEntries(formData.entries());
        try {
            const response = await fetch('/api/modifyCard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(modifyData),
            });
            if (response.ok) {
                alert('Card modified successfully');
                e.target.reset();
            } else {
                const errorData = await response.json();
                alert(`Error modifying card: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error modifying card');
        }
    });
});

function displayResults(results) {
    const resultsDiv = document.getElementById('queryResults');
    if (results.length === 0) {
        resultsDiv.innerHTML = '<p>No results found.</p>';
        return;
    }

    const headers = ['ID', 'Year', 'Description', 'Name', 'Type', 'Condition', 'Cost', 'Quantity', 'Sold'];
    let html = '<table><tr>';
    headers.forEach(header => {
        html += `<th>${header}</th>`;
    });
    html += '</tr>';

    results.forEach(row => {
        html += '<tr>';
        headers.forEach(header => {
            const key = header.toLowerCase();
            let value = row[key];
            if (key === 'sold') {
                value = value ? 'Yes' : 'No';
            }
            html += `<td>${value}</td>`;
        });
        html += '</tr>';
    });
    html += '</table>';

    resultsDiv.innerHTML = html;
}
