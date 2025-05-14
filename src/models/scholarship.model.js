const db = require('../config/firebase');

class Scholarship {
  constructor(data) {
    this.title = data.title;
    this.description = data.description;
    this.ngoId = data.ngoId;
    this.deadline = data.deadline || '';
    this.eligibility = data.eligibility || '';
    this.applicationUrl = data.applicationUrl || '';
    this.amount = data.amount || '';
    this.imageUrl = data.imageUrl || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static async create(scholarshipData) {
    const scholarshipRef = db.collection('scholarships').doc();
    const scholarshipInstance = new Scholarship(scholarshipData);
    await scholarshipRef.set(scholarshipInstance.toJSON());
    return { id: scholarshipRef.id, ...scholarshipData };
  }

  static async getAll() {
    const snapshot = await db.collection('scholarships').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getByNgoId(ngoId) {
    const snapshot = await db.collection('scholarships')
      .where('ngoId', '==', ngoId)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getById(id) {
    const doc = await db.collection('scholarships').doc(id).get();
    if (!doc.exists) {
      throw new Error('Scholarship not found');
    }
    return { id: doc.id, ...doc.data() };
  }

  static async update(id, updateData) {
    const docRef = db.collection('scholarships').doc(id);
    await docRef.update({
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  }

  static async delete(id) {
    await db.collection('scholarships').doc(id).delete();
    return { id, message: 'Scholarship deleted successfully' };
  }

  toJSON() {
    return {
      title: this.title,
      description: this.description,
      ngoId: this.ngoId,
      deadline: this.deadline,
      eligibility: this.eligibility,
      applicationUrl: this.applicationUrl,
      amount: this.amount,
      imageUrl: this.imageUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Scholarship;