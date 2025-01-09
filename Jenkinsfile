pipeline {
    agent any

    environment {
        // Set Docker Hub credentials and repository name
        DOCKER_HUB_REPO = "dris685/playwright"
    }

    stages {
        stage('Build Image') {
            steps {
                script {
                    // If needed, change the build context (e.g., point to a specific folder with the Dockerfile)
                    sh "docker build -t ${DOCKER_HUB_REPO}:latest ."
                }
            }
        }

        stage('Push Image') {
            environment {
                DOCKER_HUB = credentials('dockerhub-creds') // Jenkins credentials for Docker Hub login
            }
            steps {
                script {
                    // Use the credentials to log in to Docker Hub
                    sh 'echo ${DOCKER_HUB_PSW} | docker login -u ${DOCKER_HUB_USR} --password-stdin'
                    
                    // Push the latest image to Docker Hub
                    sh "docker push ${DOCKER_HUB_REPO}:latest"
                    
                    // Tag the image with the build number for versioning
                    sh "docker tag ${DOCKER_HUB_REPO}:latest ${DOCKER_HUB_REPO}:${env.BUILD_NUMBER}"
                    
                    // Push the tagged image with the build number
                    sh "docker push ${DOCKER_HUB_REPO}:${env.BUILD_NUMBER}"
                }
            }
        }
    }

    post {
        always {
            // Clean up by logging out of Docker and removing unused images
            sh "docker logout"
            sh "docker system prune -f"
        }
    }
}