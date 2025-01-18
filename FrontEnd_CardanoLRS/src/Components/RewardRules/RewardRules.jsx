import React, { useState } from "react";
import { CirclePlus, CircleMinus } from "lucide-react";
import "./RewardRules.css";
import { useNavigate } from "react-router-dom";

const RewardRules = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([{ amount: "", percentage: "", tier: "" }]);
  const [submittedRows, setSubmittedRows] = useState([]);

  const handleBack = () => {
    navigate("/SetupPage3");
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const newRows = [...rows];
    newRows[index][name] = value;
    setRows(newRows);
  };

  const handleAddRow = () => {
    setRows([...rows, { amount: "", percentage: "", tier: "" }]);
  };

  const handleRemoveRow = (index) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedRows((prevRows) => [...prevRows, ...rows]); // Append new rows to existing data
    setRows([{ amount: "", percentage: "", tier: "" }]); // Reset form to only one row after submit
  };

  const handleNext = () => {
    navigate("/Dashboard");
  };

  return (
    <div className="reward-rules-container">
      <div className="reward-rules">
        <h1>Reward Rules</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-container">
            {rows.map((row, index) => (
              <div key={index} className="form-row row-layout">
                <div className="input-group-cur">
                  <label htmlFor={`currency-${index}`}>Cur</label>
                  <div className="currency-input-container">
                    <span className="input-prefix">USD</span>
                  </div>
                </div>

                <div className="input-group-amount">
                  <label htmlFor={`amount-${index}`}>Amount</label>
                  <input
                    type="number"
                    id={`amount-${index}`}
                    name="amount"
                    placeholder="Enter Amount"
                    value={row.amount}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                </div>

                <div className="input-group-percentage">
                  <label htmlFor={`percentage-${index}`}>%</label>
                  <input
                    type="number"
                    id={`percentage-${index}`}
                    name="percentage"
                    placeholder="%"
                    value={row.percentage}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                </div>

                <div className="input-group-tier">
                  <label htmlFor={`tier-${index}`}>Tier Name</label>
                  <select
                    id={`tier-${index}`}
                    name="tier"
                    value={row.tier}
                    onChange={(e) => handleInputChange(e, index)}
                  >
                    <option value="">Select</option>
                    <option value="Silver Tier">Silver Tier</option>
                    <option value="Gold Tier">Gold Tier</option>
                    <option value="Platinum Tier">Platinum Tier</option>
                  </select>
                </div>

                <div className="button-container">
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => handleRemoveRow(index)}
                  >
                    <CircleMinus size={20} />
                  </button>
                  {index === rows.length - 1 && (
                    <button
                      type="button"
                      className="add-button"
                      onClick={handleAddRow}
                    >
                      <CirclePlus size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="button" className="back-button" onClick={handleBack}>
              Back
            </button>
            <button
              type="submit"
              className="submit-button"
              onClick={handleNext}
            >
              Submit
            </button>
          </div>
        </form>

        {/* Displaying table below */}
        {submittedRows.length > 0 && (
          <div className="submitted-table">
            <h2>Submitted Reward Rules</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Percentage</th>
                    <th>Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {submittedRows.map((row, index) => (
                    <tr key={index}>
                      <td>{row.amount}</td>
                      <td>{row.percentage}</td>
                      <td>{row.tier}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardRules;
