import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";

const configureCloudinary = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new ApiError(
      503,
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server/.env."
    );
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
};

const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) {
    throw new ApiError(400, "Upload file is missing from temporary storage.");
  }

  try {
    configureCloudinary();
    return await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;

    console.error("Cloudinary upload failed:", error?.message || error);
    throw new ApiError(
      502,
      `Cloudinary upload failed: ${error?.message || "provider rejected the file"}`
    );
  } finally {
    try {
      await fs.promises.unlink(localFilePath);
    } catch (error) {
      if (error?.code !== "ENOENT") {
        console.error(
          "Failed to remove uploaded temporary file:",
          error?.message || error
        );
      }
    }
  }
};

const getPublicIdFromUrl = (assetUrl) => {
  let parsedUrl;
  try {
    parsedUrl = new URL(assetUrl);
  } catch {
    throw new ApiError(400, "Stored Cloudinary asset URL is invalid.");
  }

  if (parsedUrl.hostname !== "res.cloudinary.com") {
    throw new ApiError(400, "Stored asset is not a Cloudinary URL.");
  }

  const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
  const uploadIndex = pathParts.indexOf("upload");
  if (uploadIndex < 0) {
    throw new ApiError(400, "Stored Cloudinary URL has no upload path.");
  }

  let assetParts = pathParts.slice(uploadIndex + 1);
  const versionIndex = assetParts.findIndex((part) => /^v\d+$/.test(part));
  if (versionIndex >= 0) assetParts = assetParts.slice(versionIndex + 1);

  const publicId = decodeURIComponent(assetParts.join("/")).replace(
    /\.[^/.]+$/,
    ""
  );
  if (!publicId)
    throw new ApiError(400, "Could not identify Cloudinary asset.");
  return publicId;
};

const deleteFromCloudinary = async ({ publicId, assetUrl, resourceType }) => {
  configureCloudinary();

  const id = publicId || getPublicIdFromUrl(assetUrl);
  if (!id) throw new ApiError(400, "Cloudinary public ID is missing.");

  try {
    const result = await cloudinary.uploader.destroy(id, {
      resource_type: resourceType,
      invalidate: true,
    });

    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error(
        `Cloudinary returned ${result.result || "an unknown result"}`
      );
    }

    return result;
  } catch (error) {
    console.error(
      `Cloudinary ${resourceType} deletion failed:`,
      error?.message || error
    );
    throw new ApiError(
      502,
      `Could not delete the ${resourceType} asset from Cloudinary: ${error?.message || "provider error"}`
    );
  }
};

export { deleteFromCloudinary, uploadOnCloudinary };
