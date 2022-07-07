const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

const User = require('../models/userModel');
const Review = require('../models/reviewModel');

/*
  @api:       POST /api/users/login/
  @desc:      user login
  @access:    public
*/
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      if (user.isVerified) {
        bcrypt.compare(password, user.password, function (err, result) {
          if (err) {
            const error = createError(401, 'Login Failed');
            next(error);
          } else {
            if (result) {
              res.status(200).json({
                message: 'Login successful',
                user: {
                  email,
                  id: user.id,
                  token: generateToken(user.id),
                },
              });
            } else {
              const error = createError(401, 'Password does not match');
              next(error);
            }
          }
        });
      } else {
        const error = createError(401, 'Email is not verified');
        next(error);
      }
    } else {
      const error = createError(404, 'User not found');
      next(error);
    }
  } catch (err) {
    const error = createError(500, 'Unknown Error');
    next(error);
  }
};

/*
  @api:       POST /api/users/register/
  @desc:      signup for new user
  @access:    public
*/
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }

    const { firstName, lastName, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (!userExists) {
      const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: encriptPassword(password),
        isVerfied: false,
      });

      const response = sendmail(
        newUser.email,
        `http://localhost:3000/email_verification/user/${newUser._id}`
      );
      res.status(200).json({
        message: 'User creation successful',
        user: {
          firstName,
          lastName,
          email,
        },
      });
    } else {
      const error = createError(400, 'User already exists');
      next(error);
    }
  } catch (err) {
    const error = createError(400, 'User creation failed');
    next(error);
  }
};

/*
  @api:       GET /api/users/profile/:id
  @desc:      get user profile of a specific user
  @access:    private
*/
const verifyEmail = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.updateOne({ _id: userId }, { isVerified: true });

    if (user.modifiedCount === 1) {
      res.status(200).json({ success: user.acknowledged });
    } else {
      const error = createError(400, 'Email verification failed');
      next(error);
    }
  } catch (err) {
    const error = createError(400, 'Email verification failed');
    next(error);
  }
};

/*
  @api:       GET /api/users/profile/:id
  @desc:      get user profile of a specific user
  @access:    private
*/
const getUserProfileById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ id: userId })
      .select('-password -__v')
      .populate({
        path: 'reviews',
        select: '-user',
        populate: {
          path: 'product',
          select: 'name price',
        },
      })
      .exec();
    res.status(200).json({ user });
  } catch (err) {
    const error = createError(404, 'User not found');
    next(error);
  }
};

/*
  @api:       PUT /api/users/profile/
  @desc:      update user profile of a specific user
  @access:    private
*/
const updateUserProfile = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const userId = req.params.id;

    const userUpdate = await User.findOneAndUpdate(
      { id: userId },
      { name, password: encriptPassword(password) },
      { new: true }
    ).select('-password -__v');

    res.status(201).json({ userUpdate });
  } catch (err) {
    const error = createError(404, 'User not found');
    next(error);
  }
};

// Helper Functions //

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const encriptPassword = (password) => {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
};

const sendmail = async (mailTo, verificationLink) => {
  const mailBody = `<html><body><h1>Email verification</h1><p>Click on the below link to verify your email address</p><p><a href=${verificationLink} target="_blank">Verify email</a></p></body></html>`;

  const transporter = nodemailer.createTransport(
    smtpTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    })
  );

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: mailTo,
    subject: 'Monmart - Email verification',
    html: mailBody,
  };
  try {
    const response = await transporter.sendMail(mailOptions);
    return response;
  } catch (err) {
    return err;
  }
};

// Exports //

module.exports = {
  login,
  register,
  getUserProfileById,
  updateUserProfile,
  verifyEmail,
};
