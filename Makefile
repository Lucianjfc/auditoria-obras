export BUILD_MODE = homolog
export TAG = latest
export BUILD_PARAMS

package:
	BUILD_MODE=$(BUILD_MODE)
	TAG=$(TAG)
	make env build tag push

up:
	make pull run

env:
	./env-build.sh ./$(BUILD_MODE).env

build:
	docker build --network host -t doe-ac-crawler:$(BUILD_MODE) -f Dockerfile $(shell cat ./parsed-env) .

tag:
	docker tag doe-ac-crawler:$(BUILD_MODE) registry.gitlab.com/lsi-ufcg/tce-ac/novo-licon/licon:doe-ac-crawler-$(BUILD_MODE)-$(TAG)

push:
	docker push registry.gitlab.com/lsi-ufcg/tce-ac/novo-licon/licon:doe-ac-crawler-$(BUILD_MODE)-$(TAG)

pull:
	docker pull registry.gitlab.com/lsi-ufcg/tce-ac/novo-licon/licon:doe-ac-crawler-$(BUILD_MODE)-$(TAG)

run:
	docker run -d --env-file ./frontend/.env.prod -p 3301:80 --name doe-ac-crawler registry.gitlab.com/lsi-ufcg/tce-ac/novo-licon/licon:doe-ac-crawler-$(BUILD_MODE)-latest