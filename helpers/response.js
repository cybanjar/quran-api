const successResponse = (
  res,
  message = 'Success',
  data = {},
  code = 200
) => {
  return res.status(code).send({
    code,
    status: 'OK',
    message,
    data
  })
}

const errorResponse = (
  res,
  message = 'Internal Server Error',
  code = 500,
  data = {}
) => {
  return res.status(code).send({
    code,
    status: 'ERROR',
    message,
    data
  })
}

module.exports = {
  successResponse,
  errorResponse
}
