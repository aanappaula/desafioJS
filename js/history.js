const getLocalStorage = () => 
JSON.parse(localStorage.getItem("db_compra")) ?? [];
const setLocalStorage = (dbCompra) =>
  localStorage.setItem("db_compra", JSON.stringify(dbCompra));
 
const readCompra = () => getLocalStorage();

const createRow = (item, index) => {

  const tableBody = document.querySelector(".table tbody");
  const newRow = document.createElement("tr");

  newRow.innerHTML = `
        <td>${item.code}</td>
        <td>${item.sumTax}</td>
        <td>$${item.sumPrice}</td>
        <td><button type="button"> <a href="compraDetail.html?code=${item.code}"">View</a></button></td>
    `;

  tableBody.appendChild(newRow);
};
 
const updateTable = () => {
  const dbCompra = readCompra();
  dbCompra.forEach(createRow);
 
};
 
updateTable();
 
