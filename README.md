# form-to-supa
A Nuxt 3 + Supabase + External API Poc Project


## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install
```

## Development Server

Start the development server on `http://localhost:3000`

```bash
yarn dev
```

## Production

Build the application for production:

```bash
yarn build
```

Locally preview production build:

```bash
yarn preview
```

## Docker

Dockerize
```bash
sudo docker build -t form-to-supa . 
```

Run docker
```bash
sudo docker run -p 3000:3000 form-to-supa
```