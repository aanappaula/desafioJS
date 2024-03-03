function getCategories() {
  var nome = JSON.parse(localStorage.getItem("db_category"));
  var taxas = JSON.parse(localStorage.getItem("db_category"));
  var selectCategories = document.getElementById("selectCategories");

  taxas.forEach((category) => {
    console.log(category);
  });

  nome.forEach((category) => {
    console.log(category);
    selectCategories.innerHTML += `<option value="${category.code}">${category.nome}</option>`;
  });
}

const getLocalStorage = () =>
  JSON.parse(localStorage.getItem("db_product")) ?? [];
const setLocalStorage = (dbProduct) =>
  localStorage.setItem("db_product", JSON.stringify(dbProduct));

const deleteProduct = (index) => {
  const dbProduct = readProduct();
  dbProduct.splice(index, 1);
  setLocalStorage(dbProduct);
};

const updateProduct = (index, product) => {
  const dbProduct = readProduct();
  dbProduct[index] = product;
  setLocalStorage(dbProduct);
};

const readProduct = () => getLocalStorage();

const createProduct = (product) => {
  const dbProduct = getLocalStorage();
  const categories = JSON.parse(localStorage.getItem("db_category")) ?? [];

  const productCategoryCode = product.categories;

  const category = categories.find((c) => {
    return String(c.code) === String(productCategoryCode);
  });


  if (category) {
    const newProduct = {
      ...product,
      tax: category.tax,
      categories: category.nome,
    };
    const pattern = /\<|\>/gm; 

    if(!pattern.test(JSON.stringify(category))) {

    dbProduct.push(newProduct);
    setLocalStorage(dbProduct);
  }
};
}

const isValidFields = () => {
  return document.getElementById("form").reportValidity();
};

const clearFields = () => {
  const fields = document.querySelectorAll(".grid-item-input");
  fields.forEach((field) => (field.value = ""));
};

const saveProduct = () => {
  if (isValidFields() && checkChar()) {
    const code = Math.floor(Math.random() * 1000) + 1;
    const product = {
      code: code,
      nome: document.getElementById("nome").value,
      amount: document.getElementById("amount").value,
      unitPrice: document.getElementById("unitPrice").value,
      categories: document.getElementById("selectCategories").value,
    };
    createProduct(product);
    updateTable();
    clearFields();
  }
};

function checkChar() {
  const inputElement = document.getElementById("nome");
  const char = inputElement.value.trim();

  const pattern = /^[a-zA-Z0-9\s]*$/; // Apenas letras, números e espaços

  if (!pattern.test(char)) {
    alert("O nome do produto não pode conter caracteres especiais.");
    return false;
  }

  return true;
}


// window.onload = function () {
//   document
//     .getElementById("amount")
//     .addEventListener("keydown", function (event) {
//       if (!Math.sign(event.key)) {
//         event.preventDefault();
//       }
//     });
//   document
//     .getElementById("unitPrice")
//     .addEventListener("keydown", function (event) {
//       if (!Math.sign(event.key)) {
//         event.preventDefault();
//       }
//     });
// };

function filter(nome) { 
  return nome.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const createRow = (product, index) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
          <td>${product.code}</td>
          <td>${filter(product.nome)}</td>
          <td>${product.amount}</td>
          <td>${product.unitPrice}</td>
          <td>${product.categories}</td>
          

          <td><button id="excluir-${index}" type="button" style="word-break: keep-all">Delete</button></td>
`;
  document.querySelector("#tableProduct>tbody").appendChild(newRow);
};

const clearTable = () => {
  const rows = document.querySelectorAll("#tableProduct>tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = () => {
  const dbProduct = readProduct();
  clearTable();
  dbProduct.forEach(createRow);
};

const deletarProduct = (event) => {
  if (event.target.type == "button") {
    const [action, index] = event.target.id.split("-");

    if (action == "excluir") {
      const product = readProduct()[index];
      const response = confirm(
        `Deseja realmente excluir o produto ${product.nome}?`
      );
      if (response) deleteProduct(index);
      updateTable();
    } else {
      console.log("você não clicou em nada");
    }
  }
};

getCategories();
updateTable();

document.getElementById("salvar").addEventListener("click", saveProduct);
document
  .querySelector("#tableProduct>tbody")
  .addEventListener("click", deletarProduct);
