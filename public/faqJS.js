// Get all accordion buttons (questions)
const acc = document.querySelectorAll('.accordion');

// Loop through each accordion button and add event listeners
acc.forEach((button) => {
    button.addEventListener('click', function() {
        // Toggle the active class to change the button's appearance
        this.classList.toggle('active');

        // Toggle the corresponding answer visibility
        const answer = this.nextElementSibling;
        if (answer.style.display === "block") {
            answer.style.display = "none";
        } else {
            answer.style.display = "block";
        }
    });
});