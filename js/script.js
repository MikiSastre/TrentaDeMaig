// Scroll suau per als botons
function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: "smooth" });
    }
}

// Funció per copiar l'IBAN
function copyIBAN() {
    const ibanText = document.getElementById('ibanText');
    if (!ibanText) return;
    const iban = ibanText.innerText;
    navigator.clipboard.writeText(iban).then(() => {
        const btn = document.querySelector('.copy-btn');
        if (btn) {
            const originalText = btn.innerText;
            btn.innerText = 'Copiat!';
            setTimeout(() => { btn.innerText = originalText; }, 2000);
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    // URL del teu Google Apps Script treta de l'atribut 'action' del teu form
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxmIValML51vCdBLvsM-SykvI437OxHjE9tYFup0hs9sGxljipjAbNy6WpvccQx4IOYqw/exec";

    const form = document.getElementById("formulariBoda");
    const submitButton = form.querySelector('.boto-enviar');
    const selectAssistencia = document.getElementById("assistencia");
    const allergiesInput = document.getElementById("allergies");
    const nomInput = document.getElementById("nom");

    // 1. Crear el Toast de confirmació
    const confirmationMessage = document.createElement('div');
    confirmationMessage.style.cssText = 'position: fixed; top: 20px; right: 20px; left: auto; max-width: 90vw; text-align: center; background-color: #4A6B4A; color: white; padding: 15px 25px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); z-index: 2000; transition: opacity 0.5s; opacity: 0; pointer-events: none; font-family: sans-serif;';
    document.body.appendChild(confirmationMessage);

    function showToast(message) {
        confirmationMessage.textContent = message;
        confirmationMessage.style.opacity = '1';
        setTimeout(() => { confirmationMessage.style.opacity = '0'; }, 5000);
    }

    // 2. Control de visibilitat dels camps
    const fieldsetsConditional = ["fs-allergies", "fs-transport", "fs-musica"];

    function updateVisibility() {
        const isAttending = selectAssistencia.value === "Si";
        
        fieldsetsConditional.forEach(id => {
            const fieldset = document.getElementById(id);
            if (fieldset) {
                fieldset.style.display = isAttending ? "block" : "none";
                // Desactivem inputs perquè no s'enviïn si estan ocults
                const inputs = fieldset.querySelectorAll('input, select, textarea');
                inputs.forEach(i => i.disabled = !isAttending);
            }
        });

        if (allergiesInput) allergiesInput.required = isAttending;
    }

    // 3. Enviament del formulari via Fetch
    form.addEventListener("submit", function(e) {
        e.preventDefault(); // Aturem l'enviament tradicional i l'iframe

        submitButton.disabled = true;
        submitButton.textContent = "Enviant...";

        // Recollim les dades
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Enviament al Script de Google
        fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', 
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(() => {
            // Èxit en l'enviament
            const msg = data.assistencia === 'Si' 
                ? "Gràcies per confirmar! Us hi esperem! 🎉" 
                : "Gràcies per avisar-nos, us trobarem a faltar! ❤️";
            
            showToast(msg);
            form.reset();
            
            // Tornem a l'estat inicial
            setTimeout(() => {
                selectAssistencia.value = "Si";
                updateVisibility();
                submitButton.disabled = false;
                submitButton.textContent = "Enviar confirmació";
            }, 100);
        })
        .catch(error => {
            console.error('Error:', error);
            showToast("S'ha produït un error. Si us plau, contacteu amb els nuvis.");
            submitButton.disabled = false;
            submitButton.textContent = "Enviar confirmació";
        });
    });

    // 4. Inicialització d'esdeveniments
    selectAssistencia.addEventListener("change", updateVisibility);
    updateVisibility(); 
});