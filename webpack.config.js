module.exports = {
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js",
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /(node_modules)/,
                loader: "babel-loader",
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(jpg|png|svg)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        limit: 25000,
                        name: "images/[name].[hash].[ext]",
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: ["*", ".js", ".json"]
    },
    externals: {
        // @TODO add d3.js
    }
};
