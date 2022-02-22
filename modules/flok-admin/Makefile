version=latest
# version=$$(cat ./package.json | jq -r .version)
docker-user=jaredhanson11
name=${docker-user}/flok-admin

build:
	docker build . -t ${name}:${version}
push: build
	docker push ${name}:${version}
