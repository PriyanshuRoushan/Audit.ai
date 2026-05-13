export const isValidGmail = (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(); // Let other validators handle missing email
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!(emailRegex.test(email) && email.endsWith("@gmail.com"))) {
    return res.status(400).json({ error: "Only valid Gmail accounts are allowed" });
  }

  next();
};
