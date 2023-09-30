import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, message, Table, DatePicker } from 'antd';
import {UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons'
import Layout from '../components/Layout/Layout';
import Input from 'antd/es/input/Input';
import axios from 'axios';
import Spinner from '../components/Spinner';
import moment from 'moment';
import Analytics from '../components/Analytics';
import '../styles/homePageStyle.css'


const {RangePicker} = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([])
  const [selectedType, setSelectedType] = useState(null); // Add selectedType state
  const [frequency, setFrequency]=useState('7');
  const[selectedDate, setSelectedDate] = useState([]);
  const[type,setType] = useState('all');
  const [viewData,setViewData] = useState('table');
  const [editable,setEditable] = useState(null);

  //table data
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text) => <span>{moment(text).format('DD-MM-YYYY')}</span>
    },
    {
      title: "Amount",
      dataIndex: "amount"
    },
    {
      title: "Type",
      dataIndex: "type"
    },
    {
      title: "Category",
      dataIndex: "category"
    },
    {
      title: "Reference",
      dataIndex: "reference"
    },
    {
      title: "Actions",
      render: (text,record) => (
        <div>
          <EditOutlined onClick={()=>{
            setEditable(record)
            setShowModal(true)
          }}/>
          <DeleteOutlined className='mx-2' onClick={()=>{handleDelete(record)}}/>
        </div>
      )
    }
  ]

  //getall transactions

  //useEffect hook
  useEffect(()=> {
    const getAllTransactions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        setLoading(true)
        const res = await axios.post('/api/v1/transactions/get-transaction', { userid: user._id, frequency, selectedDate, type });
        setLoading(false);
        setAllTransaction(res.data)
        console.log(res.data)
      } catch (error) {
        setLoading(false);
        console.error('Error fetching transactions:', error); // Log the error for debugging
        message.error('Fetch issue with Transaction')
      }
    };

    getAllTransactions();
  },[frequency, selectedDate, type]);

  const handleDelete = async(record) => {
    try {
      setLoading(true)
      await axios.post('/api/v1/transactions/delete-transaction', {transactionId: record._id}) 
      setLoading(true)
      message.success("Transaction Deleted!");

      window.location.reload();
    } catch (error) {
      setLoading(false)
      console.log(error)
      message.error('unable to delete')
    }
  }

  // Form handling
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      setLoading(true)
      if(editable){
        await axios.post('/api/v1/transactions/edit-transaction', {
          payload:{
            ...values, userid:user._id
          },
          transactionId:editable._id
        })
      setLoading(false)
      message.success('Transaction Updated Successfully');
      }else{
        await axios.post('/api/v1/transactions/add-transaction', {...values, userid:user._id})
      setLoading(false)
      message.success('Transaction Added Successfully')
      }
      setShowModal(false);
      setEditable(null);

      window.location.reload();
    } catch (error) {
      setLoading(false)
      message.error('Failed to add transaction')
    }
  };

  // Category options based on selected type
  const categoryOptions = selectedType === 'income'
    ? ['salary', 'stipend']
    : selectedType === 'expense'
    ? ['entertainment', 'shopping', 'food', 'travel', 'bills', 'tax']
    : [];

  return (
    <Layout>
      {loading && <Spinner/>}
      <div className="filters">
        <div>
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(values)=>setFrequency(values)}>
            <Select.Option value="7">LAST 1 Week</Select.Option>
            <Select.Option value="30">LAST 1 Month</Select.Option>
            <Select.Option value="365">LAST 1 Year</Select.Option>
            <Select.Option value="custom">custom</Select.Option>
          </Select>
          {frequency === 'custom' && <RangePicker value={selectedDate} onChange={(values)=>setSelectedDate(values)}/>}
        </div>
        <div>
          <h6>Select Type</h6>
          <Select value={type} onChange={(values)=>setType(values)}>
            <Select.Option value="all">ALL</Select.Option>
            <Select.Option value="income">INCOME</Select.Option>
            <Select.Option value="expense">EXPENSE</Select.Option>
          </Select>
          {frequency === 'custom' && <RangePicker value={selectedDate} onChange={(values)=>setSelectedDate(values)}/>}
        </div>
        <div className='switch-icons'>
              <UnorderedListOutlined className={`mx-2 ${viewData==='table' ? 'active-icon':'inactive-icon'}`} onClick={()=>{
                setViewData('table')
              }}/>
              <AreaChartOutlined className={`mx-2 ${viewData==='analytics' ? 'active-icon':'inactive-icon'}`} onClick={()=>{
                setViewData('analytics')
              }} />
          </div>
        <div>
          <button className="btn btn-primary logout-btn" onClick={() => setShowModal(true)}>
            Add New
          </button>
        </div>
      </div>
      <div className="content">
        {viewData === 'table' ? <Table columns={columns} dataSource={allTransaction}/> : <Analytics allTransaction={allTransaction}/>}
        
      </div>
      <Modal title={editable ? 'Edit Transaction':'Add Transaction'} open={showModal} onCancel={() => setShowModal(false)} footer={false}>
        <Form layout="vertical" onFinish={handleSubmit} initialValues={editable}>
          <Form.Item label="Amount" name="amount">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Type" name="type">
            <Select onChange={(value) => setSelectedType(value)}>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select>
              {categoryOptions.map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label='Date' name='date'>
            <Input type='date'/>
          </Form.Item>
          <Form.Item label='Reference' name="reference">
            <Input type='text'/>
          </Form.Item>
          <Form.Item label='Description' name="description">
            <Input type='text'/>
          </Form.Item>
          <div className='d-flex justify-content-end'>
              <button type='submit' className='btn btn-primary'>SAVE</button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
