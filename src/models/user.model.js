const db = require('../config/firebase');
const { hashPassword } = require('../utils/passwordUtils');

class User {
  constructor(data) {
    this.email = data.email;
    this.password = data.password;
    this.name = data.name || '';
    this.role = data.role || 'user';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
  
  static async create(userData) {
    const { email, password } = userData;
    // Prevent duplicate users
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    // Hash password
    const hashedPassword = await hashPassword(password);
    const userRef = db.collection('users').doc();
    // Save user data (including hashed password)
    await userRef.set({
      ...new User({ ...userData, password: hashedPassword }).toJSON(),
      password: hashedPassword
    });
    return { id: userRef.id, email, name: userData.name };
  }
  
  static async findByEmail(email) {
    const snapshot = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }
  
  static async findById(id) {
    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }
  
  static async getAll() {
    const snapshot = await db.collection('users').get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      const { password, ...userWithoutPassword } = data;
      return { id: doc.id, ...userWithoutPassword };
    });
  }
 
  static async updateRole(id, newRole) {
    const docRef = db.collection('users').doc(id);
    await docRef.update({
      role: newRole,
      updatedAt: new Date().toISOString()
    });
    const updatedDoc = await docRef.get();
    const data = updatedDoc.data();
    const { password, ...userWithoutPassword } = data;
    return { id: updatedDoc.id, ...userWithoutPassword };
  }
  
  static async update(id, updateData) {
    const docRef = db.collection('users').doc(id);
    await docRef.update({
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    const updatedDoc = await docRef.get();
    const data = updatedDoc.data();
    const { password, ...userWithoutPassword } = data;
    return { id: updatedDoc.id, ...userWithoutPassword };
  }
  
  static async delete(id) {
    await db.collection('users').doc(id).delete();
    return { id, message: 'User deleted successfully' };
  }
  
  toJSON() {
    return {
      email: this.email,
      name: this.name,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

// Create default admin user if not exists
(async () => {
  try {
    const adminEmail = 'mabu@bigrelief.com';
    const adminExists = await User.findByEmail(adminEmail);
    if (!adminExists) {
      await User.create({
        email: adminEmail,
        password: 'admin001',
        name: 'Admin User',
        role: 'admin'
      });
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
})();

module.exports = User;