// client/src/components/Questions.js
import React, { useState } from 'react';
import axios from 'axios';

const Questions = () => {
  const [answers, setAnswers] = useState({});

  const handleChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/questions', { answers });
      alert('Answers saved successfully');
    } catch (error) {
      console.error('Error saving answers', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Question 1:
        <input type="text" name="question1" onChange={handleChange} />
      </label>
      <br />
      <label>
        Question 2:
        <input type="text" name="question2" onChange={handleChange} />
      </label>
      <br />
      <button type="submit">Submit Answers</button>
    </form>
  );
};

export default Questions;
