package com.fresherjobs.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    /**
     * Upload a raw file (PDF, DOC) to Cloudinary with a fixed public_id.
     * Re-uploading with the same publicId overwrites the file, keeping the same
     * URL.
     */
    public String uploadFile(MultipartFile file, String folder, String publicId) {
        try {
            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", "fresher-jobs/" + folder,
                    "public_id", publicId,
                    "overwrite", true,
                    "invalidate", true,
                    "resource_type", "raw"));
            return (String) result.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file to Cloudinary: " + e.getMessage(), e);
        }
    }

    /**
     * Upload an image to Cloudinary with a fixed public_id.
     * Re-uploading with the same publicId overwrites the file, keeping the same
     * URL.
     */
    public String uploadImage(MultipartFile file, String folder, String publicId) {
        try {
            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", "fresher-jobs/" + folder,
                    "public_id", publicId,
                    "overwrite", true,
                    "invalidate", true,
                    "resource_type", "image"));
            return (String) result.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image to Cloudinary: " + e.getMessage(), e);
        }
    }

    /**
     * Delete a file from Cloudinary by its public ID.
     */
    public void deleteFile(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file from Cloudinary: " + e.getMessage(), e);
        }
    }
}
