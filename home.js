function filter(nome) { 
  return nome.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function getProducts () {
  var nome = JSON.parse(localStorage.getItem("db_product"));

  var selectProducts = document.getElementById("selectProducts");

  nome.forEach((product) => {
    console.log(product);
    selectProducts.innerHTML += `<option value="${product.code}">${filter(product.nome)}</option>`;
  });
};

const getLocalStorage = () =>
  JSON.parse(localStorage.getItem("db_compra")) ?? [];
const setLocalStorage = (dbCompra) =>
  localStorage.setItem("db_compra", JSON.stringify(dbCompra));

const updateCompra = (index, compra) => {
  const dbCompra = readCompra();
  dbCompra[index] = compra;
  setLocalStorage(dbCompra);
};

const readCompra = () => getLocalStorage();

const createCompra = (compra) => {
  const dbCompra = getLocalStorage();
  const products = JSON.parse(localStorage.getItem("db_product")) ?? [];

  const compraProductCode = compra.products;

  const product = products.find((c) => {
    return String(c.code) === String(compraProductCode);
  });

  if (product) {
    const newCompra = {
      ...compra,
      products: product.nome,
    };

  const pattern = /\<|\>/gm;

  if (!pattern.test(JSON.stringify(product))) {
    dbCompra.push(newCompra);
    setLocalStorage(dbCompra);
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


const showInput = () => {
  const amount = parseFloat(document.getElementById("amount").value);
  const selectedProduct = document.getElementById("selectProducts").value;
  const products = JSON.parse(localStorage.getItem("db_product"));
  const product = products.find((p) => p.code === Number(selectedProduct));
  const compra = {
    nome: product.nome,
    amount: amount,
    products: document.getElementById("selectProducts").value,
  };
  const unitPrice = getProductUitPrice(compra.products);
  const productTax = getProductTax(compra.products);
  const totalTax = (productTax * unitPrice * amount) / 100;
  const totalPrice = unitPrice * amount;
  

  document.getElementById("unitPrice").value = totalPrice.toFixed(2);
  document.getElementById("taxValue").value = totalTax.toFixed(2);
};

document.getElementById("amount").addEventListener("input", showInput);

let carrinhoTemporario = [];

const saveCompra = () => {
  if (isValidFields()) {
    const amount = parseFloat(document.getElementById("amount").value);
    const selectedProduct = document.getElementById("selectProducts").value;
    const products = JSON.parse(localStorage.getItem("db_product"));
    const product = products.find((p) => p.code === Number(selectedProduct));

    const existingProduct = carrinhoTemporario.find(
      (item) => item.products === selectedProduct
    );

    if (!existingProduct) {
      if (amount <= product.amount) {
        const compra = {
          nome: product.nome,
          amount: amount,
          products: document.getElementById("selectProducts").value,
        };

        const unitPrice = getProductUitPrice(compra.products);
        const productTax = getProductTax(compra.products);
        const totalTax = (productTax * unitPrice * compra.amount) / 100;
        const totalPrice = unitPrice * compra.amount;
        const totalValue = totalPrice + totalTax;

        compra.unitPrice = unitPrice;
        compra.totalTax = totalTax;
        compra.totalValue = totalValue;

        createRow(compra, carrinhoTemporario.length);
        carrinhoTemporario.push(compra);

        let sumTax = 0;
        let sumPrice = 0;

        carrinhoTemporario.forEach((compra) => {
          sumTax += parseFloat(compra.totalTax);
          sumPrice += parseFloat(compra.totalValue);
        });

        showTotal({ sumTax, sumPrice });
        clearFields();
      } else {
        alert(
          `Sem estoque suficiente para essa quantidade! Digite um valor menor que ${product.amount}!`
        );
      }
    } else {
      alert("Este produto foi adicionado ao carrinho anteriormente.");
    }
  }
};

const atualizaEstoque = (productName, purschasedAmount) => {
  const products = JSON.parse(localStorage.getItem("db_product"));
  const productIndex = products.findIndex((p) => p.nome === productName);

  if (productIndex !== -1) {
    products[productIndex].amount -= purschasedAmount;
    localStorage.setItem("db_product", JSON.stringify(products));
  }
};

const finalizarCompra = () => {
  const selectedProduct = document.getElementById("selectProducts").value;
  const products = JSON.parse(localStorage.getItem("db_product"));
  const product = products.find((p) => p.code === Number(selectedProduct));
  if (carrinhoTemporario.length > 0) {
    const code = Math.random();
    let sumTax = 0;
    let sumPrice = 0;

    carrinhoTemporario.forEach((compra) => {
      sumTax += parseFloat(compra.totalTax);
      sumPrice += parseFloat(compra.totalValue);
    });

    const dbCompra = readCompra();
    const response = confirm("Deseja realmente finalizar a sua compra?");
    if (response);
    carrinhoTemporario.forEach((item) => {
      atualizaEstoque(item.nome, item.amount);
    });
    dbCompra.push({
      sumTax,
      sumPrice,
      code,
      carrinho: [...carrinhoTemporario],
    });

    setLocalStorage(dbCompra);

    carrinhoTemporario = [];
    updateTable();
  }
};

const showTotal = () => {
  let sumTax = 0;
  let sumPrice = 0;

  carrinhoTemporario.forEach((compra) => {
    sumTax += parseFloat(compra.totalTax);
    sumPrice += parseFloat(compra.totalValue);
  });

  document.getElementById("totalTax").textContent =
    "Valor total da taxa: " + sumTax.toFixed(2);
  document.getElementById("totalPrice").textContent =
    "Valor total do carrinho: " + sumPrice.toFixed(2);
};



const createRow = (compra, index) => {
  const newRow = document.createElement("tr");
  const unitPrice = getProductUitPrice(compra.products);
  const productTax = getProductTax(compra.products);
  const totalTax = (productTax * unitPrice * compra.amount) / 100;

  const totalPrice = unitPrice * compra.amount;
  const totalValue = totalPrice + totalTax;
  console.log(totalPrice, totalTax);

  newRow.innerHTML = `
          <td>${filter(compra.nome)}</td>         
          <td>${unitPrice}</td>
          <td>${compra.totalTax}</td>
          <td>${compra.amount}</td>
          <td>${totalValue}</td> 
          
          <td><button id="excluir-${index}" type="button" style="word-break: keep-all">Delete</button></td>
`;
  document.querySelector("#tableCompra>tbody").appendChild(newRow);
  newRow.addEventListener("click", () => removeRow(newRow));
};

const getProductUitPrice = (productCode) => {
  const products = JSON.parse(localStorage.getItem("db_product")) ?? [];
  const product = products.find((p) => p.code == productCode);
  return product ? product.unitPrice : "N/A";
};

const getProductTax = (productCode) => {
  const products = JSON.parse(localStorage.getItem("db_product")) ?? [];
  const product = products.find((p) => p.code == productCode);
  return product ? product.tax : 0;
};

const clearTable = () => {
  const rows = document.querySelectorAll("#tableCompra>tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = () => {
  const dbCompra = readCompra();
  clearTable();
  showTotal();
};

const removeRow = (row) => {
  const response = confirm(
    "Deseja realmente excluir esse produto do carrinho?"
  );
  if (response) {
    row.remove();
    updateCompra();
    showTotal();
  }
};

const cancelCompra = () => {
  const response = confirm("Deseja realmente cancelar o seu carrinho?");
  if (response);
  carrinhoTemporario = [];
  updateTable();
};

getProducts();
updateTable();

document.getElementById("salvar").addEventListener("click", saveCompra);
document.getElementById("finish").addEventListener("click", finalizarCompra);
document.getElementById("cancel").addEventListener("click", cancelCompra);
