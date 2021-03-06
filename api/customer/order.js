/*
 * @Author: Long Nguyễn
 * @Date: 2019-04-09 10:16:37
 * @Last Modified by: Long Nguyễn
 * @Last Modified time: 2019-04-21 15:56:58
 */

const express = require("express");
const router = express.Router();
const Order = require("../../models/Order");
const OrderDetail = require("../../models/OrderDetail");
const Cart = require("../../models/Cart");
const Payment = require("../../models/Payment");
// Setup router
router.get("/list", getListOrder);
router.get("/list-payment", getListPayment);
router.post("/add", postAddOrder);
router.put("/cancel", putCancelOrder);
router.put("/success", putSuccessOrder);
router.put("/change-product-count", putChangeOrderQuantity);

function getListPayment(req, res) {
  Payment.methods
    .getList()
    .then(list => {
      res.json(list);
    })
    .catch(error => {
      console.log(error);
      return res.status(500);
    });
}

/**
 * Body : orderId, userId, quantity
 */
async function putChangeOrderQuantity(req, res) {
  let orderDetailId = req.body.orderDetailId;
  let userId = req.user._id;
  let quantity = req.body.quantity;
  OrderDetail.methods
    .changeProductQuantity(orderDetailId, quantity, userId)
    .then(() => {
      return res.json({ ok: 1, message: "thanh cong" });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send({ ok: 0, message: "that bai" });
    });
}

/**
 * Body : orderId, comment, paymentId, quantity
 */

/** Quy trinh
 * 1 Lấy thông tin trong giở hàng
 * 2 Kiểm tra sản phẩm có thể mua không và số lượng đặt mua có hợp lệ không
 * 3 Kiểm tra phương thức thanh toán có hợp lệ không
 * 4 Tạo đơn đặt hàng mới
 * 5 Xoá đơn hàng khỏi giỏ hàng
 */
async function postAddOrder(req, res) {
  let {
    productId,
    paymentId,
    discountId,
    quantity,
    providerId,
    name,
    address,
    phone
  } = req.body;
  let userId = req.user._id;
  if (discountId === "") discountId = undefined;
  if (!(name && address && phone))
    return res.json({
      ok: 0,
      message: "Vui lòng nhập đầy đủ thông tin cá nhân để đặt hàng"
    });
  let deliveryInfo = { name, address, phone };
  Order.methods
    .addOrder(
      productId,
      quantity,
      providerId,
      userId,
      paymentId,
      discountId,
      deliveryInfo
    )
    .then(() => {
      return res.json({ ok: 1, message: "Add order success" });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send({ ok: 0, message: "Add Order Fail" });
    });
}

/**
 * Get list Order by user
 */
async function getListOrder(req, res) {
  let userId = req.user._id;
  console.log(userId, req.user);
  Order.methods
    .getList(undefined, undefined, userId, undefined)
    .then(list => {
      console.log("get list order", list);
      return res.json(list);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send({ ok: 0, message: "fail" });
    });
}

// Huy don dat hang
/**
 * Body " orderid"
 * @param {*} req
 * @param {*} res
 */
async function putCancelOrder(req, res) {
  let userId = req.user._id;
  let { orderId, comment } = req.body;
  Order.methods
    .refuseOrderForUser(orderId, userId, comment)
    .then(() => {
      return res.json({ ok: 1, message: "Huy thanh cong" });
    })
    .catch(err => {
      console.log(err);
      return res.send({ ok: 0, message: "that bai" });
    });
}

// Xac nhan nhan hang thanh cong!
/**
 * Body : orderId, comment
 */
async function putSuccessOrder(req, res) {
  let orderId = req.body.orderId;
  let comment = req.body.comment;
  let userId = req.user._id;
  Order.methods
    .successOrder(orderId, userId, undefined, comment)
    .then(rs => {
      console.log(rs);
      return res.json(rs);
    })
    .catch(err => {
      console.log(err);
      return res.send(err);
    });
}

module.exports = router;
