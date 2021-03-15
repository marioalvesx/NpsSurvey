import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';

import createConnection from '../database';

describe("Surveys", () => {
    beforeAll(async() => {
        const connection = await createConnection();
        await connection.runMigrations();
    });

    // sempre que um teste for executado, database é dropada
    afterAll(async() => {
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close();
    });
    
    it("Should be able to create a new Survey", async () => {
        const response = await request(app).post("/surveys").send({
            title: "Title Example",
            description: "Description Example",
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id"); // Verificar se item criado possui a propriedade  "id"
    });

    it("Should be able to get all surveys", async () => {
        await request(app).post("/surveys").send({
            title: "Title Example2",
            description: "Description Example2",
        });

        const response = await request(app).get("/surveys");

        expect(response.body.length).toBe(2); // Espera que tamanho do array seja "2" = title e description
    });
});