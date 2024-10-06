const express = require('express')
const router = express.Router()
const multer = require('multer');

const Banner = require('../models/Banner');
const CarausalBanner = require('../models/CarausalBanner');
const Cart = require('../models/Cart');
const Category = require('../models/Category');
const Controller = require('../models/Controller');
const Headphone = require('../models/Headphone');
const Keyboard = require('../models/Keyboard');
const Laptop = require('../models/Laptop');
const Mouse = require('../models/Mouse');
const PC = require('../models/Pc');
const ProductBanner = require('../models/ProductBanner');
const Signup = require('../models/Signup');


const roleGateway = function (roles = []) {
    return function (req, res, next) {
        if (req.session.user && roles.includes(req.session.role)) {
            next(); 
        } else {
            res.redirect('/login'); 
        }
    };
};


const admingateway = function (req, res, next) {
    if (req.session.role === 'admin') {
        next();
    } else if (req.session.user) {
        res.status(403).send('Access denied'); 
    } else {
        res.redirect('/login');
    }
}

 router.get('/login', async (req, res) => {
     try {
         const name = await Signup.findOne({ user_email: req.session.user, user_role: req.session.role });
         const cou = await Cart.countDocuments({ user_email: req.session.user });
         res.render('admin/login', { name: name, cou: cou });
     } catch (err) {
         console.error(err);
         res.status(500).send('Internal Server Error');
     }
 });
 
 // Signup Route
 router.get('/signup', async (req, res) => {
     res.render('admin/signup');
 });
 
 // Profile Route
 router.get('/profile', roleGateway, async (req, res) => {
     try {
         const name = await Signup.findOne({ user_email: req.session.user, user_role: req.session.role });
         const pc = await Cart.find({ user_email: req.session.user });
         const cou = await Cart.countDocuments({ user_email: req.session.user });
 
         res.render('profile', {
             role: req.session,
             name: name,
             pc: pc.length ? pc : ' ',
             cou: cou ? cou : '0'
         });
     } catch (err) {
         console.error(err);
         res.status(500).send('Internal Server Error');
     }
 });
 
 // Home Route
 router.get('/', async (req, res) => {
     try {
         const banner = await Banner.find({});
         const category = await Category.find({}).sort({ product_category: -1 });
         const carausal = await CarausalBanner.find({ carausal_category: 'first_carausal' });
         const carausal2 = await CarausalBanner.find({ carausal_category: 'second_carausal' });
         const reslt5 = await Signup.distinct('user_profile', { user_email: req.session.user });
         const cou = await Cart.countDocuments({ user_email: req.session.user });
         
         res.render('index', {
             banner: banner,
             product: category,
             carausal: carausal,
             carausal2: carausal2,
             name: reslt5,
             cou: cou
         });
     } catch (err) {
         console.error(err);
         res.status(500).send('Internal Server Error');
     }
 });
 
 // Admin Route
 router.get('/admin', admingateway, async (req, res) => {
     if (req.session.user) {
         try {
             const user = await Signup.find({}).sort({ id: -1 });
             res.render('admin/dashboard', { user: user });
         } catch (err) {
             console.error(err);
             res.status(500).send('Internal Server Error');
         }
     } else {
         res.redirect('/login');
     }
 });
 
 // Dashboard Banner Route
 router.get('/dashboard_banner', admingateway, async (req, res) => {
     try {
         const banner = await Banner.find({});
         res.render('admin/banner', { banner: banner });
     } catch (err) {
         console.error(err);
         res.status(500).send('Internal Server Error');
     }
 });
 
 // Category Route
 router.get('/category', admingateway, async (req, res) => {
     try {
         const category = await Category.find({});
         res.render('admin/category', { category: category });
     } catch (err) {
         console.error(err);
         res.status(500).send('Internal Server Error');
     }
 });
 
 // Carausal Banner Route
 router.get('/carausal_banner', admingateway, async (req, res) => {
     try {
         const category = await Category.find({});
         const c_banner = await CarausalBanner.find({});
         res.render('admin/carausal_banner', { category, c_banner });
     } catch (err) {
         console.error(err);
         res.status(500).send('Internal Server Error');
     }
 });
 
 // Product Route
 router.get('/product', admingateway, async (req, res) => {
     try {
         const category = await Category.find({});
         
         const pc = await PC.find({});
         const mouse = await Mouse.find({});
         const laptop = await Laptop.find({});
         const keyboard = await Keyboard.find({});
         const headphone = await Headphone.find({});
         const controller = await Controller.find({});
 
         const pro = {
             controller,
             headphone,
             keyboard,
             laptop,
             mouse,
             pc
         };
 
         res.render('admin/product', { category, pro });
     } catch (err) {
         console.error(err);
         res.status(500).send('Internal Server Error');
     }
 });
 
 

