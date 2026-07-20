import { useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { IMPORT_EMPLOYEES } from "../graphql/mutations";
import { GET_EMPLOYEES, GET_METRICS } from "../graphql/queries";
import { employeesToCsv, parseEmployeesCsv } from "../utils/employeeCsv.mjs";

const downloadCsv = (name, content) => {
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
};

const EmployeeTransfer = () => {
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const [fileError, setFileError] = useState("");
  const fileInput = useRef(null);
  const { data, loading: employeesLoading } = useQuery(GET_EMPLOYEES);
  const [importEmployees, { loading }] = useMutation(IMPORT_EMPLOYEES, {
    refetchQueries: [{ query: GET_EMPLOYEES }, { query: GET_METRICS }],
  });
  const employees = data?.employees || [];

  const handleFile = async (event) => {
    const file = event.target.files[0];
    setMessage("");
    setFileError("");
    setRows([]);
    setFileName(file?.name || "");
    if (!file) return;

    try {
      setRows(parseEmployeesCsv(await file.text()));
    } catch (error) {
      setFileError(error.message);
    }
  };

  const handleImport = async () => {
    setMessage("");
    setFileError("");
    try {
      const { data: result } = await importEmployees({ variables: { rows } });
      const { imported, skipped } = result.importEmployees;
      setMessage(`Imported ${imported} employee${imported === 1 ? "" : "s"}${skipped ? `; skipped ${skipped} duplicate${skipped === 1 ? "" : "s"}` : ""}.`);
      setRows([]);
      setFileName("");
      fileInput.current.value = "";
    } catch (error) {
      setFileError(error.message);
    }
  };

  return (
    <section className="directory-transfer" aria-labelledby="employee-csv-heading">
      <h2 id="employee-csv-heading">Employee CSV</h2>
      <div className="directory-transfer-controls">
        <label>
          <span>CSV file</span>
          <input ref={fileInput} type="file" accept=".csv,text/csv" onChange={handleFile} />
        </label>
        <button type="button" className="ems-button" onClick={handleImport} disabled={!rows.length || loading}>
          {loading ? "Importing..." : `Import${rows.length ? ` ${rows.length}` : ""}`}
        </button>
        <button type="button" className="ems-button secondary" onClick={() => downloadCsv("employees.csv", employeesToCsv(employees))} disabled={employeesLoading || !employees.length}>
          Export
        </button>
        <button type="button" className="ems-button secondary" onClick={() => downloadCsv("employee-import-template.csv", employeesToCsv([]))}>
          Template
        </button>
      </div>
      {fileName && rows.length > 0 && <p className="ems-section-note">{fileName} is ready to import.</p>}
      {message && <p className="success-message directory-message">{message}</p>}
      {fileError && <p className="error-message directory-message">{fileError}</p>}
    </section>
  );
};

export default EmployeeTransfer;
