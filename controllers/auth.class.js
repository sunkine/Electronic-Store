import Account from "../models/account.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/createToken.js";

export const SignIn = async (req, res) => {
  const email = req.body.Email;
  const pw = req.body.Password;
  if (!email || !pw) {
    return res.status(400).json({
      success: false,
      message: "Email, Password are required.",
    });
  }
  try {
    const mail = await Account.findOne({ Email: req.body.Email });

    if (!mail) {
      return res.status(404).json({
        success: false,
        message: "Email not found.",
      });
    }

    const checkPassword = bcrypt.compare(pw, mail.Password);

    if (!checkPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect email or password." });
    }

    const { Password, Role, ...rest } = mail._doc;
    if (mail && checkPassword)
      res.status(200).json({
        success: true,
        message: "Successfully login",
        token: generateToken(mail?._id),
        data: {
          ...rest,
        },
      });
    else {
      throw new Error("Invalid login credentials");
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

export const SignUp = async (req, res) => {
  const { Username, Password, Email } = req.body;
  if (!Username || !Password || !Email) {
    return res.status(400).json({
      success: false,
      message: "Username, Password, and Email are required.",
    });
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.Password, salt);

  const newAccount = new Account({
    Username: req.body.Username,
    Password: hash,
    Email: req.body.Email,
  });

  try {
    const existingUsername = await Account.findOne({
      Username: req.body.Username,
    });
    const existingEmail = await Account.findOne({ Email: req.body.Email });

    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: "Username already exists.",
      });
    }

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const accountData = await newAccount.save();
    return res.status(201).json({
      success: true,
      message: "Successfully created account.",
      data: accountData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};
