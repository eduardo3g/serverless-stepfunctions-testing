const AWS = require('aws-sdk')
const StepFunctions = new AWS.StepFunctions()
const axios = require('axios')

const we_start_execution = async (stateMachineArn, input) => {
  const { executionArn } = await StepFunctions.startExecution({
    stateMachineArn,
    input: JSON.stringify(input)
  }).promise()

  return executionArn
}

const we_accept_order = async (orderId, token) => {
  await axios({
    method: 'POST',
    url: `${process.env.ApiUrl}/order/accept`,
    data: {
      orderId,
      token
    }
  })

  console.log('Order has been accepted:', orderId)
}

const we_reject_order = async (orderId, token) => {
  await axios({
    method: 'POST',
    url: `${process.env.ApiUrl}/order/reject`,
    data: {
      orderId,
      token
    }
  })

  console.log('Order has been rejected:', orderId)
}

const we_confirm_delivery = async (orderId) => {
  await axios({
    method: 'POST',
    url: `${process.env.ApiUrl}/order/confirm`,
    data: {
      orderId
    }
  })

  console.log('Order has been confirmed:', orderId)
}

module.exports = {
  we_start_execution,
  we_accept_order,
  we_reject_order,
  we_confirm_delivery
}