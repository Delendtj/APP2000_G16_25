//SN
// Get all form elements
const form = document.getElementById('form');
const firstname_input = document.getElementById('firstname-input');
const email_input = document.getElementById('email-input');
const password_input = document.getElementById('password-input');
const repeat_password_input = document.getElementById('repeat-password');

// legger til en eventlistener på formen som lytter etter submit eventet 
form.addEventListener('submit', function(e) {
    // Prevent the form from submitting by default
    e.preventDefault();
    
    // fjerner alle eventuelle feilmeldinger fra tidligere forsøk 
    clearErrors();
    
    // skjekker om det er noen errors i formen
    let hasErrors = false;
    
    // Validere fornavn hvis det finnes for registreringsskjemaet 
    if(firstname_input) {
        if(!firstname_input.value.trim()) {
            addError(firstname_input, 'Fullt navn er påkrevd');
            hasErrors = true;
        }
    }
    
    // Validere e-post 
    if(!email_input.value.trim() || !email_input.value.includes('@')) {
        addError(email_input, 'Gyldig e-post er påkrevd');
        hasErrors = true;
    }
    
    // Validere passord
    if(!password_input.value) {
        addError(password_input, 'Passord er påkrevd');
        hasErrors = true;
    }
        // jeg ville legge til flere funksjoner men tenkte det var nok for nå
    /*if(password.length < 8){
        errors.push('passordet må være minst 8 tegn')
        password_input.parentElement.classList.add ('incorrect')
     }; */
    
    // Validere gjentatt passord hvis det finnes for registreringsskjemaet
    if(repeat_password_input && password_input.value !== repeat_password_input.value) {
        addError(repeat_password_input, 'Passordene matcher ikke :(');
        hasErrors = true;
    }
    
    // hvis det er ikke noen errors da submitter vi formen
    if(!hasErrors) {
        form.submit();
    }
});

// Funksjon for å legge feilstil og melding til input feltet 
function addError(input, message) {
    const parentDiv = input.parentElement;
    parentDiv.classList.add('error');
    
    // Add error melding til input feltet 
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    parentDiv.appendChild(errorMessage);
}



// Funksjon til å fjerne alle feilmeldinger
function clearErrors() {
    // Remove all error classes
    document.querySelectorAll('.error').forEach(element => {
        element.classList.remove('error');
    });
    
    // fjerne alle error meldinger 
    document.querySelectorAll('.error-message').forEach(element => {
        element.remove();
    });
}

