pipeline {
  agent any

  tools {nodejs "nodejs"}

  options { timestamps () }
  
  stages {    
    stage('Cloning Git') {
      steps {
        sh  'npm i' 
      }
    }        
  }
  post { 
    always { 
      cleanWs()
    }
  }
}
