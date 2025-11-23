// Scroll suau per als botons
function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: "smooth" });
    }
}

// Mostra alert quan s'envia el formulari i reseteja el form
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("formulariBoda");

    form.addEventListener("submit", function() {
        alert("Gràcies per confirmar la vostra assistència!");
        setTimeout(() => form.reset(), 1000);
    });
});

document.addEventListener("DOMContentLoaded", () => {

  const selectAssistencia = document.getElementById("assistencia");

  // Fieldsets que s'han d'amagar quan l'usuari diu NO
  const fieldsetsToHide = [
    "fs-dades",
    "fs-allergies",
    "fs-musica",
    "fs-transport"
  ];

  const fsMissatge = document.getElementById("fs-missatge");
  const fsAssistencia = document.getElementById("fs-assistencia");

  function updateVisibility() {
    if (selectAssistencia.value === "No") {
      // Amagar tots EXCEPTE assistència i missatge
      fieldsetsToHide.forEach(id => {
        document.getElementById(id).style.display = "none";
      });

      fsAssistencia.style.display = "block";
      fsMissatge.style.display = "block";

    } else {
      // Mostrar-ho tot si diu SI
      fieldsetsToHide.forEach(id => {
        document.getElementById(id).style.display = "block";
      });

      fsAssistencia.style.display = "block";
      fsMissatge.style.display = "block";
    }
  }

  selectAssistencia.addEventListener("change", updateVisibility);

  updateVisibility();
});
