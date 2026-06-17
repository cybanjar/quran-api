const AuthService = require('../../services/auth.service');

class AuthHandler {
  static async register(req, res) {
    console.log('Register request:', { body: req.body });
    try {
      const { name, email, password } = req.body;
      const user = await AuthService.register({ name, email, password });
      // send verification email
      const token = AuthService.generateVerification(email);
      const verifyUrl = `${req.protocol}://${req.get('host')}/verify-email?token=${token}`;
      AuthService.sendEmail({ to: email, subject: 'Verify your email', text: `Click to verify: ${verifyUrl}` });

      return res.status(201).send({ code: 201, status: 'Created.', message: 'User registered. Verification email sent.', data: { id: user.id, email: user.email } });
    } catch (e) {
      return res.status(e.status || 500).send({ code: e.status || 500, status: 'Error.', message: e.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const payload = await AuthService.authenticate({ email, password });
      return res.status(200).send({ code: 200, status: 'OK.', message: 'Authenticated', data: payload });
    } catch (e) {
      return res.status(e.status || 500).send({ code: e.status || 500, status: 'Error.', message: e.message });
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const token = AuthService.generateResetToken(email);
      if (!token) return res.status(200).send({ code: 200, status: 'OK.', message: 'If the email exists, a reset link has been sent.' });
      const url = `${req.protocol}://${req.get('host')}/reset-password?token=${token}`;
      await AuthService.sendEmail({ to: email, subject: 'Password reset', text: `Reset your password: ${url}` });
      return res.status(200).send({ code: 200, status: 'OK.', message: 'If the email exists, a reset link has been sent.' });
    } catch (e) {
      return res.status(e.status || 500).send({ code: e.status || 500, status: 'Error.', message: e.message });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      await AuthService.resetPassword(token, password);
      return res.status(200).send({ code: 200, status: 'OK.', message: 'Password has been reset.' });
    } catch (e) {
      return res.status(e.status || 500).send({ code: e.status || 500, status: 'Error.', message: e.message });
    }
  }

  static async verifyEmail(req, res) {
    try {
      const { token } = req.query;
      await AuthService.verifyEmail(token);
      return res.status(200).send({ code: 200, status: 'OK.', message: 'Email verified.' });
    } catch (e) {
      return res.status(e.status || 500).send({ code: e.status || 500, status: 'Error.', message: e.message });
    }
  }

  static async resendVerification(req, res) {
    try {
      const { email } = req.body;
      const token = AuthService.generateVerification(email);
      if (!token) return res.status(404).send({ code: 404, status: 'Not Found.', message: 'Email not found.' });
      const verifyUrl = `${req.protocol}://${req.get('host')}/verify-email?token=${token}`;
      await AuthService.sendEmail({ to: email, subject: 'Verify your email', text: `Click to verify: ${verifyUrl}` });
      return res.status(200).send({ code: 200, status: 'OK.', message: 'Verification email sent.' });
    } catch (e) {
      return res.status(e.status || 500).send({ code: e.status || 500, status: 'Error.', message: e.message });
    }
  }

  static logout(req, res) {
    // Stateless JWT: client should discard token. Reply OK.
    return res.status(200).send({ code: 200, status: 'OK.', message: 'Logged out.' });
  }
}

module.exports = AuthHandler;
