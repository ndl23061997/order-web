const router = require("express").Router();
const Cart = require("../../models/Cart");
const auth = require("../../helpers/Auth");

router.get("/", auth.authCustomer, getCart);
router.post("/remove-product", auth.authCustomer, deleteProductFromCart);
router.post("/add-product", auth.authCustomer, postAddToCart);

// Lay thong tin cua gio hang của user
async function getCart(req, res) {
  try {
    // usefId
    let userId = req.user._id;
    Cart.methods.getCart(userId).then(cart => {
      console.log('Router coustmer/cart :',cart.products);
      return res.json(JSON.stringify(cart));
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}

async function deleteProductFromCart(req, res) {
  let products = req.body.products;
  let userId = req.user._id;
  Cart.methods
    .removeFromCart(userId, products)
    .then(result => {
      return res.json({ message: "Thanhf cong " });
    })
    .catch(err => {
      // console.log(err);
      return res.status(500).json({ message: err.message });
    });
}

// Them san pham vao gio hang
async function postAddToCart(req, res) {
  let userId = req.user._id;
  let products = req.body.products;
  console.log('router customer/cart line 41 :', req.body);

  Cart.
  methods
    .addToCart(userId, products)
    .then(result => {
      res.status(200).json({ message: "Add success", result : result });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error! Add Failure", error: err.message });
    });
}

module.exports = router;
