/**
 * Basic unit testing of routes/handlers
 * As of right now, only success cases are tested
 */

const dotenv = require('dotenv');
dotenv.config();
const mongodb = require('../db/connect');
const request = require('supertest');
const express = require('express');
const { MongoMemoryServer } = require('mongodb-memory-server')
const { ObjectId } = require('mongodb');

const database_name = "cse341-database";
const collection_name = "level_data";
let mongo_memory_server;
let uri;

beforeAll(async () => {
    /**
     * Creates in-memory MongoDB server
     * Sets the URI to use the new in-memory serve
     * Initializes connection used by controllers
     */
    mongo_memory_server = await MongoMemoryServer.create();
    uri = mongo_memory_server.getUri();
    //eslint-disable-next-line no-undef
    process.env.MONGODB_URI = uri
    //eslint-disable-next-line no-unused-vars
    await mongodb.initDb((err, mongodb) => {
        if (err) {
            console.log(err);
        }
    });
    // bypass authentication for tests
    // const stubbedIsAuth = sinon.stub(auth, 'isAuthenticated');
    // auth.isAuthenticated.callsFake((req, res, next) => next());
});

afterAll(async () => {
    /**
     *  Stops connection
     *  Closes in-memory server
     */
    mongodb.closeDb();
    await mongo_memory_server.stop();
});


const fake_levels = [
    /**
     * Define some fake levels to use in tests
     * Sets the _id explicitly so we know it will match
     */
    {
        _id: ObjectId('63d60baf2bb47b6f813f1e7c'),
        "level_name": "Jest Level 1.0",
        "level_author": "Jester",
        "author_id": '',
        "level_block_data": [
            {
                "grid_x": "1",
                "grid_y": "2",
                "width": "1",
                "height": "1",
                "color": "green",
                "bouncy": "true",
                "causes_damage": "true"
            }
        ]
    },
    {
        _id: ObjectId('63d60baf2bb47b6f813f1e7d'),
        "level_name": "Jest Level 2.0",
        "level_author": "Jester",
        "author_id": '',
        "level_block_data": [
            {
                "grid_x": "2",
                "grid_y": "3",
                "width": "1",
                "height": "1",
                "color": "red",
                "bouncy": "false",
                "causes_damage": "false"
            }
        ]
    }
]

const addFakeData = async () => {
    /**
     * Adds fake levels to in-memory DB
     */
    await mongodb.getDb().db(database_name).collection(collection_name).insertMany(
        fake_levels
    )
}

const clearLevels = async () => {
    /**
     * Wipes all levels from in-memory DB
     */
    await mongodb.getDb().db(database_name).collection(collection_name).deleteMany({});
}


//eslint-disable-next-line no-unused-vars
const mock_auth = (req, res, next) => {
    /**
     * Mock authentication middleware and oidc object
     */
    class mockAuth {
        isAuthenticated() {
            return true;
        }
    }
    req.oidc = new mockAuth();
    next();
}


describe('Test Levels handlers with in-memory mongo', () => {
    /**
     * Test suite for Levels handlers
     */

    // define app
    const app = new express();
    // set up to use routes, and json encoding for post/put
    app.use(mock_auth)
        .use(express.json())
        .use(express.urlencoded({ extended: true }))
        .use('/', require('../routes'));

    // clear levels collection after each test
    afterEach(async () => {
        await clearLevels();
    });

    test('get all levels /', async () => {
        /**
         * Test the getAllLevels handler in Levels controller
         */

        // add fake levels to in-memory DB
        addFakeData();
        // send get request
        const res = await request(app).get('/levels');
        // expected conditions - - - - - - -
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        // expect data response to match fake data
        expect(
            JSON.stringify(res.body) === JSON.stringify(fake_levels)
        ).toBe(true);
    });


    test('get level by ID /:id', async () => {
        /**
         * Test the getLevelById handler in Levels controller
         */

        // add fake levels to in-memory DB
        addFakeData();
        // send get request
        const res = await request(app).get(`/levels/${fake_levels[0]._id}`);
        // expected conditions - - - - - - -
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        // expect data response to match fake data
        expect(
            JSON.stringify(res.body) === JSON.stringify(fake_levels[0])
        ).toBe(true);
    });


    test('create level /', async () => {
        /**
         * Test the createLevel handler in Levels controller
         */

        // send get request
        const res = await request(app).post('/levels').send(fake_levels[0]);
        // expected conditions - - - - - - -
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(201);
        expect(res.body.acknowledged).toBe(true);
    });


    test('delete level by ID /:id', async () => {
        /**
         * Test the deleteLevel handler in Levels controller
         */
        // add fake levels to in-memory DB
        addFakeData();

        // send delete request
        const res = await request(app).delete(`/levels/${fake_levels[0]._id}`);
        // expected conditions - - - - - - -
        expect(res.statusCode).toBe(204);

        // Check database to make sure level got deleted - - - - - -
        // send get all levels request
        const validate_result = await request(app).get('/levels');
        // expected conditions - - - - - - -
        expect(validate_result.header['content-type']).toBe('application/json; charset=utf-8');
        expect(validate_result.statusCode).toBe(200);
        // expect data response to not include deleted evel
        expect(
            JSON.stringify(validate_result.body) === JSON.stringify([fake_levels[1]])
        ).toBe(true);

    });


    test('update level by ID /:id', async () => {
        /**
         * Test the updateLevel handler in Levels controller
         */
        // add fake levels to in-memory DB
        addFakeData();

        let updated_level = fake_levels[0];
        updated_level.level_name = "Updated Name";

        // send put request
        const res = await request(app).put(`/levels/${fake_levels[0]._id}`).send(updated_level);
        // expected conditions - - - - - - -
        expect(res.statusCode).toBe(204);

        // Check database to make sure level got updated - - - - - -
        // send get all levels request
        const validate_result = await request(app).get(`/levels/${fake_levels[0]._id}`);
        // expected conditions - - - - - - -
        expect(validate_result.header['content-type']).toBe('application/json; charset=utf-8');
        expect(validate_result.statusCode).toBe(200);
        console.log(validate_result.body);
        // expect data response to prove level_name was updated
        expect(validate_result.body.level_name).toBe("Updated Name");
    });

})


