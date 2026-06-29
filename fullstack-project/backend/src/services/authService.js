const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (data) => {
  if (!data.email && !data.phone) {
    throw new Error("Email or phone number is required");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        data.email ? { email: data.email } : undefined,
        data.phone ? { phone: data.phone } : undefined,
      ].filter(Boolean),
    },
  });

  if (existingUser) {
    throw new Error("User with this email or phone already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      password: hashedPassword,
    },
  });
};

const loginUser = async (data) => {
  if (!data.email && !data.phone) {
    throw new Error("Email or phone number is required");
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        data.email ? { email: data.email } : undefined,
        data.phone ? { phone: data.phone } : undefined,
      ].filter(Boolean),
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, phone: user.phone, role: user.role },
    process.env.JWT_SECRET || "mysecretkey",
    { expiresIn: "1d" }
  );

  return {
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    token,
  };
};

module.exports = {
  registerUser,
  loginUser,
};