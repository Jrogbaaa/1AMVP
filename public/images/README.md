# Images Directory

This directory contains static images for the 1Another MVP.

## Current Status

⚠️ **Using Placeholders**: The app currently uses gradient placeholders for all images. Add real images to the appropriate folders below to replace them.

## Structure

```
images/
├── doctors/         # Doctor avatars and profile images
├── thumbnails/      # Video thumbnail images
└── README.md        # This file
```

## Usage

### Doctor Avatars

Place doctor profile images here:
- Format: JPG or PNG
- Recommended size: 256x256px minimum
- Naming: `dr-{lastname}.jpg` (e.g., `dr-johnson.jpg`)

### Video Thumbnails

Place video thumbnail images here:
- Format: JPG or PNG
- Recommended size: 1280x720px (16:9 aspect ratio)
- Naming: Descriptive (e.g., `blood-pressure.jpg`, `heart-healthy-diet.jpg`)

## Production Notes

For production deployment:
- Use a CDN for image hosting (Cloudflare Images, AWS CloudFront, etc.)
- Implement lazy loading
- Use Next.js Image optimization
- Generate multiple sizes for responsive images

