console.log("running");
const main = (() => {
  const elems = {
    fileInput: document.querySelector("#fileInput input"),
    dateInput: document.querySelector("#date input"),
    printElem: document.querySelector("#printable"),
  };

  function parse(text) {
    let result = text.trim().split("\r\n");
    result = result.map((row) => {
      return row.split(",");
    });
    tableData.header = result.shift();
    let blocks = [];
    let block = [];
    let className = "";
    let section = "";
    result.forEach((row, index) => {
      if (index === 0) {
        className = row[1];
        section = row[2];
      }
      if (row[1] === className && row[2] === section) {
        block.push(row);
      } else {
        blocks.push(block);
        block = [];
        className = row[1];
        section = row[2];
        block.push(row);
      }
    });
    blocks.push(block);
    tableData.dataBlocks = blocks;
    tableData.dataBlocks.forEach((blc) => {
      elems.printElem.appendChild(generateTable(tableData.header, blc));
    });
  }
  function generateTable(header, data) {
    let result = document.createElement("div");
    let table = document.createElement("table");
    function createRow(data, header = false) {
      let rowElem = document.createElement("tr");
      data.forEach((cell) => {
        let cellElem = document.createElement(header ? "th" : "td");
        cellElem.textContent = cell;
        rowElem.appendChild(cellElem);
      });
      if (header) {
        let headElem = document.createElement("thead");
        headElem.appendChild(rowElem);
        return headElem;
      }
      return rowElem;
    }
    let dateRow = document.createElement("div");
    dateRow.textContent = main.elems.dateInput.value;
    main.elems.dateInput.addEventListener("change", (e) => {
      dateRow.textContent = e.target.value;
    });
    result.appendChild(dateRow);
    table.appendChild(createRow(header, true));
    data.forEach((rowData) => {
      table.appendChild(createRow(rowData));
    });
    result.setAttribute("class", "block");
    result.appendChild(table);
    return result;
  }

  let tableData = { header: [], dataBlocks: [] };
  return { elems, tableData, parse };
})();

const events = (() => {
  function readFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const text = e.target.result;
      main.parse(text);
    };

    reader.readAsText(file);
  }

  main.elems.fileInput.addEventListener("change", readFile);
})();
