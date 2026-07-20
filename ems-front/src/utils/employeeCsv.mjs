export const employeeHeaders = [
  "FirstName",
  "LastName",
  "Age",
  "DateOfJoining",
  "Title",
  "Department",
  "EmployeeType",
  "CurrentStatus",
];

const csvRows = (text) => {
  const rows = [[]];
  let value = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        value += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        value += character;
      }
    } else if (character === '"' && value === "") {
      quoted = true;
    } else if (character === ",") {
      rows.at(-1).push(value);
      value = "";
    } else if (character === "\n") {
      rows.at(-1).push(value);
      rows.push([]);
      value = "";
    } else if (character !== "\r") {
      value += character;
    }
  }

  if (quoted) throw new Error("CSV contains an unclosed quoted value");
  rows.at(-1).push(value);
  return rows.filter((row) => row.some((cell) => cell.trim()));
};

export const parseEmployeesCsv = (text) => {
  const rows = csvRows(text);
  if (!rows.length) throw new Error("CSV file is empty");

  rows[0][0] = rows[0][0].replace(/^\uFEFF/, "");
  if (rows[0].map((value) => value.trim()).join(",") !== employeeHeaders.join(",")) {
    throw new Error(`CSV columns must be: ${employeeHeaders.join(", ")}`);
  }

  const dataRows = rows.slice(1);
  if (!dataRows.length || dataRows.length > 100) {
    throw new Error("CSV must contain between 1 and 100 employees");
  }

  return dataRows.map((values, index) => {
    if (values.length !== employeeHeaders.length) throw new Error(`CSV row ${index + 2} has the wrong number of columns`);
    const row = Object.fromEntries(employeeHeaders.map((header, cell) => [header, values[cell].trim()]));
    const age = Number(row.Age);
    const status = row.CurrentStatus.toLowerCase();
    const date = new Date(`${row.DateOfJoining}T00:00:00Z`);

    if (!Number.isInteger(age)) throw new Error(`CSV row ${index + 2} has an invalid age`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== row.DateOfJoining) {
      throw new Error(`CSV row ${index + 2} has an invalid joining date`);
    }
    if (!["true", "false", "active", "inactive"].includes(status)) {
      throw new Error(`CSV row ${index + 2} has an invalid status`);
    }

    return {
      ...row,
      Age: age,
      CurrentStatus: status === "true" || status === "active",
    };
  });
};

const csvValue = (value) => {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

export const employeesToCsv = (employees) => [
  employeeHeaders,
  ...employees.map((employee) => [
    employee.FirstName,
    employee.LastName,
    employee.Age,
    new Date(Number(employee.DateOfJoining) || employee.DateOfJoining).toISOString().slice(0, 10),
    employee.Title,
    employee.Department,
    employee.EmployeeType,
    employee.CurrentStatus,
  ]),
].map((row) => row.map(csvValue).join(",")).join("\r\n");
