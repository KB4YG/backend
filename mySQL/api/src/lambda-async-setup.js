require('source-map-support/register')
const serverlessExpress = require('@vendia/serverless-express')
const app = require('./app')
const sequelize = require('./lib/sequelize')

let serverlessExpressInstance

function asyncTask () {
  return new Promise((resolve) => {
   await connectDB()
   console.log("ran 3")
    setTimeout(() => resolve('connected to database'), 1000)
  })
}

async function setup (event, context) {
  const asyncValue = await asyncTask()
  console.log(asyncValue)
  console.log("ran 2")
  serverlessExpressInstance = serverlessExpress({ app })
  return serverlessExpressInstance(event, context)
}

function handler (event, context) {
  if (serverlessExpressInstance) return serverlessExpressInstance(event, context)
  console.log("ran 1")

  return setup(event, context)
}

exports.handler = handler
