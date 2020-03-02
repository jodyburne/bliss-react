import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Input, Button } from 'antd';
import axios from 'axios';
import { Chart } from "react-google-charts";
import { useHistory } from "react-router-dom";
const { Search } = Input;

export default function List() {
  const [results, setResults]  = useState([])
  const [offset, setOffset] = useState(0)
  const [filter, setFilter] = useState('')
  const [questionFilter, setQuestionFilter] = useState('')
  const [choiceFilter, setChoiceFilter] = useState('')
  const [filterPrefix, setFilterPrefix] = useState('')
  const [call, setCall] = useState(0)

  const clearFilters = () => {
    setChoiceFilter('')
    setQuestionFilter('')
    setFilter('')
    setFilterPrefix('')
  }

  let history = useHistory();
  
  function handleRowClick(index) {
    history.push("/detail/" + index);
  }

  useEffect(() => {
    axios.get(`https://private-anon-32ceb71746-blissrecruitmentapi.apiary-mock.com/questions?limit=10&offset=${offset}${filterPrefix}${filter}`)
      .then((response) => {
        setResults(response.data)
        clearFilters()
    })
    }, [call])

  function handleLoad(e) {
    if (e.target.name === 'loadButton') {
        setOffset(offset + 10)
      } 
    setCall(call + 1)
  }

    
  const createData = (index, question, answers) => ({ index, question, answers })
    
  const data = results.map(row => createData(row.id, row.question, row.choices))

  const columns = [
    {
      title: 'Index',
      dataIndex: 'index',
      key: 'index',
      width: '20%',
    },
    {
      title: 'Questions',
      dataIndex: 'question',
      key: 'question',
      width: '30%',
    },
    {
      title: 'Poll Results',
      dataIndex: 'choices',
      key: 'choices',
      render: (choice, row) => {
          const data = [
            ['Choice', 'Votes']
            ]
          row.answers.forEach(ans => {
              data.push([ans.choice, ans.votes])
            })
        return (
          <Chart
            chartType='BarChart'
            width='400px'
            height='150px'
            data={data}
            options={{legend: {position: 'none'}}}
          />
        )
      }
    }
  ];

  function searchResults(value, prefix) {
    setFilter(value)
    setFilterPrefix(prefix)
    setCall(call + 1)
  }

  const handleChange = (e) => {
    if (e.target.name === 'question')
      setQuestionFilter(e.target.value)
    else setChoiceFilter(e.target.value)
  }

  const handleReset = () => {
    clearFilters()
    setCall(call + 1)
  }

  const wrapperStyle = {
    display: 'flex',
    marginBottom: '20px'
  }

  const mainStyle = {
    width: '80vw',
    margin: '20px auto 20px auto'
  }
    
  return (
    <>
    {results && (
      <div style={mainStyle}>
        <div
          style={wrapperStyle}>
          <Search
            name='question'
            placeholder="Search Questions"
            onSearch={value => searchResults(value, '&question_filter=')}
            value={questionFilter}
            onChange={(e) => {handleChange(e)}}
          />
          <Search
            name="choice"
            placeholder="Search Choices"
            onSearch={value => searchResults(value, '&choice_filter=')}
            value={choiceFilter}
            onChange={(e) => {handleChange(e)}}
          />
          <Button
            onClick={() => {handleReset()}}>
            Reset filters
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          onRow={(record, rowIndex) => {
            return {
              onClick: rowIndex => {
                handleRowClick(record.index)}
            }
          }
        }
        />
        <Button
          style={{marginTop: '10px'}}
          name='loadButton'
          onClick={(e) => {handleLoad(e)}}>
          Next results
        </Button>
      </div>
    )}
    </>
  )
}
