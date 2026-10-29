import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import Token from '../model/token.js'
import User from '../model/user.js';

dotenv.config();

export const singupUser = async (request, response) => {
    try {
        const { username, name, password } = request.body;

        if (!username || !name || !password) {
            return response.status(400).json({ msg: 'All fields are required' });
        }

        if (password.length < 6) {
            return response.status(400).json({ msg: 'Password must be at least 6 characters' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return response.status(400).json({ msg: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = { username: username.trim(), name: name.trim(), password: hashedPassword }

        const newUser = new User(user);
        await newUser.save();

        return response.status(200).json({ msg: 'Signup successfull' });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ msg: 'Error while signing up user' });
    }
}


export const loginUser = async (request, response) => {
    try {
        const { username, password } = request.body;

        if (!username || !password) {
            return response.status(400).json({ msg: 'Username and password are required' });
        }

        let user = await User.findOne({ username });
        if (!user) {
            return response.status(400).json({ msg: 'Username or password does not match' });
        }

        let match = await bcrypt.compare(password, user.password);
        if (match) {
            const accessToken = jwt.sign({ username: user.username, name: user.name }, process.env.ACCESS_SECRET_KEY, { expiresIn: '15m'});
            const refreshToken = jwt.sign({ username: user.username, name: user.name }, process.env.REFRESH_SECRET_KEY);
            
            const newToken = new Token({ token: refreshToken });
            await newToken.save();
        
            response.status(200).json({ accessToken: accessToken, refreshToken: refreshToken, name: user.name, username: user.username });
        
        } else {
            response.status(400).json({ msg: 'Username or password does not match' })
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({ msg: 'error while login the user' })
    }
}

export const logoutUser = async (request, response) => {
    try {
        const token = (request.body.token || '').replace(/^Bearer\s+/, '').replace(/^refreshToken\s*[:=]\s*/i, '').trim();
        if (token) {
            await Token.deleteOne({ token: token });
        }
        return response.status(204).send();
    } catch (error) {
        console.error(error);
        return response.status(500).json({ msg: 'Error while logging out' });
    }
}