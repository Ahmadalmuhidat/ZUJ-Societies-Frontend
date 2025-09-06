pipeline {
  agent any

  environment {
    DOCKER_IMAGE = "zuj-societies-frontend"
    DOCKER_CONTAINER = "zuj-societies-frontend"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Image') {
      steps {
        echo "Building Docker image ${DOCKER_IMAGE}:latest"
        sh "docker build -t ${DOCKER_IMAGE}:latest ."
      }
    }

    stage('Stop and Remove Old Container') {
      steps {
        echo "Stopping old container if exists"
        sh """
          docker stop ${DOCKER_CONTAINER} || true
          docker rm ${DOCKER_CONTAINER} || true
        """
      }
    }

    stage('Run Container') {
      steps {
        echo "Running container ${DOCKER_CONTAINER}..."
        sh """
          docker run -d --name ${DOCKER_CONTAINER} --restart unless-stopped -p 80:80 ${DOCKER_IMAGE}:latest
        """
      }
    }
  }

  post {
    success {
      echo 'Deployment completed successfully!'
    }
    failure {
      echo 'Deployment failed.'
    }
  }
}
