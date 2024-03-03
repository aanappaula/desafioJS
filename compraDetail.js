function filter(nome) { 
  return nome.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}


const getLocalStorage = () => JSON.parse(localStorage.getItem("db_compra")) ?? [];
const setLocalStorage = (dbCompra) => localStorage.setItem("db_compra", JSON.stringify(dbCompra));

const readCompra = () => getLocalStorage();

const createRow = (element) => {
  const tableBody = document.querySelector(".table tbody");
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
     
        <td>${filter(element.nome)}</td>
        <td>${element.amount}</td>
        <td>$${element.unitPrice}</td>
        <td>${element.totalTax}</td>
        <td>$${element.totalValue} </td>
    `;
  tableBody.appendChild(newRow);
};
 
const updateTable = () => {
  const dbCompra = readCompra();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let getCompra = dbCompra.find((carrinho) => carrinho.code == urlParams.get("code"));
 
  getCompra.carrinho.forEach((element) => createRow(element) )
};
 
 
updateTable();