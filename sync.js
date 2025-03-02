import Product from './models/Product.js';
import User from './models/User.js';

(async () => {
  try {
    await User.sync({ alter: true });
    // await Product.sync({ alter: true });
    // console.log('Product table synced successfully');
    console.log('User table synced successfully');
  } catch (error) {
    console.error('Error syncing User table:', error);
  }
})();
