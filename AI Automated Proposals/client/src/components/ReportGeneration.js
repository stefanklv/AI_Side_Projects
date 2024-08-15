// client/src/components/ReportGeneration.js
import React, { useState } from 'react';
import axios from 'axios';

const ReportGeneration = () => {
  const [answers, setAnswers] = useState({});
  const [gptParams, setGptParams] = useState({ temperature: 0.7, max_tokens: 150 });
  const [report, setReport] = useState('');

  const handleGenerateReport = async () => {
    try {
      const response = await axios.post('/api/generate', { answers, gptParams });
      setReport(response.data.report);
    } catch (error) {
      console.error('Error generating report', error);
    }
  };

  const handleParamChange = (e) => {
    setGptParams({ ...gptParams, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Generated Proposal</h2>
      <button onClick={handleGenerateReport}>Generate Report</button>
      <br />
      <label>
        Temperature:
        <input
          type="number"
          name="temperature"
          value={gptParams.temperature}
          onChange={handleParamChange}
          step="0.1"
          min="0"
          max="1"
        />
      </label>
      <br />
      <label>
        Max Tokens:
        <input
          type="number"
          name="max_tokens"
          value={gptParams.max_tokens}
          onChange={handleParamChange}
          min="50"
          max="1000"
        />
      </label>
      <br />
      <div>
        <h3>Report:</h3>
        <p>{report}</p>
      </div>
    </div>
  );
};

export default ReportGeneration;
