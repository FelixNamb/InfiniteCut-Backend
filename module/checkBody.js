// Fonction pour vérifier si toutes les clés (fields) sont présentes et non vides dans l'objet 'body'
function checkBody(body, keys) {
  let isValid = true; // Initialise la variable de validation à 'true'

  // Parcourt chaque clé fournie dans 'keys'
  for (const field of keys) {
    // Si une clé est absente ou vide dans 'body', 'isValid' devient 'false'
    if (!body[field] || body[field] === "") {
      isValid = false;
    }
  }

  return isValid; // Renvoie 'true' si toutes les clés sont présentes et non vides, sinon 'false'
}

// Exporte la fonction 'checkBody' pour pouvoir l'utiliser dans d'autres modules
module.exports = { checkBody };
