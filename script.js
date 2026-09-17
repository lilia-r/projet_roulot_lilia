var formulaire = document.getElementById("form-inscription");

formulaire.addEventListener("submit", function (event) {
  event.preventDefault();

  var login = document.getElementById("login").value;
  var password = document.getElementById("password").value;
  var confirmation = document.getElementById("confirmation").value;
  var nom = document.getElementById("nom").value;
  var prenom = document.getElementById("prenom").value;
  var adresse = document.getElementById("adresse").value;
  var email = document.getElementById("email").value;
  var telephone = document.getElementById("telephone").value;
  var date = document.getElementById("date-naissance").value;

  if (
    login == "" ||
    password == "" ||
    confirmation == "" ||
    nom == "" ||
    prenom == "" ||
    adresse == "" ||
    email == "" ||
    telephone == "" ||
    date == ""
  ) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  if (password != confirmation) {
    alert("Les mots de passe ne sont pas identiques.");
    return;
  }

  document.getElementById("recap-login").textContent = login;
  document.getElementById("recap-nom").textContent = nom;
  document.getElementById("recap-prenom").textContent = prenom;
  document.getElementById("recap-adresse").textContent = adresse;
  document.getElementById("recap-email").textContent = email;
  document.getElementById("recap-telephone").textContent = telephone;
  document.getElementById("recap-date").textContent = date;

  formulaire.classList.add("cache");
  document.getElementById("recap").classList.remove("cache");
});
