// client/src/components/TemplateSelection.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TemplateSelection = () => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('/api/templates');
        setTemplates(response.data);
      } catch (error) {
        console.error('Error fetching templates', error);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <div>
      <h2>Select a Template</h2>
      <ul>
        {templates.map((template) => (
          <li key={template._id}>{template.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default TemplateSelection;
