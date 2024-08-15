import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = () => {
  const [settings, setSettings] = useState({
    logo: '',
    businessName: '',
    color: '',
    preparedBy: '',
    contactInfo: ''
  });

  useEffect(() => {
    // Fetch existing settings from the server if any
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/settings');
        if (response.data.length > 0) {
          setSettings(response.data[0]); // assuming the response is an array of settings
        }
      } catch (error) {
        console.error('Error fetching settings', error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/settings', settings);
      alert('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings', error);
      alert('Failed to save settings');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Logo URL:
        <input type="text" name="logo" value={settings.logo} onChange={handleChange} />
      </label>
      <br />
      <label>
        Business Name:
        <input type="text" name="businessName" value={settings.businessName} onChange={handleChange} />
      </label>
      <br />
      <label>
        Color:
        <input type="text" name="color" value={settings.color} onChange={handleChange} />
      </label>
      <br />
      <label>
        Prepared by:
        <input type="text" name="preparedBy" value={settings.preparedBy} onChange={handleChange} />
      </label>
      <br />
      <label>
        Contact Information:
        <input type="text" name="contactInfo" value={settings.contactInfo} onChange={handleChange} />
      </label>
      <br />
      <button type="submit">Save Settings</button>
    </form>
  );
};

export default Settings;
