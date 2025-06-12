### Install Requirements
To install all the backend requirements run:

```bash
cd backend
npm install
````

If you’re using `requirements.txt` as a reference, you can also install the packages manually:

```bash
npm install axios cors express dotenv
npm install --save-dev nodemon
```

##  How to run 

### Backend

To start the backend server in development mode:

```bash
cd backend
npm run dev
```

> Make sure your `package.json` includes a dev script like:
>
> ```json
> "scripts": {
>   "dev": "nodemon server.js"
> }
> ```

### Client

To start the frontend application:

```bash
cd client
npm install
npm start
```

