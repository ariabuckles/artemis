pretty:
	find src -type f -name '*.js' | xargs ./node_modules/.bin/prettier --single-quote --trailing-comma es5 --bracket-spacing=true --parser flow --write
	
