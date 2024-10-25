
document.addEventListener('DOMContentLoaded', () => {
    const stopAppButton = document.getElementById('stopAppButton');
    const backupDatabaseButton = document.getElementById('backupDatabaseButton');

    stopAppButton.addEventListener('click', async () => {
        if (confirm('Are you sure you want to stop the application?')) {
            try {
                const response = await fetch('/api/stopApp', { method: 'POST' });
                if (response.ok) {
                    // Display a message and disable all interactions
                    document.body.innerHTML = `
                        <div style="text-align: center; padding: 50px;">
                            <h1>Application Stopped</h1>
                            <p>The server has been shut down successfully.</p>
                            <p>It is now safe to close this browser window.</p>
                            <p>Thank you for using the Card Database Interface!</p>
                        </div>
                    `;
                } else {
                    alert('Failed to stop the application.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error stopping the application.');
            }
        }
    });

    backupDatabaseButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/backupDatabase', { method: 'POST' });
            if (response.ok) {
                const result = await response.json();
                alert(`Database backed up successfully. Backup file: ${result.backupFile}`);
            } else {
                alert('Failed to backup the database.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error backing up the database.');
        }
    });
});
