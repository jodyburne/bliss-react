import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { Card, Radio, Button, Modal, Input, Alert } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { Chart } from "react-google-charts";

export default function Detail(props) {
  const [ result, setResult ] = useState('')
  const [ choice, setChoice ] = useState('')
  const [ votes, setVotes ] = useState(0)
  const [ disabled, setDisabled ] = useState(true)
  const [ visible, setVisible ] = useState(false)
  const [ email, setEmail ] = useState('')
  const [ alertMsg, setAlertMsg] = useState('')

  useEffect(() => {
    axios.get(`https://private-anon-163db2b497-blissrecruitmentapi.apiary-mock.com/questions/${props.match.params.id}`)
      .then((response) => {
        setResult(response.data)
    })
  }, [votes])

  function handleVote() {
    const votedQ = {...result}
    votedQ.choices[choice].votes += 1
    axios.put(`https://private-anon-163db2b497-blissrecruitmentapi.apiary-mock.com/questions/${props.match.params.id}`, votedQ)
      .then(() => {
        setChoice('')
        setVotes(votes + 1)
      })
  }

  function handleShare() {
    if (!validateEmail(email)) {
      setAlertMsg('Please provide valid email')}
    else {
    axios.post(`https://private-anon-163db2b497-blissrecruitmentapi.apiary-mock.com/share?destination_email=${email}&content_url=${props.match.url}`)
      .then((res)=> {
        if (res.status === 200) {
          setVisible(false)
          setEmail('')
          setAlertMsg('')
        } else setAlertMsg('Email not sent, please try again')
      })
    }
  }

function openModal() {
  setVisible(true)
}

function closeModal() {
  setVisible(false)
  setAlertMsg('')
  setEmail('')
}

function renderChart(choices) {
  const data = [
    ['Choice', 'Votes']
    ]
  choices.forEach(ans => {
    data.push([ans.choice, ans.votes])
  })
  return (
    <Chart
      chartType='AreaChart'
      width='460px'
      height='150px'
      data={data}
      options={{legend: {position: 'bottom'}}}
    />
  )
}

function renderPoll(choices) {
  function onChange(e) {
    setChoice(e.target.value)
    setDisabled(false)
  }

  return (
    <div>
      <Radio.Group onChange={(e) => {onChange(e)}}>
      {choices.map((choice, i) => (
        <Radio.Button className='options' key={i} value={i}>{choice.choice}</Radio.Button>
        ))}
      </Radio.Group><br/><br/>
      <Button 
        disabled={disabled}
        onClick={() => {handleVote()}}>Vote</Button>
    </div>
  )
}

function handleChange(e) {
  setEmail(e.target.value)
}

function validateEmail(email) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

return (
  <>
    {result && (
      <div>
        <Card
          title={`${result.id}. ${result.question}`}
          extra={<Link to="/">Return</Link>}
          bordered={false}
          style={{textAlign: 'center', width: '500px', margin: 'auto'}}
          actions={[
            <span
              onClick={() => { openModal()}}>
              <SendOutlined key="send"/>
              Share
            </span>
          ]}
        >
          <img 
            width='300px'
            height='200px'
            src={result.image_url}/><br/><br/>
          <p>Choose One</p>
          {renderPoll(result.choices)}<br/>
          <h3>Results</h3>
          {renderChart(result.choices)}<br/>
          <p>Date published: {moment(result.published_at).format('MMMM Do YYYY, h:mm:ss a')}</p>
        </Card>
        <Modal
          title="Basic Modal"
          visible={visible}
          okText="Send"
          closable
          onOk={() => {handleShare()}}
          onCancel={() => closeModal()} 
        >
          {alertMsg && (
            <Alert style={{marginBottom: '10px'}} message={alertMsg} type='warning'closable/>
          )}
          <p>Enter recipient's email</p>
          <Input
            placeholder="email@address.com"
            name="email"
            value={email}
            onChange={(e) => {handleChange(e)}}
            />
        </Modal>
      </div>
    )}
  </>     
  )
}