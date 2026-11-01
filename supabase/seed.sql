-- Optional: copies the three original placeholder stories into the
-- database as published posts, so the site looks the same once connected.
-- Run after schema.sql (SQL Editor → New query → Run).

insert into public.posts
  (slug, code, name, macro_region, area, difficulty, trek_date, author_id, author_name,
   excerpt, image_url, altitude, distance, duration, body, tips, status)
values
(
  'rajgad-monsoon-trail', 'FORT 01', 'Rajgad monsoon trail', 'Maharashtra', 'Pune', 'Moderate',
  '2026-06-14', null, 'Aisha Patil',
  'Clouds rolled over the Bale Killa as we climbed through knee-deep grass, the trail slick from a week of rain.',
  'https://images.unsplash.com/photo-1673970825861-3469f8fe01d3?fm=jpg&q=70&w=1400&auto=format&fit=crop',
  '1340m', '12km', '6hr',
  array[
    'We started from Gunjavane base village a little after sunrise, the kind of grey monsoon morning where the hills look like they''re breathing mist. Rajgad doesn''t ease you in — the first hour is a steady climb through slick stone steps, and by the time we reached Chor Darwaza, everyone''s shoes had given up being waterproof.',
    'The fort itself is enormous. Shivaji Maharaj''s capital for over two decades, and you feel that scale once you''re up on the Bale Killa — the citadel sits like its own separate fort above the rest of Rajgad, with a final scramble up wet rock to reach it.',
    'By midday the clouds finally broke just long enough for a clear view down into the Pali Darwaza side — entire valleys of green stretching out, terraced fields catching the light. It''s the kind of view that makes the slipping and the soaked socks completely worth it.',
    'We started down by early afternoon, racing the next band of clouds rolling in. Made it to the base just as the rain started again — perfect timing, or beginner''s luck.'
  ],
  array[
    'Best season: June–September, post-monsoon for clear views',
    'Carry grip shoes — the stone steps get dangerously slick',
    'Base village: Gunjavane, about 2hr from Pune',
    'Carry a rain cover for your bag and a spare pair of socks',
    'Bale Killa climb has exposed rock — not ideal for beginners',
    'Water sources available near Padmavati temple'
  ],
  'published'
),
(
  'harishchandragad-night-climb', 'FORT 02', 'Harishchandragad night climb', 'Maharashtra', 'Ahmednagar', 'Difficult',
  '2026-05-02', null, 'Rohan Deshmukh',
  'We started at midnight with four headlamps and a thermos of chai, hoping to catch the Konkan Kada sunrise.',
  '', '1424m', '18km', '10hr',
  array[
    'Night treks change everything about a trail. What''s a clear, obvious path in daylight becomes a narrow cone of headlamp light and a lot of trust in whoever''s walking in front. We left the base around midnight, four of us, mostly silent except for the occasional warning about loose rock.',
    'The Nalichi Vaat route is no joke even in daylight — steep, exposed in sections, with a fixed rope climb near the top that''s a little more thrilling at 3am than it probably needed to be.',
    'We reached the plateau with maybe an hour to spare before sunrise, found a spot near the temple complex, and just sat in the dark drinking chai from a thermos that had somehow stayed warm the whole climb.',
    'Then the Konkan Kada did what it does — the cliff edge lit up gold as the sun came over the horizon, fog pooling in the valley below like it was filling up a bowl. Nobody said much. Some views just don''t need commentary.'
  ],
  array[
    'Best attempted with a guide — the Nalichi Vaat route is steep and exposed',
    'Carry at least 2 reliable headlamps per person for the night climb',
    'Fixed rope section near the top — basic climbing comfort helps',
    'Pack extra layers, it gets cold on the plateau before sunrise'
  ],
  'published'
),
(
  'lohagad-after-the-rains', 'FORT 03', 'Lohagad after the rains', 'Maharashtra', 'Pune', 'Easy',
  '2026-04-20', null, 'Aisha Patil',
  'A first-timer''s trek — easy steps, sweeping valley views, and far too many photos of the Vinchu Kata.',
  '', '1033m', '6km', '3hr',
  array[
    'If you''re bringing someone on their first trek, Lohagad is the answer. The path is mostly stone steps, well-marked, and short enough that you''re at the top before anyone''s legs have a real complaint.',
    'We went a week after the first good rain of the season, so everything was that impossible shade of green you only get in the Sahyadris in April — waterfalls that don''t exist in summer were running along the cliff faces on the drive up.',
    'The Vinchu Kata — the scorpion-tail spur jutting out from the fort — is the obvious highlight, and we spent way too long out there taking photos with the valley dropping away on both sides.',
    'Total time including snack breaks and an embarrassing number of photo stops: about three hours. Perfect half-day trek if you want the Sahyadri feeling without committing a whole weekend to it.'
  ],
  array[
    'Great for beginners and families — well-marked stone steps',
    'Visit right after monsoon for waterfalls along the drive up',
    'Don''t skip the Vinchu Kata viewpoint — easy walk, best views'
  ],
  'published'
)
on conflict (slug) do nothing;
