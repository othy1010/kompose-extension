./kompose convert -h
Convert a Docker Compose file

Usage:
kompose convert [flags]

Kubernetes Flags:
-c, --chart Create a Helm chart for converted objects
--controller Set the output controller ("deployment"|"daemonSet"|"replicationController")
--service-group-mode Group multiple service to create single workload by "label"("kompose.service.group") or "volume"(shared volumes)
--service-group-name Using with --service-group-mode=volume to specific a final service name for the group

OpenShift Flags:
--build-branch Specify repository branch to use for buildconfig (default is current branch name)
--build-repo Specify source repository for buildconfig (default is current branch's remote url)
--insecure-repository Specify to use insecure docker repository while generating Openshift image stream object

Flags:
--build string Set the type of build ("local"|"build-config"(OpenShift only)|"none") (default "none")
--build-command string Set the command used to build the container image. override the docker build command.Should be used in conjuction with --push-command flag.
--controller string Set the output controller ("deployment"|"daemonSet"|"replicationController")
--generate-network-policies Specify whether to generate network policies or not.
-h, --help help for convert
--indent int Spaces length to indent generated yaml files (default 2)
-j, --json Generate resource files into JSON format
-n, --namespace string Specify the namespace of the generated resources
-o, --out string Specify a file name or directory to save objects to (if path does not exist, a file will be created)
--profile stringArray Specify the profile to use, can use multiple profiles
--push-command string Set the command used to push the container image. override the docker push command. Should be used in conjuction with --build-command flag.
--push-image If we should push the docker image we built
--push-image-registry string Specify registry for pushing image, which will override registry from image name.
--pvc-request-size string Specify the size of pvc storage requests in the generated resource spec
--replicas int Specify the number of replicas in the generated resource spec (default 1)
--secrets-as-files Always convert docker-compose secrets into files instead of symlinked directories.
--service-group-mode label Group multiple service to create single workload by label(`kompose.service.group`) or `volume`(shared volumes)
--service-group-name string Using with --service-group-mode=volume to specific a final service name for the group
--stdout Print converted objects to stdout
--volumes string Volumes to be generated ("persistentVolumeClaim"|"emptyDir"|"hostPath" | "configMap") (default "persistentVolumeClaim")
--with-kompose-annotation Add kompose annotations to generated resource (default true)

Global Flags:
--error-on-warning Treat any warning as an error
-f, --file stringArray Specify an alternative compose file
--provider string Specify a provider. Kubernetes or OpenShift. (default "kubernetes")
--suppress-warnings Suppress all warnings
-v, --verbose verbose output

---

./kompose completion -h
Generates shell completion code.

Auto completion supports bash, zsh and fish. Output is to STDOUT.

source <(kompose completion bash)
source <(kompose completion zsh)
kompose completion fish | source

Will load the shell completion code.

Usage:
kompose completion SHELL [flags]

Flags:
-h, --help help for completion

Global Flags:
--error-on-warning Treat any warning as an error
-f, --file stringArray Specify an alternative compose file
--provider string Specify a provider. Kubernetes or OpenShift. (default "kubernetes")
--suppress-warnings Suppress all warnings
-v, --verbose verbose output

---

./kompose help -h
Help provides help for any command in the application.
Simply type kompose help [path to command] for full details.

Usage:
kompose help [command] [flags]

Flags:
-h, --help help for help

Global Flags:
--error-on-warning Treat any warning as an error
-f, --file stringArray Specify an alternative compose file
--provider string Specify a provider. Kubernetes or OpenShift. (default "kubernetes")
--suppress-warnings Suppress all warnings
-v, --verbose verbose output
----------------------------------------------------------------------------------------------------------------------------./
kompose version -h
Print the version of Kompose

Usage:
kompose version [flags]

Flags:
-h, --help help for version

Global Flags:
--error-on-warning Treat any warning as an error
-f, --file stringArray Specify an alternative compose file
--provider string Specify a provider. Kubernetes or OpenShift. (default "kubernetes")
--suppress-warnings Suppress all warnings
-v, --verbose verbose output
