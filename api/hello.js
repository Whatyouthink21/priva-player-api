// api/hello.js
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({
    message: 'Priva Player API is working!',
    timestamp: new Date().toISOString()
  });
};
