import initDb from "../../../helpers/initDb";
import Products from "../../../models/Products";

initDb();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getProduct(req, res);
      break;
    case "DELETE":
      await deleteProduct(req, res);
      break;
  }
};

const getProduct = async (req, res) => {
  const { pid } = req.query;
  const product = await Products.findOne({ _id: pid });
  res.status(200).json(product);
};

const deleteProduct = async (req, res) => {
  const { pid } = req.query;
  await Products.findByIdAndDelete({ _id: pid });
  res.status(200).json({})
};
