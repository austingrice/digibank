pipeline {

  environment {
    // You know the drill. Please change team00 to your team. If you were teamxx you would do: team = 'teamxx' 
    // The line below is the only line you need to change and team00 is the only piece of that line to change.
    team = 'team19'
    registry = "wsc-ibp-icp-cluster.icp:8500"
    icp_proxy_ip = '192.168.22.81'
    icp_endpoint = "${icp_proxy_ip}:8443"
    namespaceTest = 'lab-test'
    namespaceProd = "workshop-${team}"
    app = 'ibp-digibank-loopback'
    imageName = "${registry}/${namespaceTest}/${app}-jenkins:${env.BUILD_ID}"
    jenkinsNode = '192.168.22.84'
    customImage = ''
    icpID="${team}-icp"
    CLOUDCTL_CREDS = credentials("${icpID}")
    deploymentName = "${app}-${team}"
    serviceName = "${app}-${team}"
  }

  agent { 
    kubernetes {
      label "default-jenkins-${UUID.randomUUID().toString()}"
    }
  }
 
  stages {

    stage ('Checkout source code from github repo') {
      steps {
        checkout scm
      }
    }

    stage ('Tests') {
      steps {
        script {
          echo "Running My Test Scripts"
          /*
            Would put tests here
          */
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          customImage = docker.build("${imageName}")
        }
      }
    }

    stage('Push Docker Image') {
      steps {
        script {
          withDockerRegistry([credentialsId: "${icpID}", url: "https://${registry}"]){
            customImage.push()
            customImage.push('latest')
          }
        }
      }
    }

    stage('Deploy to test Namespace') {
      steps {

        sh '''
          cloudctl login -a "https://${icp_endpoint}" -u "${CLOUDCTL_CREDS_USR}" -p "${CLOUDCTL_CREDS_PSW}" -n "${namespaceTest}"

          sed -i "s|myappname|${app}|g" deployment.yaml
          sed -i "s|myenvname|dev|g" deployment.yaml
          sed -i "s|mycontainername|${app}|g" deployment.yaml
          sed -i "s|mydeploymentname|${deploymentName}|g" deployment.yaml
          sed -i "s|myimagename|${imageName}|g" deployment.yaml
          sed -i "s|myteamname|${team}|g" deployment.yaml
          sed -i "s|myjenkinsnode|${jenkinsNode}|g" deployment.yaml

          sed -i "s|myservicename|${serviceName}|g" service.yaml
          sed -i "s|myappname|${app}|g" service.yaml 
          sed -i "s|myenvname|dev|g" service.yaml   

          kubectl apply -f "deployment.yaml"
          kubectl apply -f "service.yaml"
          echo "Waiting for deployment ${deploymentName} to become available"
          SECONDS=0
          POD_NUMBER=0
          DESIRED_PODS=$(kubectl get deploy --no-headers=true "${deploymentName}" | awk '{print $2}')

          while [ $SECONDS -lt 60 ] && [ $POD_NUMBER -lt $DESIRED_PODS ]
          do
            echo "Waiting for deployment ${deploymentName} to start completion. Status = ${CURRENT_PODS}/${DESIRED_PODS} pods up"
            sleep 3
            DESIRED_PODS=$(kubectl get deploy --no-headers=true "${deploymentName}" | awk '{print $2}')
            CURRENT_PODS=$(kubectl get deploy --no-headers=true "${deploymentName}" | awk '{print $3}')
            if [ ${DESIRED_PODS} == ${CURRENT_PODS} ]; then
              appPort=$(kubectl get svc ${serviceName} -o jsonpath={'.spec.ports['${POD_NUMBER}'].nodePort'})
              curl -s -k --connect-timeout 1 "http://${icp_proxy_ip}:${appPort}/ping"
              RET=$?
              if [ "$RET" == "0" ]; then
                echo "pod ${POD_NUMBER} of deployment ${deploymentName} is running"
                POD_NUMBER=$((POD_NUMBER + 1))
              fi
            fi
          done

          if [ $SECONDS -ge 60 ]
          then
            echo "Timed out waiting for deployment to finish"
            kubectl describe pods ${deploymentName}
            echo "Described all pods with deployment prefix for debug purposes"
            kubectl delete -f "deployment.yaml"
            kubectl delete -f "service.yaml"
            exit 1
          fi
        '''
      }
    }
    
    //If you wanted to remove Docker image after push you could with
    /*stage('Remove Docker Image After Push') {
      steps {
        script {
          docker rmi $(docker images --format '{{.Repository}}:{{.Tag}}' | grep "${imageName}")
        }
      }
    }*/

    stage('Deploy to production Namespace') {
      steps {

        sh '''
          cloudctl login -a "https://${icp_endpoint}" -u "${CLOUDCTL_CREDS_USR}" -p "${CLOUDCTL_CREDS_PSW}" -n "${namespaceProd}"

          sed -i "s|myenvname|prod|g" deployment.yaml
          sed -i "s|myenvname|prod|g" service.yaml

          kubectl apply -f "deployment.yaml"
          kubectl apply -f "service.yaml"
          echo "Waiting for deployment ${deploymentName} to become available"
          SECONDS=0
          POD_NUMBER=0
          DESIRED_PODS=$(kubectl get deploy --no-headers=true "${deploymentName}" | awk '{print $2}')
          
          while [ $SECONDS -lt 60 ] && [ $POD_NUMBER -lt $DESIRED_PODS ]
          do
            echo "Waiting for deployment ${deploymentName} to start completion. Status = ${CURRENT_PODS}/${DESIRED_PODS} pods up"
            sleep 3
            DESIRED_PODS=$(kubectl get deploy --no-headers=true "${deploymentName}" | awk '{print $2}')
            CURRENT_PODS=$(kubectl get deploy --no-headers=true "${deploymentName}" | awk '{print $3}')
            if [ ${DESIRED_PODS} == ${CURRENT_PODS} ]; then
              appPort=$(kubectl get svc ${serviceName} -o jsonpath={'.spec.ports['${POD_NUMBER}'].nodePort'})
              curl -s -k --connect-timeout 1 "http://${icp_proxy_ip}:${appPort}/ping"
              RET=$?
              if [ "$RET" == "0" ]; then
                echo "pod ${POD_NUMBER} of deployment ${deploymentName} is running"
                POD_NUMBER=$((POD_NUMBER + 1))
              fi
            fi
          done

          if [ $SECONDS -ge 60 ]
          then
            echo "Timed out waiting for deployment to finish"
            kubectl describe pods ${deploymentName}
            echo "Described all pods with deployment prefix for debug purposes"
            kubectl delete -f "deployment.yaml"
            kubectl delete -f "service.yaml"
            exit 1
          else
            kubectl delete -f "deployment.yaml" -n ${namespaceTest}
            kubectl delete -f "service.yaml" -n ${namespaceTest}
          fi

          echo "------------------------------------------TESTS COMPLETE--------------------------------------------------"
          echo "Congratulations ${team} on a successful test! Please vist your ${app} at http://${icp_proxy_ip}:${appPort}"
        '''
      }
    }
  }
}
