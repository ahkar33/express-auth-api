import * as dotenv from 'dotenv'
import User from '../schemas/userSchema.js'
import bcrypt from 'bcrypt'
import validator from 'validator'
import jwt from 'jsonwebtoken'

dotenv.config();

const saltRounds = parseInt("10");

export const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ message: 'Both Email and Password are required.' });
	}
	const user = await User.findOne({ email: email });
	if(user == null) {
		return res.status(401).json({ message: 'Email or Password incorrect' });
	}
	const isPasswordMatch = bcrypt.compareSync(password, user.password);
	if (!isPasswordMatch) {
		return res.status(401).json({ message: 'Email or Password incorrect' });
	}
	const accessToken = jwt.sign(
		{ id: user.id, email: user.email },
		"234kjf(*)ui234r-09i<.,jfo;.2j3ljrlej02934o0wdhjlaosdjf[q2039845uodfja;lkdjf",
		{ expiresIn: '3d' }
	);
	return res.status(200).json({ user: { id: user.id, email: user.email }, accessToken: accessToken });
}

export const register = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ message: 'Both Email and Password are required.' });
	}
	if (!validator.isEmail(email)) {
		return res.status(400).json({ message: 'Invalid Email.' });
	}
	const isUserExist = await User.findOne({ email: email });
	if (isUserExist) {
		return res.status(400).json({ message: 'User already Exists' });
	}
	if (!validator.isStrongPassword(password)) {
		return res.status(400).json({ message: 'Password not strong enough.' });
	}
	const hashPassword = bcrypt.hashSync(password, saltRounds);
	const user = new User({
		email: email,
		password: hashPassword
	});
	try {
		await user.save();
	}
	catch (err) {
		return res.status(500).json({ error: err.message });
	}
	res.status(201).json({ message: 'Registered Successfully' });
}