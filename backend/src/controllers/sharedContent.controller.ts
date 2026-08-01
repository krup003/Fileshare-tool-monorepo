import { Request, Response } from "express";
import { SharedContentModel } from "../models/sharedContent";
import axios from "axios";
import cloudinary from "../config/multer";
import { mailer } from "../config/mailer";

export const SharedContentController = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    if (!data) {
      return res.status(400).json({ message: "No data received" });
    }

    const finalAccessOTP =
      data.privacyType === "private" ? Number(data.otp) : null;

    await SharedContentModel.create({
      privacyType: data.privacyType,
      otp: finalAccessOTP,
      contentUrl: data.contentUrl,
      uniqueUserCode: data.uniqueUserCode,
      file: {
        url: data.fileUrl, // comes from frontend after Cloudinary upload
        publicId: data.publicId,
        originalName: data.originalName,
        mimeType: data.mimeType,
        fileType: data.mimeType.split("/")[0],
        size: data.fileSize,
      },
    });

    res.status(200).json({ message: "Shared content received" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getSharedContent = async (req: Request, res: Response) => {
  try {
    const uniqueURL = req.params.id;
    const sharedContent = await SharedContentModel.findOne({
      contentUrl: uniqueURL,
    }).select("-otp -file.url -file.publicId -uniqueUserCode");
    if (!uniqueURL) {
      return res.status(400).json({ message: "Content not found" });
    }

    return res
      .status(200)
      .json({ message: "Get content successfully", sharedContent });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    // const id = req.params.id;
    const userData = req.body;
    // const insrtedOTP = req.body.otp;
    const findOTP = await SharedContentModel.findOne({
      contentUrl: userData.uniqueId,
    });
    if (findOTP) {
      if (userData.otp == findOTP.otp) {
        return res.status(200).json({ message: "Verified Successfully" });
      } else {
        return res.status(400).json({ message: "OTP is invalid" });
      }
    } else {
      return res.status(400).json({ message: "Content not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const downloadFile = async (req: Request, res: Response) => {
  try {
    const uniqueURL = req.body.sharedURL;
    const sharedData = await SharedContentModel.findOne({
      contentUrl: uniqueURL,
    });

    if (!sharedData || !sharedData.file) {
      return res.status(404).json({ message: "Data not found" });
    }
    const cloudinaryResponse = await axios({
      method: "GET",
      url: sharedData.file.url,
      responseType: "stream",
    });
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${sharedData.file.originalName}"`,
    );
    res.setHeader("Content-Type", sharedData.file.mimeType);
    cloudinaryResponse.data.pipe(res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSharedItemList = async (req: Request, res: Response) => {
  try {
    const uniqueUserId = req.params.id;
    const sharedItems = await SharedContentModel.find({
      uniqueUserCode: uniqueUserId,
    }).sort({ createdAt: -1 });

    if (sharedItems.length == 0) {
      return res.status(400).json({ message: "No shared items found" });
    }
    const finalSharedItems = sharedItems.map((item) => {
      return {
        privacyType: item.privacyType,
        contentUrl: item.contentUrl,
        type: item.file?.fileType,
        file: item.file?.originalName,
        time: item.createdAt,
        ...(item.privacyType === "private" && { password: item.otp }),
      };
    });

    return res
      .status(200)
      .json({ message: "Shared items found", finalSharedItems });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const changePrivacyTypes = async (req: Request, res: Response) => {
  try {
    const { uniqueURL, updatedPrivacyTypes, otp } = req.body;

    const findData = await SharedContentModel.findOne({
      contentUrl: uniqueURL,
    });
    if (!findData) {
      return res.status(400).json({ message: "Content not found" });
    }
    const updatedContent = await SharedContentModel.findOneAndUpdate(
      { contentUrl: uniqueURL },
      { $set: { privacyType: updatedPrivacyTypes, otp: otp } },
      { new: true },
    ).select(" -file");
    return res
      .status(200)
      .json({ message: "Privacy type changed", updatedContent });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteSharedContent = async (req: Request, res: Response) => {
  try {
    const uniqueURL = req.params.id;
    const matchedContent = await SharedContentModel.findOne({
      contentUrl: uniqueURL,
    });

    if (!matchedContent) {
      return res.status(404).json({ message: "Content not found" });
    }

    if (matchedContent.file && matchedContent.file.publicId) {
      let cloudinaryResourceType = "image";
      if (matchedContent.file.fileType === "video") {
        cloudinaryResourceType = "video";
      } else if (
        matchedContent.file.fileType === "application" ||
        matchedContent.file.fileType === "text"
      ) {
        cloudinaryResourceType = "raw";
      }

      await cloudinary.uploader.destroy(matchedContent.file.publicId, {
        resource_type: cloudinaryResourceType,
      });
    }

    await SharedContentModel.deleteOne({ contentUrl: uniqueURL });

    return res
      .status(200)
      .json({ message: "Deleted successfully from database and Cloudinary" });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const SendViaEmail = async (req: Request, res: Response) => {
  try {
    const userEmail = req.body.email;
    const uniqueURL = req.body.sharedURL;

    if (!userEmail || !uniqueURL) {
      return res.status(400).json({
        message: "Email and shared URL are required",
      });
    }

    const matchedContent = await SharedContentModel.findOne({
      contentUrl: uniqueURL,
    });

    if (!matchedContent) {
      return res.status(404).json({
        message: "Content not found",
      });
    }

    const fileUrl = matchedContent.file?.url;

    if (!fileUrl) {
      return res.status(400).json({
        message: "File URL not found",
      });
    }

    const downloadLink = fileUrl.replace("/upload/", "/upload/fl_attachment/");

    await mailer.sendMail({
      from: `"FileShare" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "📁 File Download",
      html: `
        <div style="font-family: Arial; padding: 15px;">
          <h2>Your file is ready to download 📁</h2>
          
          <p><strong>File Name:</strong> ${
            matchedContent.file?.originalName || "Unknown"
          }</p>

          <p>Click below to download instantly:</p>

          <a href="${downloadLink}" 
             style="
               display:inline-block;
               padding:10px 15px;
               background:#000;
               color:#fff;
               text-decoration:none;
               border-radius:5px;
               margin-top:10px;
             ">
             Download File
          </a>
        </div>
      `,
    });

    return res.status(200).json({
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({
      message: "Failed to send email",
    });
  }
};
