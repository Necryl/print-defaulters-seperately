console.log("running");
const main = (() => {
  const elems = {
    fileInput: document.querySelector("#fileInput input"),
    dateInput: document.querySelector("#date input"),
    printElem: document.querySelector("#printable"),
    numberRows: document.querySelector("#numberRows input"),
    hideFirstColumn: document.querySelector("#hideFirstColumn input"),
  };

  function parse(text) {
    elems.printElem.innerHTML = "";
    let result = text.trim().split("\r\n");
    result = result.map((row) => {
      return row.split(",");
    });
    let header = result.shift();
    const emptyColumnIndices = [];
    for (let i = 0; i < header.length; i++) {
      if (header[i].trim() === "") {
        emptyColumnIndices.push(i);
      }
    }
    tableData.header = header.filter(
      (_, i) => !emptyColumnIndices.includes(i)
    );
    result = result.map((row) =>
      row.filter((_, i) => !emptyColumnIndices.includes(i))
    );
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
  function generateTable(header, data) {
    let result = document.createElement("div");
    let table = document.createElement("table");
    const SNo = main.elems.numberRows.checked;
    const hideFirstColumn = main.elems.hideFirstColumn.checked;
    let tableHeader = [...header];
    let tableBody = [...data];
    if (hideFirstColumn) {
      tableHeader.shift();
      tableBody = tableBody.map((row) => {
        let newRow = [...row];
        newRow.shift();
        return newRow;
      });
    }
    if (SNo) {
      tableHeader.unshift("S.No.");
      tableBody = tableBody.map((row, index) => {
        let newRow = [...row];
        newRow.unshift(index + 1);
        return newRow;
      });
    }
    let dateRow = document.createElement("div");
    function getDate() {
      let date = new Date(main.elems.dateInput.value);
      const options = { year: "numeric", month: "long", day: "numeric" };
      const humanReadableDate = date.toLocaleDateString("en-US", options);
      return isNaN(date) ? "" : `Date: ${humanReadableDate}`;
    }
    dateRow.textContent = getDate();
    main.elems.dateInput.addEventListener("change", (e) => {
      dateRow.textContent = getDate();
    });
    result.appendChild(dateRow);
    table.appendChild(createRow(tableHeader, true));
    tableBody.forEach((rowData) => {
      table.appendChild(createRow(rowData));
    });
    result.setAttribute("class", "block");
    result.appendChild(table);
    return result;
  }

  let tableData = { header: [], dataBlocks: [], text: "" };
  return { elems, tableData, parse };
})();

const events = (() => {
  function readFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const text = e.target.result;
      main.tableData.text = text;
      main.parse(text);
    };

    reader.readAsText(file);
  }

  main.elems.fileInput.addEventListener("change", readFile);
  main.elems.numberRows.addEventListener("change", () => {
    main.parse(main.tableData.text);
  });
  main.elems.hideFirstColumn.addEventListener("change", () => {
    main.parse(main.tableData.text);
  });
})();
