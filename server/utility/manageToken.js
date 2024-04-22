import JWT from 'jsonwebtoken';

export const generateToken = (id, expiresIn) => {
  // Conditional assignment for expiresIn
  const options = expiresIn ? { expiresIn } : {};

  return JWT.sign({ id }, process.env.JWT_SECRET, options);
};

export const verifyToken = (token) => {
  return JWT.verify(token, process.env.JWT_SECRET);
};
