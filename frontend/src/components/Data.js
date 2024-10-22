import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Data() {
  const [data, setData] = useState('');

  useEffect(() => {
    axios.get('/api/data')
      .then(response => {
        setData(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h2>Data Page</h2>
      <p>{data}</p>
    </div>
  );
}

export default Data;
