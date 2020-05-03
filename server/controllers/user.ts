import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import * as moment from 'moment';
import { NodeMailgun } from 'ts-mailgun';

import User from '../models/user';
import ResetPassword from '../models/resetpassword'
import Token from '../models/token'
import BaseCtrl from './base';

export default class UserCtrl extends BaseCtrl {
  model = User;

  login = (req, res) => {
    this.model.findOne({ email: req.body.email }, (err, user) => {
      if (!user) { return res.sendStatus(403); }
      user.comparePassword(req.body.password, (error, isMatch) => {
        if (!isMatch) { return res.sendStatus(403); }
        const token = jwt.sign({ user: user }, process.env.SECRET_TOKEN); // , { expiresIn: 10 } seconds
        res.status(200).json({ token: token });
      });
    });
  }

  insert = (req, res) => {
    const obj = new this.model(req.body);
    obj.save((err, user) => {
      // 11000 is the code for duplicate key error
      if (err && err.code === 11000) {
        res.sendStatus(400);
      }
      if (err) {
        return console.log(err);
      }
      var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

      // Save the verification token
      token.save(function (err) {
        if (err) { return res.status(500).send({ msg: err.message }); }

        // Send the email
        var mailOptions = {
          from: 'covidfighter@tibyane.com',
          to: user.email,
          subject: 'Account Verification Token',
          text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n'
        };
        var mailgun = new NodeMailgun()
        mailgun.apiKey = process.env.MAILGUN_API_KEY;
        mailgun.domain = process.env.MAILGUN_DOMAIN;
        mailgun.fromEmail = mailOptions.from;
        mailgun.fromTitle = mailOptions.subject;
        mailgun.init();
        mailgun.send(mailOptions.to, mailOptions.subject, mailOptions.text).then((result) => {

          res.status(200).json(user);
          //res.status(200).send('A verification email has been sent to ' + user.email + '.');
          //return res.json({ success: true, message: 'Check your mail to reset your password.', result: result });
        }).catch((error) => {
          console.log(error);
          res.status(500).json({ success: false, message: 'Unable to send confirmation mail.' });
        });

      });

    });
  }
  // Create a verification token for this user

  // Get all
  getAll = (req, res) => {

    //res.status(200).json(req.session);
    if (req.user.role == "admin") {
      this.model.find({}, (err, docs) => {
        if (err) { return console.error(err); }
        res.status(200).json(docs);
      });

    } else {
      return res.sendStatus(403);
    }

  }


  resetPassword = (req, res) => {
    const email = req.body.email
    User.findOne({ email: email },//checking if the email address sent by client is present in the db(valid)
      (error, user) => {
        if (!user) {
          return res.sendStatus(404).json({ success: false, message: 'No user found with that email address.' })
          //return throwFailed(res, 'No user found with that email address.')
        }
        ResetPassword.findOneAndRemove({ userId: user._id }, (error) => {
          //if (resetPassword)
          //  resetPassword.destroy({
          //    where: {
          //      id: resetPassword.id
          //    }
          var token = crypto.randomBytes(32).toString('hex')//creating the token to be sent to the forgot password

          bcrypt.genSalt(10, function (err, salt) {
            if (err) { return res.sendStatus(404).json({ success: false, message: 'Oops problem in creating new password record.' }) }
            bcrypt.hash(token, salt, function (error, hash) {
              if (error) { return res.sendStatus(404).json({ success: false, message: 'Oops problem in creating new password record.' }) }
              const obj = new ResetPassword({
                userId: user.id,
                resetPasswordToken: hash,
                expire: moment.utc().add(process.env.TOKEN_EXPIRY, 'seconds'),
                status: 0
              });
              obj.save((error, item) => {
                if (error)
                  return res.sendStatus(404).json({ success: false, message: 'Oops problem in creating new password record.' })
                //return throwFailed(res, 'Oops problem in creating new password record')
                let mailOptions = {
                  from: 'covidfighter@tibyane.com',
                  to: user.email,
                  subject: 'Reset your account password',
                  text: '<h4><b>Reset Password</b></h4>' +
                    '<p>To reset your password, complete this form:</p>' +
                    '<a href=' + process.env.CLIENT_URL + 'reset/' + user.id + '/' + token + '">' + process.env.CLIENT_URL + 'reset/' + user.id + '/' + token + '</a>' +
                    '<br><br>' +
                    '<p>--Team</p>'
                }
                var mailgun = new NodeMailgun()
                mailgun.apiKey = process.env.MAILGUN_API_KEY;
                mailgun.domain = process.env.MAILGUN_DOMAIN;
                mailgun.fromEmail = mailOptions.from;
                mailgun.fromTitle = mailOptions.subject;
                mailgun.init();
                mailgun.send(mailOptions.to, mailOptions.subject, mailOptions.text).then((result) => {
                  console.log("email sent");
                  console.log(result);
                  return res.json({ success: true, message: 'Check your mail to reset your password.' });
                }).catch((error) => {
                  console.log(error);
                  res.status(500).json({ success: false, message: 'Unable to send email.' });
                });

              });
            });
          });
        });
      });
  }

