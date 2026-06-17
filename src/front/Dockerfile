FROM node:22-alpine

WORKDIR /dashboard

COPY package*.json ./

RUN npm install --include=dev

COPY . .

RUN npm run build --verbose  

EXPOSE 3002

# for run our nextjs project for production 
CMD ["npm","run","start"]
