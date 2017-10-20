module.exports = {
	"parserOptions": {
		"ecmaVersion": 2017,
		"sourceType" : "module",
		"ecmaFeatures" : {
			"jsx" : true,
			"experimentalObjectRestSpread" : true
		}
	},
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
		"no-unused-vars" : "off",
		"no-console" : "off",
		"no-empty" : "off"
    },
	"globals" : {
		"_" : true,
		"config" : true,
		"fetch"  : true,
		"moment" : true,
		"mongoose" : true,
		"Morty" : true,
		"Promise" : true
	}
};
