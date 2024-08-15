// client/src/components/ProposalForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProposalForm = () => {
  const [clientInfo, setClientInfo] = useState({
    name: '',
    industry: '',
    companySize: '',
    contactInfo: '',
    primaryContact: '',
  });

  const [projectDetails, setProjectDetails] = useState({
    goal: '',
    problems: '',
    importance: '',
  });

  const [hourlyRate, setHourlyRate] = useState('');
  const [generatePDF, setGeneratePDF] = useState(false);
  const [timeEstimate, setTimeEstimate] = useState('');
  const [proposal, setProposal] = useState('');
  const [settings, setSettings] = useState({ preparedBy: '', contactInfo: '' });
  const [language, setLanguage] = useState('en'); // Default language

  useEffect(() => {
    // Fetch settings from the server or local storage
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/settings');
        setSettings(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e, setState) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      clientInfo: Object.values(clientInfo),
      projectDetails: Object.values(projectDetails),
      hourlyRate,
      generatePDF,
      timeEstimate,
      settings,
      language,
    };

    console.log('Form data submitted:', formData);

    try {
      const response = await axios.post('/api/generate/proposal', formData);
      console.log('Response from backend:', response.data);
      if (generatePDF) {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'proposal.pdf');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } else {
        setProposal(response.data.proposal);
      }
    } catch (error) {
      console.error('Error generating proposal:', error);
      alert(`Failed to generate proposal: ${error.response.data.details}`);
    }
  };

  return (
    <div>
      <h2>Create Proposal</h2>
      <form onSubmit={handleSubmit}>
        <h3>Client Information</h3>
        <label>
          Client Name:
          <input
            type="text"
            name="name"
            value={clientInfo.name}
            onChange={(e) => handleChange(e, setClientInfo)}
            required
          />
        </label>
        <br />
        <label>
          Industry:
          <input
            type="text"
            name="industry"
            value={clientInfo.industry}
            onChange={(e) => handleChange(e, setClientInfo)}
            required
          />
        </label>
        <br />
        <label>
          Company Size:
          <input
            type="text"
            name="companySize"
            value={clientInfo.companySize}
            onChange={(e) => handleChange(e, setClientInfo)}
            required
          />
        </label>
        <br />
        <label>
          Contact Information:
          <input
            type="text"
            name="contactInfo"
            value={clientInfo.contactInfo}
            onChange={(e) => handleChange(e, setClientInfo)}
            required
          />
        </label>
        <br />
        <label>
          Primary Contact Person:
          <input
            type="text"
            name="primaryContact"
            value={clientInfo.primaryContact}
            onChange={(e) => handleChange(e, setClientInfo)}
            required
          />
        </label>
        <br />

        <h3>Project Details</h3>
        <label>
          Goal:
          <input
            type="text"
            name="goal"
            value={projectDetails.goal}
            onChange={(e) => handleChange(e, setProjectDetails)}
            required
          />
        </label>
        <br />
        <label>
          Problems or Needs:
          <input
            type="text"
            name="problems"
            value={projectDetails.problems}
            onChange={(e) => handleChange(e, setProjectDetails)}
            required
          />
        </label>
        <br />
        <label>
          Importance:
          <input
            type="text"
            name="importance"
            value={projectDetails.importance}
            onChange={(e) => handleChange(e, setProjectDetails)}
            required
          />
        </label>
        <br />

        <h3>Pricing and Costs</h3>
        <label>
          Hourly Rate (NOK):
          <input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            required
          />
        </label>
        <br />

        <h3>Time Estimate</h3>
        <label>
          Estimated Hours Range (e.g., 5-10):
          <input
            type="text"
            value={timeEstimate}
            onChange={(e) => setTimeEstimate(e.target.value)}
            required
          />
        </label>
        <br />

        <h3>Language</h3>
        <label>
          <select name="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="no">Norwegian</option>
          </select>
        </label>
        <br />

        <label>
          <input
            type="checkbox"
            checked={generatePDF}
            onChange={(e) => setGeneratePDF(e.target.checked)}
          />
          Generate PDF
        </label>
        <br />

        <button type="submit">Generate Proposal</button>
      </form>

      {proposal && (
        <div>
          <h2>Generated Proposal</h2>
          <pre>{proposal}</pre>
        </div>
      )}
    </div>
  );
};

export default ProposalForm;
