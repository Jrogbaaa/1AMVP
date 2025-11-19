-- Sample data for 1Another MVP

-- Insert sample doctor
INSERT INTO doctors (id, name, specialty, avatar_url, clinic_name, clinic_address, phone, email)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Dr. Sarah Johnson', 'Cardiology', '/images/doctors/dr-johnson.jpg', 'Heart Health Clinic', '123 Medical Center Dr, Boston, MA 02115', '(617) 555-0100', 'sjohnson@hearthealthclinic.com'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Dr. Michael Chen', 'Primary Care', '/images/doctors/dr-chen.jpg', 'Boston Family Medicine', '456 Healthcare Ave, Boston, MA 02116', '(617) 555-0200', 'mchen@bostonfamilymed.com')
ON CONFLICT DO NOTHING;

-- Insert sample user
INSERT INTO users (id, name, email, phone, date_of_birth)
VALUES 
  ('650e8400-e29b-41d4-a716-446655440001', 'Dave Thompson', 'dave@example.com', '(617) 555-1234', '1985-06-15')
ON CONFLICT DO NOTHING;

-- Link user to doctor
INSERT INTO user_doctors (user_id, doctor_id, is_primary)
VALUES 
  ('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', true)
ON CONFLICT DO NOTHING;

-- Insert sample videos
INSERT INTO videos (id, title, description, video_url, thumbnail_url, poster_url, duration, category, tags, doctor_id, is_personalized)
VALUES 
  -- Personalized doctor video
  ('750e8400-e29b-41d4-a716-446655440001', 
   'Your Follow-Up from Dr. Johnson', 
   'Dave, here''s your personalized follow-up after your recent visit.',
   '/videos/sample-followup.mp4',
   '/images/thumbnails/doctor-followup.jpg',
   '/images/doctors/dr-johnson.jpg',
   120,
   'Follow-Up',
   ARRAY['personalized', 'follow-up', 'cardiology'],
   '550e8400-e29b-41d4-a716-446655440001',
   true),
  
  -- Educational videos
  ('750e8400-e29b-41d4-a716-446655440002',
   'Understanding Blood Pressure',
   'Learn what blood pressure numbers mean and how to monitor your heart health.',
   '/videos/blood-pressure-basics.mp4',
   '/images/thumbnails/blood-pressure.jpg',
   '/images/thumbnails/blood-pressure.jpg',
   180,
   'Education',
   ARRAY['blood pressure', 'heart health', 'basics'],
   NULL,
   false),
  
  ('750e8400-e29b-41d4-a716-446655440003',
   'Heart-Healthy Diet Tips',
   'Simple and practical nutrition tips for maintaining a healthy heart.',
   '/videos/heart-healthy-diet.mp4',
   '/images/thumbnails/diet.jpg',
   '/images/thumbnails/diet.jpg',
   240,
   'Education',
   ARRAY['nutrition', 'diet', 'heart health'],
   NULL,
   false),
  
  ('750e8400-e29b-41d4-a716-446655440004',
   'Medication Reminders',
   'Why taking your medication on schedule is crucial for your health.',
   '/videos/medication-compliance.mp4',
   '/images/thumbnails/medication.jpg',
   '/images/thumbnails/medication.jpg',
   150,
   'Education',
   ARRAY['medication', 'compliance', 'tips'],
   NULL,
   false),
  
  ('750e8400-e29b-41d4-a716-446655440005',
   'Exercise for Heart Health',
   'Safe and effective exercises to strengthen your cardiovascular system.',
   '/videos/exercise-tips.mp4',
   '/images/thumbnails/exercise.jpg',
   '/images/thumbnails/exercise.jpg',
   200,
   'Education',
   ARRAY['exercise', 'cardio', 'fitness'],
   NULL,
   false)
ON CONFLICT DO NOTHING;

-- Initialize health metrics for sample user
INSERT INTO health_metrics (user_id, score, watched_doctor_video, completed_onboarding, completed_next_steps, submitted_calendar_request, watched_educational_videos)
VALUES 
  ('650e8400-e29b-41d4-a716-446655440001', 0, false, false, false, false, 0)
ON CONFLICT DO NOTHING;

-- Initialize onboarding state
INSERT INTO onboarding_state (user_id, current_step, completed, data)
VALUES 
  ('650e8400-e29b-41d4-a716-446655440001', 0, false, '{}')
ON CONFLICT DO NOTHING;

