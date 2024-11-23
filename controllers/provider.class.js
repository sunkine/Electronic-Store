import Provider from "../models/provider.model.js";

// Tạo nhà cung cấp mới
export const createProvider = async (req, res) => {
  try {
    const providerData = req.body; // Dữ liệu nhà cung cấp từ request body

    // Tạo đối tượng nhà cung cấp mới
    const newProvider = new Provider(providerData);

    await newProvider.save(); // Lưu nhà cung cấp mới vào cơ sở dữ liệu

    res.status(201).json({
      success: true,
      message: "Tạo nhà cung cấp thành công.",
      data: newProvider,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật nhà cung cấp theo ID
export const updateProviderByID = async (req, res) => {
  try {
    const idProvider = req.params.id; // Lấy id từ params
    const updatedData = { ...req.body }; // Dữ liệu cập nhật

    const updatedProvider = await Provider.findOneAndUpdate(
      { idProvider },
      updatedData,
      { new: true }
    );

    if (!updatedProvider) {
      return res.status(404).json({
        success: false,
        message: "Nhà cung cấp không tìm thấy.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật nhà cung cấp thành công.",
      data: updatedProvider,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa nhà cung cấp theo ID
export const deleteProviderByID = async (req, res) => {
  try {
    const { id } = req.params; // Lấy id từ params
    const deletedProvider = await Provider.findOneAndDelete({ idProvider: id }); // Xóa nhà cung cấp theo idProvider

    if (!deletedProvider) {
      return res.status(404).json({
        success: false,
        message: "Nhà cung cấp không tìm thấy.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Nhà cung cấp đã được xóa thành công.",
      data: deletedProvider,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy tất cả nhà cung cấp
export const getAllProviders = async (req, res) => {
  const page = parseInt(req.query.page) || 0; // Mặc định trang 0 nếu không có tham số
  const { name, idProvider } = req.query; // Lấy các tham số tìm kiếm từ query
  let filters = {};

  if (name) filters.nameOfProvider = { $regex: name, $options: "i" }; // Tìm kiếm theo tên nhà cung cấp
  if (idProvider) filters.idProvider = { $regex: idProvider, $options: "i" }; // Tìm kiếm theo idProvider

  try {
    const providers = await Provider
      .find(filters)
      .limit(10) // Giới hạn số lượng nhà cung cấp trả về
      .skip(page * 10); // Bỏ qua số lượng nhà cung cấp tương ứng với trang

    // Instead of checking if providers.length, just return an empty array with a success message
    res.status(200).json({
      success: true,
      message: "Lấy tất cả nhà cung cấp thành công.",
      total: providers.length,
      data: providers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Lấy thông tin một nhà cung cấp theo ID
export const getProvider = async (req, res) => {
  try {
    const id = req.params.id; // Lấy id từ params
    const provider = await Provider.findOne({ idProvider: id }); // Tìm nhà cung cấp theo idProvider

    if (!provider) {
      return res.status(404).json({ success: false, message: "Nhà cung cấp không tìm thấy." });
    }

    res.status(200).json({
      success: true,
      message: "Lấy thông tin nhà cung cấp thành công.",
      data: provider,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
