const db = require('../config/firebase');

class NGO {
  constructor(data) {
    this.name = data.name;
    this.description = data.description;
    this.accountNumber = data.accountNumber;
    this.bankName = data.bankName || '';
    this.accountName = data.accountName || '';
    this.website = data.website || '';
    this.contactEmail = data.contactEmail || '';
    this.imageUrl = data.imageUrl || '';
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    this.isVerified = data.isVerified || false; // Added verification status
  }

  // Create a new NGO document
  static async create(ngoData) {
    const ngoRef = db.collection('ngos').doc();
    const ngoInstance = new NGO(ngoData);
    await ngoRef.set(ngoInstance.toJSON());
    return { id: ngoRef.id, ...ngoData };
  }

  // Get all NGOs
  static async getAll() {
    const snapshot = await db.collection('ngos').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Get a specific NGO by ID
  static async getById(id) {
    const doc = await db.collection('ngos').doc(id).get();
    if (!doc.exists) {
      throw new Error('NGO not found');
    }
    return { id: doc.id, ...doc.data() };
  }

  // Update an NGO
  static async update(id, updateData) {
    const docRef = db.collection('ngos').doc(id);
    await docRef.update({
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  }

  // Delete an NGO
  static async delete(id) {
    await db.collection('ngos').doc(id).delete();
    return { id, message: 'NGO deleted successfully' };
  }

  // Convert instance to JSON (for Firestore)
  toJSON() {
    return {
      name: this.name,
      description: this.description,
      accountNumber: this.accountNumber,
      bankName: this.bankName,
      accountName: this.accountName,
      website: this.website,
      contactEmail: this.contactEmail,
      imageUrl: this.imageUrl,
      createdBy: this.createdBy,
      isVerified: this.isVerified,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = NGO;