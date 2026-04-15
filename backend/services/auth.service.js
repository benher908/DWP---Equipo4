import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import * as authModel from "../models/user.model.js";
import * as passwordResetTokenModel from "../models/passwordResetToken.model.js";

export const register = async (data) => {
    const { name, email, address, water_meter, password } = data;

    if (!name || !email || !address || !water_meter || !password) {
        throw new ApiError(400, "Todos los campos son obligatorios");
    }
    const existingEmail = await authModel.findByEmail(email);
    if (existingEmail) {
        throw new ApiError(400, "El correo ya esta registrado");
    }
    const existingMeter = await authModel.findByWaterMeter(water_meter);
    if (existingMeter) {
        throw new ApiError(400, "El medidor ya esta registrado");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await authModel.createUser({
        name,
        email,
        address,
        water_meter,
        password: hashedPassword,
        role: "user"
    });

    return userId;
};

export const login = async (email, password) => {
    const user = await authModel.findByEmail(email);
    if (!user) throw new ApiError(401, "Credenciales invalidas");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ApiError(401, "Credenciales invalidas");
    if (!user.is_active || user.status === "banned") {
        throw new ApiError(403, "Usuario deshabilitado");
    }

    const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.ACCESS_EXPIRES }
    );

    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.REFRESH_EXPIRES }
    );

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await authModel.saveRefreshToken(user.id, refreshToken, expiresAt);

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            role: user.role
        }
    };
};

export const refresh = async (refreshToken) => {
    if (!refreshToken) throw new ApiError(401, "Token requerido");

    const storedToken = await authModel.findRefreshToken(refreshToken);
    if (!storedToken) throw new ApiError(403, "Token no registrado");

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
        throw new ApiError(403, "Token invalido");
    }

    const user = await authModel.findById(decoded.id);
    if (!user || !user.is_active || user.status === "banned") {
        throw new ApiError(403, "Usuario deshabilitado");
    }

    const accessToken = jwt.sign(
        { id: decoded.id, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.ACCESS_EXPIRES }
    );

    return {
        accessToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
        }
    };
};

export const logout = async (token) => {
    if (!token) throw new ApiError(400, "Token requerido");
    await authModel.deleteRefreshToken(token);
};

export const logoutAll = async (userId) => {
    await authModel.deleteAllUserTokens(userId);
};

const PASSWORD_RESET_TOKEN_TTL_MINUTES = process.env.PASSWORD_RESET_TOKEN_TTL || 15;
const buildPasswordResetToken = () => crypto.randomBytes(32).toString("hex");
const hashPasswordResetToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");

export const forgotPassword = async (email) => {
    if (!email) {
        throw new ApiError(400, "El correo es obligatorio");
    }

    const user = await authModel.findByEmail(email);
    if (!user) {
        return null;
    }

    await passwordResetTokenModel.deleteExpiredPasswordResetTokens();
    await passwordResetTokenModel.deletePasswordResetTokensByUserId(user.id);

    const token = buildPasswordResetToken();
    const tokenHash = hashPasswordResetToken(token);
    const expiresAt = new Date(
        Date.now() + PASSWORD_RESET_TOKEN_TTL_MINUTES * 60 * 1000
    );

    await passwordResetTokenModel.savePasswordResetToken(user.id, tokenHash, expiresAt);

    return {
        token,
        expiresAt
    };
};

export const resetPassword = async (token, newPassword) => {
    if (!token || !newPassword) {
        throw new ApiError(400, "Token y nueva contrasena son obligatorios");
    }

    if (newPassword.length < 8) {
        throw new ApiError(400, "La contrasena debe tener al menos 8 caracteres");
    }

    await passwordResetTokenModel.deleteExpiredPasswordResetTokens();

    const tokenHash = hashPasswordResetToken(token);
    const storedToken = await passwordResetTokenModel.findValidPasswordResetToken(tokenHash);

    if (!storedToken) {
        throw new ApiError(400, "Token invalido o expirado");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await authModel.updatePasswordById(storedToken.user_id, hashedPassword);
    await passwordResetTokenModel.deletePasswordResetTokensByUserId(storedToken.user_id);

    return true;
};
