import Account from "../models/account.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/createToken.js";

export const SignIn = async (req, res) => {
  try {
    const account = await Account.findOne({ Email: req.body.Email });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Email not found.",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.Password,
      account.Password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password.",
      });
    }

    const { Password: pwHash, Role, ...userDetails } = account._doc;

    // Create JWT token
    const token = generateToken(account?.id);

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      })
      .status(200)
      .json({
        success: true,
        message: "Successfully logged in.",
        token: token,
        data: userDetails,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error",
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
