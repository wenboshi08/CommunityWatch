Our app currently supports the following APIs:

GET /api/neighborhoods         (Get all neighborhoods)
GET /api/neighborhoods/:id     (Get a neighborhood)
GET /api/crimes                (Get all crimes)
GET /api/crimes/types          (Get all crime types )
POST /api/feeds                (Post a feed subscribtion relationship )
PUT /api/feeds                 (Remove a feed subscribtion  relationship)
GET /api/feeds/user            (Get all feeds a user is subscribed too)    
GET /api/feeds/neighborhood/:neighborhoodId (get all feeds of a neigh, by id)
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
DELETE /api/users               (delete user)
GET /api/posts//flag/:postId?   (get any active flag)
GET /api/posts/flag/all/:postId?(get all active flags)
PUT /api/posts/flag/:postId?    (toggle a flag)
POST /api/upvotes/              (create an upvote)
PUT /api/upvotes                (remove an upvote)
GET /api/upvotes/user           (get all upvotes for a user)
GET /api/upvotes/post/:postId?  (get all upvotes for post id)
GET /api/upvotes                (get all upvotes in a db)
GET /api/upvotes/exist          (get if one upvote exists in the db)
POST /api/downvotes/              (create an downvote)
PUT /api/downvotes                (remove an downvote)
GET /api/downvotes/user           (get all downvotes for a user)
GET /api/downvotes/post/:postId?  (get all downvotes for post id)
GET /api/downvotes                (get all downvotes in a db)
GET /api/downvotes/exist          (get if one downvote exists in the db)








