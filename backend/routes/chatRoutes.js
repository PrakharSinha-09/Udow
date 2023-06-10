const express=require('express')
const { protect } = require('../middleware/authMiddleware')
const {accessChat,fetchChat,createGroupChat,renameGroup,addToGroup,removeFromGroup}=require('../controllers/chatController')
const router=express.Router()

//Creating Routes

router.route('/').post(protect,accessChat)                             //protect middleware invoked, means that if the user is not logged in, he won't be able to access this
router.route('/').get(protect,fetchChat) 
router.route('/group').post(protect,createGroupChat) 
router.route('/rename').post(protect,renameGroup) 
router.route('/groupremove').put(protect,removeFromGroup) 
router.route('/groupadd').put(protect,addToGroup) 

module.exports=router