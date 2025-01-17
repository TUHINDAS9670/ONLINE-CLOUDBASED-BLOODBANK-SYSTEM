
const testController = (req, res) => {
  res.status(200).send({
    message: "hii route",
    success: true,
  });
}; 

module.exports={ testController };
