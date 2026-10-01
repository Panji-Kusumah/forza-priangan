update public.alumni
set profile_photo_url = '/logokonsul.png'
where details ? 'sourceMockId'
  and auth_user_id is null
  and profile_photo_url like 'https://images.unsplash.com/%';

update public.memories
set image_url = '/logokonsul.png'
where details ? 'sourceMockId'
  and image_url like 'https://images.unsplash.com/%';