node ('node') {
    currentBuild.result = "SUCCESS"

    try {
        stage('Checkout') {
            checkout scm
        }
        stage('Build') {
            sh 'npm cache clean'
            sh 'npm install'
        }
        stage('Restart') {
            sh 'service nginx restart'
        }
    }
    catch (err) {
        currentBuild.result = "FAILURE"

            mail body: "project build error is here: ${env.BUILD_URL}" ,
            from: 'jenkins@iamborsch.ru',
            replyTo: 'jenkins@iamborsch.ru',
            subject: 'project build failed',
            to: 'shaper2010@yandex.ru'
    }
}