  storePassword = (req, res) => {
    //handles the new password
    const userId = req.body.userId
    const token = req.body.token
    const password = req.body.password
    ResetPassword.findOne({ userId: userId, status: 0 }, (error, resetPassword) => {
      //console.log(resetPassword);
      let expireTime = moment.utc(new Date(resetPassword.expire))
      let currentTime = new Date();
      if (!resetPassword || expireTime.isBefore(currentTime)) {
        return res.status(501).json({ success: false, message: 'Invalid or expired reset token.' });
      }
      bcrypt.compare(token, resetPassword.resetPasswordToken, function (errBcrypt, resBcrypt) {// the token and the hashed token in the db are verified befor updating the password
        console.log(resBcrypt);

        if (errBcrypt) {
          return res.status(502).json({ success: false, message: 'Invalid or expired reset token.', error: errBcrypt });
        }

        bcrypt.genSalt(10, function (errr, salt) {
          if (errr) { return res.status(500).json({ success: false, error: errr }); }
          bcrypt.hash(password, salt, function (errrr, hash) {
            if (errrr) { return res.status(500).json({ success: false, error: errrr }); }
            const hashedPassword = hash;
            User.findOneAndUpdate({ _id: userId }, { password: hashedPassword }, (err) => {

              //console.log(err);
              if (err) {
                return res.status(503).json({ success: false, message: 'Invalid or expired reset token.', error: err });
              }
              console.log("password update");
              ResetPassword.findOneAndUpdate({ _id: resetPassword._id }, {
                status: 1
              }, (error) => {
                console.log(error);
                if (error)
                  res.status(504).json({ success: false, error: error });
                else
                  res.json({ success: true, message: 'Password Updated successfully.' })
              });
            });
          });
        });
      });
    });
  }

  emailConfirmation = function (req, res, next) {
    //req.assert('email', 'Email is not valid').isEmail();
    //req.assert('email', 'Email cannot be blank').notEmpty();
    //req.assert('token', 'Token cannot be blank').notEmpty();
    //req.sanitize('email').normalizeEmail({ remove_dots: false });

    // Check for validation errors
    //var errors = req.validationErrors();
    //if (errors) return res.status(400).send(errors);

    // Find a matching token
    Token.findOne({ token: req.params.token }, function (err, token) {
      if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });

      // If we found a token, find a matching user
      User.findOne({ _id: token._userId }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
        if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

        // Verify and save the user
        user.isVerified = true;
        user.save(function (err) {
          if (err) { return res.status(500).send({ msg: err.message }); }

          var mailgun = new NodeMailgun();
          mailgun.apiKey = process.env.MAILGUN_API_KEY;
          mailgun.domain = process.env.MAILGUN_DOMAIN;
          // Setting Mailgun options
          mailgun.options = {
            host: 'api.eu.mailgun.net'
          };
          mailgun.fromEmail = 'covidfighter@tibyane.com';
          mailgun.fromTitle = 'My Sample App';
          mailgun.init();
          mailgun.initMailingList(process.env.MAILGUN_LIST_ALIAS);
          mailgun.listAdd(user.email, user.first_name + " " + user.last_name, { role: user.role })
            .then(() => {
              res.status(200).send("The account has been verified. Please log in.");
            })
            .catch((error) => {
              console.log(error);
              res.status(200).send("The account has been verified but not adding to mailing list. Please log in.")
            });
        });
      });
    });
  }

  // Get by id
  get = (req, res) => {
    if (req.params.id == req.user._id || req.user.role == "admin") {
      this.model.findOne({ _id: req.params.id }, (err, item) => {
        if (err) { return console.error(err); }
        res.status(200).json(item);
      });
    }
    else {
      return res.sendStatus(403);
    }
  }

  // Update by id
  update = (req, res) => {
    console.log("hello");
    if (req.params.id == req.user._id || req.user.role == "admin") {
      this.model.findOneAndUpdate({ _id: req.params.id }, req.body, (err) => {
        // 11000 is the code for duplicate key error
        if (err && err.code === 11000) {
          res.sendStatus(400);
        }
        if (err) {
          return console.error(err);
        }
        res.sendStatus(200);
      });
    }
    else {
      return res.sendStatus(403);
    }
  }

  // Delete by id
  delete = (req, res) => {
    if (req.user.role == "admin") {
      this.model.findOneAndRemove({ _id: req.params.id }, (err) => {
        if (err) { return console.error(err); }
        res.sendStatus(200);
      });
    }
    else {
      return res.sendStatus(403);
    }
  }


}
