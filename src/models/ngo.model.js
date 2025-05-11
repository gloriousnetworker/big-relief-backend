const db = require('../config/firebase');

class NGO {
  constructor(data) {
    this.name = data.name;
    this.description = data.description;
    this.accountNumber = data.accountNumber;
    this.website = data.website || '';
    this.contactEmail = data.contactEmail || '';
    this.imageUrl = data.imageUrl || ''; // This can be a URL to an externally hosted image
    this.createdAt = new Date().toISOString();
  }

  static async create(ngoData) {
    const ngoRef = db.collection('ngos').doc();
    await ngoRef.set(new NGO(ngoData).toJSON());
    return { id: ngoRef.id, ...ngoData };
  }

  static async getAll() {
    const snapshot = await db.collection('ngos').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getById(id) {
    const doc = await db.collection('ngos').doc(id).get();
    if (!doc.exists) {
      throw new Error('NGO not found');
    }
    return { id: doc.id, ...doc.data() };
  }

  toJSON() {
    return {
      name: this.name,
      description: this.description,
      accountNumber: this.accountNumber,
      website: this.website,
      contactEmail: this.contactEmail,
      imageUrl: this.imageUrl,
      createdAt: this.createdAt
    };
  }
}

module.exports = NGO;