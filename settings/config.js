const config = {
    app: {
        name: 'NodeJs CRUD',
        version: '1.0',
        port: 2000
    },
    secret: {
        token: 'abc.123',
        token_expires: 10800
    },
    database: {
        host: 'localhost',
        port: 27017,
        user: '',
        password: '',
        db: 'node_crud'
    }
}

module.exports = config;