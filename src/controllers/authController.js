const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { generateToken } = require('../utils/jwt');

const prisma = new PrismaClient();

const authController = {
    async register(req, res) {
        try {
            // Validar entrada
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: errors.array()
                });
            }

            const { email, username, password } = req.body;

            // Verificar si el usuario ya existe
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email },
                        { username }
                    ]
                }
            });

            if (existingUser) {
                return res.status(400).json({
                    error: 'User already exists',
                    message: existingUser.email === email
                        ? 'Email already registered'
                        : 'Username already taken'
                });
            }

            // Hashear contraseña
            const hashedPassword = await bcrypt.hash(password, 12);

            // Crear usuario
            const user = await prisma.user.create({
                data: {
                    email,
                    username,
                    password: hashedPassword
                },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    createdAt: true
                }
            });

            // Generar token
            const token = generateToken(user.id);

            res.status(201).json({
                message: 'User created successfully',
                user,
                token
            });

        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                error: 'Registration failed',
                message: 'An error occurred during registration'
            });
        }
    },

    async login(req, res) {
        try {
            // Validar entrada
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: errors.array()
                });
            }

            const { email, password } = req.body;

            // Buscar usuario
            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                return res.status(401).json({
                    error: 'Invalid credentials',
                    message: 'Email or password is incorrect'
                });
            }

            // Verificar contraseña
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({
                    error: 'Invalid credentials',
                    message: 'Email or password is incorrect'
                });
            }

            // Generar token
            const token = generateToken(user.id);

            res.json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username
                },
                token
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                error: 'Login failed',
                message: 'An error occurred during login'
            });
        }
    }
};

module.exports = authController;