// Product Banner Route
router.get('/product_banner', admingateway, async (req, res) => {
    try {
        const category = await Category.find({});
        const banner = await ProductBanner.find({});
        res.render('admin/product_banner', { category, banner });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// User Route
router.get('/user', async (req, res) => {
    try {
        const users = await Signup.find({});
        res.render('admin/user', { user: users });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// PC Page
router.get('/PC', async (req, res) => {
    try {
        const pc = await PC.find({});
        const banner = await ProductBanner.find({ product_category: 'PC' })
                            .select('product_banner product_title product_link');
        const name = await Signup.distinct('user_profile', { user_email: req.session.user });
        const cou = await Cart.countDocuments({ user_email: req.session.user });

        res.render('pc', { pc, banner, name, cou });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Controller Page
router.get('/controller', async (req, res) => {
    try {
        const controller = await Controller.find({});
        const banner = await ProductBanner.find({ product_category: 'controller' })
                            .select('product_banner product_title product_link');
        const name = await Signup.distinct('user_profile', { user_email: req.session.user });
        const cou = await Cart.countDocuments({ user_email: req.session.user });

        res.render('controller', { controller, banner, name, cou });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Laptop Page
router.get('/laptop', async (req, res) => {
    try {
        const laptop = await Laptop.find({});
        const banner = await ProductBanner.find({ product_category: 'laptop' })
                            .select('product_banner product_title product_link');
        const name = await Signup.distinct('user_profile', { user_email: req.session.user });
        const cou = await Cart.countDocuments({ user_email: req.session.user });

        res.render('laptop', { laptop, banner, name, cou });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/accessories', async (req, res) => {
    try {
        const keyboard = await Keyboard.find({});
        const mouse  = await Mouse.find({});
        const headphone = await Headphone.find({});
        const banners = await ProductBanner.find({ product_category: 'keyboard' })
                           .select('product_banner product_title product_link');
        const name = await Signup.distinct('user_profile', { user_email: req.session.user });
        const cou = await Cart.countDocuments({ user_email: req.session.user });

        res.render('accessories', { keyboard, mouse , headphone, banners, name, cou });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


// Service Page
router.get('/service', async (req, res) => {
    try {
        const name = await Signup.distinct('user_profile', { user_email: req.session.user });
        const cou = await Cart.countDocuments({ user_email: req.session.user });

        res.render('service', { name, cou });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Community Page
router.get('/community', async (req, res) => {
    try {
        const banner = await Banner.find({ banner_dis: ' ' });
        const name = await Signup.distinct('user_profile', { user_email: req.session.user });
        const cou = await Cart.countDocuments({ user_email: req.session.user });

        res.render('community', { banner, name, cou });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Product Page with Dynamic Parameters
router.get('/product/:product_category/:product_id', async (req, res) => {
    const { product_id, product_category } = req.params;

    try {
        const productModel = require(`../models/${product_category.toLowerCase()}`);
        const product = await productModel.findOne({ product_id });
        const cartItem = await Cart.findOne({ product_id, user_email: req.session.user });
        const name = await Signup.distinct('user_profile', { user_email: req.session.user });
        const count = await Cart.countDocuments({ user_email: req.session.user });

        res.render('product_param', { product, results1: cartItem, name, cou: count });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/cart_page', async (req, res) => {
    if (req.session.user) {
        try {
            const products = await Cart.find({ user_email: req.session.user });
            const name = await Signup.distinct('user_profile', { user_email: req.session.user });
            const count = await Cart.countDocuments({ user_email: req.session.user });

            res.render('cart_page', { product: products, name: name, cou: count });
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.redirect('/login');
    }
});
 
router.get('/cartonpage', roleGateway, async (req, res) => {
    try {
        const products = await Cart.find({ user_email: req.session.user });

        if (products.length === 0) {
            res.send({ product: ' ', cou: 0 });
        } else {
            const count = await Cart.countDocuments({ user_email: req.session.user });
            res.send({ product: products, cou: count });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


router.get("/logout", async (req, res) => {
    if (req.session) {
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                res.json({ msg: "logout" });
            }
        });
    }
});




// Login Route
router.post('/login', async (req, res) => {
   const { user_email, user_pass } = req.body;
   try {
       // Use the Signup model to find the user
       const user = await Signup.findOne({ user_email, user_pass });

       if (user) {
           // Store user information in the session
           req.session.user = user.user_email;
           req.session.role = user.user_role; // Ensure that user_role exists in your model
           req.session.num = user.user_number;

           res.send({ user_role: user.user_role });
       } else {
           res.send({ user_role: 'login' });
       }
   } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
   }
});


// Multer storage setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, './public/images/category/profile'); // Adjust destination as needed
    },
    filename: function (req, file, cb) {
       cb(null, Date.now() + "_" + file.originalname);
    }
 });
 const upload = multer({ storage: storage });
 
 // User login

 
 router.post('/new_signup', upload.single('user_profile'), async (req, res) => {
   console.log(req.body, 'fwfawf');

   let user_profile = req.file ? req.file.filename : 'default.jpg';
   const { user_email, user_pass, user_name, user_number, latitude, longitude } = req.body;

   const newUser = new Signup({ user_profile, user_email, user_pass, user_name, user_number, latitude, longitude });

   try {
       await newUser.save();
       res.send({ msg: 'ok' });
   } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
   }
});


const storagebnr = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, './public/images/banner'); // Adjust destination as needed
    },
    filename: function (req, file, cb) {
       cb(null, Date.now() + "_" + file.originalname);
    }
 });
 const uploadbnr = multer({ storage: storagebnr });


// Banner Upload
router.post('/dash_banner', uploadbnr.single('main_banner'), async (req, res) => {
    
   const { banner_id, banner_title, banner_dis, banner_link } = req.body;
   const main_banner = req.file.filename;

   const banner = new Banner({ main_banner, banner_id, banner_title, banner_dis, banner_link });

   try {
       await banner.save();
       res.send({ msg: 'ok' });
   } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
   }
});


const storagepc = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, 'public/images/category/product'); 
    },
    filename: function (req, file, cb) {
       cb(null, Date.now() + "_" + file.originalname);
    }
 });
 const uploadpc = multer({ storage: storagepc });
 


router.post('/pc', uploadpc.fields([{ name: 'product_image' }]), async (req, res) => {
    console.log(req.body,'fwafwafwafwafw');
    
   const ppicFiles = req.files['product_image'];
   const product_image = ppicFiles ? ppicFiles.map(file => file.filename) : [];

   const { product_category, product_id, product_name, product_dis, product_price, orignal_price } = req.body;
   const product = new PC({
       product_category,
       product_id,
       product_image: product_image.join(','),
       product_name,
       product_dis,
       product_price,
       orignal_price,
   });

   try {
       await product.save();
       res.redirect('/product');
   } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
   }
});

const storageConfig = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/category/product'); // Static folder for all products
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname); // Filename with timestamp
    }
});

// Upload configuration for products
const PRODUCT_upload = multer({ storage: storageConfig });

// Function to insert product into the respective MongoDB collection
const insertProduct = async (Model, productData, res) => {
    const product = new Model(productData);

    try {
        await product.save();
        res.redirect('/product');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

// Headphone POST
router.post('/headphone', PRODUCT_upload.fields([{ name: 'product_image' }]), async (req, res) => {
    const ppicFiles = req.files['product_image'];
    const product_image = ppicFiles ? ppicFiles.map(file => file.filename).join(',') : '';
    await insertProduct(Headphone, { ...req.body, product_image }, res);
});

// Keyboard POST
router.post('/keyboard', PRODUCT_upload.fields([{ name: 'product_image' }]), async (req, res) => {
    const ppicFiles = req.files['product_image'];
    const product_image = ppicFiles ? ppicFiles.map(file => file.filename).join(',') : '';
    await insertProduct(Keyboard, { ...req.body, product_image }, res);
});

// Laptop POST
router.post('/laptop', PRODUCT_upload.fields([{ name: 'product_image' }]), async (req, res) => {
    const ppicFiles = req.files['product_image'];
    const product_image = ppicFiles ? ppicFiles.map(file => file.filename).join(',') : '';
    await insertProduct(Laptop, { ...req.body, product_image }, res);
});

// Mouse POST
router.post('/mouse', PRODUCT_upload.fields([{ name: 'product_image' }]), async (req, res) => {
    const ppicFiles = req.files['product_image'];
    const product_image = ppicFiles ? ppicFiles.map(file => file.filename).join(',') : '';
    await insertProduct(Mouse, { ...req.body, product_image }, res);
});

// Controller POST
router.post('/controller', PRODUCT_upload.fields([{ name: 'product_image' }]), async (req, res) => {
    const ppicFiles = req.files['product_image'];
    const product_image = ppicFiles ? ppicFiles.map(file => file.filename).join(',') : '';
    await insertProduct(Controller, { ...req.body, product_image }, res);
});


const storage_dash = multer.diskStorage({
   destination: function (req, file, cb) {
       cb(null, './public/images/category/productbanner');
   },
   filename: function (req, file, cb) {
       cb(null, Date.now() + "_" + file.originalname);
   }
});

const bnnr_upload = multer({ storage: storage_dash });

// Product Banner POST route
router.post('/product_bann', bnnr_upload.single('product_banner'), async (req, res) => {
   const { product_title, product_category, product_link, banner_id } = req.body;
   const product_banner = req.file ? req.file.filename : ''; // Check if file exists

   // Create a product banner object to insert into MongoDB
   const productBanner = new ProductBanner({
       product_banner,
       product_title,
       product_category,
       product_link,
       banner_id
   });

   try {
       // Insert the product banner into the 'product_banners' collection
       await productBanner.save();
       res.send({ msg: 'ok' }); // Send success response
   } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error'); // Handle errors
   }
});

const storage_cart = multer.diskStorage({
   destination: function (req, file, cb) {
       cb(null, './public/images/category/cart'); // Path to save cart images
   },
   filename: function (req, file, cb) {
       cb(null, Date.now() + "_" + file.originalname); // Add timestamp to the filename
   }
});
const cart_upload = multer({ storage: storage_cart });

// Add item to cart
router.post('/cart', cart_upload.single('cart_img'), async (req, res) => {
   if (req.session.user) {
       const { product_category, product_quantity, cart_pname, cart_pprice } = req.body;
       const user = req.session.user;
       const cart_img = req.file ? req.file.filename : ''; // Get the uploaded cart image filename

       try {
           // Check if the product already exists in the user's cart
           const existingProduct = await Cart.findOne({ product_id: req.body.product_id, user_email: user });

           if (existingProduct) {
               // Update the quantity if the product already exists
               existingProduct.product_quantity = product_quantity; // Update quantity
               await existingProduct.save();
               res.send({ msg: 'Product quantity updated' });
           } else {
               // Insert new product into the cart
               const newProduct = new Cart({
                   product_category,
                   product_quantity,
                   product_id: req.body.product_id,
                   cart_image: cart_img,
                   cart_pname,
                   cart_pprice,
                   user_email: user,
               });
               await newProduct.save();
               res.send({ msg: 'Product added to cart' });
           }
       } catch (err) {
           console.error(err);
           res.status(500).send('Internal Server Error');
       }
   } else {
       res.send({ msg: 'User not logged in' });
   }
});

// Change product quantity in cart
router.post('/quantity_change', async (req, res) => {
   if (req.session.user) {
       const { product_quantity, product_id } = req.body;

       try {
           const updatedProduct = await Cart.findOneAndUpdate(
               { user_email: req.session.user, product_id: product_id },
               { $set: { product_quantity: product_quantity } },
               { new: true } // Return the updated document
           );

           if (updatedProduct) {
               res.send({ msg: 'Product quantity updated successfully' });
           } else {
               res.send({ msg: 'No product found to update' });
           }
       } catch (err) {
           console.error(err);
           res.status(500).send('Internal Server Error');
       }
   } else {
       res.redirect('/login');
   }
});

const productModelMap = {
    headphone: Headphone,
    keyboard: Keyboard,
    laptop: Laptop,
    mouse: Mouse,
    pc: PC,
    // Add other mappings as needed
};

router.post('/edit_product', async (req, res) => {
    
   const { product_id, product_category } = req.body;
   try {
    const ProductModel = productModelMap[product_category];
    const product = await ProductModel.findOne({ product_id: product_id}); // Assuming category is a field in Product model

       if (product) {
           res.send({ product: product });
       } else {
           res.send({ msg: 'Product not found' });
       }
   } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
   }
});

// Multer storage configuration for product images
const storage_product = multer.diskStorage({
   destination: function (req, file, cb) {
       cb(null, './public/images/category/product'); // Path to save product images
   },
   filename: function (req, file, cb) {
       cb(null, Date.now() + "_" + file.originalname); // Add timestamp to the filename
   }
});
const product_upload = multer({ storage: storage_product });

// Update product details
router.post('/pc_update', product_upload.fields([{ name: 'product_image' }]), async (req, res) => {
console.log('✌️pc_update --->', req.body);
    
   const ppicFiles = req.files['product_image'];
   const product_image = ppicFiles ? ppicFiles.map(file => file.filename).join(',') : undefined;

   const { product_category, product_id, product_name, product_dis, product_price, orignal_price } = req.body;

   try {
       const updateData = {
           ...(product_image && { product_image: product_image }),
           product_name,
           product_dis,
           product_price,
           orignal_price
       };
       const ProductModel = productModelMap[product_category];
       const result = await ProductModel.updateOne(
           { product_id: product_id}, // Assuming category is used in the update query
           { $set: updateData }
       );

       if (result.modifiedCount > 0) {
           res.redirect('/product');
       } else {
           res.status(404).send('Product not found');
       }
   } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
   }
});

 


// Delete a product
router.post('/delete_pro', async (req, res) => {
    const { product_id, product_category } = req.body;
    console.log(req.body);

    try {
        // Retrieve the correct model based on product_category
        const ProductModel = productModelMap[product_category];

        if (!ProductModel) {
            return res.status(400).send('Invalid product category');
        }

        const result = await ProductModel.deleteOne({ product_id: product_id });

        if (result.deletedCount > 0) {
            res.send({ product: 'deleted' });
        } else {
            res.status(404).send('Product not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Show product details
router.post('/show_product', async (req, res) => {
   const { product_id, product_category } = req.body;

   try {
    const ProductModel = productModelMap[product_category];
       const product = await ProductModel.findOne({ product_id: product_id }); // Assuming category is a field in Product model

       if (product) {
           res.json({ product });
       } else {
           res.status(404).send('Product not found');
       }
   } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
   }
});

// Edit banner details
router.post('/banner_edit', async (req, res) => {
   const { banner_id } = req.body;

   try {
       const banner = await Banner.findOne({ banner_id: banner_id }); // Assuming banner_id is a field in Banner model

       if (banner) {
           res.json({ banner });
       } else {
           res.status(404).send('Banner not found');
       }
   } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
   }
});

// Multer storage configuration for banner images
const storage_banner = multer.diskStorage({
   destination: function (req, file, cb) {
       cb(null, 'public/images/banner'); // Path to save banner images
   },
   filename: function (req, file, cb) {
       cb(null, Date.now() + "_" + file.originalname); // Add timestamp to the filename
   }
});
const bnr_upload = multer({ storage: storage_banner });

// Update banner details
router.post('/banner_update', bnr_upload.single('main_banner'), async (req, res) => {
console.log('✌️banner_update --->', req.body);
   const main_banner = req.file.filename;
   const { banner_id, banner_title, banner_dis, banner_link } = req.body;

   try {
       const updateData = {
           main_banner,
           banner_title,
           banner_dis,
           banner_link
       };

       const result = await Banner.updateOne(
           { banner_id: banner_id },
           { $set: updateData }
       );

       if (result.modifiedCount > 0) {
           res.json({ msg: 'ok' });
       } else {
           res.status(404).send('Banner not found or no changes made');
       }
   } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
   }
});

// Delete banner
router.post('/delete_banner', async (req, res) => {
   const { banner_id } = req.body;

   try {
       const result = await Banner.deleteOne({ banner_id: banner_id });

       if (result.deletedCount > 0) {
           res.send({ msg: 'ok' });
       } else {
           res.status(404).send('Banner not found');
       }
   } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
   }
});

// Edit product banner details
router.post('/edit_banner', async (req, res) => {
   const { product_id } = req.body;

   try {
       const results = await ProductBanner.findOne({ banner_id: product_id }); // Assuming banner_id is a field in ProductBanner model

       if (results) {
           res.send({ product: results });
       } else {
           res.status(404).send('Banner not found');
       }
   } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
   }
});

// Storage configuration for product banner images
const storage_product_banner = multer.diskStorage({
   destination: function (req, file, cb) {
       cb(null, 'public/images/category/productbanner'); // Path to save product banner images
   },
   filename: function (req, file, cb) {
       cb(null, Date.now() + "_" + file.originalname); // Add timestamp to the filename
   }
});
const bnnr_product_upload = multer({ storage: storage_product_banner });

// Update product banner details
router.post('/update_bnnn', bnnr_product_upload.single('product_banner'), async (req, res) => {
   const product_banner = req.file.filename;
   const { product_title, product_category, product_link, banner_id } = req.body;

   try {
       const result = await ProductBanner.updateOne(
           { banner_id: banner_id },
           { $set: { product_banner, product_title, product_category, product_link } }
       );

       if (result.modifiedCount > 0) {
           res.send({ msg: 'ok' });
       } else {
           res.status(404).send('Banner not found or no changes made');
       }
   } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
   }
});

 // Delete a product banner
 router.post('/delete_pbanner', async (req, res) => {
    const { banner_id } = req.body;

    try {
        const result = await ProductBanner.deleteOne({ _id: banner_id });

        if (result.deletedCount > 0) {
            res.send({ msg: 'Banner deleted successfully' });
        } else {
            res.status(404).send({ msg: 'Banner not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: 'Internal Server Error' });
    }
});
// Edit carousel details
router.post('/edit_carausal', async (req, res) => {
    const { carausal_id } = req.body;

    try {
        const result = await CarausalBanner.findOne({ _id: carausal_id });

        if (result) {
            res.send({ product: result });
        } else {
            res.status(404).send({ msg: 'Carousel not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: 'Internal Server Error' });
    }
});

// Storage configuration for carousel images
const storagess = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/category/carousel');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    }
});
const carouselImageUpload = multer({ storagess });

// Update carousel details
router.post('/update_carausal', carouselImageUpload.single('carausal_image'), async (req, res) => {
    const carausal_image = req.file.filename;
    const { carausal_title, carausal_category, carausal_dis, carausal_link, carausal_id } = req.body;

    try {
        const result = await CarausalBanner.updateOne(
            { _id: carausal_id },
            { $set: { carausal_image, carausal_title, carausal_category, carausal_dis, carausal_link } }
        );

        if (result.modifiedCount > 0) {
            res.send({ msg: 'Carousel updated successfully' });
        } else {
            res.status(404).send({ msg: 'Carousel not found or no changes made' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: 'Internal Server Error' });
    }
});

// Delete a carousel
router.post('/delete_carausal', async (req, res) => {
console.log('✌️delete_carausal --->', req.body);
    const { carausal_id } = req.body;

    try {
        const result = await CarausalBanner.deleteOne({ carausal_id: carausal_id });

        if (result.deletedCount > 0) {
            res.send({ msg: 'Carousel deleted successfully' });
        } else {
            res.status(404).send({ msg: 'Carousel not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: 'Internal Server Error' });
    }
});

// Delete an item from the cart
router.post('/delete_cart', async (req, res) => {
    if (req.session.user) {
        const { product_id } = req.body;

        try {
            const result = await Cart.deleteOne({
                product_id: product_id,
                user_email: req.session.user
            });

            if (result.deletedCount > 0) {
                res.send({ msg: 'Product removed from cart' });
            } else {
                res.status(404).send({ msg: 'Product not found in cart' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send({ msg: 'Internal Server Error' });
        }
    } else {
        res.redirect('/login');
    }
});

const storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/category/pro_category'); // Removed leading slash
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    }
});
const upload_category = multer({ storage: storage1 });

router.post('/category', upload_category.fields([{ name: 'product_image' }, { name: 'sub_product_image' }]), async (req, res) => {
    try {
        const product_image = req.files['product_image'][0].filename;
        const sub_product_image = req.files['sub_product_image'][0].filename;
        const { product_category, product_name } = req.body;

        // Create a new category document
        const newCategory = new Category({
            product_category,
            product_image,
            product_name,
            sub_product_image
        });

        // Save the category to the database
        await newCategory.save();
        res.redirect('/category');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/category/:id', async (req, res) => {
    const { product_category, product_name } = req.body;

    try {
        const categoryId = req.params.id;
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { product_category, product_name },
            { new: true } // Return the updated document
        );

        if (updatedCategory) {
            res.status(200).json({ msg: 'Category updated successfully', category: updatedCategory });
        } else {
            res.status(404).json({ msg: 'Category not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});

// Delete a category
router.delete('/category/:id', async (req, res) => {
    const categoryId = req.params.id;

    try {
        const result = await Category.findByIdAndDelete(categoryId);

        if (result) {
            res.status(200).json({ msg: 'Category deleted successfully' });
        } else {
            res.status(404).json({ msg: 'Category not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});

// Example API route for fetching banner details
router.post('/new_banner_url', async (req, res) => {
    const { banner_id } = req.body;

    try {
        // Fetch the banner from the database using the banner_id
        const banner = await Banner.findOne({ banner_id: banner_id });
        
        if (banner) {
            res.status(200).json({ banner });
        } else {
            res.status(404).json({ message: 'Banner not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

const storag = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, 'public/images/category/carousel')  // Ensure this path exists
    },
    filename: function (req, file, cb) {
       cb(null, Date.now() + "_" + file.originalname)
    }
 });
 
 const dash_banner = multer({ storage: storag });
 
 router.post('/carausal_banner', dash_banner.single('carausal_image'), async (req, res) => {
     try {
        console.log('✌️carausal_banner --->', req.body);
       // Retrieve uploaded file and form data
       const carausal_image = req.file.filename;
       const { carausal_title, carausal_category, carausal_dis, carausal_link, carausal_id } = req.body;
 
       // Create new document for MongoDB
       const newCarausalBanner = new CarausalBanner({
          carausal_image,
          carausal_title,
          carausal_category,
          carausal_dis,
          carausal_link,
          carausal_id
       });
 
       // Save to MongoDB
       await newCarausalBanner.save();
 
       // Respond with success
       res.send({ msg: 'ok' });
    } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
    }
 });

module.exports=router
