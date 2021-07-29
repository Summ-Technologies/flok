## Flok React/Front End App

#### Local Setup
1. Checkout the flok repository and enter the Flok module within that repo.

```bash
git clone git@github.com:Summ-Technologies/flok.git
cd flok/modules/flok/
```

1. Install dependencies

```bash
yarn install # or npm install if you prefer
```

1. Setup `.env` file with config options.

```bash
echo """
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_IMAGES_URL=https://flok-b32d43c.s3.us-east-1.amazonaws.com/
""" > .env
```

1. Run the react app dev server

```bash
env $(cat .env) npm run start
```

#### Heroku
Production, staging, and review apps are all hosted on heroku
