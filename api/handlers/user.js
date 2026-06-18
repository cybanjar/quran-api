const UserService = require('../../services/user.service');

class UserHandler {
  static async setLastRead(req, res) {
    try {
      const userId = req.user && req.user.id;
      if (!userId) return res.status(401).send({ code: 401, status: 'Unauthorized.', message: 'Missing user' });
      const { surahId, ayat } = req.body;
      const result = await UserService.setLastRead(userId, { surahId, ayat });
      return res.status(200).send({ code: 200, status: 'OK.', message: 'Last read saved', data: result });
    } catch (e) {
      return res.status(e.status || 500).send({ code: e.status || 500, status: 'Error.', message: e.message });
    }
  }

  static async getLastRead(req, res) {
    try {
      const userId = req.user && req.user.id;
      if (!userId) return res.status(401).send({ code: 401, status: 'Unauthorized.', message: 'Missing user' });
      const data = await UserService.getLastRead(userId);
      return res.status(200).send({ code: 200, status: 'OK.', message: 'Last read', data });
    } catch (e) {
      return res.status(e.status || 500).send({ code: e.status || 500, status: 'Error.', message: e.message });
    }
  }

  static async saveAyat(req, res) {
    try {
      const userId = req.user && req.user.id;
      if (!userId) return res.status(401).send({ code: 401, status: 'Unauthorized.', message: 'Missing user' });
      const { surahId, ayat, surahName, arab, translation } = req.body;
      const saved = await UserService.saveAyat(userId, { surahId, ayat, surahName, arab, translation });
      return res.status(201).send({ code: 201, status: 'Created.', message: 'Saved ayat', data: saved });
    } catch (e) {
      return res.status(e.status || 500).send({ code: e.status || 500, status: 'Error.', message: e.message });
    }
  }

  static async listSavedAyats(req, res) {
    try {
      const userId = req.user && req.user.id;
      if (!userId) return res.status(401).send({ code: 401, status: 'Unauthorized.', message: 'Missing user' });
      const list = await UserService.listSavedAyats(userId);
      return res.status(200).send({ code: 200, status: 'OK.', message: 'Saved ayats', data: list });
    } catch (e) {
      return res.status(e.status || 500).send({ code: e.status || 500, status: 'Error.', message: e.message });
    }
  }

  static async removeSavedAyat(req, res) {
    try {
      const userId = req.user && req.user.id;
      if (!userId) return res.status(401).send({ code: 401, status: 'Unauthorized.', message: 'Missing user' });
      const { surahId, ayat } = req.body;
      await UserService.removeSavedAyat(userId, surahId, ayat);
      return res.status(200).send({ code: 200, status: 'OK.', message: 'Removed' });
    } catch (e) {
      return res.status(e.status || 500).send({ code: e.status || 500, status: 'Error.', message: e.message });
    }
  }

  static async getProfile(req, res) {
    try {
      const userId = req.user && req.user.id;
      if (!userId) return res.status(401).send({ code: 401, status: 'Unauthorized.', message: 'Missing user' });
      const profile = await UserService.getProfile(userId);
      return res.status(200).send({ code: 200, status: 'OK.', message: 'Profile', data: profile });
    } catch (e) {
      return res.status(e.status || 500).send({ code: e.status || 500, status: 'Error.', message: e.message });
    }
  }
}

module.exports = UserHandler;
