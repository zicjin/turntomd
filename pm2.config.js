module.exports = {
    apps: [{
        name: 'turntomd',
        script: 'index.js',
        env: {
            NODE_ENV: 'production',
        },
        out_file: '/dev/null',
        error_file: 'error_logs/turntomd.log',
        log_date_format: 'YYYY-MM-DD HH:mm Z',
    }],
}
