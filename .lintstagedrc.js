module.exports = {
	'src/*.{js,ts,css,json,md}': 'prettier --config ".prettierrc.js" --write ',
	'src/*.{js,ts}': 'eslint'
};
