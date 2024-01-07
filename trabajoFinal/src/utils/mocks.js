import { Faker, es } from "@faker-js/faker";
const faker = new Faker({ locale: [es] });
export const generateProducts = () => {
    return {
        title: faker.commerce.productName(),
        // description:faker.commerce., 
        price:faker.commerce.price(),
        // thumbnails,
        code:faker.string.alphanumeric(),
        stock :+faker.string.numeric(1),
        // status,
        // category,
        id: faker.database.mongodbObjectId(10)
    }
};
