// Scroll suau per als botons
function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: "smooth" });
    }
}

// Variable global para almacenar el estado de asistencia antes del envío
let submissionStatus = ''; 

// Missatge de confirmació al enviar el formulari (sense usar alert)
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("formulariBoda");
    const submitButton = form.querySelector('.boto-enviar'); // Obtenim la referència al botó
    const selectAssistencia = document.getElementById("assistencia"); // Referència a select

    // Crear un element per mostrar el missatge de confirmació
    const confirmationMessage = document.createElement('div');
    // CORRECCIÓ CLAU: left: auto i max-width: 90vw per a mòbils
    confirmationMessage.style.cssText = 'position: fixed; top: 20px; right: 20px; left: auto; max-width: 90vw; text-align: center; background-color: #4A6B4A; color: white; padding: 15px 25px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); z-index: 2000; transition: opacity 0.5s; opacity: 0;';
    // No li posem text encara, es definirà dinàmicament
    document.body.appendChild(confirmationMessage);

    // Funció per mostrar i amagar el missatge
    function showConfirmation(message) {
        confirmationMessage.textContent = message; // Establir el missatge dinàmicament
        confirmationMessage.style.opacity = '1';
        setTimeout(() => {
            confirmationMessage.style.opacity = '0';
        }, 3000); // Amaga després de 3 segons
    }

    // Funció per re-inicialitzar l'estat del formulari a "No"
    function resetFormState() {
        // 1. Resetejar el formulari
        form.reset();
        
        // 2. Usar setTimeout(..., 0) per assegurar-se que el reset ha acabat
        setTimeout(() => {
            // 3. Establir la visibilitat al valor inicial ('No')
            selectAssistencia.value = "No"; 
            updateVisibility(); 
        }, 0); 
    }

    // Afegim un listener a l'iframe per detectar la resposta (si es fa servir Google Sheets)
    const iframe = document.getElementById("hidden_iframe");
    iframe.onload = function() {
        // Assegurem que només es mostri la confirmació després d'un enviament POST reeixit
        if (form.getAttribute('target') === 'hidden_iframe') {
            
            let message;
            // DYNAMIC MESSAGE: Mostrar el missatge correcte segons el que s'ha enviat
            if (submissionStatus === 'Si') {
                message = "Gràcies per confirmar la vostra assistència! Us hi esperem! 🎉";
            } else {
                message = "Hem rebut la vostra resposta. Gràcies per avisar-nos, us trobarem a faltar! ❤️";
            }
            
            showConfirmation(message);
            
            // Re-habilitar el botó i restaurar el text
            submitButton.disabled = false;
            submitButton.textContent = "Enviar confirmació"; 
            
            // Cridar la funció de reset que gestiona el setTimeout
            resetFormState();
            
            // Netejar l'estat
            submissionStatus = ''; 
        }
    };
    
    // Escolta l'enviament del formulari
    form.addEventListener("submit", function() {
        // 1. Deshabilitar el botó i donar feedback
        submitButton.disabled = true;
        submitButton.textContent = "Enviant...";
        
        // 2. Emmagatzemar l'estat abans que el formulari es reiniciï
        submissionStatus = selectAssistencia.value;
        
        // El iframe.onload gestionarà la confirmació i el reset.
    });
});

document.addEventListener("DOMContentLoaded", () => {

    const selectAssistencia = document.getElementById("assistencia");

    // Fieldsets que NOMÉS es mostren si l'assistència és 'Si'
    const fieldsetsConditional = [
        "fs-allergies",
        "fs-musica",
        "fs-transport"
    ];

    // Inputs que són obligatoris (required) només si l'usuari assisteix
    const allergiesInput = document.getElementById("allergies");

    // Assegurar que el nom sempre és obligatori (per identificació)
    const nomInput = document.getElementById("nom");
    nomInput.required = true;


    // Funció principal per controlar la visibilitat i els requisits
    function updateVisibility() {
        const selectedValue = selectAssistencia.value;
        const isAttending = selectedValue === "Si";

        // 1. Gestionar visibilitat dels fieldsets condicionals (Plus1, Al·lèrgies, Música, Transport)
        fieldsetsConditional.forEach(id => {
            const fieldset = document.getElementById(id);
            if (fieldset) {
                fieldset.style.display = isAttending ? "block" : "none";
            }
        });

        // 2. Gestionar si el camp d'al·lèrgies és obligatori
        // Es requereix només si assisteix (Si)
        allergiesInput.required = isAttending;
        
        // 3. Assegurar que els fieldsets bàsics (fs-dades, fs-assistencia, fs-missatge) estan sempre visibles
        document.getElementById("fs-dades").style.display = "block";
        document.getElementById("fs-assistencia").style.display = "block";
        document.getElementById("fs-missatge").style.display = "block";
    }

    // Establir l'estat per defecte a "No" al carregar la pàgina
    selectAssistencia.value = "Si"; 

    // Escoltar el canvi en el select
    selectAssistencia.addEventListener("change", updateVisibility);

    // Executar al carregar la pàgina per establir l'estat inicial correcte
    updateVisibility();
});