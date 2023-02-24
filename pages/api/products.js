// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import initDb from "../../helpers/initDb";
import Products from "../../models/Products";

initDb();

// export default async function handler(req, res) {
//   Products.find().then((products) => {
//     res.status(200).json(products);
//   });
// }

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getallProducts(req, res);
      break;
    case "POST":
      await saveProduct(req, res);
      break;
  }
};

const getallProducts = async (req, res) => {
  try {
    const products = await Products.find();
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
  }
};

const saveProduct = async (req, res) => {
  const { name, price, discription, mediaUrl } = req.body;
  try {
    if (!name || !price || !discription || !mediaUrl) {
      return res.status(422).json({ error: "Please add all the fields" });
    }
    const product = await new Products({
      name,
      price,
      discription,
      mediaUrl,
    }).save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: "internal server error" });
    console.log(err);
  }
};
