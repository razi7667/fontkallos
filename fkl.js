let issuedLicenseData = null; // Global variable to store issued license data

// Function to issue the license and save details to Google Sheets
async function issueLicense() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    // Validate form fields
    if (!name || !email || !phone) {
        alert('Please fill out all fields.');
        return;
    }

    // Get selected fonts
    const fontCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const selectedFonts = Array.from(fontCheckboxes).map(cb => cb.value);

    if (selectedFonts.length === 0) {
        alert('Please select at least one font.');
        return;
    }

    const url = 'https://script.google.com/macros/s/AKfycbzoZ1IFBjUFRS-ZZDlAW5g026m-MBscJWLCocOh2XfdkllG2odL6jgepSE8IrGp7G8o/exec'; // Replace with your Google Apps Script URL

    const data = new URLSearchParams();
    data.append('name', name);
    data.append('email', email);
    data.append('phone', phone);
    data.append('fonts', selectedFonts.join(', ')); // Store selected fonts

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        // Check if the response is ok
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.text();
        document.getElementById('message').innerText = result;

        // Store license data in the global variable
        issuedLicenseData = { name, email, phone, fonts: selectedFonts };

        // Display license information
        displayLicense(name, email, phone, selectedFonts);
        
        // Show download button
        document.getElementById('downloadButton').style.display = 'block';
        
        // Reset the form after submission
        document.getElementById('licenseForm').reset();
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('message').innerText = 'Error submitting data. Please try again.';
    }
}

// Function to display the license information
function displayLicense(name, email, phone, fonts) {
    const licenseDisplay = document.getElementById('licenseDisplay');
    licenseDisplay.innerHTML = `
        <h2>License Issued</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone Number:</strong> ${phone}</p>
        <p><strong>Selected Fonts:</strong><br>${fonts.join('<br>')}</p>
    `;
    licenseDisplay.style.display = 'block'; // Show the license display
}

// Function to download PDF with custom template
async function downloadPDF() {
    const { PDFDocument, rgb } = PDFLib;

    // Check if license data has been issued
    if (!issuedLicenseData) {
        alert("Please issue a license before downloading the PDF.");
        return;
    }

    const { name, email, phone, fonts } = issuedLicenseData; // Use issued license data

    const templateUrl = 'https://raw.githubusercontent.com/razi7667/fontkallos/main/END-USER-LICENSE-AGREEMENT .pdf'; // Replace with your PDF file URL

    try {
        const response = await fetch(templateUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const templateBytes = await response.arrayBuffer();

        // Load the PDF template
        const pdfDoc = await PDFDocument.load(templateBytes);
        const page = pdfDoc.getPage(0);

        // Add license details to the PDF
        page.drawText(name.toUpperCase(), { x: 158, y: 233, size: 12, color: rgb(0, 0, 0) });
        page.drawText(`${phone}`, { x: 158, y: 204, size: 12, color: rgb(0, 0, 0) });
        page.drawText(`${email}`, { x: 158, y: 176, size: 12, color: rgb(0, 0, 0) });

        // Position for the fonts, adjusting based on the number of fonts selected
        let yPosition = 220; // Starting Y position for fonts
        fonts.forEach(font => {
            page.drawText(`${font}`, { x: 416, y: yPosition, size: 10, color: rgb(0, 0, 0) });
            yPosition -= 12; // Move down for the next font
        });

        // Serialize the modified PDF to bytes  
        const pdfBytes = await pdfDoc.save();

        // Create the PDF file name
        const pdfFileName = `END-USER-LICENSE-AGREEMENT ${name.toUpperCase()}.pdf`; // Construct the file name

        // Trigger download of the PDF
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const urlBlob = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = urlBlob;
        a.download = pdfFileName; // Use the constructed file name
        a.click();
        URL.revokeObjectURL(urlBlob); // Cleanup
    } catch (error) {
        alert('There was an issue generating the PDF. Please check the console for details.');
        console.error('Error:', error);
    }
}
