# Videos Directory

This directory is for local video files during development.

## Production Notes

**⚠️ DO NOT host videos directly in this directory for production!**

For production deployment, use a dedicated video hosting service:

### Recommended Services

1. **Cloudflare Stream**
   - Medical-grade security
   - Adaptive bitrate streaming
   - Built-in encoding
   - DRM support

2. **Mux**
   - Professional video infrastructure
   - Analytics built-in
   - Thumbnails and GIFs
   - Live streaming support

3. **AWS MediaConvert + CloudFront**
   - Full control
   - Custom workflows
   - Cost-effective at scale

4. **Vimeo Pro**
   - Easy integration
   - Privacy controls
   - Customizable player

### Implementation

Update the video URLs in your database to point to your video hosting service:

```sql
UPDATE videos 
SET video_url = 'https://stream.cloudflare.com/...'
WHERE id = '...';
```

### Development

For local development, you can use sample videos from:
- https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/
- Or place small MP4 files here for testing

