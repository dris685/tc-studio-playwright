FROM mcr.microsoft.com/playwright:focal

# Set working directory
WORKDIR /app

# Copy test code
COPY . .

# Install dependencies
RUN npm cache clean --force
RUN npm install -g playwright
RUN npm install
RUN apt-get update && apt-get install -y wget gnupg ca-certificates && \
   curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
   apt install -y nodejs
RUN npx playwright install chromium

# Install dependencies
RUN apt-get update && apt-get install -y \
    wget unzip openjdk-11-jre-headless \
    && rm -rf /var/lib/apt/lists/*

# Install Allure
RUN wget -qO- https://github.com/allure-framework/allure2/releases/download/2.20.0/allure-2.20.0.tgz | tar -xz -C /opt/ \
    && ln -s /opt/allure-2.20.0/bin/allure /usr/bin/allure

EXPOSE 9323