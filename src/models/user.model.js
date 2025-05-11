const db = require('../config/firebase');
const { hashPassword } = require('../utils/passwordUtils');

class User {
  constructor(data) {
    this.email = data.email;
    this.password = data.password;
    this.name = data.name || '';
    this.role = data.role || 'user';
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static async create(userData) {
    const { email, password } = userData;
    
    // Check if user already exists
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    const userRef = db.collection('users').doc();
    
    await userRef.set({
      ...new User({ ...userData, password: hashedPassword }).toJSON()
    });
    
    return { id: userRef.id, email, name: userData.name };
  }

  static async findByEmail(email) {
    const snapshot = await db.collection('users').where('email', '==', email).limit(1).get();
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  static async findById(id) {
    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
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

module.exports = User;