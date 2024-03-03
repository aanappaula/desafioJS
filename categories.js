const tempCategory = {
  nome: "Books",
  tax: "30%",
};

const getLocalStorage = () =>
  JSON.parse(localStorage.getItem("db_category")) ?? [];
const setLocalStorage = (dbCategory) =>
  localStorage.setItem("db_category", JSON.stringify(dbCategory));

const deleteCategory = (index) => {
  const dbCategory = readCategory();
  dbCategory.splice(index, 1);
  setLocalStorage(dbCategory);
};

const updateCategory = (index, category) => {
  const dbCategory = readCategory();
  dbCategory[index] = category;
  setLocalStorage(dbCategory);
};

const readCategory = () => getLocalStorage();

const createCategory = (category) => {
  const pattern = /\<|\>/gm; 

  if(!pattern.test(JSON.stringify(category))) {
    const dbCategory = getLocalStorage();
    dbCategory.push(category);
    setLocalStorage(dbCategory);
  }
};

const isValidFields = () => {
  return document.getElementById("form").reportValidity();
};


const clearFields = () => {
  const fields = document.querySelectorAll(".grid-item-input");
  fields.forEach((field) => (field.value = ""));
};

const saveCategory = () => {
  if (isValidFields() && checkChar()) {
    const code = Math.floor(Math.random() * 1000) + 1;
    const category = {
      code: code,
      nome: document.getElementById("nome").value.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
      tax: document.getElementById("tax").value.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
    };
    createCategory(category);
    updateTable();
    clearFields();
  }
};

function checkChar() {
  const inputElement = document.getElementById("nome");
  const char = inputElement.value.trim();

  const pattern = /^[a-zA-Z0-9\s]*$/; // Apenas letras, números e espaços

  if (!pattern.test(char)) {
    alert("O nome da categoria não pode conter caracteres especiais.");
    return false;
  }

  return true;
}

function filter(nome) { 
  return nome.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}



const createRow = (category, index) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
          <td>${category.code}</td>
          <td>${filter(category.nome)}</td>
          <td>${category.tax}</td>
          <td><button id="excluir-${index}" type="button" style="word-break: keep-all">Delete</button></td>
`;
  document.querySelector("#tableCategory>tbody").appendChild(newRow);
};

const clearTable = () => {
  const rows = document.querySelectorAll("#tableCategory>tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = () => {
  const dbCategory = readCategory();
  clearTable();
  dbCategory.forEach(createRow);
};

const deletarCategory = (event) => {
  if (event.target.type == "button") {
    const [action, index] = event.target.id.split("-");

    if (action == "excluir") {
      const category = readCategory()[index];
      const response = confirm(
        `Deseja realmente excluir a categoria ${category.nome}?`
      );
      if (response) deleteCategory(index);
      updateTable();
    } else {
      console.log("você não clicou em nada");
    }
  }
};

updateTable();

document.getElementById("salvar").addEventListener("click", saveCategory);
document
  .querySelector("#tableCategory>tbody")
  .addEventListener("click", deletarCategory);
