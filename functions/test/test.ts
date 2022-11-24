console.log(__dirname)

const send = async (event) => {
  /**
   * Send a mail using Mailgun
   */
  return {
    statusCode: 405,
    body: __dirname,
    headers: {Allow: 'POST'},
  };

};

exports.handler = send

