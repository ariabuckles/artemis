server:
	./node_modules/.bin/react-scripts start

pretty:
	find src -type f -name '*.js' | grep -v '^src/math-input' | xargs ./node_modules/.bin/prettier --single-quote --trailing-comma es5 --bracket-spacing=true --parser flow --write
	
