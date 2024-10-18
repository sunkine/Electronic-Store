import Account from "../models/account.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/createToken.js";

export const SignIn = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const acc = await Account.findOne({ Email });

    if (!acc) {
      return res.status(404).json({
        success: false,
        message: "Username not found.",
      });
    }

    const isPasswordValid = await bcrypt.compare(Password, acc.Password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password.",
      });
    }

    const { Password: pwHash, Role, ...userDetails } = acc._doc;

    // Create JWT token
    const token = jwt.sign(
      {
        id: acc._id,
        role: acc.Role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
// them reset token
    res.cookie("accessToken", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    })
    .status(200)
    .json({
      success: true,
      message: "Successfully logged in.",
      data: userDetails,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to login.",
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
