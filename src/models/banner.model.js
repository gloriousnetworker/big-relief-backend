const db = require('../config/firebase');

class Banner {
  constructor(data) {
    this.imageUrl = data.imageUrl;
    this.title = data.title || '';
    this.description = data.description || '';
    this.active = data.active !== undefined ? data.active : true;
    this.createdBy = data.createdBy;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static async create(bannerData) {
    const bannerRef = db.collection('banners').doc();
    const bannerInstance = new Banner(bannerData);
    await bannerRef.set(bannerInstance.toJSON());
    return { id: bannerRef.id, ...bannerData };
  }

  static async getAll() {
    const snapshot = await db.collection('banners').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getActive() {
    const snapshot = await db.collection('banners')
      .where('active', '==', true)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getById(id) {
    const doc = await db.collection('banners').doc(id).get();
    if (!doc.exists) {
      throw new Error('Banner not found');
    }
    return { id: doc.id, ...doc.data() };
  }

  static async update(id, updateData) {
    const docRef = db.collection('banners').doc(id);
    await docRef.update({
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  }

  static async delete(id) {
    await db.collection('banners').doc(id).delete();
    return { id, message: 'Banner deleted successfully' };
  }

  toJSON() {
    return {
      imageUrl: this.imageUrl,
      title: this.title,
      description: this.description,
      active: this.active,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Banner;