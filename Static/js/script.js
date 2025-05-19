document.addEventListener('DOMContentLoaded', function() {
    console.log('Application d\'inventaire chargée');
    
    // Animation simple pour les lignes du tableau
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
        row.style.opacity = 0;
        setTimeout(() => {
            row.style.transition = 'opacity 0.5s ease';
            row.style.opacity = 1;
        }, index * 100);
    });
    
    // Vérification du formulaire
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const nameInput = document.getElementById('name');
            const priceInput = document.getElementById('price');
            const quantityInput = document.getElementById('quantity');
            
            if (nameInput.value.trim() === '') {
                alert('Le nom du produit est requis');
                e.preventDefault();
                return;
            }
            
            if (parseFloat(priceInput.value) <= 0) {
                alert('Le prix doit être supérieur à 0');
                e.preventDefault();
                return;
            }
            
            if (parseInt(quantityInput.value) < 0) {
                alert('La quantité ne peut pas être négative');
                e.preventDefault();
                return;
            }
            
            console.log('Formulaire validé, envoi en cours...');
        });
    }
});