import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin, Button } from 'antd';
import List from './List';

export default function Health () {
  const [ healthStatus, setHealthStatus ] = useState(null);
  const [ retries, setRetries ] = useState(0);

  useEffect(() => {
    axios.get('https://private-anon-32ceb71746-blissrecruitmentapi.apiary-mock.com/health')
      .then((response) => {
        setHealthStatus(response.data.status)
      })
  }, [retries])

  const handleRetry = () => {
    setHealthStatus(null)
    setRetries(retries + 1)
  }

  const renderList = () => {
    if (healthStatus === 'OK') 
      return (
        <List />
        )
    else 
      return (
        <Button
          onClick={() => { handleRetry() }}
        >Retry Action</Button>
      )

  }

  const wrapperStyle = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

  return (
    <>
      {!healthStatus ? (
        <div style={wrapperStyle}>
          <Spin size='large' />
        </div>
      ) : ( renderList())
      }
    </>
  )
}