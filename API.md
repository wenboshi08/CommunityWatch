Our app currently supports the following APIs:

GET /api/neighborhoods         (Get all neighborhoods)
GET /api/neighborhoods/:id     (Get a neighborhood)
GET /api/crimes                (Get all crimes)
GET /api/crimes/types          (Get all crime types )
POST /api/feeds                (Post a feed subscribtion relationship )
PUT /api/feeds                 (Remove a feed subscribtion  relationship)
GET /api/feeds/user            (Get all feeds a user is subscribed too)    
GET /api/feeds/neighborhood/:neighborhoodId
GET /api/feeds                 (Get all feeds)
GET /api/posts                 (Get all posts)
POST /api/posts/new            (Post a new post)
DELETE /api/post//:postId?     (Deletes a post)
POST /api/users/session        (Creates a new session)
DELETE /api/users/session      (Deletes the session)
GET /api/users                 (get all users)
GET /api/users/:username       (get this user)
POST /api/users                (create user)
PUT /api/users                 (update username)
PUT /api/users/password        (update password)
DELTE /api/users               (delete user)


