.PHONY: server pretty test build

server:
	BROWSER=none PORT=3030 ./node_modules/.bin/react-scripts start

pretty:
	find src -type f -name '*.js' | grep -v '^src/math-input' | grep -v '^src/lib/' | xargs ./node_modules/.bin/prettier --single-quote --trailing-comma es5 --bracket-spacing=true --parser flow --write

test:
	./node_modules/.bin/jest --no-watchman

build:
	npm run postinstall
