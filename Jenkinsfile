pipeline {
    agent any 
    tools {nodejs "node js"}

   stages {
        stage('SCM PROJECT') {
            steps {
                echo 'Getting PROJECT FROM SCM'
                git branch: 'main', credentialsId: '4883425d-9cb5-479a-a84e-8d800e3f77af', url: 'https://github.com/aroussiteyeb/orientationFront.git'
                 mail to: "aroussi1996@gmail.com",
                 subject: "Success",
                 body: " Git SCM PROJECT DONE"
                
            }
            post { 
                    failure { 
                  mail to: "aroussi1996@gmail.com",
                  subject: "failure",
                  body: " Git SCM PROJECT failure"        
                    }        
            } 

        }
        stage('BUILD') {
            steps {
                echo 'BUILD OF Project IN PROGRESS'
                sh 'npm install --global expo-cli --force'
                sh 'npm isntall --force'
                sh'expo login -u jenkinsorientation -p Aroussi123*'
                sh 'npm install expo-updates --force'
                sh 'expo build:android --type apk   --non-interactive'
                
                 mail to: "aroussi1996@gmail.com",
                 subject: "Success",
                 body: " BUILD DONE"
                
            }
               post { 
                    failure { 
                  mail to: "aroussi1996@gmail.com",
                  subject: "failure",
                  body: " Build failure"        
                    }        
            } 
        }
        stage('UNIT TEST') {
            steps {
                echo 'TEST PHASE IN PROGRESS'
                sh 'npm test'
                mail to: "aroussi1996@gmail.com",
                 subject: "Success",
                 body: " TEST DONE"
                
            }
             post { 
                    failure { 
                  mail to: "aroussi1996@gmail.com",
                  subject: "failure",
                  body: " Test failure"        
                    }        
            } 
        }
        stage('PACKAGE & DEPLOY') {
            steps {
                echo 'PACKAGING and DEPLOYMENT IN PROGRESS'
                          sh 'expo publish'
                    mail to: "aroussi1996@gmail.com",
                 subject: "Success",
                 body: " DEPLOY DONE"

                
            }
            post { 
                    failure { 
                  mail to: "aroussi1996@gmail.com",
                  subject: "failure",
                  body: " Deploy failure"        
                    }        
            } 
        }
      
     
         stage('ARCHIVE') {
            steps {
                echo 'ARCHIVING PHASE IN PROGRESS'
                 sh 'rm -rf *.tar.gz'
                 sh 'tar czf Archive_$BUILD_NUMBER.tar.gz **/*.*'
                //junit '**/mochaReport.xml'
                mail to: "aroussi1996@gmail.com",
                 subject: "Success",
                 body: " ARCHIVE DONE"
                
            }
             post { 
                    failure { 
                  mail to: "aroussi1996@gmail.com",
                  subject: "failure",
                  body: " Archive failure"        
                    }        
            } 
        }
    }
    post {  
         always {  
             echo 'This will always run' 
             
               //archiveArtifacts artifacts: '*.tar.gz', fingerprint: true
               //archiveArtifacts artifacts: '**/*.min.*'
               // junit 'build/test-results/**/TEST-*.xml'
         }  
         success {  
             echo 'This will run only if successful' 
           
               mail to: "aroussi1996@gmail.com",
               subject: "All stage are succefuly done : jenkins build:${currentBuild.currentResult}: ${env.JOB_NAME}",
               body: "${currentBuild.currentResult}: Job ${env.JOB_NAME}\nMore Info can be found here: ${env.BUILD_URL}"
              /*mail to: "aroussi1996@gmail.com",
              subject: "jenkins build:${currentBuild.currentResult}: ${env.JOB_NAME}",
              body: "${currentBuild.currentResult}: Job ${env.JOB_NAME}\nMore Info can be found here: ${env.BUILD_URL}",
            cleanWs()*/
 
       
         }  
         failure {  
              echo 'This will run only if failer'
               mail to: "aroussi1996@gmail.com",
               subject: "jenkins build:${currentBuild.currentResult}: ${env.JOB_NAME}",
               body: "${currentBuild.currentResult}: Job ${env.JOB_NAME}\nMore Info can be found here: ${env.BUILD_URL}"
            

         }  
         unstable {  
             echo 'This will run only if the run was marked as unstable' 
             
               mail to: "aroussi1996@gmail.com",
               subject: "jenkins build:${currentBuild.currentResult}: ${env.JOB_NAME}",
               body: "${currentBuild.currentResult}: Job ${env.JOB_NAME}\nMore Info can be found here: ${env.BUILD_URL}"
              
         }  
         changed {  
             echo 'This will run only if the state of the Pipeline has changed'  
             
               mail to: "aroussi1996@gmail.com",
               subject: "jenkins build:${currentBuild.currentResult}: ${env.JOB_NAME}",
               body: "${currentBuild.currentResult}: Job ${env.JOB_NAME}\nMore Info can be found here: ${env.BUILD_URL}"
            
         }  
     }  
}
