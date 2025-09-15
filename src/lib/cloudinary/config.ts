    export const uploadImageToCloudinary = async (file: string | Blob) => {

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "profile"); 

        try {
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(`Cloudinary Error: ${data.error.message}`);
            }
            return data.secure_url; // Return the image URL
        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
            throw error;
        }
    };