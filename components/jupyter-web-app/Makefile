IMG:=gcr.io/arrikto-interns/notebooks-manager

apply: 
	cd release && kubectl -n kubeflow apply -f .

reapply:
	cd release && kubectl -n kubeflow delete -f . && kubectl -n kubeflow apply -f .

delete:
	cd release && kubectl -n kubeflow delete -f .

publish: build push

build: 
	docker build -t ${IMG} .

push:
	gcloud docker -- push ${IMG}
