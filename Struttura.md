POVBlogs/
│
├── backend/
│   ├── config/
│   │   ├── cloudinaryConfig.js
│   │   └── passportConfig.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── errorHandlers.js
│   ├── modules/
│   │   ├── Authors.js
│   │   └── BlogPosts.js
│   ├── routes/
│   │   ├── authorsRoutes.js
│   │   ├── authRoutes.js
│   │   └── blogRoutes.js
│   ├── services/
│   │   └── emailServices.js
│   ├── utils/
│   │   └── jwt.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   ├── index.html
    │   └── ...
    ├── src/
    │   ├── components/
    │   │   ├── AnimatedBackground.jsx
    │   │   ├── CardSkeleton.jsx
    │   │   ├── CommentSection.jsx
    │   │   ├── Loader.jsx
    │   │   ├── MyFooter.jsx
    │   │   ├── MyNav.jsx
    │   │   └── NightSkyBackground.jsx
    │   ├── modules/
    │   │   ├── ApiCrud.js
    │   │   ├── axios.js
    │   │   └── SearchContext.jsx
    │   ├── Pages/
    │   │   ├── AuthorPosts.jsx
    │   │   ├── AuthorsList.jsx
    │   │   ├── CreatePost.jsx
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── PostDetail.jsx
    │   │   ├── Register.jsx
    │   │   └── UserPage.jsx
    │   ├── Style/
    │   │   ├── AnimatedBackground.css
    │   │   ├── Animations.css
    │   │   └── Form.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── vercel.json
    └── vite.config.js
