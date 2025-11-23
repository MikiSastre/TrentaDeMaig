// Scroll suau per als botons
function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: "smooth" });
    }
}

// Missatge de confirmació al enviar el formulari (sense usar alert)
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("formulariBoda");
    
    // Crear un element per mostrar el missatge de confirmació
    const confirmationMessage = document.createElement('div');
    confirmationMessage.style.cssText = 'position: fixed; top: 20px; right: 20px; background-color: #4A6B4A; color: white; padding: 15px 25px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); z-index: 2000; transition: opacity 0.5s; opacity: 0;';
    confirmationMessage.textContent = "Gràcies per confirmar la vostra assistència!";
    document.body.appendChild(confirmationMessage);

    // Funció per mostrar i amagar el missatge
    function showConfirmation() {
        confirmationMessage.style.opacity = '1';
        setTimeout(() => {
            confirmationMessage.style.opacity = '0';
        }, 3000); // Amaga després de 3 segons
    }

    // Afegim un listener a l'iframe per detectar la resposta (si es fa servir Google Sheets)
    const iframe = document.getElementById("hidden_iframe");
    iframe.onload = function() {
        // Assegurem que només es mostri la confirmació després d'un enviament POST reeixit
        if (form.getAttribute('target') === 'hidden_iframe') {
            showConfirmation();
            // Restableix l'estat inicial
            form.reset();
            // Assegurar que la visibilitat s'actualitza a l'estat inicial (Si)
            document.getElementById("assistencia").value = "Si";
            updateVisibility(); 
        }
    };
    
    // Escolta l'enviament del formulari
    form.addEventListener("submit", function() {
        // El iframe.onload gestionarà la confirmació i el reset.
    });
});

document.addEventListener("DOMContentLoaded", () => {

    const selectAssistencia = document.getElementById("assistencia");

    // Fieldsets que NOMÉS es mostren si l'assistència és 'Si'
    // AÑADIDO: fs-plus1 ahora es condicional
    const fieldsetsConditional = [
        "fs-plus1", 
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
        // Nota: fs-plus1 s'ha eliminat d'aquesta llista i es gestiona amb els condicionals.
        document.getElementById("fs-dades").style.display = "block";
        document.getElementById("fs-assistencia").style.display = "block";
        document.getElementById("fs-missatge").style.display = "block";
    }

    // Escoltar el canvi en el select
    selectAssistencia.addEventListener("change", updateVisibility);

    // Executar al carregar la pàgina per establir l'estat inicial correcte
    updateVisibility();
});