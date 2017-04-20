
/**
 * webpack page.js dist/wxpage.js --output-library-target='commonjs-module'
 */
var meta = require('./package.json')
var webpack = require('webpack')
var banner = new webpack.BannerPlugin({
	banner: `${meta.name} v${meta.version}\nhttp://git.code.oa.com/vfe-components/wxpage\nLicense ${meta.license}`
})

module.exports = {
	entry: './page.js',
	output: {
		filename: './dist/wxpage.js',
		libraryTarget: 'commonjs-module'
	},
	plugins: [banner]
}
