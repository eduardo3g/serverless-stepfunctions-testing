const StepFunctions = require('aws-sdk/clients/stepfunctions')
const StepFunctionsClient = new StepFunctions()
const { getOrder } = require('../lib/orders')

/**
 * 
 * @param {import('aws-lambda').APIGatewayEvent} event 
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResult>}
 */
module.exports.handler = async (event) => {
  const { orderId } = JSON.parse(event.body)

  const order = await getOrder(orderId)

  if (!order) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Order is not found.'
      })
    }
  }

  if (order.status !== 'ACCEPTED') {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Order is not awaiting delivery.'
      })
    }
  }

  await StepFunctionsClient.sendTaskSuccess({
    taskToken: order.confirmationToken,
    output: JSON.stringify({
      orderId: order.id,
      confirmedAt: new Date().toJSON()
    })
  }).promise()

  return {
    statusCode: 204
  }
}