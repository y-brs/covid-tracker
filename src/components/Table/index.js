import numeral from "numeral";
import "./index.css";

function Table({ countries }) {
  return (
    <div className="table">
      <table>
        <tbody>
          {countries.map(({ country, cases }) => (
            <tr key={country}>
              <td>{country}</td>
              <td><strong>{numeral(cases).format("000,000")}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;