import * as authService from "../services/auth.service.js";
import { validationResult } from "express-validator";

export const register = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success:false, errors: errors.array() });
        }

        const { nombre, direccion, medidor, ...rest } = req.body;
        const payload = {
            name: nombre || rest.name,
            address: direccion || rest.address,
            water_meter: medidor || rest.water_meter,
            email: rest.email,
            password: rest.password
        };
        const userId = await authService.register(payload);
        res.status(201).json({ success: true, userId });

    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success:false, errors: errors.array() });
        }

        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            success: true,
            accessToken: result.accessToken,
            user: result.user
        });

    } catch (error) {
        next(error);
    }
};
export const refresh = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        const result = await authService.refresh(token);
        res.json({
            success: true,
            accessToken: result.accessToken,
            user: result.user
        });
    } catch (error) {
        next(error);
    }
};
export const logout = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        await authService.logout(token);
        res.clearCookie("refreshToken");
        res.json({ success: true, message: "Sesión cerrada" });
    } catch (error) {
        next(error);
    }
};
export const logoutAll = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await authService.logoutAll(userId);
        res.json({ success: true, message: "Todas las sesiones cerradas" });
    } catch (error) {
        next(error);
    }
};

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        
        const result = await authService.forgotPassword(email);
    
        const tokenToSend = result ? result.token : null;

        res.json({
            success: true,
            message: "Si el correo existe, se enviaron instrucciones",
        
            token: tokenToSend 
        });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        await authService.resetPassword(token, newPassword);

        res.json({
            success: true,
            message: "Contraseña actualizada correctamente"
        });
    } catch (error) {
        next(error);
    }
};
