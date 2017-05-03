pretty:
	find src -type f -name '*.js' | xargs ./node_modules/.bin/prettier --write --print-width=120 --trailing-comma=es5
	
