FROM node:20-alpine

WORKDIR /app

# Copy the root package.json
COPY package.json ./

# Copy backend and frontend package.json to take advantage of Docker caching
COPY backend/package.json backend/
COPY frontend/package.json frontend/

# Install dependencies for both the backend and frontend
RUN npm install --prefix backend && npm install --prefix frontend

# Copy all the rest of the source code
COPY . .

# Build the frontend application
RUN npm run build --prefix frontend

# Provide the production environment variable 
# This tells the backend to serve the frontend dist folder
ENV NODE_ENV=production

# The backend service runs on port 3000 by default
EXPOSE 3000

# Start the express server
CMD ["npm", "start"]
