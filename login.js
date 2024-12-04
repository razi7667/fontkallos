document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get the input values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');

    // Clear previous message
    messageDiv.textContent = '';

    // Check the username and password
    if (username === 'Iyasfkl' && password === 'Iyas@123') {
        messageDiv.textContent = 'Welcome, Iyas!';
        messageDiv.style.color = 'green';
        window.location.href = 'fkl.html';
    } else if (username === 'Haneenfkl' && password === 'Haneen@123') {
        messageDiv.textContent = 'Welcome, Haneen!';
        messageDiv.style.color = 'green';
        window.location.href = 'fkl.html';
    } else if (username === 'guest' && password === 'guest123') {
        messageDiv.textContent = 'Welcome, Guest!';
        messageDiv.style.color = 'green';
        window.location.href = 'fkl.html';
    } else {
        messageDiv.textContent = 'Invalid username or password.';
        messageDiv.style.color = 'red';
    }
});
